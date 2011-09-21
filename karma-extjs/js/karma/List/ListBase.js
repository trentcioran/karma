/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.List.ListBase = Ext.extend(Ext.Panel, {

    module: null,

    entity: null,

    service: null,

    ordenar: true,

    previewTemplate: null,

    gridStore: null,

    grid: null,

    gridH: 600,

    singleSelect: true,

    editable: false,

    selectionMode: 'row', /*row / check*/

    grouping: false,

    canNew: true,

    canUpdate: true,

    canOpen: true,

    canDelete: true,

    groupField: null,

    initComponent: function() {
        Ext.apply(this, {
            border: false,
            frame: false,
            layout: 'fit',
            tbar: this.toolbar = new Ext.Toolbar(this.getTBarControls()),
            bodyStyle: 'padding: 0px 0px 0px 0px',
            items: this.getGridControl(),
            bbar: this.getBbarControls()
        });
        this.getMenuActions();
        Karma.List.ListBase.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'open': true,
            'new': true,
            'delete': true,
            'activity': true,
            'any': true
        });

        if (!Ext.isEmpty(this.entity.security)) {

            this.canOpen = this.canOpen && this.entity.security.Open;
            this.canNew = this.canNew && this.entity.security.New;
            this.canUpdate = this.canUpdate && this.entity.security.Update;
            this.canDelete = this.canDelete && this.entity.security.Delete;

        } else {

            this.canOpen = false;
            this.canNew = false;
            this.canUpdate = false;
            this.canDelete = false;

        }

        this.updateControls.createDelegate(this)();

        this.doLayout();
    },

    getSelectionModel: function() {
        if (!this.sm) {
            return this.sm = this.selectionMode === 'row' ? new Ext.grid.RowSelectionModel({
                singleSelect: this.singleSelect
            })
	            : new Ext.grid.CheckboxSelectionModel({ singleSelect: this.singleSelect,
	                sortable: true
	            });
        }
        return this.sm;
    },

    getGridView: function() {
        var config = {
            showPreview: true,
            sortAscText: "Ordenar ascendente",
            sortDescText: "Ordenar descendente",
            columnsText: "Columnas",
            autoFill: true,
            forceFit: true
        };
        return new Ext.grid.GroupingView(config);
    },

    getGridListeners: function() {
        return {
            'rowclick': { fn: this.onContextMenu, scope: this },
            'bodyresize': { fn: function() { this.syncSize(); }, scope: this },
            'mouseover': { fn: function() { this.onMouseOverGrid(); }, scope: this }
        };
    },
    
    onMouseOverGrid: function() {},

    getStoreColumns: function(colDefinitions) {
        if (colDefinitions) {
            var properties = [];
            Ext.each(colDefinitions, function(item, index) {
                properties.push({
                    name: item.Name,
                    mapping: index
                });
            }, this);
            return properties;
        }
        return Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
    },

    getGridColumns: function(colDefinitions) {
        if (colDefinitions) {
            var columns = [];
            //if(this.selectionMode === 'check') {
            //    columns[0] = this.getSelectionModel();
            //}
            //else {
            //    columns[0] = new Ext.grid.RowNumberer();
            //}
            Ext.each(colDefinitions, function(item) {
                var xtype = 'gridcolumn';
                var format = null;
                var enumType = null;
                if (!Ext.isEmpty(item.Format)) {
                    switch (item.Format) {
                        case 'usMoney':
                            xtype = 'numbercolumn';
                            format = '0,000.00';
                            break;
                        case 'date':
                            xtype = 'datecolumn';
                            format = 'd/M/Y';
                            break;
                        case 'enum':
                            xtype = 'enumcolumn';
                            enumType = item.Type;
                            break;
                    }
                }
                columns.push({
                    header: Ext.isEmpty(item.Header) ? item.Name : item.Header,
                    dataIndex: item.Name,
                    sortable: item.Sortable,
                    hidden: item.Hidden,
                    format: format,
                    xtype: xtype,
                    enumType: enumType
                });
            }, this);
            return columns;
        }
        return Karma.Factory.ColumnFactory.getGridColumnModel(this.entity.columns, true);
    },

    getGridControl: function() {
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns();
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
            xtype: (this.editable ? 'editorgrid' : 'grid'),
            id: this.getId() + '-grid',
            border: false,
            frame: false,
            columnLines: true,
            store: this.getStore(),
            cm: new Ext.grid.ColumnModel(columns),
            stripeRows: true,
            sm: sm,
            listeners: listeners,
            view: this.getGridView(),
            loadMask: true,
            plugins: plugins
        };

        this.grid = grid;

        return grid;
    },

    getTBarControls: function() {
        var base = this.getTBarBaseControls();
        var custommenus = this.getTBarCustomControls();
        Ext.each(custommenus, function(menu) {
            base.push(menu);
        }, this);
        return base;
    },

    getTBarBaseControls: function() {
        return [];
    },

    getTBarCustomControls: function() {
        return [];
    },

    getBbarControls: function() {
        return this.paginbar = new Karma.Ext.Grid.PagingToolbar({
            store: this.getStore(),
            displayInfo: true
        });
    },

    newRecord: function() {
        this.fireEvent('new');
    },

    openRecord: function(id) {
        this.fireEvent('open', id);
    },

    deleteRecord: function(id) {
        Ext.Msg.show({
            title: 'Eliminar',
            msg: 'Esta operaci&oacute;n es irreversible, desea continuar?',
            buttons: Ext.Msg.YESNO,
            fn: function(result) {
                if (result === 'yes') {
                    this.fireEvent('delete', id, {
                        fn: function() {
                            this.getStore().reload();
                            this.mask.hide();
                        },
                        scope: this
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this
        });
    },

    getMenuActions: function() {
        if (!this.submenus) {
            this.submenus = [this.openMenuAction = new Ext.menu.Item({
                iconCls: 'icon-window',
                text: 'Abrir...',
                scope: this,
                handler: function() {
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.openRecord(selected.get('Id'));
                }
            }), this.deleteMenuAction = new Ext.menu.Item({
                text: 'Eliminar...',
                iconCls: 'icon-minus',
                scope: this,
                handler: function() {
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.deleteRecord(selected.get('Id'));
                }
            }), '-', this.newMenuAction = new Ext.menu.Item({
                iconCls: 'icon-plus',
                text: 'Nuevo...',
                handler: function() {
                    PLOG.debug('[ListBase.onContextMenu.Nuevo]');
                    this.newRecord();
                },
                scope: this
            })];
        }
        return this.submenus;
    },

    onContextMenu: function(grid, rowIndex, e) {
        if (!this.menu) {
            var selections = grid.getSelectionModel().getSelections();
            menuActions = this.getMenuActions();
            if (!Ext.isEmpty(menuActions) && menuActions.length > 0) {
                this.menu = new Ext.menu.Menu({
                    items: menuActions
                });
            }
        }
        this.menu.showAt(e.getXY());
        e.preventDefault();
        this.fireEvent('any');
    },

    getPlugins: function(columns) {
        var plugins = new Array();
        Ext.each(columns, function(column, idx) {
            if (column.IsPlugin) {
                plugins.push(column);
            }
        }, this);
        return plugins;
    },

    processStore: function() { },

    getStore: function() {
        if (Ext.isEmpty(this.gridStore)) {
            this.gridStore = this.processStore();
            this.gridStore.on('load', function() {
                this.fireEvent('activity');
            }, this);
            this.gridStore.on('loadexception', function() {
                this.fireEvent('activity');
            }, this);
        }
        return this.gridStore;
    },

    updateControls: function(value) {
        // menu config
        if (!this.canOpen) {
            this.openMenuAction.disable();
        }
        if (!this.canDelete) {
            this.deleteMenuAction.disable();
        }
        if (!this.canNew) {
            this.newMenuAction.disable();
        }
    }

});

Ext.reg('Karma.list', Karma.List.ListBase);

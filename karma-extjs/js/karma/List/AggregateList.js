/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.List.AggregateList = Ext.extend(Karma.List.ListBase, {
    entityName: null,
    entity: null,
    parentEntity: null,
    context: null,
    showSearch: false,
    isLoaded: false,
    canDrop: false,
    addBulk: true,
    highlightNewRows: true,
    lineEndRE: /\r\n|\r|\n/,
    sepRe: /\s*\t\s*/,
    excelValuesField: null,
    initComponent: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.initComponent] <- Entity Name: ' + this.entityName);
        }
        Karma.List.AggregateList.superclass.initComponent.apply(this, arguments);
        this.addEvents({ 'change': true, 'refresh': true });

        this.on('afterlayout', function() {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[AggregateList.afterlayout] <- Id: ' + this.id +
					', parentEntity: ' + this.parentEntity);
            }
            if (!this.isLoaded) {
                if (this.parentEntity != null && this.parentEntity.Id > 0) {
                    this.setContext(this.parentEntity);
                    this.getStore().reload();
                    this.isLoaded = true;
                    this.enable();
                } else {
                    if (this.parentEntity == null || this.parentEntity.Id == 0) {
                        this.disable();
                    }
                }
            }
        }, this);

        if (this.canDrop) {

            this.addEvents({
                'beforedatadrop': true,
                'datadrop': true,
                'afterdatadrop': true
            });

            Ext.apply(this.grid, {
                changeValueTask: {
                    run: function() {
                        this.dataDropped.call(this.grid, this, this.grid.excelValuesField.dom);
                    },
                    interval: 100,
                    scope: this
                },
                onResize: this.onResize.createSequence(this.resizeDropArea)
            });
            this.grid.view.afterRender = this.grid.view.afterRender.createSequence(this.onViewRender, this.grid);

        }

    },

    newRecord: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.newRecord] <-');
        }
        var reload = this.reload.createDelegate(this);
        this.entity.NewFromEntity(this.getParentParameters(), {
            flush: {
                fn: function(result, form) {
                    reload();
                }, scope: this
            }
        });
    },

    getParentParameters: function() {
        return { Id: this.parentEntity.Id };
    },

    openRecord: function(id) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.openRecord] <-');
        }
        if (!(this.canOpen && this.security.Open)) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[AggregateList.openRecord] User does not have permissions. Open: ' +
					this.security.Open + ', canOpen: ' + this.canOpen);
            }
            return;
        }
        var reload = this.reload.createDelegate(this);
        this.entity.Open(id, {
            'flush': {
                fn: function(win) {
                    reload();
                }
            },
            scope: this
        },
			null, {
			    canUpdate: this.canUpdate
			});
    },

    deleteRecord: function(id) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.deleteRecord] <-');
        }
        this.entity.Delete(id, {
            fn: function() {
                this.reload();
            },
            scope: this
        });
    },

    setParentEntity: function(v) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.setParentEntity] <- value: ' + v);
        }
        this.parentEntity = v;
        this.updateControls.createDelegate(this)(v);
        this.setContext(v);
        this.enable();
    },

    getParentEntity: function() {
        return this.parentEntity;
    },

    setContext: function(value) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.setContext] Id: ' + value);
        }
        if (!Ext.isEmpty(this.context) && value.Id > 0) {
            ;
            this.context = this.context.replace('?', value.Id);
            this.getStore().baseParams.Parameters.SubQuery = this.context;
        }
    },

    getTBarControls: function() {
        return [this.newToolbarButton = new Ext.Button({
            xtype: 'button',
            text: 'Agregar...',
            iconCls: 'icon-plus',
            handler: this.newRecord,
            scope: this
        }), this.exportBtn = new Ext.Button({
            text: 'Exportar',
            handler: this.onExportExcel,
            iconCls: 'icon-export',
            scope: this,
            hidden: ((!Ext.isEmpty(this.security)) ? !this.security.Export : true)
        }), '->', this.searchfield = new Ext.ux.SearchField({
            anchor: '50%',
            store: this.getStore(),
            value: ''
        })];
    },

    getGridControl: function() {
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns(Ext.isEmpty(this.query) ? null : this.query.Columns);
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
            xtype: 'grid',
            id: this.getId() + '-grid',
            border: false,
            columnLines: true,
            frame: false,
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

    processStore: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.processStore] <-' + this.id + ', Context: ' +
				this.context + ', Service: ' + this.service);
        }
        var _fields;
        if (Ext.isEmpty(this.query)) {
            _fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        }
        else {
            _fields = this.getStoreColumns(this.query.Columns);
        }
        var store = Karma.Data.GroupingStore.create(
			this.service, _fields, null, {
			    Query: this.query ? this.query.Id : this.metadata.LinkQuery,
			    SubQuery: this.context,
			    Criteria: '',
			    Start: 0,
			    PageSize: Karma.Conf.DefaultPageSize
			});
        return store;
    },

    reload: function() {
        this.getStore().baseParams.Parameters.SubQuery = this.context;
        this.getStore().reload();
        this.fireEvent('refresh');
    },

    onExportExcel: function() {
        var form = Ext.DomHelper.append(document.body, {
            id: 'export_form',
            tag: 'form',
            cls: 'x-hidden',
            method: 'GET',
            action: 'Service/Exporter',
            target: '_self',
            children: [
                { name: 'Service', tag: 'input', type: 'hidden', value: this.service },
                { name: 'Method', tag: 'input', type: 'hidden', value: Karma.Conf.FindMethod },
                { name: 'Parameters', tag: 'input', type: 'hidden',
                    value: Ext.encode({
                        Query: this.query ? this.query.Id : this.metadata.LinkQuery,
                        SubQuery: this.context,
                        Criteria: '',
                        Start: 0,
                        PageSize: 0
                    })
                }
            ]
        });
        form.submit();
    },

    updateControls: function(value) {
        Karma.List.AggregateList.superclass.updateControls.apply(this, arguments);
        // toolbar config
        if (!this.canNew) {
            this.newToolbarButton.disable();
        }
        if (!this.canDelete) {
            this.deleteMenuAction.disable();
        }
    },

    onMouseOverGrid: function() {

        if (this.canDrop) {
            resizeDropArea.call(this.grid);
        }

    },

    //  After the GridView has been rendered, insert a static transparent textarea over it.
    onViewRender: function() {
        var v = this.view;
        if (v.mainBody) {
            this.excelValuesField = Ext.DomHelper.insertAfter(v.scroller, {
                tag: 'textarea',
                id: Ext.id(),
                value: '',
                style: {
                    'font-size': '1px',
                    border: '0px none',
                    overflow: 'hidden',
                    color: '#fff',
                    position: 'absolute',
                    top: v.mainHd.getHeight() + 'px',
                    left: '0px',
                    'background-color': '#fff',
                    margin: 0,
                    cursor: 'default'
                }
            }, true);
            this.excelValuesField.setOpacity(0.1);
            this.excelValuesField.forwardMouseEvents();
            this.excelValuesField.on({
                mouseover: function() {
                    Ext.TaskMgr.start(this.changeValueTask);
                },
                mouseout: function() {
                    Ext.TaskMgr.stop(this.changeValueTask);
                },
                scope: this
            });
            resizeDropArea.call(this);
        }
    },

    resizeDropArea: function() {
        if (this.excelValuesField) {
            alert('ya chingue!');
            var v = this.view,
                sc = v.scroller,
                scs = sc.getSize,
                s = {
                    width: sc.dom.clientWidth || (scs.width - v.getScrollOffset() + 2),
                    height: sc.dom.clientHeight || scs.height
                };
            this.excelValuesField.setSize(s);
        }
    },

    //  on change of data in textarea, create a Record from the tab-delimited contents.
    dataDropped: function(e, el) {

        var nv = el.value;
        el.blur();
        if (nv !== '') {
            if (e.fireEvent('beforedatadrop', e, nv, el)) {

                var store = e.grid.store;
                var Record = store.recordType;
                el.value = '';

                var rows = nv.split(e.lineEndRE);
                var cols = e.grid.cm.getColumnsBy(function(c) {
                    return !c.hidden;
                });

                var fields = Record.prototype.fields;
                var recs = [];

                e.fireEvent('datadrop', e, rows);
                var idParentEntityValue = e.editor.entityId;

                if (cols.length && rows.length) {

                    var registros = new Array(rows.length - 1);

                    for (var i = 0; i < rows.length; i++) {

                        var vals = rows[i].split(e.sepRe);
                        var data = {};

                        if (vals.join('').replace(' ', '') !== '') {

                            var colsRegistro = new Array(vals.length);

                            for (var k = 0; k < vals.length; k++) {

                                var fldName = cols[k + 1].dataIndex;
                                var fld = fields.item(fldName);
                                data[fldName] = fld ? fld.convert(vals[k]) : vals[k];

                                colsRegistro[k] = vals[k];

                            }

                            registros[i] = colsRegistro;

                        }

                    }

                    var currentService = e.entity.service;
                    e.doSaveRecord(registros, currentService, idParentEntityValue);

                    resizeDropArea.call(this);
                    store.reload();

                }

            } else {
                this.excelValuesField.value = '';
            }

        }

    },

    doSaveRecord: function(registros, service, idPapa) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.doSaveRecord] <-');
        }

        this.editor.getForm().doAction('action.base', {
            operation: 'NewFromDrop',
            service: service,
            parameters: [registros, idPapa],
            success: function(form, action) {
                var result = action.result.Result;
                this.editor.status.setStatus({
                    text: 'Operacion realizada exitosamente',
                    clear: true
                });
                this.fireEvent('afterdatadrop');
                this.editor.status.clearStatus();
            },
            failure: function(form, action) {
                Ext.Msg.alert('Error', action.Result.ErrorMessage);
                this.editor.status.setStatus({
                    text: 'Ocurrio un error al guardar.',
                    clear: true
                });
            },
            scope: this
        });

        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.doSaveRecord] ->');
        }
    }

});

Karma.AL = Karma.List.AggregateList;
Ext.reg('ag.list', Karma.AL);


function resizeDropArea(){
    if (this.excelValuesField) {
        var v = this.view;
        var sc = v.scroller;
        var scs = sc.getSize;
        
        /*var s = {
            width: sc.dom.clientWidth || (scs.width - v.getScrollOffset() + 2),
            height: sc.dom.clientHeight || scs.height
        };*/
        
        var s = {
            width: sc.dom.clientWidth || (scs.width - v.scrollOffset + 2),
            height: sc.dom.clientHeight || scs.height
        };
        this.excelValuesField.setSize(s);
    }
}
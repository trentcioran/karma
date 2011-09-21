/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.List.SearchList = Ext.extend(Karma.List.ListBase, {

    combosField: 'Name',
    
    sortings: null,
    
    filters: null,
    
    title: 'Filtro de b&uacute;squeda',
    
    initComponent: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.initComponent] <-');
        }
        this.filters = this.metadata.Queries;
               
        this.query = this.filters[0];
        Karma.List.SearchList.superclass.initComponent.apply(this, arguments);
        if (!Ext.isEmpty(this.entity.customevents)) {
            this.addEvents(this.entity.customevents);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.initComponent] ->');
        }
    },
    
    getGridControl: function() { 
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns(Ext.isEmpty(this.query.Columns) ? null : this.query.Columns);
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
                xtype: 'grid',
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
        return grid;
    },

    getTBarBaseControls: function(){
        return ['Buscar: ', this.searchfield = new Ext.ux.SearchField({
            id: this.id + 'txtCriterio',
            anchor: '50%',
            store: this.getStore(),
			value: ''
        }), this.exportBtn = new Ext.Button({
            text: 'Exportar',
            handler: this.onExportExcel,
			iconCls: 'icon-export',
            scope: this,
            hidden: !this.entity.security.Export
        }), ' ', {
            xtype: 'tbseparator'
        }, ' ', {
            id: this.id + 'cmbVistas',
            xtype: 'combo',
            fieldLabel: 'Vista',
            displayField: this.combosField,
            valueField: 'Id',
            store: this.processViews(),
            forceSelection: true,
            triggerAction: 'all',
            editable: false,
            selectOnFocus: true,
            mode: 'local',
            value: this.views[0].Id,
            hidden: true
        }, '->', 'Filtro: ', this.cmbFilter = new Ext.form.ComboBox({
            width: '170px',
            fieldLabel: 'Filtro',
            forceSelection: true,
            selectOnFocus: true,
            editable: false,
            triggerAction: 'all',
            store: this.processFilters(),
            displayField: this.combosField,
            valueField: 'Id',
            mode: 'local',
            value: this.filters[0].Id,
            listeners: {
                'select': {
                    fn: this.onSelectFilter,
                    scope: this
                }
            }
        })];
    },
    
    getTBarCustomControls: function(){
        return ['->', this.newToolbarButton = new Ext.Button({
            text: 'Nuevo...',
            handler: this.newRecord,
			iconCls: 'icon-plus',
            scope: this,
            hidden: !(this.security.New && this.canNew)
        }), '|', ' '];
    },
    
    processFilters: function(){
        return new Ext.data.JsonStore({
            data: {
                filters: this.filters
            },
            root: 'filters',
            fields: [{
                name: 'Id'
            }, {
                name: this.combosField
            }]
        });
    },
    
    processViews: function(){
        return new Ext.data.JsonStore({
            data: {
                views: this.views
            },
            root: 'views',
            fields: [{
                name: 'Id'
            }, {
                name: this.combosField
            }, {
                name: 'Template'
            }]
        });
    },
    
    openRecord: function(id){
        this.fireEvent('open', id, null, null, {
            canUpdate: this.canUpdate
        });
    },
    
    processStore: function(){
        var _fields;
        if (Ext.isEmpty(this.query.Columns)) {
        	_fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        } 
        else {
	        _fields = this.getStoreColumns(this.query.Columns);
		}
        return Karma.Data.GroupingStore.create(this.service, _fields, null, {
            Query: this.query.Id,
            Criteria: '',
            Start: 0,
            PageSize: Karma.Conf.DefaultPageSize,
            Sorting: [{
                Field: this.sortings[0],
                Sort: 0
            }]
        });
    },
    
    onExportExcel: function(){
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
                        Query: this.cmbFilter.getValue(),
                        Criteria: this.searchfield.getValue(),
                        Start: 0,
                        PageSize: 0,
                        Sorting: [{
                            Field: this.sortings[0],
                            Sort: 0
                        }]
                    }) 
                }
            ]
        });
		form.submit();
    },
    
    onSelectFilter: function(record){
    	var queryId = this.cmbFilter.getValue();
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.onSelectFilter] <- Query ID: ' + queryId);
        }
        Ext.each(this.filters, function(item) {
            PLOG.debug('[SearchList.initComponent] Query item: -' + item.Id);
            if (item.Id == queryId) {
                this.setQuery(item);
                return false;
            }
        }, this);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.onSelectFilter] -> Query ID: ' + queryId);
        }
    },
    
    setQuery: function(query) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.setQuery] <- Query: ' + query.Id + ', Columns: ' + query.Columns);
        }
        if(!query) {
            return;
        }
        this.query = query;
        if(query.Columns) {
            this.reconfigureColumns(query.Columns);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.setQuery] -> Query: ' + query.Id + ', Columns: ' + query.Columns);
        }
    },
    
    reconfigureColumns: function(colDefinitions){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.reconfigureColumns] <- Columns: ' + colDefinitions);
        }
        this.columns = colDefinitions;
        this.gridStore = this.processStore();
        this.paginbar.bindStore(this.gridStore);
        this.searchfield.store = this.gridStore;
        var sl = Ext.getCmp(this.getId() + '-grid');
        sl.reconfigure(this.gridStore, new Ext.grid.ColumnModel(this.getGridColumns(colDefinitions)));
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.reconfigureColumns] -> Columns: ' + colDefinitions);
        }
    },

    updateControls: function(value){
        Karma.List.SearchList.superclass.updateControls.apply(this, arguments);
        if (!this.canNew) {
            this.newToolbarButton.disable();
        }
    }
    
});

Karma.SL = Karma.List.SearchList;

Ext.reg('Karma.searchlist', Karma.List.SearchList);

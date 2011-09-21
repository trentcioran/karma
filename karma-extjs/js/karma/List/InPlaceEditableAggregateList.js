/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.List.InPlaceEditableAggregateList = Ext.extend(Karma.List.AggregateList/*Karma.List.ListBase*/, {

    value: [],
    
    editable: true,
    
    Record: null,
    
    canNew: true,
    
    canUpdate: true,
    
    canDelete: true,
    
    isnew: false,
    
    initComponent: function(){
        this.entity = Karma.Core.ModuleManager.Instance.getEntity(this.entityName);
        this.security = this.entity.security;
        this.metadata = this.entity.metadata;
        if (!Ext.isEmpty(this.entity.inplacelist)) {
            Ext.apply(this, this.entity.inplacelist);
        }
        this.editable = (this.editable && this.canUpdate);
        Karma.List.InPlaceEditableAggregateList.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('change');
        if (Ext.isEmpty(this.value)) {
            this.value = new Array();
        }
    },

    specification: function(){
    },
    
    newRecord: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.newRecord] <-');
        }
        
        var grid = this.items.get(0);
        var record = this.specification();
        /*this.grid.stopEditing();*/
        grid.stopEditing();
        
        this.gridStore.insert(0, new this.Record(record));
        /*this.grid.startEditing(0, 0);*/
        grid.startEditing(0, 0);
        this.value.splice(0, 0, record);
        this.fireEvent('change');
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.newRecord] ->');
        }
    },
    
    deleteRecord: function(record){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.deleteRecord] <-');
        }
        var id = this.getStore().indexOf(record);
        this.value.splice(id, 1);
        this.gridStore.remove(record);
        this.fireEvent('change');
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.deleteRecord] ->');
        }
    },
    
    /*setValue: function(v){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.setValue] <-');
            PLOG.debug('[InPlaceEditableAggregateList.setValue] Value: ' + v);
            if (!Ext.isEmpty(v)) {
                ObjectAnalyzer().analyze(v, 1);
            }
        }
        if (!Ext.isEmpty(v)) {
            this.value = v;
        }
        else {
            this.value = [];
        }
        this.gridStore.loadData({
            Data: this.value
        });
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.setValue] ->');
        }
    },*/
    
    /*getValue: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.getValue] <-');
        }
        var modified = this.gridStore.getModifiedRecords();
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.getValue] Modified records: ' + modified.length);
        }
        Ext.each(modified, function(record){
            var idx = this.gridStore.indexOf(record);
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[InPlaceEditableAggregateList.getValue] record modified: ' + record +
                ', index: ' +
                idx);
            }
            Ext.each(this.columnmodel, function(column){
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[InPlaceEditableAggregateList.getValue] Column: ' + column +
                    ', property: ' +
                    column.dataIndex);
                }
                this.value[idx][column.dataIndex] = record.data[column.dataIndex];
            }, this);
        }, this);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.getValue] ->');
        }
        this.getStore().commitChanges();
        return this.value;
    },*/
    
    getMenuActions: function(selModel){
        var actions = [{
            text: 'Eliminar...',
            iconCls: 'delete-icon',
            scope: this,
            hidden: !this.canDelete,
            handler: function(){
                var selected = selModel.getSelected();
                this.deleteRecord(selected);
            }
        }, {
            iconCls: 'add-icon',
            text: 'Nuevo...',
            scope: this,
            hidden: !this.canNew,
            handler: function(){
                PLOG.debug('[InPlaceEditableAggregateList.onContextMenu.Nuevo]');
                this.newRecord();
            }
        }];
        var custActions = this.getCustomActions(selModel);
        if (!Ext.isEmpty(this.getCustomActions())) {
            for (var idx = 0; idx < custActions.length; idx++) {
                actions.push(custActions[idx]);
            }
        }
        return actions;
    },
    
    getTBarControls: function(){
        return [{
            xtype: 'button',
            text: 'Nuevo...',
            handler: this.newRecord,
            scope: this,
            hidden: !this.canNew
        }];
    },
    
    /*getBbarControls: function(){
        return [];
    },*/
    
    /*processStore: function(){
        /*var fields = this.columnstore;*
        var fields;
        if (Ext.isEmpty(this.query) || Ext.isEmpty(this.query.Columns)) {
        	fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        } 
        else {
	        fields = this.getStoreColumns(this.query.Columns);
		}
		
        this.Record = Ext.data.Record.create(fields);
        var proxy = new Ext.data.MemoryProxy({
            Data: {
                Data: []
            }
        });
        return  new Karma.Data.GroupingStore.create(this.service, fields, this.groupField, {
            Query: '',
            Criteria: '',
            Start: 0,
            PageSize: Karma.Conf.DefaultPageSize,
            Sorting: [{
                Field: this.groupField,
                Sort: 0
            }]
        }, /*listeners* {
            'update': {
                fn: function(thestore){
                    PLOG.debug('[GroupingStore.update]');
                    this.fireEvent('change');
                },
                scope: this
            },
            'add': {
                fn: function(thestore){
                    PLOG.debug('[GroupingStore.add]');
                    this.fireEvent('change');
                },
                scope: this
            }
        
        }, proxy);
    },*/
    
	/*updateControls: function(value) {
		Karma.List.AggregateList.superclass.updateControls.apply(this, arguments);
		// toolbar config
		if (!this.canNew) {
			this.newToolbarButton.disable();
		}
		if (!this.canDelete) {
			this.deleteMenuAction.disable();
		}
	},*/
    
    getCustomActions: function(selModel){
        return [];
    }
    
});

Karma.EAL = Karma.List.InPlaceEditableAggregateList;
Ext.reg('eag.list', Karma.EAL);

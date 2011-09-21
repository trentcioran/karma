/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Controls.EntityLinkSearch = Ext.extend(Karma.List.ListBase, {
	
	queryId: null,
	
	subquery: null,
	
	columns: null,
	
	entity: null,
	
	canAdd: true,
	
	ignoreTriggers: false,
	
	parameters: [],
	
	context: null,
	
	gridH: 200,

	initComponent: function(){
		Karma.Controls.EntityLinkSearch.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'select': true });
	},
	
	getTBarControls: function(){
		var buttons = [
            'Buscar: ', ' ',
            new Ext.ux.SearchField({
                store: this.getStore(),
                width: 250
            }),
			'->',{
				xtype: 'button',
				text: 'Nuevo...',
				handler: this.onNew,
				scope: this,
				hidden: !(this.security.New && this.canAdd)
			}
        ];
		if(!this.singleSelect) {
			buttons.push({
				xtype: 'button',
				text: 'Seleccionar',
				handler: this.onMultipleSelect,
				scope: this,
				buffer: 500
			});
		}
		return buttons;
	},
	
	processStore: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.processStore] <-' + this.id + ', Context: ' + 
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
			this.metadata.Service, _fields, null, {
			Query: this.query? this.query.Id: this.metadata.LinkQuery,
			SubQuery: this.subquery,
			Criteria: '',
			Start: 0,
			PageSize: Karma.Conf.DefaultPageSize });
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.processStore] ->');
		}
		return store;
	},

	getGridListeners: function(){
		return {
				'rowdblclick' : { fn: this.onRowDblClick, scope: this },
				'bodyresize' : { fn: function(){ this.syncSize(); }, scope: this} 
			};
	},
	
	onRowDblClick : function (grid, rowIndex, e){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onRowDblClicPLOG<-');
			PLOG.debug('row index: ' + rowIndex + ', row element: ' + 
				grid.getStore().getAt(rowIndex));
		}
		var data = grid.getStore().getAt(rowIndex).data;
		this.fireEvent('select', data.Id, data);
	},
	
	onContextMenu: function(){},
	
	onNew: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onNew] <-');
			PLOG.debug('[EntityLinkSearch.onNew] parameters: ' + this.parameters);
			PLOG.debug('[EntityLinkSearch.onNew] context: ' + this.context);
			PLOG.debug('[EntityLinkSearch.onNew] ignore triggers? ' + this.ignoreTriggers);
		}
		var me = this;
		var config = { 
			aftersave: {
				fn: function(entity){
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EntityLinkSearch.onNew] aftersave <-');
					}
					me.fireEvent('select', entity);
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EntityLinkSearch.onNew] aftersave ->');
					}
				}
			}, scope: this
		};
		var parameters = [];
		if (!Ext.isEmpty(this.parameters) && this.parameters.length > 0) {
			parameters = this.parameters;
		} else {
			parameters = new Array();
		}
		if (!Ext.isEmpty(this.context)) {
			parameters.push(this.context);
		}
		if (parameters.length == 0 || this.ignoreTriggers) {
			this.entity.link.New(config);
		}  else {
			this.entity.link.NewFromEntity(this.parameters, config);
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onNew] ->');
		}
	},
	
	reload: function() {
		this.getStore().baseParams.Parameters.SubQuery = this.subquery;
		this.getStore().reload();
	},
	
	onMultipleSelect: function(){
		var grid = this.findById(this.getId() + '-grid');
		var selected = grid.getSelectionModel().getSelections();
		var ids = new Array();
		var data = new Array();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onMultipleSelect] Rows selected: ' + selected);
			Ext.each(selected, function(record) {
				PLOG.debug('[EntityLinkSearch.onMultipleSelect] row: ' + record.get('Id'));
			}, this);
		}
		Ext.each(selected, function(record) {
			ids.push(record.data.Id);
			data.push(record.data);
		}, this);
		if (!Ext.isEmpty(ids)) {
			this.fireEvent('select', ids, data);
		}
	}

});

Ext.reg('entity.search', Karma.Controls.EntityLinkSearch);

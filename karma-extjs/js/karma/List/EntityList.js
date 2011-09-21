/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.List.EntityList = Ext.extend(Karma.List.AggregateList, {
	
	selectContextSubQuery: '',
	
	singleSelectAdd: true,

    initComponent: function(){
        Karma.List.EntityList.superclass.initComponent.apply(this, arguments);
		this.addEvents({
			beforeadd: true,
			beforedelete: true
		});
    },
    
	getSelectContextSubQuery: function () {
		return this.selectContextSubQuery;
	},
	
	setSelectContextSubQuery: function (value) {
		this.selectContextSubQuery = value;
	},
	
    newRecord: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityList.onAddRecord] <-');
        }
		var linkSearch = {
            title: this.entityName,
            parameters: {
                entity: this.entity,
                metadata: this.metadata,
                security: this.security,
                service: this.service,
                canAdd: false,
				selectionMode: 'check',
				singleSelect: false,
				query: this.searchquery,
				subquery: this.getSelectContextSubQuery(this.parentEntity)
            },
            listeners: {
                'select': {
                    fn: this.onSelect,
                    scope: this
                }
            },
            allowMultiple: true
        };
		if (this.selectionConfig) {
			Ext.apply(linkSearch.parameters, this.selectionConfig);
		}
        Ext.ComponentMgr.create(linkSearch, 'entity.window');
    },
    
    deleteRecord: function(id){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityList.deleteRecord] <-' + id);
        }
		var record = this.getStore().getById(id);
        this.fireEvent('change');
        this.onBeforeDelete(id);
    },
    
    getTBarControls: function(){
        return [this.newToolbarButton = new Ext.Button({
            text: 'Agregar a la lista...',
			iconCls: 'icon-plus',
            handler: this.newRecord,
            scope: this
        })];
    },
    
    getMenuActions: function(selModel){
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
                text: 'Eliminar de la lista...',
                iconCls: 'icon-minus',
                scope: this,
                handler: function(){
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.deleteRecord(selected.get('Id'));
                }
            })];
        }
        return this.submenus;
    },
    
    onSelect: function(id, selected){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityList.onSelect] <-' + selected);
        }
        this.fireEvent('change');
        this.onBeforeAdd(id, selected, this.parentEntity);
    },
	
	onBeforeAdd: function (id, selected, parentEntity) { },
	
	onBeforeDelete: function (id, selected, parentEntity) { }
    
});

Karma.EntL = Karma.List.EntityList;
Ext.reg('entity.list', Karma.List.EntityList);

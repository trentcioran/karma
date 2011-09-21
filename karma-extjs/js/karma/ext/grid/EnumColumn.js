/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Ext.Grid.EnumColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Karma.Ext.Grid.EnumColumn.prototype ={
	
    init : function(grid){
    },

    renderer : function(v, p, record, rowIndex, colIndex){
        p.css += ' x-grid3-check-col-td';
		this.enumStore = Karma.Data.EnumStore.create(this.enumType); 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumColumn.renderer] <- DataIndex: ' + this.dataIndex + ', colIndex : ' + 
				colIndex  + ', Value[dataindex]: ' +  record.get(this.dataIndex) + 
				', the store: ' +  this.enumStore + ', enumType: ' + 
				this.enumType);
		}
		if(Ext.isEmpty(this.dataIndex)) {
	        return this.enumStore.getLabelById(record.data[colIndex]);
		}
        return this.enumStore.getLabelById(record.get(this.dataIndex));
    }
	
};
Ext.grid.Column.types['enumcolumn'] = Karma.Ext.Grid.EnumColumn;

Ext.apply(Karma.Data.EnumStore, {
	
	findById: function(type, id){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] <- Type: ' + type + ', Id: ' + id);
		}
		var store = Karma.Data.EnumStore.create(type);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] <- store: ' + store, + ', Len: ' + store.getTotalCount());
		}
		var record = store.getById(id);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] <- record: ' + record);
		}
		var name = record.get('Name');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] ->');
		}
		return name;
	}

});

/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Ext.Grid.EntityColumn = function(config){
	Ext.apply(this, config);
	if(!this.id){
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Karma.Ext.Grid.EntityColumn.prototype ={
	
	init : function(grid){
	},

    renderer : function(v, p, record){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityColumn.renderer] Record: ' + record + ', DataIndex: ' + 
				this.dataIndex + ', Property Name: ' + this.property + ', DataIndex Value: ' + 
				record.get(this.dataIndex) + ', Property Type: ' + 
				Ext.type(record.get(this.dataIndex)));
		}
		var value = record.get(this.dataIndex);
		if(!Ext.isEmpty(value)) {
			p.css += ' x-grid3-check-col-td'; 
			return value[this.property];
		} 
		return '';
	}
	
};


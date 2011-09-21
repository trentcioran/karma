/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.ListReport = Ext.extend(Karma.List.ListBase, {
	
    initComponent: function(){
		Karma.Modules.Report.ListReport.superclass.initComponent.apply(this, arguments);
		this.getStore().load();
	},
    
    getGridControl: function() { 
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns(this.report.Columns);
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
                xtype: 'grid',
                id: this.getId() + '-grid',
                border: false,
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
        return grid;
    },
    
    processStore: function(){
        var _fields = this.getStoreColumns(this.report.Columns);
        return Karma.Data.GroupingStore.create(this.entity.service, _fields, 
			null, {
            Metadata: {
				Id: this.report.Id
			},
			Criterions: this.expression,
            Start: 0,
            PageSize: Karma.Conf.DefaultPageSize
        }, null, null, 'ExecuteListReport');
    },
	
	getMenuActions: function() {
        return [];
    },
	
	getGridListeners: function(){
        return {
            'bodyresize' : { fn: function(){ this.syncSize(); }, scope: this} 
        };
    },
	
	getStoreColumns: function(colDefinitions){
        var properties = [];
        Ext.each(colDefinitions, function(item, index){
            properties.push({
                name: item.Name,
				mapping: index
            });
        }, this);
        return properties;
    },

    getGridColumns: function(colDefinitions){
        var columns = [];
        Ext.each(colDefinitions, function(item, index){
			var xtype = 'gridcolumn';
			var format = null;
			var enumType = null;
			if (!Ext.isEmpty(item.Type)) {
				if (item.Type == 'number') {
					xtype= 'numbercolumn';
					format= '0,000.00';
				} else if (item.Type == 'date') {
					xtype= 'datecolumn';
					format= 'd/M/Y';
				} else if (item.Type.indexOf('Enum') != -1) {
					xtype= 'enumcolumn';
					enumType = item.Type;
				}
			}
            columns.push({
                header: item.Name,
				dataIndex: item.Name,
                sortable: false,
                hidden: false,
				format: format,
				xtype: xtype,
				enumType: enumType,
				groupable: item.Groupable
            });
        }, this);
        return columns;
    }

	
});
Ext.reg('report.listview', Karma.Modules.Report.ListReport);

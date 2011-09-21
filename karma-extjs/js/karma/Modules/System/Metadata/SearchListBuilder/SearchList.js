/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.SearchList = Ext.extend(Karma.SL, {
    canNew: false,
    canDelete: false,
    initComponent: function(){
        Karma.Modules.System.Metadata.SearchList.superclass.initComponent.apply(this, arguments);
    },
    
    getGridView: function(){
        return new Karma.Modules.System.Metadata.GridView({
            showPreview: true,
            autoFill: true,
            forceFit: true
        });
    },
    
    getGridControl: function(){
        var grid = {
            xtype: 'grid',
            id: this.getId() + '-grid',
            border: false,
            frame: false,
            store: this.getStore(),
            cm: new Ext.grid.ColumnModel(this.columnmodel),
            stripeRows: true,
            sm: this.getSelectionModel(),
            view: this.getGridView(),
            loadMask: true,
            plugins: this.getPlugins(this.columnmodel),
            listeners: {
                headerclick: {
                    fn: function(colIndex, e){
                        //e.stopEvent();
                    },
                    scope: this
                },
                headercontextmenu: {
                    fn: function(colIndex, e){
                        e.stopEvent();
                    },
                    scope: this
                },
                render: {
                    fn: function(colIndex, e){
                        var sl = Ext.getCmp(this.getId() + '-grid');
                        var dropTargetEl = sl.getView().mainBody.dom;
                        this.dropTarget = new Ext.dd.DropTarget(dropTargetEl, {
                            ddGroup: 'propertiesDD',
                            notifyEnter: function(ddSource, e, data){
                            },
                            notifyDrop: function(ddSource, e, data){
                                // Generic function to add records.
                                function addRow(record, index, allItems){
                                    // Search for duplicates
                                    //var foundItem = secondGridStore.findExact('name', record.data.name);
                                    // if not found
                                    //if (foundItem == -1) {
                                        //secondGridStore.add(record);
                                        // Call a sort dynamically
                                        //secondGridStore.sort('name', 'ASC');
                                        //Remove Record from the source
                                        //ddSource.grid.store.remove(record);
                                    //}
                                }
                                // Loop through the selections
                                //Ext.each(ddSource.dragData.selections, addRow);
                                return true;
                            }
                        });
                        
                        this.dropTarget.lock();
                    },
                    scope: this
                }
            }
        };
        return grid;
    },
    
    setQuery: function(query) {
        if(!query) {
            return;
        }
        this.query = query;
        this.dropTarget.unlock();
        if(!query.Columns) {
            return;
        }
        this.configureGridColumns(query.Columns);
    },
    
    configureGridColumns: function(colDefinitions){
        var properties = [];
        var columns = [];
        Ext.each(colDefinitions, function(item){
        	properties.push({
        		name: item.Name
    		});
        	columns.push({
        		header: item.Name,
        		sortable: item.Sortable,
        		hidden: item.Hidden
        	});
        }, this);
        
        var store = new Ext.data.ArrayStore({
            autoDestroy: true,
            data: [],
            idIndex: 0,
            fields: properties
        });
        
        var sl = Ext.getCmp(this.getId() + '-grid');
        sl.reconfigure(store, new Karma.Modules.System.Metadata.ColumnModel(columns));
    },
    
    newRecord: function(){ },
    openRecord: function(){ },
    deleteRecord: function(){ },
    onExportExcel: function(){ },
    
    updateControls: function(value){
        this.searchfield.disable();
        this.paginbar.disable();
        this.cmbFilter.disable();
        this.exportBtn.disable();
        this.newToolbarButton.disable();
    }
});
Ext.reg('meta.sl', Karma.Modules.System.Metadata.SearchList);

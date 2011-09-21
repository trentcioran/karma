/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.EntityPropertyGrid = Ext.extend(Ext.Panel, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Entity Details',
            layout: 'fit',
            items: [{
                xtype: 'tabpanel',
                border: false,
                frame: false,
                tabPosition: 'bottom',
                activeTab: 0,
                defaultType: 'grid',
                items: [{
                    id: 'ed.properties',
                    title: 'Properties',
					ddGroup: 'propertiesDD',
					enableDragDrop: true,
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        root: 'Data',
                        idProperty: 'Name',
                        fields: ['Name', 'Type', 'IsEntity', 'Description']
                    }),
                    columns: [{
                        header: 'Name',
                        dataIndex: 'Name'
                    }, {
                        header: 'Type',
                        dataIndex: 'Type'
                    }, {
                        header: 'IsEntity',
                        dataIndex: 'IsEntity',
                        hidden: true
                    }, {
                        header: 'Description',
                        dataIndex: 'Description',
                        hidden: true
                    }]
                }, {
                    id: 'ed.aggregates',
                    title: 'Aggregates',
					ddGroup: 'aggregatesDD',
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        root: 'Data',
                        idProperty: 'Name',
                        fields: ['Name', 'TargetType']
                    }),
                    columns: [{
                        header: 'Name',
                        dataIndex: 'Name'
                    }, {
                        header: 'TargetType',
                        dataIndex: 'TargetType'
                    }]
                }, {
                    id: 'ed.operations',
                    title: 'Operations',
					ddGroup: 'operationsDD',
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        root: 'Data',
                        idProperty: 'Name',
                        fields: ['Name', 'ReturnType']
                    }),
                    columns: [{
                        header: 'Name',
                        dataIndex: 'Name'
                    }, {
                        header: 'ReturnType',
                        dataIndex: 'ReturnType'
                    }]
                }]
            }]
        });
        Karma.Modules.System.Metadata.EntityPropertyGrid.superclass.initComponent.apply(this, arguments);
    },
    setDetails: function(details){
        this.findById('ed.properties').getStore().loadData({
			Data: details.Properties
		});
        this.findById('ed.aggregates').getStore().loadData({
			Data: details.Aggregates
		});
        this.findById('ed.operations').getStore().loadData({
			Data: details.Operations
		});
    }
});

Ext.reg('meta.epgrid', Karma.Modules.System.Metadata.EntityPropertyGrid);

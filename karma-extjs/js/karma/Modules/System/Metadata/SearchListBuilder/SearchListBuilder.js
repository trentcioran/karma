/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.SearchListBuilder = Ext.extend(Ext.Panel, {
    fakeEntity: {
        security: {
            New: true,
            Update: true,
            Delete: true,
            Find: true,
            Export: true,
            Print: true
        },
        metadata: {
            Service: '',
            Consultas: [{
                Id: 0,
                Name: 'Test'
            }]
        },
        columns: [{
            Name: 'Id',
            Property: 'Id'
        }],
        sortings: ['Id'],
        views: [{
            Id: 0,
            Nombre: 'Normal'
        }]
    },
    initComponent: function(){
        Ext.apply(this, {
            title: 'SearchList Builder',
            layout: 'border',
            items: [{
                region: 'west',
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                width: 270,
                layout: 'anchor',
                items: [{
                    id: 'query.list',
                    xtype: 'meta.sl.query.list',
                    anchor: '100%, 40%',
                    listeners: {
                        'select': {
                            fn: this.onQuerySelect,
                            scope: this
                        }
                    }
                }, {
                    id: 'query.details',
                    anchor: '100%, 60%',
                    xtype: 'meta.sl.det'
                }]
            }, this.mainPanel = new Ext.Panel({
                region: 'center',
                layout: 'fit',
                items: []
            })]
        });
        Karma.Modules.System.Metadata.SearchListBuilder.superclass.initComponent.apply(this, arguments);
    },
    
    setEntity: function(entity){
        this.fakeEntity.metadata = entity;
        this.mainPanel.add({
            id: 'sl.preview',
            xtype: 'meta.sl',
            entity: this.fakeEntity,
            sortings: ['Id'],
            views: [{
                Id: 0,
                Nombre: 'Normal'
            }]
        });
        var list = this.findById('query.list');
        list.setQueries(entity.Queries);
        this.doLayout();
    },
    
    clear: function(){
        this.mainPanel.remove('sl.preview');
        var list = this.findById('query.list');
        list.clear();
        this.doLayout();
    },
    
    onQuerySelect: function(query) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchListBuilder] Query:' + query);
        }
        var details = this.findById('query.details');
        details.setQuery(query);
        
        var sl = this.findById('sl.preview');
        sl.setQuery(query);
    }
});

Ext.reg('meta.slbuilder', Karma.Modules.System.Metadata.SearchListBuilder);

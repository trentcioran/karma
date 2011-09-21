/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.EntityBrowser = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Entity Browser',
            autoScroll: true,
            loader: new Ext.tree.TreeLoader(),
            rootVisible: false,
            lines: false,
            root: new Ext.tree.AsyncTreeNode({
                expanded: true,
                allowChildren: true
            })
        });
        Karma.Modules.System.Metadata.EntityBrowser.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
        this.entity.useInvoker('GetEntities', null, {
            fn: function(entities){
                var data = [];
                Ext.each(entities, function(entity){
                    if (PLOG.isDebugEnabled()) {
                        PLOG.debug('[EntityBrowser] entity: ' + entity);
                    }
                    data.push({
                        id: entity,
                        text: entity,
                        leaf: true,
                        listeners: {
                            click: {
                                fn: this.onSelect,
                                scope: this
                            }
                        }
                    });
                }, this);
                this.getRootNode().appendChild(data);
            },
            scope: this
        });
    },
    
    onSelect: function(node){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityBrowser] select: ' + node.text);
        }
        this.fireEvent('select', node.text);
    }
});

Ext.reg('meta.ebrowser', Karma.Modules.System.Metadata.EntityBrowser);

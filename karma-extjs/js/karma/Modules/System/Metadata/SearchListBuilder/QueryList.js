/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.QueryList = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function() {
        Ext.apply(this, {
            title: 'Query List',
            autoScroll: true,
            loader: new Ext.tree.TreeLoader(),
            rootVisible: false,
            lines: false,
            root: new Ext.tree.AsyncTreeNode({
                expanded: true,
                allowChildren: true
            })
        });
        Karma.Modules.System.Metadata.QueryList.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
    },
    
    onSelect: function(node){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[QueryList.onSelect] select: ' + node.text);
        }
        this.fireEvent('select', node.attributes.query);
    },
    
    setQueries: function(queries){
        if(this.getRootNode().hasChildNodes()) {
            this.clear();
        }
        if(!queries) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[QueryList.setQueries] the entity has no queries.');
            }
            return;
        }
        var data = [];
        Ext.each(queries, function(query){
            if(!query.LinkQuery) {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[QueryList.setQueries] query: ' + query.Nombre);
                }
                data.push({
                    text: query.Name,
                    leaf: true,
                    query: query,
                    listeners: {
                        click: {
                            fn: this.onSelect,
                            scope: this
                        }
                    }
                });
            }
        }, this);
        this.getRootNode().appendChild(data);
    },
    
    clear: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[QueryList.clear] <-');
        }
        if(!this.getRootNode().hasChildNodes()) {
            return;
        }
        var data = [];
        this.getRootNode().eachChild(function(node) {
            data.push(node);
        }, this);
        Ext.each(data, function(node) {
            node.remove();
        }, this);
    }
});
Ext.reg('meta.sl.query.list', Karma.Modules.System.Metadata.QueryList);	

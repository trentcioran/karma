/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.View.ViewMenuBase = Ext.extend(Ext.Panel, {

    title: 'Operaciones',
    
    iconCls: 'icon-box-world',
    
    section: 'ops',
	
    initComponent: function(){
        var moduleMgr = Karma.Core.ModuleManager.Instance;
        var modules = this.process(moduleMgr.getAll());
        Ext.apply(this, {
            layout: 'accordion',
            border: false,
            headerCfg: {
                tag: 'center',
                cls: 'x-navigation-header'
            },
            layoutConfig: {
                titleCollapse: true,
                hideCollapseTool: false,
                animate: true
            },
            items: modules
        });
        Karma.View.ViewMenuBase.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
    },
    
    onEntityClick: function(node){
        var entity = node.attributes.entity;
        this.fireEvent('select', entity);
    },
    
    process: function(modules){
        var _modules = new Array();
        Ext.each(modules, function(module, index){
            if (!module.isHidden() && module.section === this.section) {
                var nodeArray = [];
                module.getEntities().each(function(entity, index){
                    if (!entity.isHidden()) {
                        nodeArray.push({
                            text: entity.getName(),
                            leaf: true,
                            entity: entity
                        });
                    }
                }, this);
                
                _modules.push(new Ext.tree.TreePanel({
                    title: module.getName(),
                    loader: new Ext.tree.TreeLoader({
                        preloadChildren: true
                    }),
                    root: {
						nodeType: 'async',
                        expanded: true,
                        allowChildren: true,
						children: nodeArray
                    },
		            autoScroll: true,
	                rootVisible: false,
	                lines: false,
	                listeners: {
	                    'click': {
	                        fn: this.onEntityClick,
	                        scope: this
	                    }
	                }
                }));
            }
        }, this);
		return _modules;
    }
    
});


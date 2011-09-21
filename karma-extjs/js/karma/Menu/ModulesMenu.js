/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.ModulesMenu = Ext.extend(Ext.Button, {

    initComponent: function(){
        this.moduleMgr = Karma.Core.ModuleManager.Instance;
        var menu = this.process(this.moduleMgr.getAll());
        Ext.apply(this, {
            id: 'mnuModules',
            text: 'Modulos',
            iconCls: 'icon-box-world',
            menu: {
                items: menu
            }
        });
        Karma.ModulesMenu.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
    },
    
    onEntityClick: function(menu){
        this.fireEvent('select', menu.entity);
    },
    
    process: function(modules){
        var menu = new Array();
        Ext.each(modules, function(module, index){
            if (!module.isHidden()) {
                var subs = new Array();
                module.getEntities().each(function(entity){
                    if (!entity.isHidden()) {
                        subs.push({
                            text: entity.getName(),
                            handler: this.onEntityClick,
                            scope: this,
                            entity: entity
                        });
                    }
                }, this);
                menu.push({
                    text: module.getName(),
					menu: {
						items: subs						
					}
                });
            }
        }, this);
        return menu;
    }
});
Ext.reg('menu.modules', Karma.ModulesMenu);


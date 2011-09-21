/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.View.ModulesView = Ext.extend(Karma.View.ViewMenuBase, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Operaciones',
            iconCls: 'icon-box-world',
			section: 'ops'
        });
        Karma.View.ModulesView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('modules.view', Karma.View.ModulesView);

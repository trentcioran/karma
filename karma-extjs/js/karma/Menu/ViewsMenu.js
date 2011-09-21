/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.ViewsMenu = Ext.extend(Ext.Button, {

	initComponent: function (){
		Ext.apply(this, {
			id: 'mnuViews',
			text: 'Vistas',
			iconCls: 'icon-view-tile',
			menu: {
				items: [{
					text: 'Ventanas',
					iconCls: 'icon-view-contract',
					handler: function(){
						var view = Ext.getCmp('windows.view');
						view.toggleCollapse();
					},
					checked: true,
					scope: this
				}, {
					text: 'Modulos',
					iconCls: 'icon-view-contract',
					handler: function(){
						var view = Ext.getCmp('modules.view');
						view.toggleCollapse();
					},
					checked: true,
					scope: this
				}]
			}
		});

		Karma.ViewsMenu.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('menu.views', Karma.ViewsMenu);

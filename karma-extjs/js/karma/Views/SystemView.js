/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.View.SystemView = Ext.extend(Karma.View.ViewMenuBase, {
	initComponent: function() {
		Ext.apply(this, {
			title: 'Sistema',
			iconCls: 'icon-advanced',
			section: 'sys'
		});
		Karma.View.SystemView.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('system.view', Karma.View.SystemView);

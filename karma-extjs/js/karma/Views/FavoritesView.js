/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.View.FavoritesView = Ext.extend(Karma.View.ViewMenuBase, {
	
	initComponent: function() {
		Ext.apply(this, {
			title: 'Favoritos',
			iconCls: 'icon-star',
			section: 'fav',
			hidden: true
		});
		Karma.View.FavoritesView.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('favorites.view', Karma.View.FavoritesView);

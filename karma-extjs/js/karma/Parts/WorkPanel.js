/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Parts.WorkPanel = Ext.extend(Ext.TabPanel, {
	
	hometabXType: null,
	
	initComponent: function(){
		Ext.apply(this, {
			region: 'center',
			defaultType: 'workpanel.item',
			anchor: '100%',
			defaults: {
				autoScroll: true,
				defaultType: 'Karma.searchlist',
				iconCls: 'icon-search'
			},
			activeItem: 0,
			resizeTabs: true,
			enableTabScroll: true,
			minTabWidth: 75,
			tabMargin: 5,
			layoutOnTabChange: true,
			items: [{ 
				xtype: this.hometabXType,
				iconCls: 'icon-home'
			}],
			listeners: {
				'close' : {
					fn: function(p) {
						this.fireEvent('activity');
					},
					scope : this
				}
			},
			plugins: [
				new Ext.ux.TabScrollerMenu({
					maxText  : 15,
					pageSize : 10
				})
			]
		});
		Karma.Parts.WorkPanel.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'activity': true });
	},
	
	setHomeTab: function(){
		this.setActiveTab(0);
	},
	
	setEntityTab: function(entity) {
		var panel = this.findById(entity.id);
		if (Ext.isEmpty(panel)) {
			this.add(entity.getMainPanel());
			this.getLayout().setActiveItem(entity.getId());
		} else {
			this.setActiveTab(panel);
		}
		this.fireEvent('activity');
	}

});

Ext.reg('workpanel', Karma.Parts.WorkPanel);

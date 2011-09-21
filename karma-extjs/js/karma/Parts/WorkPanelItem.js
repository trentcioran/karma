/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Parts.WorkPanelItem = Ext.extend(Ext.Panel, {
	
	initComponent: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WorkPanelItem.initComponent] <-');
		}
		Ext.apply(this, {
			layout: 'fit',
			autoScroll: true,
			resizeTabs: true,
			closable: true
		});
		Karma.Parts.WorkPanelItem.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'activity': true });
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WorkPanelItem.initComponent] ->');
		}
	}

});

Ext.reg('workpanel.item', Karma.Parts.WorkPanelItem);

/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Parts.StatusBar = Ext.extend(Ext.ux.StatusBar, {
	
	minutes: 0,
	
	userData: null,
	
	footer: null,

	userDataXTemplate: null,
	
	footerItem: null,
	
	userDataItem: null,
	
	sessionDataItem: null,
	
	accessDataItem: null,
	
	clockItem: null,

	footerItem: null,

	initComponent: function (){
		PLOG.debug('[StatusBar.initComponent] <-');
	    this.footerItem = new Ext.Toolbar.TextItem(this.footer);
		var userDataString = '';
		if (!Ext.isEmpty(this.userData) && !Ext.isEmpty(this.userDataXTemplate)) {
			userDataString = this.userDataXTemplate.applyTemplate(this.userData);
		}
		this.userDataItem = new Ext.Toolbar.TextItem(userDataString);
	    this.sessionDataItem = new Ext.Toolbar.TextItem('');
	    this.accessDataItem = new Ext.Toolbar.TextItem('Acceso: ' + new Date().format('g:i:s A'));
	    this.clockItem = new Ext.Toolbar.TextItem('');
		Karma.Core.SessionManager.Instance.on('renew', this.reset, this);
		
		Ext.apply(this, {
            id: 'status',
            items: [
				'->',
				this.footerItem, '-',
				this.userDataItem, '-', 
				this.accessDataItem, '-', 
				this.sessionDataItem, '-', 
				this.clockItem],
				listeners: {
					'render': {
						fn: function(){
					        Ext.fly(this.footerItem.getEl().parentNode).addClass('x-status-text-panel')
								.createChild({cls:'spacer'});
					        Ext.fly(this.userDataItem.getEl().parentNode).addClass('x-status-text-panel')
								.createChild({cls:'spacer'});
					        Ext.fly(this.accessDataItem.getEl().parentNode).addClass('x-status-text-panel')
								.createChild({cls:'spacer'});
					        Ext.fly(this.sessionDataItem.getEl().parentNode).addClass('x-status-text-panel')
								.createChild({cls:'spacer'});
					        Ext.fly(this.clockItem.getEl().parentNode).addClass('x-status-text-panel')
								.createChild({cls:'spacer'});
						},
						scope: this
					}
				}
		});
		Karma.Parts.StatusBar.superclass.initComponent.apply(this, arguments);
		PLOG.debug('[StatusBar.initComponent] ->');
	},
	
	onRender: function() {
		Karma.Parts.StatusBar.superclass.onRender.apply(this, arguments);
	    Ext.TaskMgr.start({
	        run: function(){
	            Ext.fly(this.clockItem.getEl()).update(new Date().format('d/m/Y g:i:s A'));
	        },
	        interval: 1000,
			scope: this
	    });
	    Ext.TaskMgr.start({
	        run: function(){
				this.minutes++;
				var mins = (Karma.Core.SessionManager.Instance.getSeccionTimeout() / 60000) - (this.minutes);
	            Ext.fly(this.sessionDataItem.getEl()).update('Sesi&oacute;n: ' + mins.toFixed(0) + ' mins.');
	        },
	        interval: 60000,
			scope: this
	    });
	},

	reset: function(){
		this.minutes = 0;
		var mins = (Karma.Core.SessionManager.Instance.getSeccionTimeout() / 60000) - (this.minutes);
        Ext.fly(this.sessionDataItem.getEl()).update('Sesi&oacute;n: ' + mins.toFixed(0) + ' mins.');
	}
	
});


/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.SessionManager = function(duration){
	this.task = new Ext.util.DelayedTask(this.end, this);
	this.sessionDuration = 900000;
	if(!Ext.isEmpty(duration) && Ext.type(duration) === 'number') {
		this.sessionDuration = duration * 60000;
	}
	this.addEvents({ 
		'timeout': true,
		'renew': true
	});
	this.renewSession = false;
    
	Karma.Core.SessionManager.Instance = this;
};

Ext.extend(Karma.Core.SessionManager, Ext.util.Observable, {
	start: function(){
		this.task.delay(this.sessionDuration);
		Ext.TaskMgr.start(this.renewtask={
	        run: function(){
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[SessionManager.renewTask] <- renew? ' + this.renewSession);
				}
				Ext.Ajax.request({
		            url: 'x.aspx?_r=' + Math.random(),
		            method: 'GET',
		            success: function(){ },
		            failure: function(){ },
		            scope: this
		        });
		        this.renewSession = false;
	        },
	        interval: 5*60000,
			scope: this
	    });
	},
	renew: function(){
		this.renewSession = true;
		this.task.delay(this.sessionDuration);
		this.fireEvent('renew');
	},
	end: function(){
		this.task.cancel();
		Ext.TaskMgr.stop(this.renewtask);
		this.fireEvent('timeout');
	},
	getSeccionTimeout: function() {
		return this.sessionDuration;
	}
});
Ext.apply(Karma.Core.SessionManager, {
	
	Instance: null
	
});

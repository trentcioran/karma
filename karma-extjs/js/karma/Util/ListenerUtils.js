/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Util.ListenerUtils = function(){};

Ext.apply(Karma.Util.ListenerUtils, {
	
	addListenersToObject: function(target, listeners) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ListenerUtils.addListenersToObject] La instancia: ' + target);
		}
		if (!Ext.isEmpty(listeners)) {
			for(property in listeners) {
				var list = listeners[property];
				var _scope = null;
				var _fn = null;
				if(!Ext.isEmpty(list.scope)) {
					_scope = list.scope;
				}
				if(Ext.isEmpty(list.fn)) {
					_fn = list;
				} else {
					_fn = list.fn;
				}
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ListenerUtils.addListenersToObject] adding event [' + 
						property + '] scope: [' + _scope + '] fn: [' + _fn + ']');
				}
				target.on(property, _fn, _scope);
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ListenerUtils.addListenersToObject] event [' + 
						property + '] added to the editor.');
				}
			}
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[ListenerUtils.addListenersToObject] listeners es null');
			}
		}
	}
});


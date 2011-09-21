/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.WindowManager = function(){
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[WindowManager.ctor] <-');
	}
	this.windows = new Ext.util.MixedCollection();
	this.counter = 0;
	this.taskRunner = new Ext.util.TaskRunner();
	this.addEvents({
        'register' : true,
        'unregister' : true,
        'destroy' : true,
        'get' : true,
		'change': true,
		'close': true,
		'open': true,
		'minimize': true,
		'titlechange': true,
		'any': true
    });

	this.onClose = function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onClose] <-');
		}
		this.unregister(win.getId());
		this.fireEvent('close', win.getId());
		this.fireEvent('any');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onClose] ->');
		}
	};
	
	this.onMinimize = function(win) {
		PLOG.debug('[WindowManager.onMinimize] <-');
		this.fireEvent('minimize', win);
		this.fireEvent('any');
		PLOG.debug('[WindowManager.onMinimize] ->');
	};
	
	this.onShow = function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onShow] <-');
		}
		this.fireEvent('show', win);
		this.fireEvent('any');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onShow] ->');
		}
	};
	
	this.onChange = function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onChange] <-');
		}
		this.fireEvent('change', win);
		this.fireEvent('any');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onChange] ->');
		}
	};
	
	this.onFlush = function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onChange] <-');
		}
		this.fireEvent('flush', win);
		this.fireEvent('any');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onChange] ->');
		}
	};
	
	this.onTitleChange = function(win, newTitle) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onTitleChanghe] <-');
		}
		this.fireEvent('titlechange', win, newTitle);
		this.fireEvent('any');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.onTitleChange] ->');
		}
	};
	
	Karma.Core.WindowManager.superclass.constructor.call(this, arguments);
	Karma.Core.WindowManager.Instance = this;
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[WindowManager.ctor] ->');
	}
};

Ext.extend(Karma.Core.WindowManager, Ext.util.Observable, {
	
	register: function(winId, title){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.register] <-');
		}
		if (Ext.isEmpty(winId)) {
			PLOG.error('[WindowManager.unregister] Window Id must not be null!!!');
			return;
		}
		var win = Ext.WindowMgr.get(winId);
		if (Ext.isEmpty(win)) {
			PLOG.error('[WindowManager.unregister] Window does not exist!!!');
			return;
		}
		if (!this.windows.containsKey(winId)) {
			this.windows.add(win.getId(), win);

			win.on('change', this.onChange, this);
			win.on('close', this.onClose, this);
			win.on('minimize', this.onMinimize, this);
			win.on('flush', this.onFlush, this);
			win.on('show', this.onShow, this);
			win.on('titlechange', this.onTitleChange, this);
			this.fireEvent('register', win);
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[WindowManager.register] Window [' + win.getId() + '] registered.');
			}
		} else {
			PLOG.error('[WindowManager.register] Window is already registered!!!');
			return;
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.register] ->');
		}
	},
	
	unregister: function(winId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.unregister] <-');
		}
		if (Ext.isEmpty(winId)) {
			PLOG.error('[WindowManager.unregister] WindowId cannot be null!!!');
		}
		if (Ext.type(winId) === 'string' && this.windows.containsKey(winId)) {
			this.windows.removeKey(winId);
		}
		this.fireEvent('unregister', winId);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.unregister] ->');
		}
	},
	
	get: function(winId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.get] <-');
		}
		if (Ext.isEmpty(winId)) {
			PLOG.error('[WindowManager.unregister] Window Id cannot be null!!!');
		}
		var win = this.windows.key(winId);
		if (Ext.isEmpty(win)) {
			PLOG.info('[WindowManager.unregister] Window [' + winId + '] is not registered!!!');
			return null;
		}
		this.fireEvent('get', win);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.get] ->');
		}
		return win;
	},
	
	init: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.int] <-');
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.int] ->');
		}
	},
	
	getIfExist: function(entity, id) {
		if (id > 0) {
			return this.get(this.getId(entity, id));
		}
		return null;
	},
	
	getId: function(entity, id) {
		if (id == 0) {
			return entity.name + '-nvo-' + this.counter++;
		}
		return entity.name + '-' + id;
	},
	
	existsDirty: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.existsDirty] <-');
		}
		var dirty = false;
		this.windows.each(function(win, index){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[WindowManager.existsDirty] Window [' + win.getId() + ']: ' + win.isDirty());
			}
			if(win.isDirty()){
				dirty = true;
			}
		}, this);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.existsDirty] - [' + dirty + ']');
		}
		return dirty;
	},
	
	flushDirty: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.flushDirty] <-');
		}
		this.windows.each(function(win, index){
			if(win.isDirty()){
				this.taskRunner.start({
					run: win.flush,
					repeat: 0
				});
			}
		}, this);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.flushDirty] ->');
		}
	},
	
	destroy: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.destroy] <-');
		}
		this.windows.each(function(win, index){
			this.unregister(win);
		}, this);
		this.fireEvent('destroy');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowManager.destroy] ->');
		}
	}
	
});

Karma.WinManager = Karma.Core.WindowManager;

Ext.apply(Karma.Core.WindowManager, {
	
	Instance: null
	
});

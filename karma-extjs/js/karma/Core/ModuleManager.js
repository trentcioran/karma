/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.ModuleManager = function(principal){
	if (PLOG.isDebugEnabled()) {
		LOG.debug('[ModuleManager.ctor] <-');
	}
	this.principal = principal;
	this.modules = [];
	this.entities = new Ext.util.MixedCollection();
	this.moduleKeys = [];
	this.counter = 0;
	this.taskRunner = new Ext.util.TaskRunner();
	this.modulesCount = 0;
	
	this.onAny = function() {
		this.fireEvent('activity');
	};
	
	this.onLoadEntity = function(entity) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.onLoadEntity] [' + entity.getName() + '] <-');
		}
		this.entities.add(entity.getName().toLowerCase(), entity);
		this.fireEvent('loadentity', entity);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.onLoadEntity] ->');
		}
	};

	this.onLoadModule = function(module) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.onLoadModule] [' + module.getName() + '] <-');
		}
		this.modulesCount++;
		if (this.modules.length == this.modulesCount) {
			this.fireEvent('load');
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.onLoadModule] -> modules.lenght: ' + this.modules.length +
				', modulesCount: ' + this.modulesCount);
		}
	};

	Karma.Core.ModuleManager.superclass.constructor.call(this, arguments);
	this.addEvents({
		'register' : true,
		'loadentity': true,
		'load': true,
		'activity' : true
    });
	
	Karma.Core.ModuleManager.Instance = this;
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[ModuleManager.ctor] ->');
	}
};

Ext.extend(Karma.Core.ModuleManager, Ext.util.Observable, {
	
	register: function(modules){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.register] Registering modules: [' + modules + ']');
		}
		if (!Ext.isEmpty(modules)) {
			Ext.each(modules, function(_module){
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ModuleManager.register] Registering module: ' + _module);
				}
				if (!Ext.isEmpty(_module)) {
					this.registerModule(new _module());
				}
				else {
					PLOG.error('[ModuleManager.register] Error on module: ' + _module);
				}
			}, this);
		}
	},
	
	registerModule: function(module){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.registerModule] <-');
		}
		if (this.principal.hasModule(module.getName())) {
			if (Ext.isEmpty(module)) {
				PLOG.error('[ModuleManager.registerModule] Module must not be null!!!');
				return;
			}
			if (Ext.isEmpty(this.moduleKeys[module.getName()])) {
				this.moduleKeys[module.getName()] = this.counter++;
				this.modules[this.moduleKeys[module.getName()]] = module;
				this.relayEvents(module, ['activity']);
				module.on('loadentity', this.onLoadEntity, this);
				module.on('load', this.onLoadModule, this);
				module.init(this.principal);
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ModuleManager.registerModule] Module [' + module.getName() + 
						'] has been registered.');
				}
				this.fireEvent('register', module);
			} else {
				PLOG.error('[ModuleManager.registerModule] Module is already registered!!!');
				return;
			}
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[ModuleManager.registerModule] User does not have access to the module [' 
					+ module.getName() + ']');
			}
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.registerModule] ->');
		}
	},
	
	unregister: function(moduleId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.unregister] <-');
		}
		if (Ext.isEmpty(moduleId)) {
			PLOG.error('[ModuleManager.unregister] ModuleId cannot be null!!!');
		}
		var module = null;
		if (Ext.type(moduleId) === 'string') {
			module = this.modules[this.moduleKeys[moduleId]];
		} else {
			module = moduleId;
		}
		if(!Ext.isEmpty(module)) {
			module.destroy();
			this.modules[this.moduleKeys[moduleId]] = null;
			delete this.moduleKeys[moduleId];
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.unregister] ->');
		}
	},
	
	get: function(moduleId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.get] <-');
		}
		if (Ext.isEmpty(moduleId)) {
			PLOG.error('[ModuleManager.get] ModuleId cannot be null!!!');
		}
		var module = this.modules[this.moduleKeys[moduleId]];
		if (Ext.isEmpty(module)) {
			PLOG.error('[ModuleManager.get] Module [' + moduleId + '] is not registered!!!');
			return null;
		}
		if (!module.isInitialized()) {
			module.init();
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.get] ->');
		}
		return module;
	},
	
	getAll: function(){
		return this.modules;
	},
	
	init: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.int] <-');
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.int] ->');
		}
	},
	
	getEntity: function(entityId) {
		if(!this.sorted) {
			this.entities.keySort();
			this.sorted = true;
		}
		var entity = this.entities.key(entityId.toLowerCase());
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.getEntity] ->[' + entityId + 
				'], Entity: [' + entity + '], Service: [' + (entity? entity.service:'') + ']');
		}
		return entity;
	},
	
	destroy: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.destroy] <-');
		}
		this.taskRunner.stopAll();
		Ext.each(this.modules, function(module, index, all){
			this.unregister(module);
		}, this);
		this.fireEvent('destroy');
		this.fireEvent('activity');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ModuleManager.destroy] ->');
		}
	}
	
});

Ext.apply(Karma.Core.ModuleManager, {
	
	Instance: null
	
});

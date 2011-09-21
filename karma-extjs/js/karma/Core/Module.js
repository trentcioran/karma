/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.Module = function() {
    if (PLOG.isDebugEnabled()) {
        PLOG.debug('[Module.ctor] <-');
    }
    this.principal = null;
    this.initialized = false;
    this.entitiesCount = 0;

    this.loadDependencies = function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Module.loadDependencies] <-');
        }
        if (!Ext.isEmpty(this.dependencies)) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Module.loadDependencies] loading entities of [' + this.getName() + ']');
                PLOG.debug('[Module.loadDependencies] entities [' + this.dependencies + ']');
            }
            this.entities = new Ext.util.MixedCollection();
            Ext.each(this.dependencies, function(dep) {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Module.dependencyLoaded] Creating Entity [' + dep + ']');
                }
                var entity = new dep();
                
                this.relayEvents(entity, ['activity']);
                entity.init();
                this.entities.add(entity.getName(), entity);
                entity.module = this;
                this.fireEvent('loadentity', entity);
                
                if (this.principal.hasEntity(entity.getName())) {
                    if (PLOG.isDebugEnabled()) {
                        PLOG.debug('[Module.dependencyLoaded] User have access to the entity ['
							+ entity.getName() + ']');
                    }
                    
                    /*this.relayEvents(entity, ['activity']);
                    entity.init();
                    this.entities.add(entity.getName(), entity);
                    entity.module = this;
                    this.fireEvent('loadentity', entity);*/
                    
                    if (PLOG.isDebugEnabled()) {
                        PLOG.debug('[Module.dependencyLoaded] Entity [' + entity.getName() + '] loaded.');
                    }
                    
                } else {
                    if (PLOG.isDebugEnabled()) {
                        PLOG.debug('[Module.dependencyLoaded] User does not have access to the entity ['
							+ entity.getName() + ']');
                    }
                    entity.hidden = true;
                }
                
            }, this);
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Module.dependencyLoaded] Module [' + this.getName() +
					'] fully initialized, entities loaded:');
                this.entities.each(function(e) {
                    PLOG.debug('[Module.dependencyLoaded] Entity: [' + e.getName() + ']');
                });
            }
            this.initialized = true;
            this.fireEvent('load', this);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Module.loadDependencies] ->');
        }
    };

    this.configure = function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Module.configure] <-');
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Module.configure] ->');
        }
    };

    this.onAny = function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Module.onAny] <-');
        }
        this.fireEvent('activity');
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Module.onAny] ->');
        }
    };

    Karma.Core.Module.superclass.constructor.call(this, arguments);
    this.addEvents({
        'load': true,
        'unload': true,
        'loadentity': true,
        'activity': true
    });
    if (PLOG.isDebugEnabled()) {
        PLOG.debug('[Module.ctor] ->');
    }
};

Ext.extend(Karma.Core.Module, Ext.util.Observable, {
	
	name: null,
	
	id: null,
	
	dependencies: null,
	
	additionalFiles: null,
	
	hidden: false,
	
	entities: null,
	
	section: 'ops',
	
	getId: function(){
		return this.id;
	},
	
	getName: function(){
		return this.name;
	},
	
	init: function(principal){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Module.init] <-');
		}
		this.principal = principal;
		this.loadDependencies();
		this.configure();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Module.init] ->');
		}
	},
	
	destroy: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Module.destroy] <-');
		}
		Ext.each(this.entities, function(entity, index){
			entity.destroy();
		}, this);
		this.fireEvent('unload', this);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Module.destroy] ->');
		}
	},
	
	isInitialized: function (){
		return this.initialized;
	},
	
	getEntity: function(entityId) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Module.getEntity] <-');
		}
		if (Ext.isEmpty(entityId)) {
			PLOG.error('[Module.getEntity] entityId cannot be null!!!');
		}
		var entity = this.entities.key(entityId);
		if (Ext.isEmpty(entity)) {
			PLOG.error('[Module.getEntity] Entity [' + entityId + '] is not registered!!!');
			return null;
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Module.getEntity] ->');
		}
		return entity;
	},
	
	isHidden: function() {
		return this.hidden;
	},
	
	getEntities: function(){
		return this.entities;
	}
	
});

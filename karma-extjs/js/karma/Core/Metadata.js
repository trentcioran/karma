/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.Metadata = function(data){
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Metadata.ctor] <-');
		PLOG.debug('[Metadata.ctor] Reading metadata...');
	}
	this.data = data;
	this.modules = new Ext.util.MixedCollection();
	this.entities = new Ext.util.MixedCollection();
	this.entitylinkqueries = new Ext.util.MixedCollection();

	this.getEntity = function(entityId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.getEntity] Entity [' + entityId + ']');
		}
		var entity = this.entities.key(entityId);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.getEntity] Entity retrieved [' + entity + ']');
		}
		return entity;
	};
	
	this.getField = function(fieldName){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.getField] Entity [' + this.Name + '], Field [' + fieldName + ']');
		}
		var field = this.fields.key(fieldName);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.getField] Field retrieved [' + field + ']');
		}
		return field;
	};
	
	Ext.each(data.Modulos, function(module, index){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.ctor] Module : ' + module.Name);
		}
		this.modules.add(module.Name, module);
		module.entities =  new Ext.util.MixedCollection();
		module.getEntity = this.getEntity.createDelegate(module);
		Ext.each(module.Entities, function(entity, eindex){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[Metadata.ctor] Entity : ' + entity.Name + ', Service: ' + entity.Service);
			}
			// process queries
			var query = null;
			var idxquery = 0;
            var found = false;
			for(var qidx = 0; qidx < entity.Queries.length; qidx++) {
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[Metadata.ctor] Query : ' + entity.Queries[qidx].Name + 
						', is LinkQuery: ' + entity.Queries[qidx].LinkQuery);
				}
				if (entity.Queries[qidx].LinkQuery) {
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[Metadata.ctor] Query Default found:' + 
							entity.Queries[qidx].Name);
					}
					entity.LinkQuery = entity.Queries[qidx].Id;
					idxquery = qidx;
                    found = true;
					break;
				}
			}
			entity.getLinkQuery = function(){ return this.LinkQuery; }.createDelegate(entity);
            if(found) {
                entity.Queries.splice(idxquery, 1);
            }
			
			// process fields
			entity.fields = new Ext.util.MixedCollection();
			if(entity.Editor && entity.Editor.Fields) {
				Ext.each(entity.Editor.Fields, function(field, index) {
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[Metadata.ctor] Field : ' + field.Name);
					}
					entity.fields.add(field.Name, field);
				}, this);
			}
			entity.getField = this.getField.createDelegate(entity);
			
			this.entities.add(entity.Name, entity);
			module.entities.add(entity.Name, entity);
		}, this);
	}, this);
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Metadata.ctor] Configured Modules:');
		this.modules.each(function(module, index){
			PLOG.debug('[Metadata.ctor] module: ' + module.Name);
		});
		PLOG.debug('[Metadata.ctor] Configured Entities:');
		this.entities.each(function(entity, index){
			PLOG.debug('[Metadata.ctor] entity: ' + entity.Name);
		});
	}

	this.getData= function(){
		return this.data;
	};

	this.hasModule = function(moduleId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.hasModule] User has permissions for [' + moduleId + ']? : ' + 
				this.modules.containsKey(moduleId));
		}
		return this.modules.containsKey(moduleId);
	};
	
	this.hasModules = function(){
		return this.modules.getCount() > 0;
	};
	
	this.hasEntity = function(entityId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.hasEntity] User has permissions for [' + entityId + ']? : ' + 
				this.entities.containsKey(entityId));
		}
		return this.entities.containsKey(entityId);
	};
	
	this.getModule = function(moduleId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Metadata.getModule] Module [' + moduleId + ']');
		}
		return this.modules.key(moduleId);
	};
};

Karma.Metadata = Karma.Core.Metadata;

Ext.apply(Karma.Core.Metadata, { Instance: null });

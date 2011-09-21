/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.Principal = function(data){
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Principal.ctor] <-');
	}
	this.data = data;
	this.modules = new Ext.util.MixedCollection();
	this.entities = new Ext.util.MixedCollection();
	
	this.hasOperation = function(operationName) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Entity.has] operationName : ' + operationName);
		}
		if (Ext.isEmpty(this.Operaciones)) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[Entity.has] operaciones is null or empty.');
			}
			return false;
		}
		var found = false;
		Ext.each(this.Operaciones, function(item){
			if (item.Nombre === operationName){
				found = true;
				return false;
			}
		}, this);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Entity.has] operationName : ' + operationName + ': ' + found);
		}
		return found;
	};
	this.isVisible = function(fieldName) {
		var flag = false;
		Ext.each(this, function(field) {
			if(field.Name == fieldName) {
				flag = field.Access == 1;
				return false;
			}
		});
		return flag;
	};
	this.isEditable = function(fieldName) {
		var flag = false;
		Ext.each(this, function(field) {
			if(field.Name == fieldName) {
				flag = field.Access == 2;
				return false;
			}
		});
		return flag;
	};
	
	Ext.each(data.Perfil.Modulos, function(module, index){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Principal.ctor] module : ' + module.Nombre);
		}
		this.modules.add(module.Nombre, module);
		Ext.each(module.Entidades, function(entity, eindex){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[Principal.ctor] entity : ' + entity.Nombre);
			}
			entity.has = this.hasOperation.createDelegate(entity);
			if (Ext.isEmpty(entity.Editor)) {
				entity.Editor = {
					Fields: {
						isVisible: function(fieldName){ return true; },
						isEditable: function(fieldName){ return true; }
					}
				};
			}
			else {
				entity.Editor.Fields.isVisible = this.isVisible.createDelegate(entity.Editor.Fields);
				entity.Editor.Fields.isEditable = this.isEditable.createDelegate(entity.Editor.Fields);
			}
			this.entities.add(entity.Nombre, entity);
		}, this);
	}, this);
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Principal.ctor] configured modules');
		this.modules.each(function(module){
			PLOG.debug('[Principal.ctor] module: ' + module.Nombre);
		});
		PLOG.debug('[Principal.ctor] configured entities');
		this.entities.each(function(entity){
			PLOG.debug('[Principal.ctor] entity: ' + entity.Nombre);
		});
	}

	this.getData= function(){
		return this.data;
	};

	this.hasModule = function(moduleId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Principal.hasModule] User has permissions for module [' + moduleId + ']? : ' + 
				this.modules.containsKey(moduleId));
		}
		return this.modules.containsKey(moduleId);
	};
	
	this.hasModules = function(){
		return this.modules.getCount() > 0;
	};
	
	this.hasEntity = function(entityId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Principal.hasEntity] User has permissions for entity [' + entityId + ']? : ' + 
				this.entities.containsKey(entityId));
		}
		return this.entities.containsKey(entityId);
	};
	
	this.getEntity = function(entityId){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Principal.getEntity] Entity [' + entityId + ']');
		}
		var entity = this.entities.key(entityId);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Principal.getEntity] Entity retrieved [' + entity + ']');
		}
		return entity;
	};
	
	this.getId = function(){
		return this.data.Id;
	};
	
	this.getName = function(){
		return this.data.Nombre;
	};
	
	this.getUsername = function(){
		return this.data.Username;
	};
	
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Principal.ctor] ->');
	}
};

Karma.Principal = Karma.Core.Principal;

Ext.apply(Karma.Core.Principal, {
	
	Instance: null
	
});

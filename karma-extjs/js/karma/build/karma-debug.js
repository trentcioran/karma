/*
 * Karma 0.7
 * Copyright(c) 2008-2009, Jose Manuel Islas Romero [trentcioran@gmail.com].
 */



Ext.ns('Karma',
	'Karma.Core',
	'Karma.Data',
	'Karma.Factory',
	'Karma.Parts',
	'Karma.Editor',
	'Karma.Editor.Actions',
	'Karma.Editor.layouts',
	'Karma.Forms',
	'Karma.List',
	'Karma.Controls',
	'Karma.View',
	'Karma.Tools',
	'Karma.Tools.Importer',
	'Karma.Tools.Shipper',
	'Karma.Gears',
	'Karma.Ext',
	'Karma.Ext.Grid',
	'Karma.Util',
	'Karma.Modules',
	'Karma.Modules.Report',
	'Karma.Modules.System',
	'Karma.Modules.System.QueryEditor',
	'Karma.Modules.System.Metadata');

Karma.Version = '0.7';



Karma.Util.AjaxHelper = function(){};

Ext.apply(Karma.Util.AjaxHelper, {
	
	call: function (
			invoker, 
			service, 
			method, 
			params, 
			depth,
			onSuccessCbck, 
			onFailureCbck, 
			thescope,
			isUpload,
			theform) {
				
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('Invoker: ' + invoker);
			PLOG.debug('Service: ' + service);
			PLOG.debug('Method: ' + method);
			PLOG.debug('Parameters: ' + params);
			PLOG.debug('Depth: ' + depth);
		}
		if(!isUpload) {
			isUpload = false;
		}
		
		Ext.Ajax.request({
            url: invoker,
            method: theform? 'GET': 'POST',
			isUpload : isUpload,
			form: theform,
            jsonData: { 
				Service: service, 
				Method: method, 
				Parameters: params,
				Depth: depth 
			},
            success: function(response, options){
				var result = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ListadoBase.loadRecord.success] response: ' + result);
				}
				result = Ext.decode(result);
				if (result.Success){
					var delegate = onSuccessCbck.createDelegate(thescope, [result.Result]);
					delegate(result.Result);
				} else {
					if (PLOG.isDebugEnabled()) {
						PLOG.error('[AjaxHelper.loadRecord.failure] ErrMsg: ' + result.ErrorMessage);
						PLOG.error('[AjaxHelper.loadRecord.failure] ErrDet: ' + result.ErrorDetail);
					}
					if (result.Report){
						Ext.Msg.show({
							title:'Error',
							msg: result.ErrorMessage,
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.ERROR
						});
					}
					if (onFailureCbck) {
						var delegate = onFailureCbck.createDelegate(thescope)(result);
						delegate(result.ErrorMessage, result.ErrorDetail);
					} else {
						Ext.MessageBox.alert('Fallo', 'No se logro cargar el registro: ' + response.responseText);
					}
				}
			},
            failure: function(response, options){
				if (PLOG.isDebugEnabled()) {
					PLOG.error('[AjaxHelper.loadRecord.failure] response: ' + response.responseText);
				}
				if (onFailureCbck) {
					var delegate = onFailureCbck.createDelegate(thescope)(response.responseText);
					delegate();
				}
				Ext.MessageBox.alert('Fallo', 'No se logro cargar el registro: ' + response.responseText);
			},
			scope: thescope
        });
    }

});



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




Ext.override(Ext.form.Field, {
    initComponent : function(){
		if(!this.isVisible()) {
			this.hidden = true;
			this.hideLabel = true;
		}
		else {
			if(!this.isEditable()) {
				this.disabled = true;
			}
		}
        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            'focus',
            'blur',
            'specialkey',
            'change',
            'invalid',
            'valid'
        );
    },
    isVisible: function(){
		if(this.principal) {
			return this.principal.Editor.Fields.isVisible(this.name);
		}
		return true;
    },
    isEditable: function(){
		if (this.principal) {
			return this.principal.Editor.Fields.isEditable(this.name);
		}
		return true;
    }
});



Karma.Core.Configuration = function(){};

Ext.apply(Karma.Core.Configuration, {
	
	GenerateStaticIds: false,
	
	BaseDir: 'lib/Karma/',
	
	ServiceInvoker: 'Service/ServiceInvoker',
	
	ExportService: 'Service/Exporter',
	
	DescribeService: 'Describe',
	
	EnumService: 'Karma.Framework.Core.Domain.IEnumDescriptorService',
	
	EnumMethod: 'GetEnumDescriptions',
	
	LogInMethod: 'IniciaSesion',
	
	LogOutMethod: 'LogIn.aspx?x=out',
	
	ImporterService: 'Karma.Framework.Core.Domain.Tools.Import.IImporterService',
	
	ImporterEntitiesMethod: 'GetEntities',
	
	NewMethod: 'New',
	
	NewFromEntityMethod: 'NewFromEntity',
	
	GetMethod: 'Get',
	
	FindMethod: 'Find',
	
	SaveMethod: 'Save',
	
	UpdateMethod: 'Update',
	
	DeleteMethod: 'Delete',
	
	DefaultNewDepth: 2,
	
	DefaultSaveDepth: 2,
	
	DefaultGetDepth: 3,
	
	DefaultRoot: 'Data',
	
	DefaultTotal: 'Count',
	
	DateFormat: 'd/m/Y g:i:s A',
	
	DefaultPageSize: 20,

	DefaultFindDepth: 2,
	
	IsTest: false,

	ApplicationName: '',
	
	ApplicationAbout: '',
	
	ApplicationHelp: ''
	
});

Karma.Conf = Karma.Core.Configuration;



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



Karma.Gears.FileSystemStore = function(manifest) {
	this.STORE_NAME = 'Karma.Cache';
	this.MANIFEST_FILENAME = manifest;
	this.initialized = false;
	
	this.localServer = null;
	this.store = null;
	this.resourceStore = null;

	if(!this.initialized) {
		this.init();
	}
};

Karma.Gears.FileSystemStore.prototype = {

	init: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.init] <-');
		}
		if (window.google && google.gears) {
			localServer = google.gears.factory.create("beta.localserver");
			store = localServer.createManagedStore(this.STORE_NAME);
			store.manifestUrl = this.MANIFEST_FILENAME;
			store.enabled = true;

			resourceStore = localServer.createStore(this.STORE_NAME + '_Libs');
			resourceStore.enabled = true;
			
			initialized = true;
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.init]initialized');
			}
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.init] ->');
		}
	},
	
	captureFiles: function(){
		if (window.google && google.gears && initialized) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.captureFiles]capturing files');
			}
			store.checkForUpdate();
			
			var timerId = window.setInterval(function(){
				if (store.currentVersion) {
					window.clearInterval(timerId);
				}
				else 
					if (store.updateStatus == 3) {
						PLOG.error("Error: " + store.lastErrorMessage);
						Ext.Msg.alert("Error: " + store.lastErrorMessage);
					}
			}, 500);
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.captureFiles] Store not initialized!!!');
			}
		}
	},
	
	removeStore: function(){
		if (window.google && google.gears && this.initialized) {
			localServer.removeManagedStore(STORE_NAME);
		}
	},
	
	capture: function(url){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.capture] Capturing: ' + url);
		}
		resourceStore.capture(url, function(url, success, captureId){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.capture] File captured: ' + url);
			}
		});
	},
	
	uncapture: function(url){
		resourceStore.remove(url);
	},
	
	isCaptured: function(url){
		if(Ext.isEmpty(url)) {
			return false;
		}
		var flag = resourceStore.isCaptured(url);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.isCaptured] url: ' + url + ', ' + flag);
		}
		return flag;
	}
	
};

Karma.ResourceStore = Karma.Gears.FileSystemStore;


Karma.Gears.MockStore = function(manifest) {};

Karma.Gears.MockStore.prototype = {	
	capture: function(url){},
	isCaptured: function(url){ return false; }
};

Ext.apply(Karma.Gears.FileSystemStore, {
	
	Instance: null
	
});



Karma.Data.EnumStore = {};

Ext.apply(Karma.Data.EnumStore, {

	cache: new Array(),
	
	create: function(enumeration){
		var store = Karma.Data.EnumStore.cache[enumeration];
		if (Ext.isEmpty(store)) {
			Karma.Data.EnumStore.init();
			store = Karma.Data.EnumStore.cache[enumeration];
		}
		return store;
	},
	
	init: function(callback){
		
        Ext.Ajax.request({
            url: Karma.Conf.ServiceInvoker,
            method: 'POST',
            params: Ext.encode({ 
				Service: Karma.Conf.EnumService, 
				Method: Karma.Conf.EnumMethod, 
				Parameters: null
			}),
            success: function(response, options){
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[EnumStore.init] -> Result: ' + response.responseText);
				}
				var resp = Ext.decode(response.responseText);
				Ext.each(resp.Result, function(e){
					Karma.Data.EnumStore.initEnum(e);
				});
				callback.fn.createDelegate(callback.scope)();
			},
            failure: function(response, options){
				Ext.MessageBox.alert('Enums initialization failed', 
					'Unable initialize enum catalogs: ' + response.responseText);
				callback.fn.createDelegate(callback.scope)();
			}
        });
	},
	
	initEnum: function(enumeration){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.initEnum] -> Enum: ' + enumeration.Name + ', Descriptions: ' + 
				enumeration.Description.length);
		}
		if(Ext.isEmpty(Karma.Data.EnumStore.cache[enumeration.Name])) {
			var proxy = new Ext.data.MemoryProxy([]);
			var reader = new Ext.data.JsonReader({
				root: 'Description',
				id: 'Id'
			}, Ext.data.Record.create([{ name: 'Id' }, { name: 'Name' }]));
			var store = new Ext.data.Store({
				root: 'Description',
				proxy: proxy,
				reader: reader,
				autoLoad: false,
				getLabelById: function(id){
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EnumStore.findById] <- Id: ' + id);
					}
					var record = this.getById(id);
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EnumStore.findById] <- record: ' + record);
					}
					return record.get('Name');
				}
			});
			store.loadData(enumeration);
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EnumStore.initEnum] -> Data loaded: ' + store.getCount() + 
					', get first: ' + store.getAt(0));
			}
			Karma.Data.EnumStore.cache[enumeration.Name] = store;
		}
	}

});


Karma.Factory._ColumnFactory = function(){
    this.getGridColumnModel = function(thecolumns, ordenar){
        var columns = new Array();
	    columns[0] = new Ext.grid.RowNumberer();
        var _sortable = ordenar;
        
        Ext.each(thecolumns, function(item, index){
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[SearchListFactory.getColumnModel] Column: ' + item.Name +
                ', Property: ' +
                item.Property +
                ', Mostrar: ' +
                item.Mostrar);
            }
            var ocultar = false;
            if (!Ext.isEmpty(item.Mostrar)) {
                ocultar = !item.Mostrar;
            }
            if (!Ext.isEmpty(item.Tipo)) {
                switch (item.Tipo) {
                    case 'fecha':
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.DateField({
                                format: 'd/m/Y',
                                selectOnFocus: true
                            })
                        };
                        break;
                    case 'moneda':
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            renderer: 'usMoney',
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.NumberField({
                                allowBlank: false,
                                allowNegative: false,
                                selectOnFocus: true,
                                style: 'text-align:left'
                            })
                        };
                        break;
                    case 'flotante':
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.NumberField({
                                allowBlank: false,
                                style: 'text-align:left',
                                selectOnFocus: true
                            })
                        };
                        break;
                    case 'logico':
                        columns[index + 1] = new Ext.ux.CheckColumn({
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            width: 55
                        });
                        columns[index + 1].IsPlugin = true;
                        break;
                    case 'enum':
                        columns[index + 1] = new Karma.Ext.Grid.EnumColumn({
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            width: 55,
                            enumType: item.TipoEnum,
                            editor: new Karma.Controls.EnumComboBox({
                                enumName: item.TipoEnum,
                                lazyRender: true
                            })
                        });
                        columns[index + 1].IsPlugin = true;
                        break;
                    case 'entity':
                        columns[index + 1] = new Karma.Ext.Grid.EntityColumn({
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            width: 55,
                            property: item.EntityProperty,
                            entityName: item.EntityName
                        });
                        columns[index + 1].IsPlugin = true;
                        break;
                    default:
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.TextField({
                                allowBlak: false,
                                selectOnFocus: true
                            })
                        };
                }
            }
            else {
                columns[index + 1] = {
                    header: item.Name,
                    dataIndex: item.Property,
                    sortable: _sortable,
                    hidden: ocultar,
                    editor: item.Editor ? item.Editor : new Ext.form.TextField({
                        allowBlak: false,
                        selectOnFocus: true
                    })
                };
            }
        });
        return columns;
    };
    this.getColumnStore = function(thecolumns){
        var _fields = new Array();
        
        Ext.each(thecolumns, function(item, index){
            if (!Ext.isEmpty(item.Tipo)) {
                switch (item.Tipo) {
                    case 'fecha':
                        _fields[index] = {
                            name: item.Property,
                            type: 'date',
                            dateFormat: 'n/j h:ia'
                        };
                        break;
                    case 'logico':
                        _fields[index] = {
                            name: item.Property,
                            type: 'bool'
                        };
                        break;
                    case 'entero':
                        _fields[index] = {
                            name: item.Property,
                            type: 'int'
                        };
                        break;
                    case 'entity':
                        _fields[index] = {
                            name: item.Property
                        };
                        break;
                    case 'moneda':
                    case 'flotante':
                    default:
                        _fields[index] = {
                            name: item.Property,
                            type: 'float'
                        };
                }
            }
            else {
                _fields[index] = {
                    name: item.Property,
                    type: 'string'
                };
            }
        });
        return _fields;
    };
    this.getListViewColumnModel = function(thecolumns){
        var columns = new Array();
        
        Ext.each(thecolumns, function(item, index){
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[SearchListFactory.getColumnModel] Column: ' + item.Name +
                ', Property: ' +
                item.Property +
                ', Mostrar: ' +
                item.Mostrar);
            }
            var ocultar = false;
            if (!Ext.isEmpty(item.Mostrar) && !item.Mostrar) {
                return true;
            }
            if (!Ext.isEmpty(item.Tipo)) {
                switch (item.Tipo) {
                    case 'fecha':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: '{' + item.Property + ':date("d/m/Y")}'
                        });
                        break;
                    case 'moneda':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: '{' + item.Property + ':number("0,000.00")}'
                        });
                        break;
                    case 'flotante':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: '{' + item.Property + ':number("0.00")}'
                        });
                        break;
                    case 'logico':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property
                        });
                        break;
                    case 'enum':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: new Ext.XTemplate('{' + item.Property + ':this.getLabel}', {
                                enumType: item.TipoEnum,
                                getLabel: function(val){
									if (!val) return;
                                    return Karma.Data.EnumStore.create(this.enumType).findById(val);
                                }
                            })
                        });
                        break;
                    case 'entity':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: new Ext.XTemplate('{' + item.Property + ':this.getLabel}', {
                                property: item.EntityProperty,
                                getLabel: function(val){
                                    return val[this.property];
                                }
                            })
                        });
                        break;
                    default:
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property
                        });
                }
            }
            else {
                columns.push({
                    header: item.Name,
                    dataIndex: item.Property
                });
            }
        });
        return columns;
    };
    
}
Ext.apply(Karma.Factory, {
    ColumnFactory: new Karma.Factory._ColumnFactory()
});



Karma.Factory.FactoryCache = function (){
	
	this.cache = new Ext.util.MixedCollection();
	
	this.add = function(key, value){
		this.cache.add(key, value);
	};
	
	this.add = function(regionkey, key, value){
		this.getRegion(regionkey).add(key, value);
	};
	
	this.getRegion = function(key){
		if (!this.cache.containsKey(key)) {
			this.cache.add(key, new Ext.util.MixedCollection());
		}
		return this.cache.get(key);
	};
	
	this.get = function(regionkey, key){
		if (!this.cache.containsKey(regionkey)) {
			return null;
		}
		return this.cache.get(regionkey).get(key);
	};

	this.containsKey = function(key) {
		return this.cache.containsKey(key);
	}
};


Ext.apply(Karma.Factory, {
	
	Cache: new Karma.Factory.FactoryCache()
	
});


Karma.Core.Entity = function(_lazyInit, _hidden){
    if (PLOG.isDebugEnabled()) {
        PLOG.debug('[Entity.ctor] <-');
    }
    if (Ext.isEmpty(_lazyInit)) {
        _lazyInit = false;
    }
    if (Ext.isEmpty(_hidden)) {
        _hidden = false;
    }
    
    this.security = null;
    this.metadata = null;
    this.initialized = false;
    this.lazyload = _lazyInit;
    this.hidden = _hidden;
    this.newCount = 1;
    
    this.addEvents({
        'load': true,
        'unload': true,
        'new': true,
        'open': true,
        'delete': true,
        'any': true,
        'activity': true
    });
    
    Karma.Core.Entity.superclass.constructor.call(this, arguments);
};

Ext.extend(Karma.Core.Entity, Ext.util.Observable, {
    id: null,
    name: null,
    service: null,
    columns: null,
    securityVisible: true,
    editorW: 600,
    editorH: 400,
    editorXType: null,
    getId: function() {
        return this.id;
    },
    getName: function() {
        return this.name;
    },
    searchlist: {},
    aggregatelist: {},
    entitylist: {},
    editableEntitylist: {},
    link: {},
    init: function() {
        this.configure();
        this.initialized = true;
        this.fireEvent('load', this);
    },
    getMainPanel: function() {
        var searchlist = {
            id: this.id,
            title: this.name,
            items: {
                id: this.id + '-search-form',
                listeners: this.getSearchListeners(),
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.service
            }
        };
        Ext.applyIf(searchlist.items, this.searchlist);
        return searchlist;
    },
    getSearchListeners: function() {
        var listeners = {
            'new': {
                fn: this.onNew,
                scope: this
            },
            'open': {
                fn: this.onOpen,
                scope: this
            },
            'delete': {
                fn: this.onDelete,
                scope: this
            },
            'activity': {
                fn: this.onAny,
                scope: this
            }
        };
        Ext.apply(listeners, this.getCustomListeners());
        return listeners;
    },
    isLazy: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.isLazy] ->' + this.lazyLoad);
        }
        return this.lazyload;
    },
    isHidden: function() {
        return this.hidden;
    },
    isInitialized: function() {
        return this.initialized;
    },
    getCustomListeners: function() {
        return {};
    },
    getLinkQuery: function() {
        return this.metadata.LinkQuery;
    },
    getNewTitle: function() {
        return 'Nuevo';
    },
    getDisplayTitle: function(value) {
        var val = '';
        var titleProperty;
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.getDisplayTitle] the record...');
        }
        if (Ext.isEmpty(this.titleProperty)) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Entity.getDisplayTitle] titleProperty is empty, take displayProperty...');
            }
            titleProperty = this.link.displayProperty;
        }
        else {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Entity.getDisplayTitle] titleProperty is not empty...');
            }
            titleProperty = this.titleProperty;
        }
        if (!Ext.isEmpty(value) && (value.Id > 0 || !Ext.isEmpty(value.get))) {
            if (Ext.type(titleProperty) === 'string') {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Entity.getDisplayTitle] titleProperty is string...');
                }
                val = value[titleProperty];
            }
            else
                if (Ext.type(titleProperty) === 'object') {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Entity.getDisplayTitle] titleProperty is XTemplate...');
                }
                val = titleProperty.apply(value);
            }
            val = ' [ID: ' + value.Id + ']';
        }
        else {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Entity.getDisplayTitle] is new record...');
            }
            val = this.getNewTitle(value);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.getDisplayProperty] display value : [' + titleProperty +
            '] from entity:' +
            val);
        }
        return val;
    },
    openWindow: function(record, listeners, editorProperties, useXtype) {
        
        if (Ext.isNumber(record)) {
            Ext.apply(editorProperties, {
                entityId: record,
                entity: this,
                security: this.security,
                metadata: this.metadata,
                listeners: listeners
            });
        }
        else {
            Ext.apply(editorProperties, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                value: record,
                listeners: listeners
            });
        }
        
        Karma.Editor.Window.create({
            editorXType: useXtype || this.editorXType,
            entity: this,
            security: this.security,
            metadata: this.metadata,
            isNew: editorProperties.isNew,
            width: this.editorW,
            height: this.editorH,
            editorProperties: editorProperties
        });
    },
    useInvoker: function(methodToInvoke, parameters, callback, errcbck) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.useInvoker] <-');
        }
        Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, this.service, methodToInvoke,
			parameters, Karma.Conf.DefaultGetDepth, function(result) {
			    if (callback) {
			        callback.fn.createDelegate(callback.scope)(result);
			    }
			}, function(response) {
			    if (errcbck) {
			        errcbck.fn.createDelegate(errcbck.scope)(response);
			    }
			}, this);
    },
    onOpen: function(id, listeners, useXtype, editorProperties) {
        id = parseInt(id);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.onOpen] <- id: ' + id);
            PLOG.debug('[Entity.onOpen] <- useXtype: ' + useXtype);
        }
        var editorWin = Karma.WinManager.Instance.getIfExist(this, id);
        if (Ext.isEmpty(editorWin)) {
            editorProperties = editorProperties ||
            {};
            Ext.apply(editorProperties, {
                entityId: id,
                listeners: listeners,
                isNew: false
            });

            this.openWindow(id, listeners, editorProperties, useXtype || this.editorXType);
            
            this.fireEvent('open');
            this.fireEvent('activity');
        }
        else {
            editorWin.show();
        }
    },
    onNew: function(listeners, useXtype, editorProperties) {
        editorProperties = editorProperties ||
        {};
        Ext.apply(editorProperties, {
            listeners: listeners,
            isNew: true
        });
        this.openWindow(0, listeners, editorProperties, useXtype || this.editorXType);
        this.fireEvent('new');
        this.fireEvent('activity');
    },
    NewFromEntity: function(parameters, listeners, editorProperties, useXtype) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.NewFromEntity] <-');
            PLOG.debug('[Entity.NewFromEntity] Parameters, type: ' + Ext.type(parameters) +
            ', len: ' +
            parameters.length);
            if (Ext.type(parameters) == 'array') {
                Ext.each(parameters, function(parameter) {
                    PLOG.debug('[Entity.NewFromEntity] parameter value: ' + parameter.Id);
                }, this);
            }
        }
        if (Ext.type(parameters) == 'array' && parameters.length == 1) {
            parameters = parameters[0];
        }
        editorProperties = editorProperties ||
        {};
        Ext.apply(editorProperties, {
            listeners: listeners,
            isNew: true
        });

        this.useInvoker(Karma.Conf.NewFromEntityMethod, parameters, {
            fn: function(result) {
                this.openWindow(result, listeners, editorProperties, useXtype || this.editorXType);
                this.fireEvent('new');
                this.fireEvent('activity');
            },
            scope: this
        });
    },
    onDelete: function(id, callback) {
        Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, this.service, Karma.Conf.DeleteMethod, id, 0, function(result) {
            callback.fn.createDelegate(callback.scope)();
        }, function() {
        }, this);
        this.fireEvent('delete');
        this.fireEvent('activity');
    },
    configure: function() {
        this.metadata = Karma.Core.Metadata.Instance.getEntity(this.name);
        this.security = Karma.Core.Principal.Instance.getEntity(this.name);
        this.service = this.metadata.Service;
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.configure] Entity [' + this.name + '], Service [' + this.service +
				'], Security [' + this.security + '], Metadata [' + this.metadata + ']');
        }
        this.Delete = this.onDelete.createDelegate(this);
        this.Open = this.onOpen.createDelegate(this);
        this.New = this.onNew.createDelegate(this);
        // EntityLink pre-configuration
        this.link.openWindow = this.openWindow.createDelegate(this);
        this.link.useInvoker = this.useInvoker.createDelegate(this);
        if (Ext.isEmpty(this.link.Open)) {
            this.link.Open = this.Open.createDelegate(this);
        }
        if (Ext.isEmpty(this.link.New)) {
            this.link.New = this.New.createDelegate(this);
        }
        if (Ext.isEmpty(this.link.NewFromEntity)) {
            this.link.NewFromEntity = this.NewFromEntity.createDelegate(this);
        }
    },
    onAny: function() {
        this.fireEvent('activity');
    },
    getConfig: function(type) {
        if (type == 'ag.list') {
            // AggregateList pre-configuration
            Ext.apply(this.aggregatelist, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            return this.aggregatelist;
        }
        if (type == 'entity.list') {
            // EntityList pre-configuration
            Ext.apply(this.entitylist, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            return this.entitylist;
        }
        
        if (type == 'eel.list') {
            // EntityList pre-configuration
            Ext.apply(this.editableEntitylist, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            return this.editableEntitylist;
        }
        
        if (type == 'entity.link') {
            // EntityLinkCombo pre-configuration
            Ext.apply(this.link, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            
            
            return this.link;
        }
    }
});



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



var PLOG = log4javascript.getNullLogger();
var LOG = log4javascript.getNullLogger();
var mask = null;

Karma.Application = function(config){
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Application.ctor] <-');
	}
	
	this.title = config.title;
	this.footer = config.footer;
	this.hometabXType = config.homeXType;
	this.helptabXType = config.helpXType;
	this.abouttabXType = config.aboutXType;
	this.modules = config.modules;
	this.reports = config.reports;
	this.userDataXTemplate = config.userDataXTemplate;
	this.logInService = config.logInService;
	this.metadataService = config.metadataService;
	this.metadataMethod = config.metadataMethod;
	this.cachefiles = config.cachefiles;
	this.manifest = config.manifest;
	this.timeout = config.timeout;
	this.isTest = config.isTest;
	this.loadMetadata = config.loadMetadata;
	this.loadUserdata = config.loadUserdata;
	
	this.principal = null;
	this.metadata = null;
	this.sessionMgr = null;
	this.windowManager = null;
	this.moduleManager = null;
	this.cache = null;
	
	Karma.Core.Configuration.ApplicationName = this.title;
	Karma.Core.Configuration.ApplicationAbout = this.abouttabXType;
	Karma.Core.Configuration.ApplicationHelp = this.helptabXType;

	this.start = function(meta, usrData){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Application.init] <-');
			PLOG.debug('[Application.init] User Data: ' + usrData);
			PLOG.debug('[Application.init] MetaData: ' + meta);
		}
		mask.show();
		this.metadata = new Karma.Core.Metadata(meta);
		Karma.Core.Metadata.Instance = this.metadata;
		this.principal = new Karma.Core.Principal(usrData);
		Karma.Core.Principal.Instance = this.principal;
		
		if (this.cachefiles) {
			this.cache = new Karma.Gears.FileSystemStore(this.manifest);
			this.cache.captureFiles();
			Karma.Gears.FileSystemStore.Instance = this.cache;
		} else {
			this.cache = new Karma.Gears.MockStore();
			Karma.Gears.FileSystemStore.Instance = this.cache;
		}
		
		if (this.principal.hasModules()) {
			this.sessionMgr = new Karma.Core.SessionManager(this.timeout);
			this.sessionMgr.on('timeout', this.sessionTimeout, this);
			this.windowManager = new Karma.Core.WindowManager();
			this.moduleManager = new Karma.Core.ModuleManager(this.principal);
			this.moduleManager.init();
			this.moduleManager.on('any', this.activityFound, this);
			this.moduleManager.on('activity', this.activityFound, this);
			this.moduleManager.on('load', function(){
				mask.hide();
				this.sessionMgr.start();
			}, this);
			this.windowManager.on('any', this.activityFound, this);
			this.windowManager.on('activity', this.activityFound, this);

			Karma.Data.EnumStore.init({ fn: function() {
				this.moduleManager.register(this.modules);
				this.loadInterface();
			}, scope: this });
		} else {
			Ext.Msg.show({
				title:'Seguridad',
				msg: 'Lo siento no cuentas con permisos para acceder a ningun modulo.',
				buttons: Ext.Msg.OK,
				fn: function(result){
					this.shutdown();
				},
				icon: Ext.MessageBox.INFO,
				scope: this
			});
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Application.init] ->');
		}
	};
	
	this.activityFound = function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Application.activityFound]');
		}
		this.sessionMgr.renew();
	};
	
	this.sessionTimeout = function() {
		Ext.MessageBox.alert('Fin de sesi&oacute;n', 
			'La sesi&oacute;n ha terminado por inactividad.', function(){
				this.shutdown();
			}, this);
	};
	
	this.loadInterface = function(){
		Ext.QuickTips.init();
		//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
		var pc = this.preventClose.createDelegate(this);
		window.onbeforeunload = pc;
		
		Ext.ComponentMgr.create({
			hometabXType: this.hometabXType,
			timeout: this.timeout,
			footer: this.footer,
			userDataXTemplate: this.userDataXTemplate,
			activityMonitor: this,
			listeners: {
				'shutdown': {
					fn: function() {
						this.shutdown();
					},
					scope: this
				},
				'activity': {
					fn: this.activityFound,
					scope: this
				}
			}
		}, 'application.win');
	};
	
	this.preventClose = function() {
		return this.title;
	};
	
	this.shutdown = function() {
		window.onbeforeunload = function(){};
		window.location = Karma.Core.Configuration.LogOutMethod;
	};
	
	this.setupLoggin = function(logEnabled, logLevel){
		if (Ext.isEmpty(logEnabled)) {
			logEnabled = true;
		}
		if(logEnabled){
			PLOG = log4javascript.getLogger('Karma');
			LOG = PLOG;//log4javascript.getLogger();
			if(Ext.isIE){
				PLOG.addAppender(new log4javascript.PopUpAppender());
				//LOG.addAppender(new log4javascript.PopUpAppender());
				PLOG.group('loggers');
				//LOG.group('loggers');
			} else {
				PLOG.addAppender(new log4javascript.PopUpAppender());
				//LOG.addAppender(new log4javascript.PopUpAppender());
				// PLOG.addAppender(new log4javascript.BrowserConsoleAppender());
				// LOG.addAppender(new log4javascript.BrowserConsoleAppender());
			}
			if (Ext.isEmpty(logLevel)){
				PLOG.setLevel(log4javascript.Level.ALL);
				//LOG = PLOG;;
			} else {
				PLOG.setLevel(logLevel);
				//LOG.setLevel(logLevel);
			}
		} else {
			log4javascript.setEnabled(false);
		}
	};
	
	this.loadUserData = function(credentials, successCbk){
		mask.show();
		Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, 
			this.logInService,'GetUsuario', 
			[ credentials[0], credentials[1] ], 
			2, 
			function(usrData) {
				mask.hide();
				if(!Ext.isEmpty(usrData)) {
					successCbk.fn.createDelegate(successCbk.scope)(usrData);
				} else {
					Ext.Msg.show({
						title: 'Error',
						msg: 'El usuario no esta dado de alta en la aplicaci&oacute;n.',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
			},
			function(meta) {
				mask.hide();
				Ext.Msg.show({
					title: 'Aplicacion',
					msg: 'No se lograron cargar los datos del usuario.',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
			},
			this
		);
	};
	
	this.loadMetaData = function(successCbk){
		Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, 
			this.metadataService,
			this.metadataMethod, 
			null, 
			0, 
			function(meta) {
				mask.hide();
				if (meta.EnMantenimiento) {
					Ext.Msg.show({
						title: 'Aplicaci&oacuten en mantenimiento',
						msg: 'La aplicaci&oacute;n se encuentra en mantenimiento, disculpa las ' +
						'molestias que esto ocasiona. Intenta acceder mas tarde',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.WARNING
					});
				}
				else {
					successCbk.fn.createDelegate(successCbk.scope)(meta);
				}
			},
			function(meta) {
				mask.hide();
				Ext.Msg.show({
					title: 'Aplicacion',
					msg: 'No se lograron cargar los metadatos de la aplicacion',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
			},
			this
		);
	};
	
	this.addEvents({ 'activity': true });
	if (PLOG.isDebugEnabled()) {
		PLOG.debug('[Application.ctor] ->');
	}
};	

Ext.extend(Karma.Application, Ext.util.Observable, {
	
	run : function(config) {
		this.setupLoggin(config.debug, config.logLevel);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Application.run] <-');
		}
		mask = new Ext.LoadMask(Ext.getBody(), {msg: "Procesando..."});
		mask.show();
		
		if (this.loadMetadata) {
			this.loadMetaData({
				fn: function(meta) {
					if(this.loadUserData) {
						this.loadUserData([config.username, config.domain], {
							fn: function(userData) {
								this.start(meta, userData);
							},
							scope: this
						});
					} else {
						this.start(meta);
					}
				},
				scope: this
			});
		} else
		if(this.loadUserdata) {
			this.loadUserData([config.username, config.domain], {
				fn: function(userData) {
					this.start(null, userData);
				},
				scope: this
			});
		} else {
			this.start();
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Application.run] ->');
		}
	}
	
});

Application = Karma.Application;



Karma.Core.Window = Ext.extend(Ext.Window, {
	
	monitorValid: true,
	
	editorXType: null,
	
	value: null,
	
	dirty: false,
	
	ignoreChanges: false,
	
	editorInternallisteners: null,
	
	editorlisteners: {},
	
	statePersister: null,
	
	originalTitle: null,

	initComponent: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.initComponent] <-');
			PLOG.debug('[Window] generated ID: ' + this.id);
		}
		this.title = this.getNewTitle(this.value);
		this.originalTitle = this.title;
		this.editorInternallisteners = {
			'beforeclose' : { fn: this.onBeforeClose, scope: this },
			'afterclose' : { fn: this.close, scope: this },
			'change' : { fn: this.onChange, scope: this },
			'aftersave' : { fn: this.onSave, scope: this },
			'afterupdate' : { fn: this.onFlush, scope: this },
			'flush' : { fn: this.onFlush, scope: this }
		};
		var _editorProperties = {
			xtype: this.editorXType,
			id: this.id + '-editor',
			value: this.value,
			security: this.entity.security,
			statePersister: this.statePersister,
			isnew : this.isnew
		};
		Ext.apply(_editorProperties, this.editorProperties);
		
		Ext.apply(this, {
	        layout: 'fit',
	        border: true,
	        closable: false,
	        frame: true,
			autoShow: true,
			modal: false,
			minimizable: true,
			maximizable: true,
			plain: true,
			constrain: true,
            items: _editorProperties,
			listeners: {
				'minimize' : { fn: this.hide, scope: this }
			}
		});
		
		Karma.Core.Window.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'flush' : true, 'change' : true });
		this.show();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.initComponent] ->');
		}
	},
	
	onRender: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onRender] <-');
		}
		Karma.Core.Window.superclass.onRender.apply(this, arguments);
		
		var editor = this.findById(this.id + '-editor');
		Karma.Util.ListenerUtils.addListenersToObject(editor, this.editorInternallisteners);
		Karma.Util.ListenerUtils.addListenersToObject(editor, this.editorlisteners);

		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onRender] ->');
		}
	},
	
	onChange: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onChange] <-');
		}
		this.dirty = true;
		this.setTitle('[*] ' + this.originalTitle);
		this.fireEvent('change', this);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onChange] ->');
		}
	},
	
	onFlush: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onFlush] <-');
		}
		this.setTitle(this.originalTitle);
		this.dirty = false;
		this.fireEvent('flush', this);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onFlush] ->');
		}
	},

	onSave: function(entity) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onSave] <-');
		}
		if(this.isnew) {
			this.originalTitle = this.getNewTitle(entity);
			this.isnew = false;
		}
		this.setTitle(this.originalTitle);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onSave] ->');
		}
	},
	
	isDirty: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.isDirty] [' + this.dirty + ']');
		}
		return this.dirty;
	},
	
	flush: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.flush] <-');
		}
		this.items[0].flush();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.flush] ->');
		}
	},
	
	onBeforeClose: function(force){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onBeforeClose] <-');
		}
		if(!force && this.dirty) {
			Ext.Msg.show({
				title:'Guardar cambios?',
				msg: 'Estas por cerrar una ventana con cambios pendientes. Deseas cerrar la ventana?',
				buttons: Ext.Msg.YESNO,
				fn: function(result){
					if (result === 'yes'){
						this.ignoreChanges = true;
						this.close();
					}
				},
				animEl: 'elId',
				icon: Ext.MessageBox.QUESTION,
				scope: this
			});
			return false;
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.onBeforeClose] ->');
		}
	},
	
	getValue: function() {
		return this.items[0].getValue();
	},
	
	getNewTitle: function (val) {
		return this.entity.name + ' : ' + this.entity.getDisplayTitle(val);
	}
});

Ext.apply(Karma.Core.Window, {
	
	create: function(editorXType, persister, record, properties,
		listeners, entity){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.create] <-');
			PLOG.debug('[Window.create] Inner Type: ' + editorXType);
		}
		if(Ext.isEmpty(listeners)) {
			listeners = {};
		}
		var myid = Karma.WinManager.Instance.getId(entity, record.Id);
		Ext.ComponentMgr.create({ 
			id: myid,
			statePersister: persister,
			value: record,
			entity: entity,
			editorXType: editorXType,
			width: entity.editorW,
			height: entity.editorH,
			isnew: properties.isnew,
			editorProperties: properties.editorProperties,
			editorlisteners: listeners
		}, 
			'editor.window'
		);
		Karma.WinManager.Instance.register(myid);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Window.create] ->');
		}
	}
	
});

Ext.reg('editor.window', Karma.Core.Window);



Karma.ViewsMenu = Ext.extend(Ext.Button, {

	initComponent: function (){
		Ext.apply(this, {
			id: 'mnuViews',
			text: 'Vistas',
			iconCls: 'icon-view-tile',
			menu: {
				items: [{
					text: 'Ventanas',
					iconCls: 'icon-view-contract',
					handler: function(){
						var view = Ext.getCmp('windows.view');
						view.toggleCollapse();
					},
					checked: true,
					scope: this
				}, {
					text: 'Modulos',
					iconCls: 'icon-view-contract',
					handler: function(){
						var view = Ext.getCmp('modules.view');
						view.toggleCollapse();
					},
					checked: true,
					scope: this
				}]
			}
		});

		Karma.ViewsMenu.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('menu.views', Karma.ViewsMenu);


Karma.WindowsMenu = Ext.extend(Ext.Button, {

    windowMgr: null,
    
    windows: new Ext.util.MixedCollection(),
    
    cursor: 0,
    
    innerMenu: null,
    
    nextOpt: null,
    
    prevOpt: null,
    
    windowsOpt: null,
    
    initComponent: function(){
        this.windowMgr = Karma.Core.WindowManager.Instance;
        this.windowMgr.on('register', this.onRegister, this);
        this.windowMgr.on('titlechange', this.onTitleChange, this);
        this.windowMgr.on('close', this.onClose, this);
        
        Ext.apply(this, {
            id: 'mnuWindows',
            text: 'Ventanas',
            iconCls: 'icon-windows',
            menu: {
                items: [this.nextOpt = new Ext.menu.Item({
                    text: 'Siguiente ventana',
                    iconCls: 'icon-window-next',
                    handler: this.onNextClick,
                    disabled: true,
                    scope: this
                }), this.prevOpt = new Ext.menu.Item({
                    text: 'Ventana anterior',
                    iconCls: 'icon-window-prev',
                    handler: this.onPrevClick,
                    disabled: true,
                    scope: this
                }), '-', this.windowsOpt = new Ext.menu.Item({
                    text: 'Ventanas',
                    menu: this.innerMenu = new Ext.menu.Menu({
                        defaults: {
                            iconCls: 'icon-window'
                        },
                        items: []
                    }),
                    iconCls: 'icon-windows',
                    disabled: true
                })]
            }
        });
        
        Karma.WindowsMenu.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'any': true,
            'activity': true
        });
    },
    
    onWindowClick: function(menu){
        var winId = menu.initialConfig.text;
        this.showWindow(winId);
        this.fireEvent('activity');
    },
    
    onNextClick: function(){
        var win = Ext.WindowMgr.getActive();
        var idx = this.windows.indexOf(win.getId()) + 1;
        if (idx > this.windows.getCount() - 1) {
            idx = 0;
        }
        this.showWindow(this.windows.get(idx).initialConfig.text);
        this.fireEvent('activity');
    },
    
    onPrevClick: function(){
        var win = Ext.WindowMgr.getActive();
        var idx = this.windows.indexOf(win.getId()) - 1;
        if (idx < 0) {
            idx = this.windows.getCount() - 1;
        }
        this.showWindow(this.windows.get(idx).initialConfig.text);
        this.fireEvent('activity');
    },
    
    onRegister: function(win){
        var mnu = new Ext.menu.Item({
            text: win.title
        });
        mnu.on('click', this.onWindowClick, this)
        this.windows.add(win.getId(), mnu);
        this.innerMenu.add(mnu);
        
        this.nextOpt.setDisabled(false);
        this.prevOpt.setDisabled(false);
        this.windowsOpt.setDisabled(false);
    },
    
    onTitleChange: function(win, newTitle){
        var mnu = this.windows.get(win.getId());
        mnu.setText(newTitle);
    },
    
    onClose: function(winId){
        this.innerMenu.remove(this.windows.get(winId));
        this.windows.removeKey(winId);
        if (this.windows.getCount() === 0) {
            this.nextOpt.setDisabled(true);
            this.prevOpt.setDisabled(true);
            this.windowsOpt.setDisabled(true);
        }
    },
    
    showWindow: function(winId){
        var win = this.windowMgr.get(winId);
        if (!Ext.isEmpty(win)) {
            win.show();
            Ext.WindowMgr.bringToFront(win);
        }
        else {
            this.remove(this.windows[winId]);
            delete this.windows[winId];
        }
        this.fireEvent('any');
    }
    
});
Ext.reg('menu.windows', Karma.WindowsMenu);



Karma.ToolsMenu = Ext.extend(Ext.Button, {

    initComponent: function() {
        Ext.apply(this, {
            id: 'mnuTools',
            iconCls: 'icon-wrench',
            text: 'Herramientas',
            menu: {
                items: [{
                    text: 'Importador',
                    iconCls: 'icon-import',
                    handler: function() {
                        var myid = Ext.id();
                        Ext.ComponentMgr.create({
                            id: myid
                        }, 'importer');
                        this.fireEvent('activity');
                        Karma.WinManager.Instance.register(myid, 'Importador');
                    },
                    scope: this
                }, {
                    text: 'Mensajeria Masiva',
                    iconCls: 'icon-import',
                    handler: function() {                        
                        var myid = Ext.id();                                                
                        Ext.ComponentMgr.create({
                        id: myid
                        }, 'shipper');                        
                        this.fireEvent('activity');                        
                        Karma.WinManager.Instance.register(myid, 'ShipmentTracker');
                    },
                    scope: this
                }, {
                    text: 'Preferencias',
                    iconCls: 'icon-prefs',
                    handler: function() {
                    },
                    scope: this
                }, {
                    text: 'Avanzado',
                    iconCls: 'icon-advanced',
                    menu: {
                        items: [{
                            text: 'Habilitar depuracion Ext',
                            iconCls: 'icon-advanced',
                            handler: function() {
                                Ext.log('Enabling Ext debug console...');
                            },
                            scope: this
}]
                        }
}]
                    }
                });

                Karma.ToolsMenu.superclass.initComponent.apply(this, arguments);
                this.addEvents({
                    'activity': true
                });
            }
        });
Ext.reg('menu.tools', Karma.ToolsMenu);


Karma.ModulesMenu = Ext.extend(Ext.Button, {

    initComponent: function(){
        this.moduleMgr = Karma.Core.ModuleManager.Instance;
        var menu = this.process(this.moduleMgr.getAll());
        Ext.apply(this, {
            id: 'mnuModules',
            text: 'Modulos',
            iconCls: 'icon-box-world',
            menu: {
                items: menu
            }
        });
        Karma.ModulesMenu.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
    },
    
    onEntityClick: function(menu){
        this.fireEvent('select', menu.entity);
    },
    
    process: function(modules){
        var menu = new Array();
        Ext.each(modules, function(module, index){
            if (!module.isHidden()) {
                var subs = new Array();
                module.getEntities().each(function(entity){
                    if (!entity.isHidden()) {
                        subs.push({
                            text: entity.getName(),
                            handler: this.onEntityClick,
                            scope: this,
                            entity: entity
                        });
                    }
                }, this);
                menu.push({
                    text: module.getName(),
					menu: {
						items: subs						
					}
                });
            }
        }, this);
        return menu;
    }
});
Ext.reg('menu.modules', Karma.ModulesMenu);



Karma.HelpMenu = Ext.extend(Ext.Button, {

    initComponent: function(){
        Ext.apply(this, {
            id: 'mnuAbout',
            iconCls: 'icon-help',
            text: 'Ayuda',
            menu: {
                items: [{
                    text: 'Ayuda',
                    iconCls: 'icon-help',
                    handler: function(){
                        Ext.ComponentMgr.create({}, Karma.Core.Configuration.ApplicationHelp);
                        this.fireEvent('activity');
                    },
                    scope: this
                }, '-', {
                    text: 'Acerca de ' + Karma.Core.Configuration.ApplicationName,
                    iconCls: 'icon-info',
                    handler: function(){
                        Ext.ComponentMgr.create({}, Karma.Core.Configuration.ApplicationAbout);
                        this.fireEvent('activity');
                    },
                    scope: this
                }, {
                    text: 'Acerca de ĸarмa',
                    iconCls: 'icon-info',
                    handler: function(){
                        new Karma.About();
                        this.fireEvent('activity');
                    },
                    scope: this
                }]
            }
        });
        
        Karma.HelpMenu.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'activity': true
        });
    }
});
Ext.reg('menu.help', Karma.HelpMenu);


Karma.Ext.Grid.PagingToolbar = Ext.extend(Ext.PagingToolbar, {

    firstLoad: false,
    
	plugins: [new Ext.ux.grid.PageSizer({
        initialSize: Karma.Core.Configuration.DefaultPageSize
    }), new Ext.ux.ProgressBarPager()],
			
    initComponent: function(){
        Ext.apply(this, {
            pageSize: Karma.Core.Configuration.DefaultPageSize,
            displayMsg: 'Mostrando {0} - {1} de {2} registros',
            emptyMsg: 'No se encontraron registros para mostrar',
            beforePageText: "P&aacute;gina",
            afterPageText: "de {0}",
            beforePageSizeText: "Tama&ntilde;o de la p&aacute;gina",
            firstText: "Primer p&aacute;gina",
            prevText: "P&aacute;gina anterior",
            nextText: "Siguiente p&aacute;gina",
            lastText: "&Uacute;ltima p&aacute;gina",
            refreshText: "Actualizar",
            paramNames: {
                start: 'Page',
                limit: 'PageSize'
            }
        });
        Karma.Ext.Grid.PagingToolbar.superclass.initComponent.call(this);
    },
    
    doLoad: function(start){
        var opts = {}
        if (this.fireEvent('beforechange', this, opts) !== false) {
            var params = this.store.baseParams;
            params.Parameters.Start = start;
            params.Parameters.PageSize = this.pageSize;
            this.store.reload();
        }
    },
    
    onLoad: function(store, r, o){
        if (!this.rendered) {
            this.dsLoaded = [store, r, o];
            return;
        }
        this.cursor = this.store.baseParams.Parameters.Start;
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;
        
        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.inputItem.setValue(ap);
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    }
});




Karma.Ext.Grid.EntityColumn = function(config){
	Ext.apply(this, config);
	if(!this.id){
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Karma.Ext.Grid.EntityColumn.prototype ={
	
	init : function(grid){
	},

    renderer : function(v, p, record){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityColumn.renderer] Record: ' + record + ', DataIndex: ' + 
				this.dataIndex + ', Property Name: ' + this.property + ', DataIndex Value: ' + 
				record.get(this.dataIndex) + ', Property Type: ' + 
				Ext.type(record.get(this.dataIndex)));
		}
		var value = record.get(this.dataIndex);
		if(!Ext.isEmpty(value)) {
			p.css += ' x-grid3-check-col-td'; 
			return value[this.property];
		} 
		return '';
	}
	
};




Karma.Ext.Grid.EnumColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Karma.Ext.Grid.EnumColumn.prototype ={
	
    init : function(grid){
    },

    renderer : function(v, p, record, rowIndex, colIndex){
        p.css += ' x-grid3-check-col-td';
		this.enumStore = Karma.Data.EnumStore.create(this.enumType); 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumColumn.renderer] <- DataIndex: ' + this.dataIndex + ', colIndex : ' + 
				colIndex  + ', Value[dataindex]: ' +  record.get(this.dataIndex) + 
				', the store: ' +  this.enumStore + ', enumType: ' + 
				this.enumType);
		}
		if(Ext.isEmpty(this.dataIndex)) {
	        return this.enumStore.getLabelById(record.data[colIndex]);
		}
        return this.enumStore.getLabelById(record.get(this.dataIndex));
    }
	
};
Ext.grid.Column.types['enumcolumn'] = Karma.Ext.Grid.EnumColumn;

Ext.apply(Karma.Data.EnumStore, {
	
	findById: function(type, id){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] <- Type: ' + type + ', Id: ' + id);
		}
		var store = Karma.Data.EnumStore.create(type);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] <- store: ' + store, + ', Len: ' + store.getTotalCount());
		}
		var record = store.getById(id);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] <- record: ' + record);
		}
		var name = record.get('Name');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.findById] ->');
		}
		return name;
	}

});


Ext.ux.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            this.store.baseParams = this.store.baseParams || {};
	        this.store.baseParams.Parameters.Criteria = '';
	        this.store.baseParams.Parameters.Start = 0;
	        this.store.reload();
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams.Parameters.Criteria = v;
        this.store.baseParams.Parameters.Start = 0;
        this.store.reload();
		if (v) {
	        this.triggers[0].show();
	        this.hasSearch = true;
		}
    }
});

Ext.reg('searchfield', Ext.ux.SearchField);


Ext.ux.ThemeChanger = Ext.extend(Ext.form.ComboBox, {
    width: 100,
    preThemes: 'lib/ext/resources/css/ext-all.css',
    extThemes: [['Sin tema', 'lib/ext/resources/css/ext-all-notheme.css'], ['Azul', 'lib/ext/resources/css/ext-all.css'], ['Negro', 'lib/ext/resources/css/xtheme-black.css'], ['Gris', 'lib/ext/resources/css/xtheme-tp.css'], ['Olivo', 'lib/ext/resources/css/xtheme-olive.css'], ['Gris 2', 'lib/ext/resources/css/xtheme-darkgray.css'], ['Negro 2', 'lib/ext/resources/css/xtheme-slickness.css'], ['Grafito', 'lib/ext/resources/css/xtheme-slate.css']],
    defaultTheme: 1,
    cssId: 'Grafito',
	
    typeAhead: true,
    triggerAction: 'all',
    mode: 'local',
    editable: false,
    
    loadCssFile: function(filename, theCssId){
        if (theCssId) 
            var elem = document.getElementById(theCssId);
        if (elem && elem != null) {
            elem.setAttribute("href", filename);
        }
        else {
            elem = document.createElement("link");
            elem.setAttribute("rel", "stylesheet");
            elem.setAttribute("type", "text/css");
            elem.setAttribute("href", filename);
            if (theCssId) 
                elem.setAttribute("id", theCssId);
            document.getElementsByTagName("head")[0].appendChild(elem);
        }
    },
    
    changeTheme: function(obj, rec, themeChoice){
        this.defaultTheme = themeChoice;
        this.loadCssFile(rec.get(this.valueField), this.cssId);
        this.fireEvent('activity');
    },
    
    loadPreThemes: function(){
        if (this.preThemes) {
            if (this.preThemes instanceof Array) {
                for (var i = 0, len = this.preThemes.length; i < len; i++) {
                    this.loadCssFile(this.preThemes[i]);
                }
            }
            else {
                this.loadCssFile(this.preThemes);
            }
        }
    },
    
    loadPostThemes: function(){
        if (this.postThemes) {
            if (this.postThemes instanceof Array) {
                for (var i = 0, len = this.postThemes.length; i < len; i++) {
                    this.loadCssFile(this.postThemes[i]);
                }
            }
            else {
                this.loadCssFile(this.postThemes);
            }
        }
    },
    
    initComponent: function(){
        Ext.ux.ThemeChanger.superclass.initComponent.call(this);
        if (!this.store) {
            this.store = new Ext.data.SimpleStore({
                fields: ['displayname', 'cssFile'],
                data: this.extThemes
            });
        }
        if (!this.displayField) 
            this.displayField = 'displayname';
        if (!this.valueField) 
            this.valueField = 'cssFile';
        if (!this.value) 
            this.value = this.store.getAt(this.defaultTheme).get(this.valueField);
        
        this.on('select', this.changeTheme);
        
        this.loadPreThemes();
        this.changeTheme(this, this.store.getAt(this.defaultTheme), this.defaultTheme);
        this.loadPostThemes();
        this.addEvents({
            'activity': true
        });
    }
    
});
Ext.reg('themechanger', Ext.ux.ThemeChanger);



Ext.ux.StatusBar = Ext.extend(Ext.Toolbar, {
    
    
    
    
    

    
    cls : 'x-statusbar',
    
    busyIconCls : 'x-status-busy',
    
    busyText : 'Loading...',
    
    autoClear : 5000,

    // private
    activeThreadId : 0,

    // private
    initComponent : function(){
        if(this.statusAlign=='right'){
            this.cls += ' x-status-right';
        }
        Ext.ux.StatusBar.superclass.initComponent.call(this);
    },

    // private
    afterRender : function(){
        Ext.ux.StatusBar.superclass.afterRender.call(this);

        var right = this.statusAlign == 'right';
        this.statusEl = new Ext.Toolbar.TextItem({
            cls: 'x-status-text ' + (this.iconCls || this.defaultIconCls || ''),
            text: this.text || this.defaultText || ''
        });

        if(right){
            this.add('->');
            this.add(this.statusEl);
        }else{
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }
    },

    
    setStatus : function(o){
        o = o || {};

        if(typeof o == 'string'){
            o = {text:o};
        }
        if(o.text !== undefined){
            this.setText(o.text);
        }
        if(o.iconCls !== undefined){
            this.setIcon(o.iconCls);
        }

        if(o.clear){
            var c = o.clear,
                wait = this.autoClear,
                defaults = {useDefaults: true, anim: true};

            if(typeof c == 'object'){
                c = Ext.applyIf(c, defaults);
                if(c.wait){
                    wait = c.wait;
                }
            }else if(typeof c == 'number'){
                wait = c;
                c = defaults;
            }else if(typeof c == 'boolean'){
                c = defaults;
            }

            c.threadId = this.activeThreadId;
            this.clearStatus.defer(wait, this, [c]);
        }
        return this;
    },

    
    clearStatus : function(o){
        o = o || {};

        if(o.threadId && o.threadId !== this.activeThreadId){
            // this means the current call was made internally, but a newer
            // thread has set a message since this call was deferred.  Since
            // we don't want to overwrite a newer message just ignore.
            return this;
        }

        var text = o.useDefaults ? this.defaultText : '',
            iconCls = o.useDefaults ? (this.defaultIconCls ? this.defaultIconCls : '') : '';

        if(o.anim){
            this.statusEl.fadeOut({
                remove: false,
                useDisplay: true,
                scope: this,
                callback: function(){
                    this.setStatus({
	                    text: text,
	                    iconCls: iconCls
	                });
                    this.statusEl.show();
                }
            });
        }else{
            // hide/show the el to avoid jumpy text or icon
            this.statusEl.hide();
	        this.setStatus({
	            text: text,
	            iconCls: iconCls
	        });
            this.statusEl.show();
        }
        return this;
    },

    
    setText : function(text){
        this.activeThreadId++;
        this.text = text || '';
        if(this.rendered){
            this.statusEl.setText(this.text);
        }
        return this;
    },

    
    getText : function(){
        return this.text;
    },

    
    setIcon : function(cls){
        this.activeThreadId++;
        cls = cls || '';

        if(this.rendered){
	        if(this.currIconCls){
	            this.statusEl.removeClass(this.currIconCls);
	            this.currIconCls = null;
	        }
	        if(cls.length > 0){
	            this.statusEl.addClass(cls);
	            this.currIconCls = cls;
	        }
        }else{
            this.currIconCls = cls;
        }
        return this;
    },

    
    showBusy : function(o){
        if(typeof o == 'string'){
            o = {text:o};
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    }
});
Ext.reg('statusbar', Ext.ux.StatusBar);


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


Karma.Parts.ApplicationWindow = Ext.extend(Ext.Viewport, {

    hometabXType: null,
    
    timeout: null,
    
    footer: null,
    
    userDataXTemplate: null,
    
    activityMonitor: null,
    
    initComponent: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[ApplicationWindow.initComponent] <-');
        }
        Ext.apply(this, {
            layout: 'border',
            items: {
                region: 'center',
                xtype: 'panel',
                anchor: '100%',
                layout: 'border',
                closable: false,
                collapsible: false,
                minimizable: false,
                modal: true,
                constrain: true,
                plain: true,
                border: false,
                frame: false,
                resizable: false,
                onEsc: Ext.emptyFn,
                bodyStyle: 'padding:0px 0px 0px 0px; margin:0px 0px 0px 0px',
                tbar: [{
                    text: 'Principal',
                    iconCls: 'icon-application',
                    menu: {
                        items: [{
                            text: 'P&aacute;gina principal',
                            iconCls: 'icon-home',
                            handler: function(){
                                var container = this.findById('module.container');
                                container.setHomeTab();
                                this.fireEvent('activity');
                            },
                            scope: this
                        }, '-', {
                            text: 'Cerrar Sesi&oacute;n',
                            iconCls: 'icon-exit',
                            handler: this.onShutdown,
                            scope: this
                        }]
                    }
                }, {
                    xtype: 'menu.modules',
                    listeners: {
                        'activity': {
                            fn: function(){
                                this.fireEvent('activity');
                            },
                            scope: this
                        },
                        'select': {
                            fn: this.onEntitySelect,
                            scope: this
                        }
                    }
                }, {
                    xtype: 'menu.tools',
                    listeners: {
                        'activity': {
                            fn: function(){
                                this.fireEvent('activity');
                            },
                            scope: this
                        }
                    }
                }, {
                    xtype: 'menu.windows',
                    listeners: {
                        'activity': {
                            fn: function(){
                                this.fireEvent('activity');
                            },
                            scope: this
                        }
                    }
                }, {
                    xtype: 'menu.views'
                }, {
                    xtype: 'menu.help'
                }, {
                    iconCls: 'icon-home',
                    qtip: 'P&aacute;gina principal',
                    handler: function(){
                        var container = this.findById('module.container');
                        container.setHomeTab();
                        this.fireEvent('activity');
                    },
                    scope: this
                }, '->', 'Tema: ', {
                    xtype: 'themechanger'
                }, {
                    text: 'Cerrar Sesi&oacute;n',
                    iconCls: 'icon-exit',
                    handler: this.onShutdown,
                    scope: this
                }],
                items: [{
                    id: 'modules.view',
                    xtype: 'panel',
                    layout: 'accordion',
                    activeItem: 0,
                    enableTabScroll: true,
                    minTabWidth: 75,
                    tabMargin: 1,
                    resizeTabs: true,
                    split: true,
                    collapsible: true,
                    collapseMode: 'mini',
                    region: 'west',
                    tabPosition: 'bottom',
                    defaultType: 'panel',
                    width: 190,
                    defaults: {
                        headerCfg: {
                            tag: 'center',
                            cls: 'x-navigation-header'
                        }
                    },
                    layoutConfig: {
                        titleCollapse: true,
                        layoutOnTabChange: true,
                        animate: true
                    },
                    defaults: {
                        listeners: {
                            'select': {
                                fn: this.onEntitySelect,
                                scope: this
                            }
                        }
                    },
                    items: [{
                        xtype: 'modules.view'
                    }, {
                        xtype: 'reports.view'
                    }, {
                        xtype: 'system.view'
                    }, {
                        xtype: 'favorites.view'
                    }]
                }, {
                    id: 'module.container',
                    xtype: 'workpanel',
                    hometabXType: this.hometabXType,
                    listeners: {
                        'activity': {
                            fn: this.onActivityFound,
                            scope: this
                        }
                    }
                }, {
                    id: 'windows.view',
                    xtype: 'windows.view',
                    listeners: {
                        'any': {
                            fn: this.onActivityFound,
                            scope: this
                        },
                        'activity': {
                            fn: this.onActivityFound,
                            scope: this
                        }
                    }
                }],
                bbar: new Karma.Parts.StatusBar({
                    userData: Karma.Core.Principal.Instance.getData(),
                    footer: this.footer,
                    userDataXTemplate: this.userDataXTemplate
                })
            }
        });
        Karma.Parts.ApplicationWindow.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'about': true
        });
        this.addEvents({
            'shutdown': true
        });
        this.addEvents({
            'activity': true
        });
        this.getEl().fadeIn({
            easing: 'easeIn',
            duration: 1
        });
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[ApplicationWindow.initComponent] ->');
        }
    },
    
    onEntitySelect: function(entity){
        var container = this.findById('module.container');
        container.setEntityTab(entity);
        this.fireEvent('activity');
    },
    
    onShutdown: function(){
        if (Karma.Core.WindowManager.Instance.existsDirty()) {
            Ext.Msg.show({
                title: 'Guardar cambios?',
                msg: 'Existen ventanas con cambios pendientes. Deseas salir del sistema?',
                buttons: Ext.Msg.YESNO,
                fn: function(result){
                    if (result === 'yes') {
                        this.fireEvent('shutdown');
                    }
                },
                icon: Ext.MessageBox.QUESTION,
                scope: this
            });
        }
        else {
            this.fireEvent('shutdown');
        }
    },
    
    onActivityFound: function(){
        this.fireEvent('activity');
    }
    
});

Ext.reg('application.win', Karma.Parts.ApplicationWindow);



Karma.LogIn = Ext.extend(Ext.Window, {
	
	service: null,
	
	username: null,
	
	password: null,
	
	ubicacion: null,
	
	recordar: false,
	
	standalone: false,
	
	usernamefield: null,
	
	passwordfield: null,
	
	domainfield: null,
	
	formid: null,
	
	frame: true,
	
	initComponent: function(options){
		var themechanger = new Ext.ux.ThemeChanger({
				 	width: 100,
			        preThemes: 'lib/ext/resources/css/ext-all.css',
			        postThemes: ['css/app/corp.css','css/extux/Portal.css'],
			        extThemes:  [
			            ['Default', 'lib/ext/resources/css/ext-all.css'],
			            ['Negro', 'lib/ext/resources/css/xtheme-black.css'],
			            ['Gris', 'lib/ext/resources/css/xtheme-gray.css'],
			            ['Olivo', 'lib/ext/resources/css/xtheme-olive.css'],
			            ['Grafito', 'lib/ext/resources/css/xtheme-slate.css']
			        ],
			        defaultTheme: 0,
			        cssId: 'Grafito'
			    });
		this.checkCookie();
		if(!Ext.isEmpty(options)) {
			this.standalone = options.standalone;
			this.usernamefield = options.usernamefield;
			this.passwordfield = options.passwordfield;
			this.domainfield = options.domainfield;
			this.formid = options.formid;
		}
		Ext.apply(this, {
			title: 'Iniciar Sesi&oacute;n',
			modal: true,
			closable: false,
			collapsible: false,
			draggable: false,
			minimizable: false,
			resizable: false,
			onEsc: Ext.emptyFn,
			width: 340,
			tbar: [
				'->', 
				themechanger
			],
			items: {
				bodyStyle: 'padding: 0px 0px 0px 0px',
				border: false,
				frame: true,
				items: {
					xtype: 'form',
					bodyStyle: 'padding: 20px 20px 20px 20px',
					id: 'loginfrm',
					border: true,
					frame: false,
					buttonAlign: 'right',
					monitorValid: true,
					stateId: 'loginFrm',
					stateful: true,
					defaults: {
						xtype: 'textfield',
						anchor: '90%',
						allowBlank: false,
						blankText: 'Mandatorio',
						selectOnFocus: true,
						msgTarget: 'side',
						enableKeyEvents: true
					},
					items: [{
						id: 'txtUsuario',
						emptyText: 'Usuario...',
						fieldLabel: 'Usuario',
			            listeners: {
			                'keypress': {
			                    fn: this.onKeyPress,
								scope: this
			                }
			            },
						stateId: 'username',
						stateful: true,
						value: this.username,
						vtype: 'alphanum'
					}, {
						id: 'txtPassword',
						inputType: 'password',
						fieldLabel: 'Contraseña',
			            listeners: {
			                'keypress': {
			                    fn: this.onKeyPress,
								scope: this
			                }
			            },
						stateId: 'password',
						stateful: true,
						value: this.password
					}, {
						id: 'txtDominio',
						emptyText: 'Ubicacion...',
						fieldLabel: 'Ubicaci&oacute;n',
			            listeners: {
			                'keypress': {
			                    fn: this.onKeyPress,
								scope: this
			                }
			            },
						stateId: 'ubicacion',
						stateful: true,
						value: this.ubicacion
					}, {
						id: 'chkRemember',
						xtype: 'checkbox',
						fieldLabel: 'Recordar datos',
						checked: this.recordar
					}],
					buttons: [{
						text: 'Entrar',
						id: 'btnEnviar',
						handler: this.enviar,
						formBind: true,
						scope: this
					}]
				}
			}
		});
		
		Karma.LogIn.superclass.initComponent.apply(this, arguments);
		this.addEvents({
			'success': true,
			'failure': true
		});
		this.on('show', this.onShow, this);
		this.show();
	},
	
	onKeyPress: function(textfield, e) {
		if (e.getKey() === Ext.EventObject.RETURN) {
			var username = Ext.getCmp('txtUsuario').isValid(false);
			var password = Ext.getCmp('txtPassword').isValid(false);
			var dominio = Ext.getCmp('txtDominio').isValid(false);
	
			if (username && password && dominio) {
				this.enviar();
			}
		}
	},
	
	checkCookie: function() {
		var nameEQ = "Karma.com=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) {
				var value = c.substring(nameEQ.length,c.length);
				value = value.split('$');
				this.username = value[0];
				this.password = value[1];
				this.ubicacion = value[2];
				this.recordar = true;
			}
		}
	},
	
	enviar: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[LogIn.enviar] <-');
		}
		var me = this;
		var username = Ext.getCmp('txtUsuario').getValue();
		var password = Ext.getCmp('txtPassword').getValue();
		var dominio = Ext.getCmp('txtDominio').getValue();
		var recordar = Ext.getCmp('chkRemember').getValue();
		if(recordar) {
			var expires = new Date(new Date().getTime()+(1000*60*60*24*30));
			var value = username + '$' + password + '$' + dominio;
			document.cookie = 'Karma.com=' + value + '; expires=' + 
				expires.toGMTString() + '; path=/';
		} else {
			document.cookie = 'Karma.com=; expires=-1; path=/';
		}
		if(this.standalone) {
			Ext.get(this.usernamefield).dom.value = username;
			Ext.get(this.passwordfield).dom.value = password;
			Ext.get(this.domainfield).dom.value = dominio;
			Ext.get(this.formid).dom.submit();
		} else {
			Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, 
				this.service,
				Karma.Conf.LogInMethod, 
				[ username, password, dominio ], 
				Karma.Conf.DefaultGetDepth,
				function(result) {
					me.fireEvent('success', result);
					me.close();
				},
				function() {
				},
				this
			);
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[LogIn.enviar] ->');
		}
	}

});

Ext.reg('login', Karma.LogIn);



Karma.About = Ext.extend(Ext.Window, {
	
	initComponent: function(){
		Ext.apply(this, {
			title: 'Acerca de ĸarмa&#8482',
			modal: false,
			closable: true,
			collapsible: false,
			draggable: true,
			minimizable: false,
			resizable: false,
			width: 300,
			height: 300,
			html: '<center><br/><img src="imgs/el-karma.png" style="width: 100px;" /><br/><br/><p><b>ĸarмa&#8482</b></p><br/><p> applιcaтιon plaтform</p><p>verѕιon ' + Karma.Version + ' </p><br/><p> aυтнor: joѕe мanυel ιѕlaѕ roмero</p><p>[тrenтcιoran@gмaιl.coм] </p><br/><p> &copy; y &reg; joѕe мanυel ιѕlaѕ roмero 2008 </p></center>'
		});
		
		Karma.About.superclass.initComponent.apply(this, arguments);
		this.show();
	}

});

Ext.reg('about', Karma.About);



Karma.Data.HttpProxy = Ext.extend(Ext.data.HttpProxy, {

    cacheResults: false,

    cache: null,

    generateKey: function(target) {
        var hash = ObjectAnalyzer().hash(target);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.generateKey] key : ' + hash);
        }
        return hash;
    },

    load: function(params, reader, callback, scope, arg) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy]Loading data...');
            
            ObjectAnalyzer().analyze(params);
        }
        this.conn.url = Karma.Conf.ServiceInvoker;
        if (this.fireEvent("beforeload", this, params) !== false) {
            var o = {
                params: params || {},
                request: {
                    callback: callback,
                    scope: scope,
                    arg: arg
                },
                reader: reader,
                callback: this.loadResponse,
                jsonData: params || {},
                scope: this
            };
            if (this.useAjax) {
                Ext.applyIf(o, this.conn);
                if (this.activeRequest) {
                    Ext.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Ext.Ajax.request(o);
            } else {
                this.conn.request(o);
            }
        } else {
            callback.call(scope || this, null, arg, false);
        }
    },

    loadResponse: function(o, success, response, params) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.loadResponse]<-');
        }
        var result;
        delete this.activeRequest;
        if (!success) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Error: ' + response.responseText);
            }
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        try {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Reading response');
            }
            result = o.reader.read(response);
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Response readed');
            }
        } catch (e) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Error while reading: ' + e);
            }
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.loadResponse]->');
        }
    }
});




Karma.Data.JsonReader = Ext.extend(Ext.data.JsonReader, { 
	read : function(response){ 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader.read] <-');
		}
		var json = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader]currently reading [' + json + ']');
		}
		var o = eval('('+json+')'); 
		
		if(!o) { 
			throw {message: 'JsonReader.read: Json object not found'}; 
		} 
		if (o.Success){
			o = o.Result;
		} else {
			throw {message: o.ErrorMessage}; 
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader.read] ->');
		}
		return Karma.Data.JsonReader.superclass.readRecords.call (this,o); 
	}
});



Karma.Data.JsonStore = Ext.extend(Ext.data.Store, {
    
    remoteSort : true,

    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
				if (p.Parameters.Sorting) {
					p.Parameters.Sorting[0].Field = this.sortInfo.field;
					if (this.sortInfo.direction == 'ASC') {
						p.Parameters.Sorting[0].Sort = '0';
					} else {
						p.Parameters.Sorting[0].Sort = '1';
					}
				}
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
            return true;
        } else {
          return false;
        }
    }
	
});

Ext.apply(Karma.Data.JsonStore, {
	
	create: function(service, fields, parameters, method, id) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[JsonStore.create] <-');
		}
		var proxy = new Karma.Data.HttpProxy({
			url: Karma.Conf.ServiceInvoker,
			method: 'POST'
		});
		var _id = Ext.isEmpty(id)? 'Id' : id;
		var reader = new Karma.Data.JsonReader({
			totalProperty: Karma.Conf.DefaultTotal,
			root: Karma.Conf.DefaultRoot,
			idProperty: _id
		}, Ext.data.Record.create(fields));
		var _m = Ext.isEmpty(method)? Karma.Conf.FindMethod : method;
		var store = new Karma.Data.JsonStore({
			root: Karma.Conf.DefaultRoot,
			totalProperty: Karma.Conf.DefaultTotal,
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: _m, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
	        reader: reader
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[JsonStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[JsonStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[JsonStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[JsonStore.load]');
			}
		}, this);
		return store;		
	}
	
});



Karma.Data.JsonReader = Ext.extend(Ext.data.JsonReader, { 
	read : function(response){ 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader.read] <-');
		}
		var json = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader]currently reading [' + json + ']');
		}
		var o = eval('('+json+')'); 
		
		if(!o) { 
			throw {message: 'JsonReader.read: Json object not found'}; 
		} 
		if (o.Success){
			o = o.Result;
		} else {
			throw {message: o.ErrorMessage}; 
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader.read] ->');
		}
		return Karma.Data.JsonReader.superclass.readRecords.call (this,o); 
	}
});



Karma.Data.ArrayReader = Ext.extend(Ext.data.ArrayReader, { 
	read : function(response){ 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ArrayReader.read] <-');
		}
		var json = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ArrayReader]currently reading [' + json + ']');
		}
		var o = eval('('+json+')'); 
		
		if(!o) { 
			throw {message: 'ArrayReader.read: Json object not found'}; 
		} 
		if (o.Success){
			o = o.Result.Data;
		} else {
			throw {message: o.ErrorMessage}; 
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ArrayReader.read] ->');
		}
		return Karma.Data.ArrayReader.superclass.readRecords.call (this,o); 
	}
});



Karma.Data.HttpProxy = Ext.extend(Ext.data.HttpProxy, {

    cacheResults: false,

    cache: null,

    generateKey: function(target) {
        var hash = ObjectAnalyzer().hash(target);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.generateKey] key : ' + hash);
        }
        return hash;
    },

    load: function(params, reader, callback, scope, arg) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy]Loading data...');
            
            ObjectAnalyzer().analyze(params);
        }
        this.conn.url = Karma.Conf.ServiceInvoker;
        if (this.fireEvent("beforeload", this, params) !== false) {
            var o = {
                params: params || {},
                request: {
                    callback: callback,
                    scope: scope,
                    arg: arg
                },
                reader: reader,
                callback: this.loadResponse,
                jsonData: params || {},
                scope: this
            };
            if (this.useAjax) {
                Ext.applyIf(o, this.conn);
                if (this.activeRequest) {
                    Ext.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Ext.Ajax.request(o);
            } else {
                this.conn.request(o);
            }
        } else {
            callback.call(scope || this, null, arg, false);
        }
    },

    loadResponse: function(o, success, response, params) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.loadResponse]<-');
        }
        var result;
        delete this.activeRequest;
        if (!success) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Error: ' + response.responseText);
            }
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        try {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Reading response');
            }
            result = o.reader.read(response);
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Response readed');
            }
        } catch (e) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Error while reading: ' + e);
            }
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.loadResponse]->');
        }
    }
});




Karma.Data.GroupingStore = Ext.extend(Ext.data.GroupingStore, {

    remoteSort: true,

    load: function(options) {
        options = options || {};
        if (this.fireEvent("beforeload", this, options) !== false) {
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if (this.sortInfo && this.remoteSort) {
                var pn = this.paramNames;
                p.Parameters.Sorting[0].Field = this.sortInfo.field;                
                if (this.sortInfo.direction == 'ASC') {
                    p.Parameters.Sorting[0].Sort = '0';
                } else {
                    p.Parameters.Sorting[0].Sort = '1';
                }                
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
            return true;
        } else {
            return false;
        }
    },

    applySort: function() {
        Ext.data.GroupingStore.superclass.applySort.call(this);
        if (!this.groupOnSort && !this.remoteGroup) {
            var gs = this.getGroupState();
            if (gs && this.baseParams.Parameters.Sorting &&
				this.baseParams.Parameters.Sorting.length > 0 &&
				gs != this.baseParams.Parameters.Sorting[0].Field) {
                this.sortData(this.groupField);
            }
        }
    }

});

Ext.apply(Karma.Data.GroupingStore, {
	
	create: function(service, fields, groupField, parameters, listeners, localproxy, method) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[GroupingStore.create] <-');
		}
		var proxy = null;
		
		if(localproxy) {
			proxy = localproxy;
		} else {
			proxy = new Karma.Data.HttpProxy({
				url: Karma.Conf.ServiceInvoker,
				method: 'POST'
			});
		}
		var reader = new Karma.Data.JsonReader({
			totalProperty: Karma.Conf.DefaultTotal,
			root: Karma.Conf.DefaultRoot,
			id: 'Id'
		}, Ext.data.Record.create(fields));
		var store = new Karma.Data.GroupingStore({
			root: Karma.Conf.DefaultRoot,
			totalProperty: Karma.Conf.DefaultTotal,
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: method || Karma.Conf.FindMethod, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
			remoteGroup: false,
	        reader: reader,
			groupField: groupField,
			listeners: listeners || {}
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[GroupingStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[GroupingStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.error('[GroupingStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[GroupingStore.load]');
			}
		}, this);
		return store;		
	}
	
});



Karma.Data.JsonStore = Ext.extend(Ext.data.Store, {
    
    remoteSort : true,

    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
				if (p.Parameters.Sorting) {
					p.Parameters.Sorting[0].Field = this.sortInfo.field;
					if (this.sortInfo.direction == 'ASC') {
						p.Parameters.Sorting[0].Sort = '0';
					} else {
						p.Parameters.Sorting[0].Sort = '1';
					}
				}
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
            return true;
        } else {
          return false;
        }
    }
	
});

Ext.apply(Karma.Data.JsonStore, {
	
	create: function(service, fields, parameters, method, id) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[JsonStore.create] <-');
		}
		var proxy = new Karma.Data.HttpProxy({
			url: Karma.Conf.ServiceInvoker,
			method: 'POST'
		});
		var _id = Ext.isEmpty(id)? 'Id' : id;
		var reader = new Karma.Data.JsonReader({
			totalProperty: Karma.Conf.DefaultTotal,
			root: Karma.Conf.DefaultRoot,
			idProperty: _id
		}, Ext.data.Record.create(fields));
		var _m = Ext.isEmpty(method)? Karma.Conf.FindMethod : method;
		var store = new Karma.Data.JsonStore({
			root: Karma.Conf.DefaultRoot,
			totalProperty: Karma.Conf.DefaultTotal,
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: _m, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
	        reader: reader
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[JsonStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[JsonStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[JsonStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[JsonStore.load]');
			}
		}, this);
		return store;		
	}
	
});



Karma.Data.GroupingStore = Ext.extend(Ext.data.GroupingStore, {

    remoteSort: true,

    load: function(options) {
        options = options || {};
        if (this.fireEvent("beforeload", this, options) !== false) {
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if (this.sortInfo && this.remoteSort) {
                var pn = this.paramNames;
                p.Parameters.Sorting[0].Field = this.sortInfo.field;                
                if (this.sortInfo.direction == 'ASC') {
                    p.Parameters.Sorting[0].Sort = '0';
                } else {
                    p.Parameters.Sorting[0].Sort = '1';
                }                
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
            return true;
        } else {
            return false;
        }
    },

    applySort: function() {
        Ext.data.GroupingStore.superclass.applySort.call(this);
        if (!this.groupOnSort && !this.remoteGroup) {
            var gs = this.getGroupState();
            if (gs && this.baseParams.Parameters.Sorting &&
				this.baseParams.Parameters.Sorting.length > 0 &&
				gs != this.baseParams.Parameters.Sorting[0].Field) {
                this.sortData(this.groupField);
            }
        }
    }

});

Ext.apply(Karma.Data.GroupingStore, {
	
	create: function(service, fields, groupField, parameters, listeners, localproxy, method) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[GroupingStore.create] <-');
		}
		var proxy = null;
		
		if(localproxy) {
			proxy = localproxy;
		} else {
			proxy = new Karma.Data.HttpProxy({
				url: Karma.Conf.ServiceInvoker,
				method: 'POST'
			});
		}
		var reader = new Karma.Data.JsonReader({
			totalProperty: Karma.Conf.DefaultTotal,
			root: Karma.Conf.DefaultRoot,
			id: 'Id'
		}, Ext.data.Record.create(fields));
		var store = new Karma.Data.GroupingStore({
			root: Karma.Conf.DefaultRoot,
			totalProperty: Karma.Conf.DefaultTotal,
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: method || Karma.Conf.FindMethod, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
			remoteGroup: false,
	        reader: reader,
			groupField: groupField,
			listeners: listeners || {}
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[GroupingStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[GroupingStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.error('[GroupingStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[GroupingStore.load]');
			}
		}, this);
		return store;		
	}
	
});


Karma.View.ViewMenuBase = Ext.extend(Ext.Panel, {

    title: 'Operaciones',
    
    iconCls: 'icon-box-world',
    
    section: 'ops',
	
    initComponent: function(){
        var moduleMgr = Karma.Core.ModuleManager.Instance;
        var modules = this.process(moduleMgr.getAll());
        Ext.apply(this, {
            layout: 'accordion',
            border: false,
            headerCfg: {
                tag: 'center',
                cls: 'x-navigation-header'
            },
            layoutConfig: {
                titleCollapse: true,
                hideCollapseTool: false,
                animate: true
            },
            items: modules
        });
        Karma.View.ViewMenuBase.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
    },
    
    onEntityClick: function(node){
        var entity = node.attributes.entity;
        this.fireEvent('select', entity);
    },
    
    process: function(modules){
        var _modules = new Array();
        Ext.each(modules, function(module, index){
            if (!module.isHidden() && module.section === this.section) {
                var nodeArray = [];
                module.getEntities().each(function(entity, index){
                    if (!entity.isHidden()) {
                        nodeArray.push({
                            text: entity.getName(),
                            leaf: true,
                            entity: entity
                        });
                    }
                }, this);
                
                _modules.push(new Ext.tree.TreePanel({
                    title: module.getName(),
                    loader: new Ext.tree.TreeLoader({
                        preloadChildren: true
                    }),
                    root: {
						nodeType: 'async',
                        expanded: true,
                        allowChildren: true,
						children: nodeArray
                    },
		            autoScroll: true,
	                rootVisible: false,
	                lines: false,
	                listeners: {
	                    'click': {
	                        fn: this.onEntityClick,
	                        scope: this
	                    }
	                }
                }));
            }
        }, this);
		return _modules;
    }
    
});




Karma.View.WindowsView = Ext.extend(Ext.tree.TreePanel, {
	
	windows: new Ext.tree.AsyncTreeNode({
		expanded: true,
		children: []
	}),
	
	windowMgr: null,
	
	nodeReferences: [],
	
	initComponent: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.initComponent] <-');
		}
		this.windowMgr = Karma.Core.WindowManager.Instance;
		this.windowMgr.on('register', this.onRegister, this);
		this.windowMgr.on('close', this.onClose, this);
		this.windowMgr.on('show', this.onShow, this);
		this.windowMgr.on('minimize', this.onMinimize, this);
		this.windowMgr.on('titlechange', this.onTitleChange, this);
		this.windowMgr.on('flush', this.onFlush, this);
		
		Ext.apply(this, {
			title: 'Ventanas abiertas',
			region: 'east',
			collapsible: true,
			split: true,
			iconClse: 'icon-windows',
			collapseMode: 'mini',
			width: 170,
			layoutConfig: {
		        titleCollapse: true,
		        animate: true
		    },
	        autoScroll: true,
			lines: false,
	        loader: new Ext.tree.TreeLoader(),
	        root: this.windows,
	        rootVisible: false
		});
		Karma.View.WindowsView.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'any' : true, 'activity': true });
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.initComponent] ->');
		}
	},
	
	onClick: function(node){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClick] <-');
		}
		var winId = node.attributes.windowId;
		var win = this.windowMgr.get(winId);
		if(!Ext.isEmpty(win)) {
			if (win.isVisible()) {
				win.hide();
			}
			else {
				win.show();
			}
		} else {
			PLOG.debug('[WindowsView.onClick] There is no window with the id [' + winId + ']');
			this.windows.removeChild(this.nodeReferences[winId]);
		}
		this.fireEvent('activity');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClick] ->');
		}
	},
	
	onContextMenu: function(node, e) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onContextMenu] <-');
		}
		node.select();
		e.preventDefault();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onContextMenu] ->');
		}
	},
	
	onRegister: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onRegister] <-');
		}
		this.nodeReferences[win.getId()] = new Ext.tree.TreeNode({
			text: win.title,
			leaf: true,
			iconCls: 'icon-window',
			windowId: win.getId(),
			windowTitle: win.title,
			listeners: { 
				'dblclick': { fn: this.onClick, scope: this}, 
				'contextmenu': { fn: this.onContextMenu, scope: this}
			}
		});
		this.windows.appendChild(this.nodeReferences[win.getId()]);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onRegister] ->');
		}
	},
	
	onClose: function(winId) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClose] <-');
		}
		this.windows.removeChild(this.nodeReferences[winId]);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClose] ->');
		}
	},
	
	onShow: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onShow] <-');
		}
		this.nodeReferences[win.getId()].select();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onShow] ->');
		}
	},
	
	onMinimize: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onMinimize] <-');
		}
		win.hide();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onMinimize] ->');
		}
	},
	
	onFlush: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onFlush] <-');
		}
		var node = this.nodeReferences[win.getId()];
		node.setText(node.attributes.windowTitle);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onFlush] ->');
		}
	},
	
	onTitleChange: function(win, newTitle) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onTitleChange] <-');
		}
		var node = this.nodeReferences[win.getId()];
		node.attributes.windowTitle = newTitle;
		node.setText(node.attributes.windowTitle);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onTitleChange] ->');
		}
	}
	
});

Ext.reg('windows.view', Karma.View.WindowsView);


Karma.View.ModulesView = Ext.extend(Karma.View.ViewMenuBase, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Operaciones',
            iconCls: 'icon-box-world',
			section: 'ops'
        });
        Karma.View.ModulesView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('modules.view', Karma.View.ModulesView);



Karma.View.ReportsView = Ext.extend(Ext.Panel, {

    title: 'Reportes',
    
    iconCls: 'icon-graph',
    
    section: 'ops',
    
	initComponent: function() {
		this.moduleMgr = Karma.Core.ModuleManager.Instance;
        var modules = this.process(this.moduleMgr.getAll());
        Ext.apply(this, {
            layout: 'accordion',
            border: false,
            headerCfg: {
                tag: 'center',
                cls: 'x-navigation-header'
            },
            layoutConfig: {
                titleCollapse: true,
                hideCollapseTool: false,
                animate: true
            },
            items: modules
        });
		Karma.View.ReportsView.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
	},
    
    onEntityClick: function(node){
        var entity = node.attributes.entity;
        this.fireEvent('select', entity);
    },
    
    process: function(modules){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ReportsView.process]<- ');
		}
        var _modules = new Array();
		var reporter = Karma.Core.ModuleManager.Instance.getEntity('ReportBuilder');
        Ext.each(modules, function(module, index){
            if (!module.isHidden()) {
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ReportsView.process] Processing module: ' + module.getName());
				}
				var hasEntityWithReports = false;
				var nodeArray = [];
				module.getEntities().each(function(entity, index){
					if (!entity.isHidden() && !Ext.isEmpty(entity.metadata.Reports)) {
						if (PLOG.isDebugEnabled()) {
							PLOG.debug('[ReportsView.process] Entity: ' + entity.getName() + 
								' has reports: ' + entity.metadata.ReportsPath);
						}
						hasEntityWithReports = true;
						nodeArray.push({
                            text: entity.getName(),
                            leaf: true,
							iconCls: 'icon-graph',
                            entity: reporter.getWrapper(entity)
                        });
                    }
                }, this);

                if (hasEntityWithReports) {
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[ReportsView.process] Adding menu for: ' + module.getName() + 
							', nodes: ' + nodeArray);
					}
	                _modules.push(new Ext.tree.TreePanel({
	                    title: module.getName(),
	                    loader: new Ext.tree.TreeLoader({
	                        preloadChildren: true
	                    }),
	                    root: {
							nodeType: 'async',
							allowChildren: true,
	                        expanded: true,
							children: nodeArray
	                    },
			            autoScroll: true,
		                rootVisible: false,
		                lines: false,
		                listeners: {
		                    'click': {
		                        fn: this.onEntityClick,
		                        scope: this
		                    }
		                }
	                }));
				}
            }
        }, this);
		return _modules;
    }
});

Ext.reg('reports.view', Karma.View.ReportsView);



Karma.View.FavoritesView = Ext.extend(Karma.View.ViewMenuBase, {
	
	initComponent: function() {
		Ext.apply(this, {
			title: 'Favoritos',
			iconCls: 'icon-star',
			section: 'fav',
			hidden: true
		});
		Karma.View.FavoritesView.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('favorites.view', Karma.View.FavoritesView);



Karma.View.SystemView = Ext.extend(Karma.View.ViewMenuBase, {
	initComponent: function() {
		Ext.apply(this, {
			title: 'Sistema',
			iconCls: 'icon-advanced',
			section: 'sys'
		});
		Karma.View.SystemView.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('system.view', Karma.View.SystemView);



Ext.override(Ext.Panel, {

    createComponent: function(config) {
        // pre-processing        
        if (config.xtype) {
            if (config.xtype === 'datefield') {
                config.format = 'd/m/Y g:i:s A';
            }

            if (config.xtype === 'ag.list' || config.xtype === 'entity.list' ||
				config.xtype === 'entity.link' || config.xtype === 'eel.list') {

                var entity;
                var field = this.metadata.getField(config.name);

                if (field) {
                    entity = Karma.Core.ModuleManager.Instance.getEntity(field.EntityName);
                    config.query = field.Query;
                    config.searchquery = field.SearchQuery;
                }
                if (!entity) {
                    entity = Karma.Core.ModuleManager.Instance.getEntity(config.entityName);
                }
                Ext.apply(config, entity.getConfig(config.xtype));
                if (config.xtype === 'ag.list' || config.xtype === 'entity.list' || config.xtype === 'eel.list') {
                    this.hasAggregates = true;
                }
            }
        }
        if (this.propertyName) {
            config.propertyName = this.propertyName;
            config.originalName = config.name;
            config.name = this.propertyName + '.' + config.name;
        }
        if (config.fieldLabel && config.xtype != 'datefield') {
            config.invalidText = 'El campo ' + config.fieldLabel + ' es mandatorio.';
            config.blankText = 'El campo ' + config.fieldLabel + ' es mandatorio.';
        }
        var cmp = Ext.create(config, this.defaultType);
        // post-processing
        return cmp;
    },


    enableAggregates: function(value) {
        this.items.each(function(item) {
            if (item.getXType() === 'ag.list' || item.getXType() === 'entity.list' || item.getXType() === 'eel.list') {

                item.setParentEntity.createDelegate(item)(value);
            }
            else if (item.enableAggregates) {
                item.enableAggregates(value);
            }
        }, this);

    },    

    updateControls: function(value) {
        this.items.each(function(item) {
            if (item.getXType() === 'ag.list' || item.getXType() === 'entity.list' || item.getXType() === 'eel.list') {

                item.updateControls.createDelegate(item)(value);
            }
            else if (item.updateControls) {
                item.updateControls(value);
            }
        }, this);
    }

});



Ext.override(Ext.form.BasicForm, {
	
	setValues : function(values){
        if(Ext.isArray(values)){ // array of objects. Convert to object hash
            var valuesObject = {};
            for(var i = 0, len = values.length; i < len; i++){
                valuesObject[values[i].id] = values[i].value;
            }
            return this.setValues(valuesObject);
        } else { // object hash
            for (var i = 0, items = this.items.items, len = items.length; i < len; i++) {
                var field = items[i];
                var v;
				if (Ext.isEmpty(field.propertyName)) {
					v = values[field.id] || values[field.hiddenName || field.name];
				}
				else {
					v = values[field.propertyName] ? values[field.propertyName][field.originalName] : '';
                    if(PLOG.isDebugEnabled()) {
                        PLOG.debug('[BasicForm.setValues] propertyName: ' + field.propertyName +
                            ', Property: ' + field.name + ', value: ' + v);
                    }
				}
                if (typeof v !== 'undefined') {
                    field.setValue(v)
                    if(this.trackResetOnLoad){
                        field.originalValue = field.getValue();
                    }
                }
            }
        }
        return this;
    },

    getFieldValues : function(){
        var o = {};
        this.items.each(function(f){
			if (Ext.isEmpty(f.propertyName)) {
				var v = f.getValue();
                if(PLOG.isDebugEnabled()) {
				    PLOG.debug('[BasicForm.getFieldValues] Property: ' + f.name + ', value: ' + v);
                }
				if(Ext.isEmpty(v)) {
					o[f.name] = null;
				} else {
					o[f.name] = v;
				}
			}
			else {
				var v = f.getValue();
                if(PLOG.isDebugEnabled()) {
                    PLOG.debug('[BasicForm.getFieldValues] propertyName: ' + f.propertyName +
                        ', Property: ' + f.originalName + ', CompositeProperty: ' + f.name +
                        ', value: ' + v);
                }
				if (!o[f.propertyName]) {
					o[f.propertyName] = { };					
				}
				
				if(Ext.isEmpty(v)) {
					o[f.propertyName][f.originalName] = null;
				} else {
					o[f.propertyName][f.originalName] = v;
				}
			}
        });
        return o;
    }
	
});



Karma.Editor.Actions.ActionBase = Ext.extend(Ext.form.Action, {
    type: 'action.base',
    run: function(){
        Ext.Ajax.request(Ext.apply(
            this.createCallback(this.options), 
			this.getConfigObject()
		));
    },
    success: function(response){
        var value = this.processResponse(response);
        if(!value.Success){
			this.failureType = Ext.form.Action.SERVER_INVALID;
			this.Result = value;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(value.Result);
        this.form.afterAction(this, true);
    },
    failure : function(response){
        this.response = response;
        if(response.responseText){
			this.Result = this.processResponse(response);
        }
        this.failureType = Ext.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },
    handleResponse: function(response){
		var result = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
        return Ext.decode(result);
    },
    getParams: function(){
        return {
			Service: this.options.service,
			Method: this.getOperation(),
			Parameters: this.options.parameters || null,
			Depth: Karma.Conf.DefaultGetDepth
		};
    },
	getOperation: function() {
		return this.options.operation;
	},
	getConfigObject: function() {
		return {
            method: 'POST',
            url: Karma.Conf.ServiceInvoker,
            params: Ext.encode(this.getParams())
    	};
	}
});
Ext.form.Action.ACTION_TYPES['action.base'] = Karma.Editor.Actions.ActionBase;



Karma.Editor.Actions.Load = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.load',
	
    run: function(){
        Ext.Ajax.request(Ext.apply(
            this.createCallback(this.options),{
	            method: 'POST',
	            url: Karma.Conf.ServiceInvoker,
	            params: Ext.encode({
					Service: this.options.service,
					Method: Karma.Conf.GetMethod,
					Parameters: this.options.parameters || null,
					Depth: Karma.Conf.DefaultGetDepth
				})
	    	}
		));
    },
    success: function(response){
        var value = this.processResponse(response);
        if(!value.Success){
			this.failureType = Ext.form.Action.SERVER_INVALID;
            this.form.afterAction(this, false);
            return;
        }
        this.form.setValues(value.Result);
        this.form.afterAction(this, true);
    },
    handleResponse: function(response){
		var result = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
        return Ext.decode(result);
    }
});
Ext.form.Action.ACTION_TYPES['action.load'] = Karma.Editor.Actions.Load;



Karma.Editor.Actions.NewFromEntity = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.newfromentity',
	getOperation: function() {
		this.options.operation = Karma.Conf.NewFromEntityMethod;
		return this.options.operation;
	}
});
Ext.form.Action.ACTION_TYPES['action.newfromentity'] = Karma.Editor.Actions.NewFromEntity;



Karma.Editor.Actions.New = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.new',
	getOperation: function() {
		this.options.operation = Karma.Conf.NewMethod;
		return this.options.operation;
	}
});
Ext.form.Action.ACTION_TYPES['action.new'] = Karma.Editor.Actions.New;



Karma.Editor.Actions.Save = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.save',
    run : function(){
        var o = this.options;
		o.operation = Karma.Conf.SaveMethod;
        if (this.form.isValid()) {
			Ext.Ajax.request(Ext.apply(this.createCallback(o), {
				url: Karma.Conf.ServiceInvoker,
				method: 'POST',
				params: Ext.encode(this.getParams())
			}));
		}
		else {
			if (o.clientValidation !== false) {
				this.failureType = Ext.form.Action.CLIENT_INVALID;
				this.form.afterAction(this, false);
			}
		}
    }
});
Ext.form.Action.ACTION_TYPES['action.save'] = Karma.Editor.Actions.Save;



Karma.Editor.Actions.Update = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.update',
    run : function(){
        var o = this.options;
		o.operation = Karma.Conf.UpdateMethod;
		var parameters = this.getParams();
		if (Ext.isEmpty(parameters.Id) && parameters.Id != 0) {
			parameters.Method = Karma.Conf.UpdateMethod;
		}
        if (this.form.isValid()) {
			Ext.Ajax.request(Ext.apply(this.createCallback(o), {
				url: Karma.Conf.ServiceInvoker,
				method: 'POST',
				params: Ext.encode(this.getParams())
			}));
		}
		else {
			if (o.clientValidation !== false) {
				this.failureType = Ext.form.Action.CLIENT_INVALID;
				this.form.afterAction(this, false);
			}
		}
    }
});
Ext.form.Action.ACTION_TYPES['action.update'] = Karma.Editor.Actions.Update;


Karma.Editor.Window = Ext.extend(Ext.Window, {
    entity: null,
    isNew: false,
    isDirty: false,
    layout: 'fit',
    iconCls: 'icon-window',
    border: true,
    closable: false,
    frame: true,
    autoShow: true,
    constraint: true,
    collapsible: true,
    modal: false,
    minimizable: true,
    maximizable: true,
	resizable: false,
    plain: true,
    constrain: true,
    initComponent: function(){
        this.internalListeners = {
            change: {
                fn: this.onChange,
                scope: this
            },
            flush: {
                fn: this.onFlush,
                scope: this
            },
            aftersave: {
                fn: this.onAfterSave,
                scope: this
            },
            load: {
                fn: this.onLoad,
                scope: this
            },
            beforeclose: {
                fn: this.onBeforeClose,
                scope: this
            },
            any: {
                fn: this.onAny,
                scope: this
            }
        };
        var editorConfig = {
            xtype: this.editorXType,
            entity: this.entity,
            isNew: this.isNew,
            entityLinks: new Array()
        };
        Ext.applyIf(editorConfig, this.editorProperties);
        Ext.apply(this, {
            items: editorConfig,
            listeners: {
                'minimize': {
                    fn: this.hide,
                    scope: this
                }
            }
        });
        Karma.Editor.Window.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            flush: true,
            change: true
        });
        Karma.Util.ListenerUtils.addListenersToObject(this.items.get(0), this.internalListeners);
        this.show();
        this.getEl().fadeIn({
            easing: 'easeOut',
            duration: 0.6
        });
    },
    onLoad: function(value){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.load] event has been raised. Id: ' + value.Id);
        }
        this.originalTitle = this.getNewTitle(value);
        this.setTitle(this.originalTitle);
        this.isDirty = false;
    },
    onChange: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.change] event has been raised.');
        }
        this.setTitle('[*]' + this.originalTitle);
        this.fireEvent('change');
        this.isDirty = true;
    },
    onFlush: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.flush] event has been raised.');
        }
        this.setTitle(this.originalTitle);
        this.fireEvent('flush', this);
        this.isDirty = false;
    },
    onAfterSave: function(value){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.aftersave] event has been raised. Id: ' + value.Id);
        }
        if (this.isNew) {
            this.originalTitle = this.getNewTitle(value);
            this.isNew = false;
        }
        this.setTitle(this.originalTitle);
        this.isDirty = false;
    },
    onBeforeClose: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.beforeclose] event has been raised.');
        }
        if (this.isDirty) {
            Ext.Msg.show({
                title: 'Aviso',
                msg: 'Estas a por cerrar una ventana con cambios pendientes. Deseas continuar?',
                buttons: Ext.Msg.YESNO,
                closable: false,
                fn: function(result){
                    if (result === 'yes') {
                        this.getEl().switchOff({
                            easing: 'easeOut',
                            duration: 0.3,
                            callback: function(){
                                this.close();
                                this.purgeListeners();
                                this.destroy();
                            },
                            scope: this
                        });
                    }
                },
                animEl: this.getEl(),
                icon: Ext.MessageBox.QUESTION,
                scope: this
            });
        }
        else {
            this.getEl().fadeOut({
                easing: 'easeOut',
                duration: 0.3,
                callback: function(){
                    this.close();
                    this.purgeListeners();
                    this.destroy();
                },
                scope: this
            });
        }
    },
    onAny: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.any] event has been raised.');
        }
        this.fireEvent('any');
    },
    isDirty: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.isDirty] [' + this.isDirty + ']');
        }
        return this.isDirty;
    },
    flush: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.flush]');
        }
        this.items[0].flush();
    },
    getNewTitle: function(value){
        return this.entity.name + ' : ' + this.entity.getDisplayTitle(value);
    }
});

Ext.apply(Karma.Editor.Window, {
    create: function(config){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.create] <- Inner Type: ' + config.editorXType);
        }
        config.id = Karma.WinManager.Instance.getId(config.entity, config.editorProperties.entityId || 0);
        Ext.ComponentMgr.create(config, 'cmp.editor.win');
        Karma.WinManager.Instance.register(config.id);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Window.create] ->');
        }
    }
});
Ext.reg('cmp.editor.win', Karma.Editor.Window);


Karma.Editor.EditorBase = Ext.extend(Ext.form.FormPanel, {
    entity: null,
    isNew: false,
    canUpdate: true,
    sections: [],
    internalEvents: true,
    value: null,
    defaultFormType: null,
    dynamicControlsLoaded: null,
    initComponent: function() {
        this.tbar = this.toolbar = this.getTBarControls();
        this.bbar = this.status = this.getBBarControls();
        Karma.Editor.EditorBase.superclass.initComponent.apply(this, arguments);
        this.on('afterlayout', function() {
            this.doLoad();
        }, this);
        this.addEvents({
            load: true,
            beforeclose: true,
            flush: true,
            change: true,
            aftersave: true,
            beforesave: true,
            any: true
        });
    },
    getTBarControls: function() {
        var base = this.getTBarBaseControls();
        var custom = this.getTBarCustomControls();
        Ext.each(custom, function(control) {
            base.push(control);
        }, this);
        return new Ext.Toolbar({
            items: base
        });
    },
    getTBarBaseControls: function() {
        var flagSave = false;
        if (this.isNew) {
            flagSave = !(this.entity.security.New && this.canUpdate);
        }
        else {
            
            if (!Ext.isEmpty(this.entity.security)) {
                flagSave = !(this.entity.security.Update && this.canUpdate);
            } else {
                flagSave = false;
            }
            
        }
        return [this.guardarBtn = new Ext.Button({
            text: 'Guardar',
            iconCls: 'icon-save',
            handler: this.doSubmit,
            scope: this,
            disabled: flagSave
        }), this.cerrarBtn = new Ext.Button({
            text: 'Cerrar',
            iconCls: 'icon-decline',
            handler: this.doClose,
            scope: this
        })];
    },
    getTBarCustomControls: function() {
        return [];
    },
    getTBarDynamicControls: function() {
        return [];
    },
    getBBarControls: function() {
        return new Ext.ux.StatusBar({
            defaultText: '',
            plugins: new Ext.ux.ValidationStatus({
                form: this.getId()
            })
        });
    },
    doLoad: function() {
        this.onBeforeLoad();
        if (Ext.isEmpty(this.value)) {
            this.loadAction();
        }
        else {
            this.loadValue();
        }
    },
    reload: function() {
        if (Ext.isEmpty(this.value)) {
            this.loadAction();
        }
        else {
            this.loadValue();
        }
    },
    loadValue: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EditorBase.loadValue]');
        }
        this.suspendEvents();
        this.getForm().setValues(this.value);
        this.onLoad(this.value);
        this.resumeEvents();
        this.fireEvent('load', this.value);
    },
    loadAction: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EditorBase.loadAction]');
        }
        this.suspendEvents();
        this.getForm().doAction((this.isNew ? 'action.new' : 'action.load'), {
            service: this.entity.service,
            parameters: this.entityId,
            success: function(form, action) {
                var result = action.result.Result;
                this.value = result;
                this.onLoad(result);
                this.resumeEvents();
                this.fireEvent('load', result);
            },
            failure: function() {
                this.status.setStatus({
                    text: 'Ocurrio un error al cargar.',
                    clear: true
                });
                this.resumeEvents();
            },
            scope: this
        });
    },
    doSubmit: function() {
        var value = this.getForm().getFieldValues();
        if (this.isValid() && this.validateValue(value, this.isNew ? 'save' : 'update')) {
            this.status.showBusy();
            if (this.isNew) {
                if (!this.onBeforeSave(value)) {
                    this.status.clearStatus();
                    this.status.setStatus({
                        text: 'Operacion cancelada',
                        clear: true
                    });
                    return;
                }
                this.fireEvent('beforesave', value);
            }
            else {
                if (!this.onBeforeUpdate(value)) {
                    this.status.clearStatus();
                    this.status.setStatus({
                        text: 'Operacion cancelada',
                        clear: true
                    });
                    return;
                }
                this.fireEvent('beforeupdate', value);
            }
            this.fireEvent('any');            
            this.getForm().doAction(this.isNew ? 'action.save' : 'action.update', {
                service: this.entity.service,
                parameters: value,
                success: function(form, action) {
                    var result = action.result.Result;
                    this.status.setStatus({
                        text: 'El registro se guardo exitosamente',
                        clear: true
                    });
                    if (this.isNew) {
                        this.isNew = false;
                        this.fireEvent('aftersave', result);
                        this.onAfterSave(result);
                    }
                    else {
                        this.fireEvent('afterupdate', result);
                        this.onAfterUpdate(result);
                    }
                    this.fireEvent('flush');
                    this.status.clearStatus();
                },
                failure: this.reportError,
                scope: this
            });
        }
    },
    reportError: function(form, action) {
        Ext.Msg.alert('Error', action.Result.ErrorMessage);
        this.status.setStatus({
            text: 'Ocurrio un error al guardar.',
            clear: true
        });
    },
    doOperation: function(operation, callback) {
        this.doOperationWithParams(this.getForm().getFieldValues(), callback);
    },
    doOperationWithParams: function(operation, params, callback) {
        var value = this.getForm().getFieldValues();
        if (this.isValid() && this.validateValue(value, operation)) {
            this.status.showBusy();
            if (!this.onBeforeOperation(operation, value)) {
                this.status.clearStatus();
                this.status.setStatus({
                    text: 'Operacion cancelada',
                    clear: true
                });
                return;
            }
            this.fireEvent('any');
            this.getForm().doAction('action.base', {
                operation: operation,
                service: this.entity.service,
                parameters: params,
                success: function(form, action) {
                    var result = action.result.Result;
                    this.status.clearStatus();
                    this.status.setStatus({
                        text: 'El registro se guardo exitosamente',
                        clear: true
                    });
                    this.getForm().setValues(result);
                    this.onAfterOperation(operation, result);
                    callback.fn.createDelegate(callback.scope)(result);
                },
                failure: this.reportError,
                scope: this
            });
        }
    },
    doClose: function() {
        this.fireEvent('beforeclose');
    },
    flush: function() {
        this.doSubmit();
    },
    onBeforeSave: function(value) {
        var flag = true;
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                if (!section.onBeforeSave.createDelegate(section)(value)) {
                    flag = false;
                }
            }, this);
        }
        return flag;
    },
    onAfterSave: function(value) {
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                section.onAfterSave.createDelegate(section)(value);
            }, this);
        }

        this.updateControls(value);
        var dyn = this.getTBarDynamicControls(value);
        if (dyn && (!this.menusLoaded || Ext.isEmpty(this.menusLoaded))) {
            Ext.each(dyn, function(d) {
                d.fn.createDelegate(d.scope)(d.params, {
                    fn: function(menu) {
                        this.toolbar.addButton(menu);
                        this.toolbar.doLayout();
                    },
                    scope: this
                });
            }, this);
            this.menusLoaded = true;
        }


    },
    onBeforeUpdate: function(value) {
        var flag = true;
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                if (!section.onBeforeUpdate.createDelegate(section)(value)) {
                    flag = false;
                }
            }, this);
        }
        return flag;
    },
    onAfterUpdate: function(value) {
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                section.onAfterUpdate.createDelegate(section)(value);
            }, this);
        }
        this.updateControls(value);
    },
    onBeforeOperation: function(op, value) {
        var flag = true;
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                if (!section.onBeforeOperation.createDelegate(section)(op, value)) {
                    flag = false;
                }
            }, this);
        }
        return flag;
    },
    onAfterOperation: function(op, value) {
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                section.onAfterOperation.createDelegate(section)(op, value);
            }, this);
        }
    },
    onBeforeLoad: function() {
        this.getForm().items.each(function(item) {
            if (item.getXType() === 'entity.link') {
                item.processContextTriggers.createDelegate(item)(this.getForm());
            }
        }, this);
    },
    onLoad: function(value) {
        if (this.internalEvents) {
            this.mainPanel.items.each(function(section) {
                section.onLoad.createDelegate(section)(value);
            }, this);
        }
        var dyn = this.getTBarDynamicControls(value);
        if (dyn && !this.menusLoaded) {
            var cont = 0;
            Ext.each(dyn, function(d) {
                cont++;
                d.fn.createDelegate(d.scope)(d.params, {
                    fn: function(menu) {
                        this.toolbar.addButton(menu);
                        this.toolbar.doLayout();
                    },
                    scope: this
                });
            }, this);
            if (cont > 0)
                this.menusLoaded = true;
        }
        this.updateControls(value);
    },
    isValid: function() {
        var valid = true;
        this.getForm().items.each(function(f) {
            if (!f.isValid()) {
                valid = false;
                f.markInvalid();
            }
        });
        return valid;
    },
    validateValue: function(value, operation) {
        return true;
    },
    updateControls: function(value) {
        this.mainPanel.items.each(function(section) {
            section.updateControls.createDelegate(section)(value);
        }, this);
    }
});
Ext.reg('cmp.editor', Karma.Editor.EditorBase);


Karma.Editor.FormBase = Ext.extend(Ext.Panel, {
    hasAggregates: false,
    initComponent: function(){
        Karma.Editor.FormBase.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'change': true });
    },
    onBeforeSave: function(value){
		return true;
    },
    onBeforeUpdate: function(value){
		return true;
    },
    onAfterSave: function(value){
        this.enableAggregates(value);
        this.updateControls(value);
    },
    onAfterUpdate: function(value){
        this.updateControls(value);
    },
    onBeforeOperation: function(operation, value){
		return true;
    },
    onAfterOperation: function(operation, value){
    },
    onLoad: function(value){
        this.value = value;
        this.enableAggregates(value);
        this.updateControls(value);
    },
    getForm: function(){
        return this.editor.getForm();
    },
    disable: function(){
        this.items.each(function(item, index, all){
            if (item.disable) {
                item.disable();
            }
        }, this);
    }
});

Ext.reg('cmp.editor.frm', Karma.Editor.FormBase);
Karma.FB = Karma.Editor.FormBase;



Karma.Editor.TwoColumnFormBase = Ext.extend(Karma.Editor.FormBase, {
	initComponent: function (){
		var col1PanelId = Ext.id(), col2PanelId = Ext.id();
		Ext.apply(this, {
			layout: 'column',
			anchor: '90%',
			layoutConfig: {
				columns: 2
			},
			defaultType: 'panel',
			defaults: {
				editor: this,
				entity: this.entity,
				metadata: this.metadata,
				security: this.security,
				value: this.value,
				isNew: this.isNew,
				columnWidth:0.5,
				layout: 'form',
				border: false,
				frame: false,
				defaultType: 'textfield',
				bodyStyle:'padding: 10px 10px 0px 10px',
				labelWidth: 80,
				defaults: { 
					anchor: '95%',
					allowBlank: false,
					selectOnFocus: true,
					msgTarget: 'side',
					listeners: {
						change: {
							fn: function(field, newValue, oldValue) {
								this.fireEvent('change', field, newValue, oldValue);
							},
							scope: this
						},
						invalid: {
							fn: function(field, msg) {
								field.getEl().highlight();
								this.fireEvent('invalid', this, field, msg);
							},
							scope: this
						}
					}
				}
			},
			items: [{
				id: col1PanelId,
				items: this.column1items
			}, {
				id: col2PanelId,
				items: this.column2items
			}]
		});
		Karma.Editor.TwoColumnFormBase.superclass.initComponent.apply(this, arguments);
		this.col1Panel = this.findById(col1PanelId);
		this.col2Panel = this.findById(col2PanelId);
	},
	disableInternal: function(items) {
        items.each(function(item){
            item.disable();
        }, this);
	},
    disable: function(){
			this.disableInternal(this.col1Panel.items);
			this.disableInternal(this.col2Panel.items);
    }
});
Ext.reg('cmp.editor.card.frm2', Karma.Editor.TwoColumnFormBase);
Karma.FB2 = Karma.Editor.TwoColumnFormBase;



Karma.Editor.IFormBase = Ext.extend(Karma.Editor.FormBase, {
	initComponent: function (){
        var col1PanelId = Ext.id(), col2PanelId = Ext.id(), col3PanelId = Ext.id(), 
			col4PanelId = Ext.id(), col5PanelId = Ext.id();
        Ext.apply(this, {
            layout: 'border',
            defaultType: 'panel',
            items: [{
                region: 'north',
                layout: 'column',
                anchor: '95%',
                layoutConfig: {
                    columns: 2
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
                    columnWidth: 0.5,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaultType: 'textfield',
                    bodyStyle: 'padding: 10px 10px 0px 10px',
                    labelWidth: 80,
                    defaults: {
                        anchor: '95%',
                        allowBlank: false,
                        selectOnFocus: true,
                        msgTarget: 'side',
                        listeners: {
                            change: {
                                fn: function(field, newValue, oldValue){
                                    this.fireEvent('change', field, newValue, oldValue);
                                },
                                scope: this
                            },
                            invalid: {
                                fn: function(field, msg){
                                    field.getEl().highlight();
                                    this.fireEvent('invalid', this, field, msg);
                                },
                                scope: this
                            }
                        }
                    }
                },
                items: [{
                    id: col1PanelId,
                    items: this.column1items
                }, {
                    id: col2PanelId,
                    items: this.column2items
                }]
            }, {
                region: 'center',
                layout: 'vbox',
                layoutConfig: {
                    align: 'stretch',
                    pack: 'start',
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaults: {
                        anchor: '95%',
                        listeners: {
                            change: {
                                fn: function(field, newValue, oldValue){
                                    this.fireEvent('change', field, newValue, oldValue);
                                },
                                scope: this
                            }
                        }
                    }
                },
                items: [{
                    id: col3PanelId,
                    flex: 1,
                    items: this.column3items
                }, {
                    layout: 'column',
                    anchor: '95%',
                    layoutConfig: {
                        columns: 2
                    },
                    defaultType: 'panel',
                    defaults: {
						entity: this.entity,
						metadata: this.metadata,
						security: this.security,
                        columnWidth: 0.5,
                        layout: 'form',
                        border: false,
                        frame: false,
                        defaultType: 'textfield',
                        bodyStyle: 'padding: 10px 10px 0px 10px',
                        labelWidth: 150,
                        defaults: {
                            anchor: '95%',
                            allowBlank: false,
                            selectOnFocus: true,
                            msgTarget: 'side',
                            listeners: {
                                change: {
                                    fn: function(field, newValue, oldValue){
                                        this.fireEvent('change', field, newValue, oldValue);
                                    },
                                    scope: this
                                },
                                invalid: {
                                    fn: function(field, msg){
                                        field.getEl().highlight();
                                        this.fireEvent('invalid', this, field, msg);
                                    },
                                    scope: this
                                }
                            }
                        }
                    },
                    items: [{
						id: col4PanelId,
                        items: this.column4items
                    }, {
						id: col5PanelId,
                        items: this.column5items
                    }]
                }]
            }]
        });
        Karma.Editor.IFormBase.superclass.initComponent.apply(this, arguments);
        this.col1Panel = this.findById(col1PanelId);
        this.col2Panel = this.findById(col2PanelId);
        this.col3Panel = this.findById(col3PanelId);
        this.col4Panel = this.findById(col4PanelId);
        this.col5Panel = this.findById(col5PanelId);
    },
	disableInternal: function(items) {
        items.each(function(item){
            item.disable();
        }, this);
	},
    disable: function(){
			this.disableInternal(this.col1Panel.items);
			this.disableInternal(this.col2Panel.items);
			this.disableInternal(this.col3Panel.items);
			this.disableInternal(this.col4Panel.items);
			this.disableInternal(this.col5Panel.items);
    }
});
Ext.reg('cmp.editor.card.ifrm', Karma.Editor.IFormBase);
Karma.IFB = Karma.Editor.IFormBase;



Karma.Editor.TFormBase = Ext.extend(Karma.Editor.FormBase, {
	initComponent: function (){
        var col1PanelId = Ext.id(), col2PanelId = Ext.id(), col3PanelId = Ext.id();
        Ext.apply(this, {
            layout: 'border',
			editor: this.editor,
            defaultType: 'panel',
            items: [{
                region: 'north',
                layout: 'column',
                anchor: '95%',
                layoutConfig: {
                    columns: 2
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
                    columnWidth: 0.5,
					editor: this.editor,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaultType: 'textfield',
                    bodyStyle: 'padding: 10px 10px 0px 10px',
                    labelWidth: 100,
                    defaults: {
						editor: this.editor,
						entity: this.entity,
						metadata: this.metadata,
						security: this.security,
                        anchor: '95%',
                        allowBlank: false,
                        selectOnFocus: true,
                        msgTarget: 'side',
                        listeners: {
                            change: {
                                fn: function(field, newValue, oldValue){
                                    this.fireEvent('change', field, newValue, oldValue);
                                },
                                scope: this
                            },
                            invalid: {
                                fn: function(field, msg){
                                    field.getEl().highlight();
                                    this.fireEvent('invalid', this, field, msg);
                                },
                                scope: this
                            }
                        }
                    }
                },
                items: [{
                    id: col1PanelId,
                    items: this.column1items
                }, {
                    id: col2PanelId,
                    items: this.column2items
                }]
            }, {
                region: 'center',
                layout: 'vbox',
                layoutConfig: {
                    align: 'stretch',
                    pack: 'start'
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
					editor: this.editor,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaults: {
						editor: this.editor,
						entity: this.entity,
						metadata: this.metadata,
						security: this.security,
                        anchor: '95%',
                        listeners: {
                            change: {
                                fn: function(field, newValue, oldValue){
                                    this.fireEvent('change', field, newValue, oldValue);
                                },
                                scope: this
                            }
                        }
                    }
                },
                items: [{
                    id: col3PanelId,
                    flex: 1,
                    items: this.column3items
                }]
            }]
        });
        Karma.Editor.TFormBase.superclass.initComponent.apply(this, arguments);
        this.col1Panel = this.findById(col1PanelId);
        this.col2Panel = this.findById(col2PanelId);
        this.col3Panel = this.findById(col3PanelId);
    },
	disableInternal: function(items) {
        items.each(function(item){
            item.disable();
        }, this);
	},
    disable: function(){
			this.disableInternal(this.col1Panel.items);
			this.disableInternal(this.col2Panel.items);
			this.disableInternal(this.col3Panel.items);
    }
});
Ext.reg('cmp.editor.card.tfrm', Karma.Editor.TFormBase);
Karma.TFB = Karma.Editor.TFormBase;



Karma.Editor.layouts.Card = Ext.extend(Karma.Editor.EditorBase, {
	defaultFormType: 'cmp.editor.frm',
	initComponent: function () {
		Ext.apply(this, {
			layout: 'border',
			anchor: '100%',
			monitorValid: false,
			items: [new Ext.tree.TreePanel({
				xtype: 'treepanel',
				region: 'west',
				title: 'Secciones',
				width: 170,
				autoScroll: true,
				split:true,
				collapsible: true,
				collapseMode: 'mini',
				border: true,
				lines: false,
				rootVisible: false,
				root: this.menu = this.generateMenu(),
				listeners: { 
					click: { 
						fn: function(node) {
							this.mainPanel.getLayout().setActiveItem(this.menu.indexOf(node));
							this.mainPanel.doLayout();
							this.fireEvent('any');
						}, 
						scope: this 
					}
				}
			}), this.mainPanel = new Ext.Panel({
				layout: 'card',
				region: 'center',
				activeItem: 0,
				bodyStyle:'padding: 1px 0px 1px 1px',
				frame: true,
				deferredRender: true,
				layoutOnCardChange: true,
				forceLayout: false,
				defaultType: this.defaultFormType,
				defaults: {
					editor: this,
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
					value: this.value,
					isNew: this.isNew,
					layout: 'form',
					anchor: '90%',
					allowBlank: false,
					labelWidth: 100,
					defaultType: 'textfield',
					listeners: {
						change: { 
							fn: function(field, newValue, oldValue) {
								this.fireEvent('change', field, newValue, oldValue);
							}, 
							scope: this 
						}
					},
					defaults: {
						security: this.security,
						editor: this,
						bodyStyle:'padding: 1px 0px 1px 1px',
						anchor: '95%',
						allowBlank: false,
						selectOnFocus: true,
						msgTarget: 'side',
						validationDelay: 1000,
						listeners: {
							change: { 
								fn: function(field, newValue, oldValue) {
									this.fireEvent('change', field, newValue, oldValue);
								}, 
								scope: this 
							}
						}
					}
				},
				items: this.sections
			})]
		});
		Karma.Editor.layouts.Card.superclass.initComponent.apply(this, arguments);
	},
	generateMenu: function () {
		var children = new Array();
		Ext.each(this.sections, function(section) {
			children.push({
				leaf: true,
				text: section.title
			});
		}, this);
		var root = new Ext.tree.AsyncTreeNode({
			text: 'Secciones',
			nodeType: 'async',
			expanded: true,
			children: children
		});
		return root;
	}
});
Ext.reg('cmp.editor.card', Karma.Editor.layouts.Card);
Karma.EBCard = Karma.Editor.layouts.Card;



Karma.Editor.layouts.Tab = Ext.extend(Karma.Editor.EditorBase, {
	defaultFormType: 'cmp.editor.frm',
	initComponent: function () {
		Ext.apply(this, {
			layout: 'fit',
			anchor: '100%',
			monitorValid: false,
			items: [this.mainPanel = new Ext.TabPanel({
				activeItem: 0,
				bodyStyle:'padding: 1px 0px 1px 1px',
				frame: true,
				layoutOnTabChange: true,
				forceLayout: false,
				deferredRender: false,
				defaultType: this.defaultFormType,
				defaults: {
					editor: this,
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
					value: this.value,
					isNew: this.isNew,
					layout: 'form',
					anchor: '90%',
					frame: true,
					border: true,
					allowBlank: false,
					labelWidth: 100,
					defaultType: 'textfield',
					defaults: {
						editor: this,
						principal: this.entity.security,
						bodyStyle:'padding: 1px 0px 1px 1px',
						anchor: '95%',
						allowBlank: false,
						selectOnFocus: true,
						msgTarget: 'side',
						validationDelay: 1000,
						listeners: {
							change: { 
								fn: function(field, newValue, oldValue) {
									this.fireEvent('change', field, newValue, oldValue);
								}, 
								scope: this 
							}
						}
					}
				},
				items: this.sections
			})]
		});
		Karma.Editor.layouts.Tab.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('cmp.editor.tab', Karma.Editor.layouts.Tab);
Karma.EBTab = Karma.Editor.layouts.Tab;


Karma.Editor.layouts.Simple = Ext.extend(Karma.Editor.EditorBase, {
    initComponent: function(){
        Ext.apply(this, {
            anchor: '100%',
            monitorValid: false,
            frame: true,
            border: true,
            allowBlank: false,
            labelWidth: 100,
            defaultType: 'textfield',
            defaults: {
				principal: this.entity.security,
                bodyStyle: 'padding: 1px 0px 1px 1px',
                anchor: '95%',
                allowBlank: false,
                selectOnFocus: true,
                msgTarget: 'side',
                validationDelay: 1000,
                listeners: {
                    change: {
                        fn: function(field, newValue, oldValue){
                            this.fireEvent('change', field, newValue, oldValue);
                        },
                        scope: this
                    }
                }
            },
			items: this.sections
        });
        Karma.Editor.layouts.Simple.superclass.initComponent.apply(this, arguments);
		this.mainpanel = this;
    },
	onBeforeSave: function(value) { return true; },
	onAfterSave: function(value) { },
	onBeforeUpdate: function(value) { return true; },
	onAfterUpdate: function(value) { },
	onBeforeOperation: function(op, value) { return true; },
	onAfterOperation: function(op, value) { },
	onLoad: function(value) { }
});
Ext.reg('cmp.editor.simple', Karma.Editor.layouts.Simple);
Karma.EBSimple = Karma.Editor.layouts.Simple;



Karma.List.ListBase = Ext.extend(Ext.Panel, {

    module: null,

    entity: null,

    service: null,

    ordenar: true,

    previewTemplate: null,

    gridStore: null,

    grid: null,

    gridH: 600,

    singleSelect: true,

    editable: false,

    selectionMode: 'row', 

    grouping: false,

    canNew: true,

    canUpdate: true,

    canOpen: true,

    canDelete: true,

    groupField: null,

    initComponent: function() {
        Ext.apply(this, {
            border: false,
            frame: false,
            layout: 'fit',
            tbar: this.toolbar = new Ext.Toolbar(this.getTBarControls()),
            bodyStyle: 'padding: 0px 0px 0px 0px',
            items: this.getGridControl(),
            bbar: this.getBbarControls()
        });
        this.getMenuActions();
        Karma.List.ListBase.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'open': true,
            'new': true,
            'delete': true,
            'activity': true,
            'any': true
        });

        if (!Ext.isEmpty(this.entity.security)) {

            this.canOpen = this.canOpen && this.entity.security.Open;
            this.canNew = this.canNew && this.entity.security.New;
            this.canUpdate = this.canUpdate && this.entity.security.Update;
            this.canDelete = this.canDelete && this.entity.security.Delete;

        } else {

            this.canOpen = false;
            this.canNew = false;
            this.canUpdate = false;
            this.canDelete = false;

        }

        this.updateControls.createDelegate(this)();

        this.doLayout();
    },

    getSelectionModel: function() {
        if (!this.sm) {
            return this.sm = this.selectionMode === 'row' ? new Ext.grid.RowSelectionModel({
                singleSelect: this.singleSelect
            })
	            : new Ext.grid.CheckboxSelectionModel({ singleSelect: this.singleSelect,
	                sortable: true
	            });
        }
        return this.sm;
    },

    getGridView: function() {
        var config = {
            showPreview: true,
            sortAscText: "Ordenar ascendente",
            sortDescText: "Ordenar descendente",
            columnsText: "Columnas",
            autoFill: true,
            forceFit: true
        };
        return new Ext.grid.GroupingView(config);
    },

    getGridListeners: function() {
        return {
            'rowclick': { fn: this.onContextMenu, scope: this },
            'bodyresize': { fn: function() { this.syncSize(); }, scope: this },
            'mouseover': { fn: function() { this.onMouseOverGrid(); }, scope: this }
        };
    },
    
    onMouseOverGrid: function() {},

    getStoreColumns: function(colDefinitions) {
        if (colDefinitions) {
            var properties = [];
            Ext.each(colDefinitions, function(item, index) {
                properties.push({
                    name: item.Name,
                    mapping: index
                });
            }, this);
            return properties;
        }
        return Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
    },

    getGridColumns: function(colDefinitions) {
        if (colDefinitions) {
            var columns = [];
            //if(this.selectionMode === 'check') {
            //    columns[0] = this.getSelectionModel();
            //}
            //else {
            //    columns[0] = new Ext.grid.RowNumberer();
            //}
            Ext.each(colDefinitions, function(item) {
                var xtype = 'gridcolumn';
                var format = null;
                var enumType = null;
                if (!Ext.isEmpty(item.Format)) {
                    switch (item.Format) {
                        case 'usMoney':
                            xtype = 'numbercolumn';
                            format = '0,000.00';
                            break;
                        case 'date':
                            xtype = 'datecolumn';
                            format = 'd/M/Y';
                            break;
                        case 'enum':
                            xtype = 'enumcolumn';
                            enumType = item.Type;
                            break;
                    }
                }
                columns.push({
                    header: Ext.isEmpty(item.Header) ? item.Name : item.Header,
                    dataIndex: item.Name,
                    sortable: item.Sortable,
                    hidden: item.Hidden,
                    format: format,
                    xtype: xtype,
                    enumType: enumType
                });
            }, this);
            return columns;
        }
        return Karma.Factory.ColumnFactory.getGridColumnModel(this.entity.columns, true);
    },

    getGridControl: function() {
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns();
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
            xtype: (this.editable ? 'editorgrid' : 'grid'),
            id: this.getId() + '-grid',
            border: false,
            frame: false,
            columnLines: true,
            store: this.getStore(),
            cm: new Ext.grid.ColumnModel(columns),
            stripeRows: true,
            sm: sm,
            listeners: listeners,
            view: this.getGridView(),
            loadMask: true,
            plugins: plugins
        };

        this.grid = grid;

        return grid;
    },

    getTBarControls: function() {
        var base = this.getTBarBaseControls();
        var custommenus = this.getTBarCustomControls();
        Ext.each(custommenus, function(menu) {
            base.push(menu);
        }, this);
        return base;
    },

    getTBarBaseControls: function() {
        return [];
    },

    getTBarCustomControls: function() {
        return [];
    },

    getBbarControls: function() {
        return this.paginbar = new Karma.Ext.Grid.PagingToolbar({
            store: this.getStore(),
            displayInfo: true
        });
    },

    newRecord: function() {
        this.fireEvent('new');
    },

    openRecord: function(id) {
        this.fireEvent('open', id);
    },

    deleteRecord: function(id) {
        Ext.Msg.show({
            title: 'Eliminar',
            msg: 'Esta operaci&oacute;n es irreversible, desea continuar?',
            buttons: Ext.Msg.YESNO,
            fn: function(result) {
                if (result === 'yes') {
                    this.fireEvent('delete', id, {
                        fn: function() {
                            this.getStore().reload();
                            this.mask.hide();
                        },
                        scope: this
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this
        });
    },

    getMenuActions: function() {
        if (!this.submenus) {
            this.submenus = [this.openMenuAction = new Ext.menu.Item({
                iconCls: 'icon-window',
                text: 'Abrir...',
                scope: this,
                handler: function() {
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.openRecord(selected.get('Id'));
                }
            }), this.deleteMenuAction = new Ext.menu.Item({
                text: 'Eliminar...',
                iconCls: 'icon-minus',
                scope: this,
                handler: function() {
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.deleteRecord(selected.get('Id'));
                }
            }), '-', this.newMenuAction = new Ext.menu.Item({
                iconCls: 'icon-plus',
                text: 'Nuevo...',
                handler: function() {
                    PLOG.debug('[ListBase.onContextMenu.Nuevo]');
                    this.newRecord();
                },
                scope: this
            })];
        }
        return this.submenus;
    },

    onContextMenu: function(grid, rowIndex, e) {
        if (!this.menu) {
            var selections = grid.getSelectionModel().getSelections();
            menuActions = this.getMenuActions();
            if (!Ext.isEmpty(menuActions) && menuActions.length > 0) {
                this.menu = new Ext.menu.Menu({
                    items: menuActions
                });
            }
        }
        this.menu.showAt(e.getXY());
        e.preventDefault();
        this.fireEvent('any');
    },

    getPlugins: function(columns) {
        var plugins = new Array();
        Ext.each(columns, function(column, idx) {
            if (column.IsPlugin) {
                plugins.push(column);
            }
        }, this);
        return plugins;
    },

    processStore: function() { },

    getStore: function() {
        if (Ext.isEmpty(this.gridStore)) {
            this.gridStore = this.processStore();
            this.gridStore.on('load', function() {
                this.fireEvent('activity');
            }, this);
            this.gridStore.on('loadexception', function() {
                this.fireEvent('activity');
            }, this);
        }
        return this.gridStore;
    },

    updateControls: function(value) {
        // menu config
        if (!this.canOpen) {
            this.openMenuAction.disable();
        }
        if (!this.canDelete) {
            this.deleteMenuAction.disable();
        }
        if (!this.canNew) {
            this.newMenuAction.disable();
        }
    }

});

Ext.reg('Karma.list', Karma.List.ListBase);


Karma.List.SearchList = Ext.extend(Karma.List.ListBase, {

    combosField: 'Name',
    
    sortings: null,
    
    filters: null,
    
    title: 'Filtro de b&uacute;squeda',
    
    initComponent: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.initComponent] <-');
        }
        this.filters = this.metadata.Queries;
               
        this.query = this.filters[0];
        Karma.List.SearchList.superclass.initComponent.apply(this, arguments);
        if (!Ext.isEmpty(this.entity.customevents)) {
            this.addEvents(this.entity.customevents);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.initComponent] ->');
        }
    },
    
    getGridControl: function() { 
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns(Ext.isEmpty(this.query.Columns) ? null : this.query.Columns);
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
                xtype: 'grid',
                id: this.getId() + '-grid',
                border: false,
                frame: false,
				columnLines: true,
                store: this.getStore(),
                cm: new Ext.grid.ColumnModel(columns),
                stripeRows: true,
                sm: sm,
                listeners: listeners,
                view: this.getGridView(),
                loadMask: true,
                plugins: plugins
            };
        return grid;
    },

    getTBarBaseControls: function(){
        return ['Buscar: ', this.searchfield = new Ext.ux.SearchField({
            id: this.id + 'txtCriterio',
            anchor: '50%',
            store: this.getStore(),
			value: ''
        }), this.exportBtn = new Ext.Button({
            text: 'Exportar',
            handler: this.onExportExcel,
			iconCls: 'icon-export',
            scope: this,
            hidden: !this.entity.security.Export
        }), ' ', {
            xtype: 'tbseparator'
        }, ' ', {
            id: this.id + 'cmbVistas',
            xtype: 'combo',
            fieldLabel: 'Vista',
            displayField: this.combosField,
            valueField: 'Id',
            store: this.processViews(),
            forceSelection: true,
            triggerAction: 'all',
            editable: false,
            selectOnFocus: true,
            mode: 'local',
            value: this.views[0].Id,
            hidden: true
        }, '->', 'Filtro: ', this.cmbFilter = new Ext.form.ComboBox({
            width: '170px',
            fieldLabel: 'Filtro',
            forceSelection: true,
            selectOnFocus: true,
            editable: false,
            triggerAction: 'all',
            store: this.processFilters(),
            displayField: this.combosField,
            valueField: 'Id',
            mode: 'local',
            value: this.filters[0].Id,
            listeners: {
                'select': {
                    fn: this.onSelectFilter,
                    scope: this
                }
            }
        })];
    },
    
    getTBarCustomControls: function(){
        return ['->', this.newToolbarButton = new Ext.Button({
            text: 'Nuevo...',
            handler: this.newRecord,
			iconCls: 'icon-plus',
            scope: this,
            hidden: !(this.security.New && this.canNew)
        }), '|', ' '];
    },
    
    processFilters: function(){
        return new Ext.data.JsonStore({
            data: {
                filters: this.filters
            },
            root: 'filters',
            fields: [{
                name: 'Id'
            }, {
                name: this.combosField
            }]
        });
    },
    
    processViews: function(){
        return new Ext.data.JsonStore({
            data: {
                views: this.views
            },
            root: 'views',
            fields: [{
                name: 'Id'
            }, {
                name: this.combosField
            }, {
                name: 'Template'
            }]
        });
    },
    
    openRecord: function(id){
        this.fireEvent('open', id, null, null, {
            canUpdate: this.canUpdate
        });
    },
    
    processStore: function(){
        var _fields;
        if (Ext.isEmpty(this.query.Columns)) {
        	_fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        } 
        else {
	        _fields = this.getStoreColumns(this.query.Columns);
		}
        return Karma.Data.GroupingStore.create(this.service, _fields, null, {
            Query: this.query.Id,
            Criteria: '',
            Start: 0,
            PageSize: Karma.Conf.DefaultPageSize,
            Sorting: [{
                Field: this.sortings[0],
                Sort: 0
            }]
        });
    },
    
    onExportExcel: function(){
       var form = Ext.DomHelper.append(document.body, {
            id: 'export_form',
            tag: 'form',
            cls: 'x-hidden',
            method: 'GET',
            action: 'Service/Exporter',
            target: '_self',
            children: [
                { name: 'Service', tag: 'input', type: 'hidden', value: this.service },
                { name: 'Method', tag: 'input', type: 'hidden', value: Karma.Conf.FindMethod },
                { name: 'Parameters', tag: 'input', type: 'hidden', 
                    value: Ext.encode({
                        Query: this.cmbFilter.getValue(),
                        Criteria: this.searchfield.getValue(),
                        Start: 0,
                        PageSize: 0,
                        Sorting: [{
                            Field: this.sortings[0],
                            Sort: 0
                        }]
                    }) 
                }
            ]
        });
		form.submit();
    },
    
    onSelectFilter: function(record){
    	var queryId = this.cmbFilter.getValue();
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.onSelectFilter] <- Query ID: ' + queryId);
        }
        Ext.each(this.filters, function(item) {
            PLOG.debug('[SearchList.initComponent] Query item: -' + item.Id);
            if (item.Id == queryId) {
                this.setQuery(item);
                return false;
            }
        }, this);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.onSelectFilter] -> Query ID: ' + queryId);
        }
    },
    
    setQuery: function(query) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.setQuery] <- Query: ' + query.Id + ', Columns: ' + query.Columns);
        }
        if(!query) {
            return;
        }
        this.query = query;
        if(query.Columns) {
            this.reconfigureColumns(query.Columns);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.setQuery] -> Query: ' + query.Id + ', Columns: ' + query.Columns);
        }
    },
    
    reconfigureColumns: function(colDefinitions){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.reconfigureColumns] <- Columns: ' + colDefinitions);
        }
        this.columns = colDefinitions;
        this.gridStore = this.processStore();
        this.paginbar.bindStore(this.gridStore);
        this.searchfield.store = this.gridStore;
        var sl = Ext.getCmp(this.getId() + '-grid');
        sl.reconfigure(this.gridStore, new Ext.grid.ColumnModel(this.getGridColumns(colDefinitions)));
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchList.reconfigureColumns] -> Columns: ' + colDefinitions);
        }
    },

    updateControls: function(value){
        Karma.List.SearchList.superclass.updateControls.apply(this, arguments);
        if (!this.canNew) {
            this.newToolbarButton.disable();
        }
    }
    
});

Karma.SL = Karma.List.SearchList;

Ext.reg('Karma.searchlist', Karma.List.SearchList);



Karma.List.AggregateList = Ext.extend(Karma.List.ListBase, {
    entityName: null,
    entity: null,
    parentEntity: null,
    context: null,
    showSearch: false,
    isLoaded: false,
    canDrop: false,
    addBulk: true,
    highlightNewRows: true,
    lineEndRE: /\r\n|\r|\n/,
    sepRe: /\s*\t\s*/,
    excelValuesField: null,
    initComponent: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.initComponent] <- Entity Name: ' + this.entityName);
        }
        Karma.List.AggregateList.superclass.initComponent.apply(this, arguments);
        this.addEvents({ 'change': true, 'refresh': true });

        this.on('afterlayout', function() {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[AggregateList.afterlayout] <- Id: ' + this.id +
					', parentEntity: ' + this.parentEntity);
            }
            if (!this.isLoaded) {
                if (this.parentEntity != null && this.parentEntity.Id > 0) {
                    this.setContext(this.parentEntity);
                    this.getStore().reload();
                    this.isLoaded = true;
                    this.enable();
                } else {
                    if (this.parentEntity == null || this.parentEntity.Id == 0) {
                        this.disable();
                    }
                }
            }
        }, this);

        if (this.canDrop) {

            this.addEvents({
                'beforedatadrop': true,
                'datadrop': true,
                'afterdatadrop': true
            });

            Ext.apply(this.grid, {
                changeValueTask: {
                    run: function() {
                        this.dataDropped.call(this.grid, this, this.grid.excelValuesField.dom);
                    },
                    interval: 100,
                    scope: this
                },
                onResize: this.onResize.createSequence(this.resizeDropArea)
            });
            this.grid.view.afterRender = this.grid.view.afterRender.createSequence(this.onViewRender, this.grid);

        }

    },

    newRecord: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.newRecord] <-');
        }
        var reload = this.reload.createDelegate(this);
        this.entity.NewFromEntity(this.getParentParameters(), {
            flush: {
                fn: function(result, form) {
                    reload();
                }, scope: this
            }
        });
    },

    getParentParameters: function() {
        return { Id: this.parentEntity.Id };
    },

    openRecord: function(id) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.openRecord] <-');
        }
        if (!(this.canOpen && this.security.Open)) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[AggregateList.openRecord] User does not have permissions. Open: ' +
					this.security.Open + ', canOpen: ' + this.canOpen);
            }
            return;
        }
        var reload = this.reload.createDelegate(this);
        this.entity.Open(id, {
            'flush': {
                fn: function(win) {
                    reload();
                }
            },
            scope: this
        },
			null, {
			    canUpdate: this.canUpdate
			});
    },

    deleteRecord: function(id) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.deleteRecord] <-');
        }
        this.entity.Delete(id, {
            fn: function() {
                this.reload();
            },
            scope: this
        });
    },

    setParentEntity: function(v) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.setParentEntity] <- value: ' + v);
        }
        this.parentEntity = v;
        this.updateControls.createDelegate(this)(v);
        this.setContext(v);
        this.enable();
    },

    getParentEntity: function() {
        return this.parentEntity;
    },

    setContext: function(value) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.setContext] Id: ' + value);
        }
        if (!Ext.isEmpty(this.context) && value.Id > 0) {
            ;
            this.context = this.context.replace('?', value.Id);
            this.getStore().baseParams.Parameters.SubQuery = this.context;
        }
    },

    getTBarControls: function() {
        return [this.newToolbarButton = new Ext.Button({
            xtype: 'button',
            text: 'Agregar...',
            iconCls: 'icon-plus',
            handler: this.newRecord,
            scope: this
        }), this.exportBtn = new Ext.Button({
            text: 'Exportar',
            handler: this.onExportExcel,
            iconCls: 'icon-export',
            scope: this,
            hidden: ((!Ext.isEmpty(this.security)) ? !this.security.Export : true)
        }), '->', this.searchfield = new Ext.ux.SearchField({
            anchor: '50%',
            store: this.getStore(),
            value: ''
        })];
    },

    getGridControl: function() {
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns(Ext.isEmpty(this.query) ? null : this.query.Columns);
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
            xtype: 'grid',
            id: this.getId() + '-grid',
            border: false,
            columnLines: true,
            frame: false,
            store: this.getStore(),
            cm: new Ext.grid.ColumnModel(columns),
            stripeRows: true,
            sm: sm,
            listeners: listeners,
            view: this.getGridView(),
            loadMask: true,
            plugins: plugins
        };

        this.grid = grid;
        return grid;
    },

    processStore: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.processStore] <-' + this.id + ', Context: ' +
				this.context + ', Service: ' + this.service);
        }
        var _fields;
        if (Ext.isEmpty(this.query)) {
            _fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        }
        else {
            _fields = this.getStoreColumns(this.query.Columns);
        }
        var store = Karma.Data.GroupingStore.create(
			this.service, _fields, null, {
			    Query: this.query ? this.query.Id : this.metadata.LinkQuery,
			    SubQuery: this.context,
			    Criteria: '',
			    Start: 0,
			    PageSize: Karma.Conf.DefaultPageSize
			});
        return store;
    },

    reload: function() {
        this.getStore().baseParams.Parameters.SubQuery = this.context;
        this.getStore().reload();
        this.fireEvent('refresh');
    },

    onExportExcel: function() {
        var form = Ext.DomHelper.append(document.body, {
            id: 'export_form',
            tag: 'form',
            cls: 'x-hidden',
            method: 'GET',
            action: 'Service/Exporter',
            target: '_self',
            children: [
                { name: 'Service', tag: 'input', type: 'hidden', value: this.service },
                { name: 'Method', tag: 'input', type: 'hidden', value: Karma.Conf.FindMethod },
                { name: 'Parameters', tag: 'input', type: 'hidden',
                    value: Ext.encode({
                        Query: this.query ? this.query.Id : this.metadata.LinkQuery,
                        SubQuery: this.context,
                        Criteria: '',
                        Start: 0,
                        PageSize: 0
                    })
                }
            ]
        });
        form.submit();
    },

    updateControls: function(value) {
        Karma.List.AggregateList.superclass.updateControls.apply(this, arguments);
        // toolbar config
        if (!this.canNew) {
            this.newToolbarButton.disable();
        }
        if (!this.canDelete) {
            this.deleteMenuAction.disable();
        }
    },

    onMouseOverGrid: function() {

        if (this.canDrop) {
            resizeDropArea.call(this.grid);
        }

    },

    //  After the GridView has been rendered, insert a static transparent textarea over it.
    onViewRender: function() {
        var v = this.view;
        if (v.mainBody) {
            this.excelValuesField = Ext.DomHelper.insertAfter(v.scroller, {
                tag: 'textarea',
                id: Ext.id(),
                value: '',
                style: {
                    'font-size': '1px',
                    border: '0px none',
                    overflow: 'hidden',
                    color: '#fff',
                    position: 'absolute',
                    top: v.mainHd.getHeight() + 'px',
                    left: '0px',
                    'background-color': '#fff',
                    margin: 0,
                    cursor: 'default'
                }
            }, true);
            this.excelValuesField.setOpacity(0.1);
            this.excelValuesField.forwardMouseEvents();
            this.excelValuesField.on({
                mouseover: function() {
                    Ext.TaskMgr.start(this.changeValueTask);
                },
                mouseout: function() {
                    Ext.TaskMgr.stop(this.changeValueTask);
                },
                scope: this
            });
            resizeDropArea.call(this);
        }
    },

    resizeDropArea: function() {
        if (this.excelValuesField) {
            alert('ya chingue!');
            var v = this.view,
                sc = v.scroller,
                scs = sc.getSize,
                s = {
                    width: sc.dom.clientWidth || (scs.width - v.getScrollOffset() + 2),
                    height: sc.dom.clientHeight || scs.height
                };
            this.excelValuesField.setSize(s);
        }
    },

    //  on change of data in textarea, create a Record from the tab-delimited contents.
    dataDropped: function(e, el) {

        var nv = el.value;
        el.blur();
        if (nv !== '') {
            if (e.fireEvent('beforedatadrop', e, nv, el)) {

                var store = e.grid.store;
                var Record = store.recordType;
                el.value = '';

                var rows = nv.split(e.lineEndRE);
                var cols = e.grid.cm.getColumnsBy(function(c) {
                    return !c.hidden;
                });

                var fields = Record.prototype.fields;
                var recs = [];

                e.fireEvent('datadrop', e, rows);
                var idParentEntityValue = e.editor.entityId;

                if (cols.length && rows.length) {

                    var registros = new Array(rows.length - 1);

                    for (var i = 0; i < rows.length; i++) {

                        var vals = rows[i].split(e.sepRe);
                        var data = {};

                        if (vals.join('').replace(' ', '') !== '') {

                            var colsRegistro = new Array(vals.length);

                            for (var k = 0; k < vals.length; k++) {

                                var fldName = cols[k + 1].dataIndex;
                                var fld = fields.item(fldName);
                                data[fldName] = fld ? fld.convert(vals[k]) : vals[k];

                                colsRegistro[k] = vals[k];

                            }

                            registros[i] = colsRegistro;

                        }

                    }

                    var currentService = e.entity.service;
                    e.doSaveRecord(registros, currentService, idParentEntityValue);

                    resizeDropArea.call(this);
                    store.reload();

                }

            } else {
                this.excelValuesField.value = '';
            }

        }

    },

    doSaveRecord: function(registros, service, idPapa) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.doSaveRecord] <-');
        }

        this.editor.getForm().doAction('action.base', {
            operation: 'NewFromDrop',
            service: service,
            parameters: [registros, idPapa],
            success: function(form, action) {
                var result = action.result.Result;
                this.editor.status.setStatus({
                    text: 'Operacion realizada exitosamente',
                    clear: true
                });
                this.fireEvent('afterdatadrop');
                this.editor.status.clearStatus();
            },
            failure: function(form, action) {
                Ext.Msg.alert('Error', action.Result.ErrorMessage);
                this.editor.status.setStatus({
                    text: 'Ocurrio un error al guardar.',
                    clear: true
                });
            },
            scope: this
        });

        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[AggregateList.doSaveRecord] ->');
        }
    }

});

Karma.AL = Karma.List.AggregateList;
Ext.reg('ag.list', Karma.AL);


function resizeDropArea(){
    if (this.excelValuesField) {
        var v = this.view;
        var sc = v.scroller;
        var scs = sc.getSize;
        
        
        
        var s = {
            width: sc.dom.clientWidth || (scs.width - v.scrollOffset + 2),
            height: sc.dom.clientHeight || scs.height
        };
        this.excelValuesField.setSize(s);
    }
}


Karma.List.InPlaceEditableAggregateList = Ext.extend(Karma.List.AggregateList, {

    value: [],
    
    editable: true,
    
    Record: null,
    
    canNew: true,
    
    canUpdate: true,
    
    canDelete: true,
    
    isnew: false,
    
    initComponent: function(){
        this.entity = Karma.Core.ModuleManager.Instance.getEntity(this.entityName);
        this.security = this.entity.security;
        this.metadata = this.entity.metadata;
        if (!Ext.isEmpty(this.entity.inplacelist)) {
            Ext.apply(this, this.entity.inplacelist);
        }
        this.editable = (this.editable && this.canUpdate);
        Karma.List.InPlaceEditableAggregateList.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('change');
        if (Ext.isEmpty(this.value)) {
            this.value = new Array();
        }
    },

    specification: function(){
    },
    
    newRecord: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.newRecord] <-');
        }
        
        var grid = this.items.get(0);
        var record = this.specification();
        
        grid.stopEditing();
        
        this.gridStore.insert(0, new this.Record(record));
        
        grid.startEditing(0, 0);
        this.value.splice(0, 0, record);
        this.fireEvent('change');
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.newRecord] ->');
        }
    },
    
    deleteRecord: function(record){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.deleteRecord] <-');
        }
        var id = this.getStore().indexOf(record);
        this.value.splice(id, 1);
        this.gridStore.remove(record);
        this.fireEvent('change');
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[InPlaceEditableAggregateList.deleteRecord] ->');
        }
    },
    
    
    
    
    
    getMenuActions: function(selModel){
        var actions = [{
            text: 'Eliminar...',
            iconCls: 'delete-icon',
            scope: this,
            hidden: !this.canDelete,
            handler: function(){
                var selected = selModel.getSelected();
                this.deleteRecord(selected);
            }
        }, {
            iconCls: 'add-icon',
            text: 'Nuevo...',
            scope: this,
            hidden: !this.canNew,
            handler: function(){
                PLOG.debug('[InPlaceEditableAggregateList.onContextMenu.Nuevo]');
                this.newRecord();
            }
        }];
        var custActions = this.getCustomActions(selModel);
        if (!Ext.isEmpty(this.getCustomActions())) {
            for (var idx = 0; idx < custActions.length; idx++) {
                actions.push(custActions[idx]);
            }
        }
        return actions;
    },
    
    getTBarControls: function(){
        return [{
            xtype: 'button',
            text: 'Nuevo...',
            handler: this.newRecord,
            scope: this,
            hidden: !this.canNew
        }];
    },
    
    
    
    
    
	
    
    getCustomActions: function(selModel){
        return [];
    }
    
});

Karma.EAL = Karma.List.InPlaceEditableAggregateList;
Ext.reg('eag.list', Karma.EAL);


Karma.List.EntityList = Ext.extend(Karma.List.AggregateList, {
	
	selectContextSubQuery: '',
	
	singleSelectAdd: true,

    initComponent: function(){
        Karma.List.EntityList.superclass.initComponent.apply(this, arguments);
		this.addEvents({
			beforeadd: true,
			beforedelete: true
		});
    },
    
	getSelectContextSubQuery: function () {
		return this.selectContextSubQuery;
	},
	
	setSelectContextSubQuery: function (value) {
		this.selectContextSubQuery = value;
	},
	
    newRecord: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityList.onAddRecord] <-');
        }
		var linkSearch = {
            title: this.entityName,
            parameters: {
                entity: this.entity,
                metadata: this.metadata,
                security: this.security,
                service: this.service,
                canAdd: false,
				selectionMode: 'check',
				singleSelect: false,
				query: this.searchquery,
				subquery: this.getSelectContextSubQuery(this.parentEntity)
            },
            listeners: {
                'select': {
                    fn: this.onSelect,
                    scope: this
                }
            },
            allowMultiple: true
        };
		if (this.selectionConfig) {
			Ext.apply(linkSearch.parameters, this.selectionConfig);
		}
        Ext.ComponentMgr.create(linkSearch, 'entity.window');
    },
    
    deleteRecord: function(id){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityList.deleteRecord] <-' + id);
        }
		var record = this.getStore().getById(id);
        this.fireEvent('change');
        this.onBeforeDelete(id);
    },
    
    getTBarControls: function(){
        return [this.newToolbarButton = new Ext.Button({
            text: 'Agregar a la lista...',
			iconCls: 'icon-plus',
            handler: this.newRecord,
            scope: this
        })];
    },
    
    getMenuActions: function(selModel){
        if (!this.submenus) {
            this.submenus = [this.openMenuAction = new Ext.menu.Item({
                iconCls: 'icon-window',
                text: 'Abrir...',
                scope: this,
                handler: function() {
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.openRecord(selected.get('Id'));
                }
            }), this.deleteMenuAction = new Ext.menu.Item({
                text: 'Eliminar de la lista...',
                iconCls: 'icon-minus',
                scope: this,
                handler: function(){
                    var grid = Ext.getCmp(this.getId() + '-grid');
                    var selected = grid.getSelectionModel().getSelected();
                    this.deleteRecord(selected.get('Id'));
                }
            })];
        }
        return this.submenus;
    },
    
    onSelect: function(id, selected){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityList.onSelect] <-' + selected);
        }
        this.fireEvent('change');
        this.onBeforeAdd(id, selected, this.parentEntity);
    },
	
	onBeforeAdd: function (id, selected, parentEntity) { },
	
	onBeforeDelete: function (id, selected, parentEntity) { }
    
});

Karma.EntL = Karma.List.EntityList;
Ext.reg('entity.list', Karma.List.EntityList);



Karma.List.AggregateDataDropList = Ext.extend(Karma.List.AggregateList, {
    
    addBulk: true,
    highlightNewRows: true,
    lineEndRE: /\r\n|\r|\n/,
    sepRe: /\s*\t\s*/,
    excelValuesField: null,
    
    initComponent: function(){
    
        if (PLOG.isDebugEnabled()) {
			PLOG.debug('[AggregateDataDropList.initComponent] <- Entity Name: ' + this.entityName);
		}
		this.service = 'Cognitum.Dominio.Cobranza.IIntegracionPagoService';
        Karma.List.AggregateDataDropList.superclass.initComponent.apply(this, arguments);
        
        this.addEvents({
			'beforedatadrop': true,
            'datadrop': true,
            'afterdatadrop': true
		});
		
        
        
        if (PLOG.isDebugEnabled()) {
			PLOG.debug('[AggregateDataDropList.initComponent] -> Entity Name: ' + this.entityName);
		}
        
    },
    
    resizeDropArea: function(){
        if (this.excelValuesField) {
            var v = this.grid.view,
                sc = v.scroller,
                scs = sc.getSize,
                s = {
                    width: sc.dom.clientWidth || (scs.width - v.getScrollOffset() + 2),
                    height: sc.dom.clientHeight || scs.height
                };
            this.excelValuesField.setSize(s);
        }
    },

    //  on change of data in textarea, create a Record from the tab-delimited contents.
    dataDropped: function(e, el){
        var nv = el.value;
        el.blur();
        if (nv !== '') {
          if (this.fireEvent('beforedatadrop',this,nv,el)){
            var store = this.grid.getStore(), Record = store.recordType;
            el.value = '';
            var rows = nv.split(this.lineEndRE), cols = this.grid.getColumnModel().getColumnsBy(function(c){
                return !c.hidden;
            }), fields = Record.prototype.fields, recs = [];
            this.fireEvent('datadrop',this,rows);
            if (cols.length && rows.length) {
                for (var i = 0; i < rows.length; i++) {
                    var vals = rows[i].split(this.sepRe), data = {};
                    if (vals.join('').replace(' ', '') !== '') {
                        for (var k = 0; k < vals.length; k++) {
                            var fldName = cols[k].dataIndex;
                            var fld = fields.item(fldName);
                            data[fldName] = fld ? fld.convert(vals[k]) : vals[k];
                        }
                        var newRec = new Record(data);
                        recs.push(newRec);
                        if (!this.addBulk){
                          store.add(newRec);
                          if (this.highlightNewRows){
                            var idx = store.indexOf(newRec);
                            this.grid.view.focusRow(idx);
                            Ext.get(this.grid.view.getRow(idx)).highlight();
                          }
                        }
                    }
                }
                if (this.addBulk && recs && recs.length){
                  store.add(recs);
                  if (this.highlightNewRows){
                    for (var i = 0; i < recs.length; i++){
                      var idx = store.indexOf(recs[i]);
                      this.grid.view.focusRow(idx);
                      Ext.get(this.grid.view.getRow(idx)).highlight();
                    }
                  }
                }
                this.fireEvent('afterdatadrop',this,recs);
                this.resizeDropArea.call(this);
            }
          }else{
            this.excelValuesField.value = '';
          }
        }
    },
	
	onBeforeAdd: function (id, selected, parentEntity) { },
	
	onBeforeDelete: function (id, selected, parentEntity) { }

});

Karma.ADDL = Karma.List.AggregateDataDropList;
Ext.reg('dda.list', Karma.ADDL);


Karma.Controls.EnumComboBox = Ext.extend(Ext.form.ComboBox, {
	
	enumName: '',

	anchor:'90%',

	initComponent: function (){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumComboBox.initComponent] <-');
		}
		
		Ext.apply(this, {
			allowBlank:false,
			typeAhead: true,
			triggerAction: 'all',
			forceSelection:true,
			disableKeyFilter: true,
			displayField: 'Name',
			valueField: 'Id',
			autoShow: true,
			loadingText: 'cargando...',
			store: Karma.Data.EnumStore.create(this.enumName),
			mode: 'local',
			lazyInit: false
		});

		Karma.Controls.EnumComboBox.superclass.initComponent.apply(this, arguments);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumComboBox.initComponent] ->');
		}
	}
});

Karma.EComboBox = Karma.Controls.EnumComboBox;
Ext.reg('enum.combo', Karma.EComboBox);




Karma.Controls.EntityLinkSearch = Ext.extend(Karma.List.ListBase, {
	
	queryId: null,
	
	subquery: null,
	
	columns: null,
	
	entity: null,
	
	canAdd: true,
	
	ignoreTriggers: false,
	
	parameters: [],
	
	context: null,
	
	gridH: 200,

	initComponent: function(){
		Karma.Controls.EntityLinkSearch.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'select': true });
	},
	
	getTBarControls: function(){
		var buttons = [
            'Buscar: ', ' ',
            new Ext.ux.SearchField({
                store: this.getStore(),
                width: 250
            }),
			'->',{
				xtype: 'button',
				text: 'Nuevo...',
				handler: this.onNew,
				scope: this,
				hidden: !(this.security.New && this.canAdd)
			}
        ];
		if(!this.singleSelect) {
			buttons.push({
				xtype: 'button',
				text: 'Seleccionar',
				handler: this.onMultipleSelect,
				scope: this,
				buffer: 500
			});
		}
		return buttons;
	},
	
	processStore: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.processStore] <-' + this.id + ', Context: ' + 
				this.context + ', Service: ' + this.service);
		}
        var _fields;
        if (Ext.isEmpty(this.query)) {
        	_fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        } 
        else {
	        _fields = this.getStoreColumns(this.query.Columns);
		}
		var store = Karma.Data.GroupingStore.create(
			this.metadata.Service, _fields, null, {
			Query: this.query? this.query.Id: this.metadata.LinkQuery,
			SubQuery: this.subquery,
			Criteria: '',
			Start: 0,
			PageSize: Karma.Conf.DefaultPageSize });
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.processStore] ->');
		}
		return store;
	},

	getGridListeners: function(){
		return {
				'rowdblclick' : { fn: this.onRowDblClick, scope: this },
				'bodyresize' : { fn: function(){ this.syncSize(); }, scope: this} 
			};
	},
	
	onRowDblClick : function (grid, rowIndex, e){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onRowDblClicPLOG<-');
			PLOG.debug('row index: ' + rowIndex + ', row element: ' + 
				grid.getStore().getAt(rowIndex));
		}
		var data = grid.getStore().getAt(rowIndex).data;
		this.fireEvent('select', data.Id, data);
	},
	
	onContextMenu: function(){},
	
	onNew: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onNew] <-');
			PLOG.debug('[EntityLinkSearch.onNew] parameters: ' + this.parameters);
			PLOG.debug('[EntityLinkSearch.onNew] context: ' + this.context);
			PLOG.debug('[EntityLinkSearch.onNew] ignore triggers? ' + this.ignoreTriggers);
		}
		var me = this;
		var config = { 
			aftersave: {
				fn: function(entity){
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EntityLinkSearch.onNew] aftersave <-');
					}
					me.fireEvent('select', entity);
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EntityLinkSearch.onNew] aftersave ->');
					}
				}
			}, scope: this
		};
		var parameters = [];
		if (!Ext.isEmpty(this.parameters) && this.parameters.length > 0) {
			parameters = this.parameters;
		} else {
			parameters = new Array();
		}
		if (!Ext.isEmpty(this.context)) {
			parameters.push(this.context);
		}
		if (parameters.length == 0 || this.ignoreTriggers) {
			this.entity.link.New(config);
		}  else {
			this.entity.link.NewFromEntity(this.parameters, config);
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onNew] ->');
		}
	},
	
	reload: function() {
		this.getStore().baseParams.Parameters.SubQuery = this.subquery;
		this.getStore().reload();
	},
	
	onMultipleSelect: function(){
		var grid = this.findById(this.getId() + '-grid');
		var selected = grid.getSelectionModel().getSelections();
		var ids = new Array();
		var data = new Array();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkSearch.onMultipleSelect] Rows selected: ' + selected);
			Ext.each(selected, function(record) {
				PLOG.debug('[EntityLinkSearch.onMultipleSelect] row: ' + record.get('Id'));
			}, this);
		}
		Ext.each(selected, function(record) {
			ids.push(record.data.Id);
			data.push(record.data);
		}, this);
		if (!Ext.isEmpty(ids)) {
			this.fireEvent('select', ids, data);
		}
	}

});

Ext.reg('entity.search', Karma.Controls.EntityLinkSearch);


Karma.Controls.EntityLinkWindow = Ext.extend(Ext.Window, {

    parameters: null,
    
    columns: null,
    
    layout: 'form',
    
    border: true,
    
    closable: true,
    
    frame: true,
    
    autoShow: true,
    
    modal: true,
    
    minimizable: false,
    
    maximizable: false,
    
    plain: true,
    
    constrain: true,
    
    height: 350,        
    
    allowMultiple: false,
    
    initComponent: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.initComponent] <-');
        }
        var linkSearch = {
            xtype: 'entity.search',
            anchor: '100% 100%',
            listeners: {
                'select': {
                    fn: this.onSelect,
                    scope: this
                }
            }
        };
        Ext.apply(linkSearch, this.parameters);
        Ext.apply(this, {
            items: linkSearch
        });
        Karma.Controls.EntityLinkWindow.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
        this.doLayout();
        this.show();
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.initComponent] ->');
        }
    },
    
    onSelect: function(record){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.onSelect] <-');
        }
        this.fireEvent('select', record);
        if (!this.allowMultiple) {
            this.close();
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.onSelect] ->');
        }
    }
    
});

Ext.reg('entity.window', Karma.Controls.EntityLinkWindow);



Karma.Controls.EntityLink = Ext.extend(Ext.form.TwinTriggerField, {
	
	metadata: null,
	
	entity: null,
	
	entityName: null,
	
	entityValue: {},
	
	displayValue: null,
	
	contextTriggers: [],
	
	preContext: [],
	
	subquery: null,
	
	displayProperty: null,
	
	additionalProperties: [],
	
	ignoreTriggers: false,
	
	canAdd: true,
	
	typeAhead: false,
	
	hideTrigger1: false,

	hideTrigger2: false,

    trigger1Class:'x-form-open-trigger',

    trigger2Class:'x-form-search-trigger',
		
	enableKeyEvents: true,
	
	style: 'text-decoration: underline; color: blue; cursor: pointer;',
	
	initComponent: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.initComponent] <-');
			PLOG.debug('[EntityLink.initComponent] Entity name: [' + this.entityName + ']');
		}
		if (Ext.isObject(this.contextTriggers) && !Ext.isArray(this.contextTriggers)) {
			this.contextTriggers = [this.contextTriggers];
		}
		else {
			if (!Ext.isArray(this.contextTriggers)) {
				Ext.Msg.alert('EntityLink.Error', this.getName() + ' does not have a valid value on contextTriggers property.');
			}
		}
		if (Ext.isObject(this.preContext) && !Ext.isArray(this.contextTriggers)) {
			this.preContext = [this.preContext];
		}
		else {
			if (!Ext.isArray(this.preContext)) {
				Ext.Msg.alert('EntityLink.Error', this.getName() + ' does not have a valid value on preContext property.');
			}
		}
		if (this.readOnly) {
			this.hideTrigger2 = true;
		}
		this.entity = Karma.Core.ModuleManager.Instance.getEntity(this.entityName);
		Ext.apply(this, {
			autoShow : false,
			lazyInit: true,
			forceSelection: true
		});
		Karma.Controls.EntityLink.superclass.initComponent.apply(this, arguments);
		this.on('keydown', function(me, e){ 
			e.stopEvent(); 
		}, this);
		this.addEvents({ 
			set: true, 
			cleared: true, 
			change: true 
		});
	},
	
	processContextTriggers: function(form){
		Ext.each(this.contextTriggers, function(trigger){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processContextTrigger] <- Name: ' + this.getName() + ' the trigger id: ' + trigger.id);
			}
			var item = form.findField(trigger.id);
			item.on('set', this.triggerSet, this);
			item.on('cleared', this.triggerCleared, this);
			trigger.name = item.fieldLabel;
			trigger.isSet = false;
		}, this);
	},
	
	triggerCleared: function(elink, value) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.triggerCleared] <- Id: ' + elink.getName());
		}
		this.entityValue.set('Id', 0);
		Karma.Controls.EntityLink.superclass.setValue.call(this, '');

		Ext.each(this.contextTriggers, function(trigger){
			if (elink.getName() === trigger.name) {
				trigger.queryValue = trigger.query;
				trigger.isSet = false;
				trigger.Id = 0;
			}
		}, this);
	},
	
	triggerSet: function(elink, _id){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.triggerSet] <- Id: ' + elink.getName() + 
				', value: ' + _id);
		}
		this.clearValue();
		Ext.each(this.contextTriggers, function(trigger){
			if (elink.getName() === trigger.id) {
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[EntityLink.triggerSet] Trigger found [' + trigger.name + ']');
				}
				trigger.queryValue = trigger.query.replace('?', _id);
				trigger.isSet = true;
				trigger.Id = _id;
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[EntityLink.triggerSet] Query set [' + trigger.queryValue + ']');
				}
			}
		}, this);
	},
	
	isContextValid: function(){
		var allset = true;
		Ext.each(this.contextTriggers, function(trigger){
			if (!trigger.isSet) {
				allset = false;
			}
		}, this);
		return allset;
	},

	setEntityValue: function(val) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.setEntityValue] <- ' + this.getName());
		}
		this.entityValue = this.processEntity(val);
		var displayValue = this.processDisplayValue(this.entityValue);
		this.displayValue = Ext.isEmpty(displayValue) || displayValue == undefined? 'empty' : displayValue;
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.setEntityValue] Entity: ' + this.getName() + ', Property: ' +
				this.displayProperty + ', Field value: ' + this.displayValue);
		}
		Karma.Controls.EntityLink.superclass.setValue.call(this, this.displayValue);
		
		this.fireEvent('set', this, this.entityValue.get('Id'));
	},
	
	getEntityValue: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.getEntityValue] ');
		}
		if (Ext.isEmpty(this.entityValue) || Ext.isEmpty(this.entityValue.get) || 
			this.entityValue.get('Id') == 0) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.getEntityValue] entity value is empty...');
			}
			return null;
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.getEntityValue] ok, lets build the object with only the Id: ' + this.entityValue.get('Id'));
			}
			return { Id: this.entityValue.get('Id') };
		}
	},

	setValue: function(v) {
		if (!Ext.isEmpty(v)) {
			if (Ext.type(v) === 'object') {
				this.setEntityValue(v);
			}
			if (Ext.type(v) === 'string') {
				Karma.Controls.EntityLink.superclass.setValue.call(this, v);
			}
		} else {
			Karma.Controls.EntityLink.superclass.setValue.call(this, '');
		}
	},
	
	clearValue: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.clearValue] <-');
		}
		this.entityValue = null;
		if (this.isVisible()) {
			Karma.Controls.EntityLink.superclass.setRawValue.call(this, '');
		} else {
			Karma.Controls.EntityLink.superclass.setValue.call(this, '');
		}
		this.fireEvent('cleared');
	},
	
	getValue: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.getValue] ' + this.entityName + ', ' + this.name);
		}
		return this.getEntityValue();
	},
	
	getRawValue: function() {
		if (Ext.isEmpty(this.entityValue) || Ext.isEmpty(this.entityValue.get) || 
			this.entityValue.get('Id') == 0) {
			return null;
		} else {
			return this.entityValue;
		}
	},
	
	onTrigger2Click: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.onTrigger1Click] <-');
		}
		if (this.disabled) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger1Click] sorry, it is disabled.');
			}
			return;
		}
		if (this.isContextValid()){
			var subquery = '';
			var parameters = new Array();
			for(var idx = 0; idx < this.contextTriggers.length; idx++) {
				subquery += this.contextTriggers[idx].queryValue;
				parameters.push({
					Id: this.contextTriggers[idx].Id
				});
				if (idx < this.contextTriggers.length - 1) {
					subquery += ' and ';
				}
			}

			if (this.contextTriggers.length >= 1 && this.preContext.length >= 1) {
				subquery += ' and ';
			}

			for(var idx = 0; idx < this.preContext.length; idx++) {
				subquery += this.preContext[idx].query;
				if (!Ext.isEmpty(this.preContext[idx].Id)) {
					parameters.push({
						Id: this.preContext[idx].Id
					});
				} 
				if (!Ext.isEmpty(this.preContext[idx].value)) {
					parameters.push(this.preContext[idx].value);
				} 
				if (idx < this.preContext.length - 1) {
					subquery += ' and ';
				}
			}

			if ((this.contextTriggers.length >= 1 || this.preContext.length >= 1) && this.subquery != null) {
				subquery += ' and ' + this.subquery;
			}

			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger1Click] The subQuery: ' + subquery);
				PLOG.debug('[EntityLink.onTrigger1Click] Parameters: ' + parameters);
			}
			Ext.ComponentMgr.create({
				title: this.fieldLabel,
				parameters: {
					entity: this.entity,
					parameters: parameters,
					ignoreTriggers: this.ignoreTriggers,
					canAdd : this.canAdd,
					subquery: subquery
				},
				listeners: {
					'select': {
						fn: this.onSelect,
						scope: this
					}
				}
			}, 'entity.window');
		} else {
			var msg = 'Falta especificar: ';
			for(var idx = 0; idx < this.contextTriggers.length; idx++) {
				if (!this.contextTriggers.isSet) {
					msg += this.contextTriggers[idx].name;
					if (idx <= this.contextTriggers.lenght - 1) {
						msg += ', ';
					}
				}
			}
			this.markInvalid(msg);
		}
	},
	
	onTrigger1Click: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.onTrigger2Click] <-');
		}
		if (this.disabled) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger2Click] sorry, it is disabled.');
			}
			return;
		}
		if(Ext.isEmpty(this.entityValue) || Ext.isEmpty(this.entityValue.get) || 
			this.entityValue.get('Id') == 0) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger2Click] sorry, it is null or empty.');
			}
			return;
		}
		this.entity.link.Open(this.entityValue.get('Id'));
	},
	
	onSelect: function(record){
		this.entityValue = this.processEntity(record);
		this.displayValue = this.processDisplayValue(this.entityValue);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.onSelect] Entity: ' + this.getName() + ', Property: ' +
				this.displayProperty + ', Field value: ' + this.displayValue);
		}
		Karma.Controls.EntityLink.superclass.setValue.call(this, this.displayValue);
		this.fireEvent('set', this, this.entityValue.get('Id'), this.entityValue);
		this.fireEvent('change', this, this.entityValue.get('Id'), this.entityValue);
	},
	
	processEntity: function(val) {
		var entity;
		if (Ext.isEmpty(val.get)) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processEntity] create new Record...');
			}
			Record = Ext.data.Record.create(this.entity.columnstore);
			entity = new Record(val, val.Id);
			entity.json = val;
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processEntity] the value is a record...');
			}
			entity = val;
		}
		return entity;
	},
	
	processDisplayValue: function(entity) {
		var val = '';
		if (Ext.type(this.entity.link.displayProperty) === 'string') {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processDisplayValue] displayProperty is string...');
			}
			val = entity.get(this.entity.link.displayProperty);
		} else 
		if (Ext.type(this.entity.link.displayProperty) === 'object') {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processDisplayValue]  displayProperty is XTemplate...');
			}
			val = this.entity.link.displayProperty.apply(entity.data);
		} 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Entity.getDisplayProperty] display value : [' + this.entity.link.displayProperty + 
				'] from entity:' + val);
		}
		return val;
	},
	
	validateValue: function() {
		var valid;
		if (this.allowBlank) {
			valid = true;
		}
		else {
			valid = this.getEntityValue() != null;
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.validateValue] :' + valid);
		}
		return valid;
	}
	
});

//Karma.EL = Karma.Controls.EntityLink;
//Ext.reg('entity.link', Karma.EL);


Karma.Controls.EntityLinkCombo = Ext.extend(Ext.form.ComboBox, {

    entityName: null,
    
    contextTriggers: [],
    
    preContext: [],
    
    subquery: null,
    
    displayProperty: null,
    
    additionalProperties: [],
    
    ignoreTriggers: false,
    
    canAdd: true,
    
    enableKeyEvents: true,
    
    minChars: 0,
    
    searchTriggerClass: 'x-elink-search-trigger',
    
    openTriggerClass: 'x-elink-open-trigger',
    
	currentBehavior: 'search',
	
    valueField: 'Id',
    
    typeAhead: false,
    
    editable: true,
    
    loadingText: 'Buscando...',
    
    hideTrigger: false,
    
    minListWidth: 300,
    
    itemSelector: 'div.search-item',
    
    pageSize: Karma.Conf.DefaultPageSize,
	
	disabled: false,
    
    initComponent: function(){
		if(!this.entity) {
	        this.entity = Karma.Core.ModuleManager.Instance.getEntity(this.entityName);
	        this.metadata = this.entity.metadata;
	        this.security = this.entity.security;
	        this.columnstore = this.entity.columnstore;
		}
        
        if (Ext.isObject(this.contextTriggers) && !Ext.isArray(this.contextTriggers)) {
            this.contextTriggers = [this.contextTriggers];
        }
        else {
            if (!Ext.isArray(this.contextTriggers)) {
                Ext.Msg.alert('EntityLinkCombo.Error', this.getName() + 
					' does not have a valid value on contextTriggers property.');
            }
        }
        if (Ext.isObject(this.preContext) && !Ext.isArray(this.contextTriggers)) {
            this.preContext = [this.preContext];
        }
        else {
            if (!Ext.isArray(this.preContext)) {
                Ext.Msg.alert('EntityLinkCombo.Error', this.getName() + 
					' does not have a valid value on preContext property.');
            }
        }
        
        var tpl;
        if (this.entity.link.tpl) {
            tpl = this.entity.link.tpl;
        }
        else {
            if (Ext.type(this.entity.link.displayProperty) === 'object') {
                tpl = this.entity.link.displayProperty.html;
            }
            else {
                tpl = '{' + this.entity.link.displayProperty + '}';
            }
        }
        var _fields;
        if (Ext.isEmpty(this.query)) {
        	_fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        } 
        else {
	        _fields = this.getStoreColumns(this.query.Columns);
		}
        Ext.apply(this, {
            store: Karma.Data.JsonStore.create(this.metadata.Service, _fields, {
                Query: this.query? this.query.Id: this.metadata.LinkQuery,
                SubQuery: this.subquery,
                Criteria: '',
                Start: 0,
                PageSize: Karma.Conf.DefaultPageSize
            }),
            displayField: this.entity.link.displayProperty,
            tpl: new Ext.XTemplate(
				'<tpl for="."><div class="{[xindex%2===0?"search-row-item":"search-row-item-alt"]}">', 
				'<div class="search-item">' + tpl + '</div></div></tpl>'),
            listeners: {
                keyup: {
                    fn: this.onKeyUp,
                    scope: this
                },
                keydown: {
                    fn: this.onKeyDown,
                    scope: this
                }
            }
        });
        Karma.Controls.EntityLinkCombo.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            set: true,
            cleared: true,
            change: true
        });
        
        if (!Ext.isEmpty(this.security)) {
		    this.canAdd = this.canAdd && this.security.New;
		} else {
		    this.canAdd = false;
		}
		
        this.triggerConfig = {
            tag: 'span',
            cls: 'x-form-twin-triggers',
            cn: [{
                tag: 'img',
                src: Ext.BLANK_IMAGE_URL,
                cls: 'x-form-trigger x-elink-new-trigger'
            }, {
                tag: 'img',
                src: Ext.BLANK_IMAGE_URL,
                cls: 'x-form-trigger x-elink-search-trigger'
            }, {
                tag: 'img',
                src: Ext.BLANK_IMAGE_URL,
                cls: 'x-form-trigger x-elink-clear-trigger'
            }]
        };
    },
	
    onRender: function(index){
        Karma.Controls.EntityLinkCombo.superclass.onRender.apply(this, arguments);
		if(this.disabled) {
			this.triggers[0].addClass('x-hide-display');
			this.triggers[1].addClass('x-hide-display');
			this.triggers[2].addClass('x-hide-display');
		}
		else if(!this.canAdd) {
			this.triggers[0].addClass('x-hide-display');
		}
    },
	
    getTrigger: function(index){
        return this.triggers[index];
    },

    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
	        t.hide = function(){
	            var w = triggerField.wrap.getWidth();
	            this.dom.style.display = 'none';
	            triggerField.el.setWidth(w-triggerField.trigger.getWidth());
	        };
	        t.show = function(){
	            var w = triggerField.wrap.getWidth();
	            this.dom.style.display = '';
	            triggerField.el.setWidth(w-triggerField.trigger.getWidth());
	        };
	        var triggerIndex = 'Trigger'+(index+1);
	
	        if(this['hide'+triggerIndex]){
	            t.dom.style.display = 'none';
	        }
	        t.on("click", this['on'+triggerIndex+'Click'], this, {preventDefault:true});
	        t.addClassOnOver('x-form-trigger-over');
	        t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    onTrigger1Click: function() {
		if(this.disabled) {
			return;
		}
		this.onNew()
	},
	
    onTrigger2Click: function() {
        switch (this.currentBehavior) {
            case 'search':
				if(this.disabled) return;
                this.initQuery();
                break;
            case 'open':
                this.onOpen();
                break;
            default:
				if(this.disabled) return;
                this.initQuery();
        }
	},
    
    onTrigger3Click: function() {
		if(this.disabled) {
			return;
		}
		this.clearValue()
	},
    
    doQuery: function(q, forceAll){
        if (this.isContextValid()) {
            PLOG.debug('[EntityLinkCombo.doQuery] [' + this.getName() + '] query:' + q);
            q = Ext.isEmpty(q) ? '' : q;
            var qe = {
                query: q,
                forceAll: forceAll,
                combo: this,
                cancel: false
            };
            if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
                return false;
            }
            q = qe.query;
            forceAll = qe.forceAll;
            if (forceAll === true || (q.length >= this.minChars)) {
                if (this.lastQuery !== q) {
                    this.lastQuery = q;
                    if (this.mode == 'local') {
                        this.selectedIndex = -1;
                        if (forceAll) {
                            this.store.clearFilter();
                        }
                        else {
                            this.store.filter(this.displayField, q);
                        }
                        this.onLoad();
                    }
                    else {
                        this.store.baseParams.Parameters.Criteria = q;
                        this.store.baseParams.Parameters.SubQuery = this.buildSubQuery();
                        this.store.baseParams.Parameters.PageSize = this.pageSize ? this.pageSize : Karma.Conf.DefaultPageSize;
                        this.store.reload();
                        this.expand();
                    }
                }
                else {
                    this.selectedIndex = -1;
                    this.onLoad();
                }
            }
        }
    },
    
    setValue: function(val){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.setValue] [' + this.getName() + '] set value : [' + val + ']');
        }
        if (Ext.isEmpty(val)) return;
		
		this.setText(val);
        this.value = val;
        
        this.setTriggerBehavior('open');
		this.disableNew();
        this.fireEvent('set', this, val.Id, val);
    },
    
    setText: function(val){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.setText]  [' + this.getName() + '] <-');
		}
        var text = this.processDisplayValue(val);
        this.lastSelectionText = text;
        this.el.dom.value = (Ext.isEmpty(text) ? '' : text);
    },
    
    clearValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.clearValue]  [' + this.getName() + '] <-');
		}
        Karma.Controls.EntityLinkCombo.superclass.clearValue.apply(this, arguments);
        delete this.value;
        
        this.setTriggerBehavior('search');
		this.enableNew();
        this.fireEvent('cleared', this);
    },
    
    getValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.getValue]  [' + this.getName() + '] <-' +  this.value);
		}
        return Ext.isEmpty(this.value) ? null : {
            Id: this.value.Id
        };
    },
    
    getEntityValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.getEntityValue]  [' + this.getName() + '] <-' + this.value);
		}
        return this.value;
    },
    
    onSelect: function(record, index){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.onSelect]  [' + this.getName() + '] <-');
		}
        if (this.fireEvent('beforeselect', this, record, index) !== false) {
            this.setValue(record.data);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
        this.fireEvent('change', this, record.get('Id'), record.data);
    },
    
    findRecord: function(value){
        var record;
        if (this.store.getCount() > 0) {
            this.store.each(function(r){
                var text = this.processDisplayValue(r.data);
                if (text == value) {
                    record = r;
                    return false;
                }
            }, this);
        }
        return record;
    },
    
    beforeBlur: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.beforeBlur]  [' + this.getName() + '] <-');
		}
		if(this.disabled) return;
		
        var val = this.getRawValue();
        var rec = this.findRecord(val);
        if (Ext.isEmpty(rec)) {
			// set last value if exist
			if(Ext.isEmpty(this.value)) {
				this.clearValue();
			} else {
				this.setText(this.value);
			}
        }
        else {
            val = rec.data;
            this.setValue(val);
        }
    },
    
    initList: function(){
        if (!this.list) {
            var cls = 'x-combo-list';
            
            this.list = new Ext.Layer({
                parentEl: this.getListParent(),
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain: false
            });
            
            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if (this.syncFont !== false) {
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if (this.title) {
                this.header = this.list.createChild({
                    cls: cls + '-hd',
                    html: this.title
                });
                this.assetHeight += this.header.getHeight();
            }
            
            this.innerList = this.list.createChild({
                cls: cls + '-inner'
            });
            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
            this.mon(this.innerList, 'mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
            
            if (this.pageSize) {
                this.footer = this.list.createChild({
                    cls: cls + '-ft'
                });
                this.pageTb = new Karma.Ext.Grid.PagingToolbar({
                    store: this.store,
                    displayInfo: true,
                    renderTo: this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }
            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
                emptyText: this.listEmptyText
            });
            
            this.mon(this.view, 'click', this.onViewClick, this);
            
            this.bindStore(this.store, true);
            
            if (this.resizable) {
                this.resizer = new Ext.Resizable(this.list, {
                    pinned: true,
                    handles: 'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
                
                this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
            }
        }
    },
    
    onEmptyResults: function(){
        this.innerList.update('<div class="loading-indicator">No se encontraron registros</div>');
        this.restrictHeight();
        this.selectedIndex = -1;
    },
    
    processDisplayValue: function(v){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.processDisplayValue]  [' + this.getName() + '] get displayProperty for :' + v);
        }
        var val = '';
        if (Ext.type(this.entity.link.displayProperty) === 'string') {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[EntityLinkCombo.processDisplayValue] displayProperty is string...[' +
                this.entity.link.displayProperty +
                ']');
            }
            val = v[this.entity.link.displayProperty];
        }
        else 
            if (Ext.type(this.entity.link.displayProperty) === 'object') {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[EntityLinkCombo.processDisplayValue]  displayProperty is XTemplate...[' +
                    this.entity.link.displayProperty.html +
                    ']');
                }
                val = this.entity.link.displayProperty.apply(v);
            }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.processDisplayValue] display value : ' + val);
        }
        return val;
    },
    
    processContextTriggers: function(form){
        Ext.each(this.contextTriggers, function(trigger){
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[EntityLinkCombo.processContextTrigger] [' + this.getName() + '] <- the trigger id: ' + trigger.id);
            }
            var item = form.findField(trigger.id);
            item.on('set', this.triggerSet, this);
            item.on('cleared', this.triggerCleared, this);
            trigger.name = item.fieldLabel;
            trigger.isSet = false;
        }, this);
    },
    
    triggerCleared: function(elink, value){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.triggerCleared]  [' + this.getName() + '] <- ');
        }
        this.clearValue();
        
        Ext.each(this.contextTriggers, function(trigger){
            if (elink.getName() === trigger.name) {
                trigger.queryValue = trigger.query;
                trigger.isSet = false;
                trigger.Id = 0;
            }
        }, this);
    },
    
    triggerSet: function(elink, _id){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.triggerSet]  [' + this.getName() + '] <- ' +
            ',trigger Id: ' +
            elink.getName() +
            ', value: ' +
            _id);
        }
        this.clearValue();
        Ext.each(this.contextTriggers, function(trigger){
            if (elink.getName() === trigger.id) {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[EntityLinkCombo.triggerSet] Trigger found [' + trigger.name + ']');
                }
                trigger.queryValue = trigger.query.replace('?', _id);
                trigger.isSet = true;
                trigger.Id = _id;
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[EntityLinkCombo.triggerSet] Query set [' + trigger.queryValue + ']');
                }
            }
        }, this);
    },
    
    isContextValid: function(){
        var allset = true;
        Ext.each(this.contextTriggers, function(trigger){
            if (!trigger.isSet) {
                allset = false;
            }
        }, this);
        return allset;
    },
    
    validateValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.validateValue]  [' + this.getName() + '] <-');
		}
        var valid;
        if (this.allowBlank) {
            valid = true;
        }
        else {
            valid = this.getValue() != null;
        }
        return valid;
    },
    
    onKeyUp: function(e){
        if (e.ctrlKey && e.getKey() == 65 || e.ctrlKey && e.getKey() == 97) {
            e.stopEvent();
            e.preventDefault();
            this.onOpen();
        }
        if (this.disabled) {
            e.stopEvent();
            e.preventDefault();
            return;
        }
        if (e.ctrlKey && e.getKey() == 32) {
            e.stopEvent();
            e.preventDefault();
            this.initQuery();
        }
        if (e.ctrlKey && e.getKey() == 78 || e.ctrlKey && e.getKey() == 110) {
            e.stopEvent();
            e.preventDefault();
            this.onNew();
        }
        
        if (e.getKey() >= 48 && e.getKey() <= 122) {
			this.setTriggerBehavior('search');
		}
    },
    
    onKeyDown: function(e){
		PLOG.debug('[EntityLinkCombo.beforeBlur]  [' + this.getName() + '] key code: ' + e.getKey());
        if (this.disabled && (e.getKey() == 8 || e.getKey() == 32)){
            e.stopEvent();
            e.preventDefault();
            return;
        }
        if (this.isContextValid()) {
            if (e.ctrlKey && e.getKey() == 32 || e.ctrlKey && e.getKey() == 78 ||
            e.ctrlKey && e.getKey() == 110 ||
            e.ctrlKey && e.getKey() == 65 ||
            e.ctrlKey && e.getKey() == 97) {
                e.stopEvent();
            }
        }
        else {
            this.markInvalid();
        }
    },
    
    disable: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.disable]  [' + this.getName() + '] <-');
		}
		
		this.triggers[0].addClass('x-hide-display');
		if(!this.value) {
			this.triggers[1].addClass('x-hide-display');
		}
		this.triggers[2].addClass('x-hide-display');
        this.disabled = true;
		this.addClass('x-item-disabled');
    },
    
    enable: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.enable]  [' + this.getName() + '] <-');
		}
		this.triggers[0].removeClass('x-hide-display');
		this.triggers[1].removeClass('x-hide-display');
		this.triggers[2].removeClass('x-hide-display');
        this.disabled = false;
		this.removeClass('x-item-disabled');
    },
    
    setDisabled: function(disabled){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.setDisabled]  [' + this.getName() + '] <-' + disabled);
		}
		if(disabled) {
			this.disable();
		} else {
			this.enable();
		}
    },
    
    onOpen: function(){
        if (Ext.isDefined(this.value)) {
            this.entity.link.Open(this.value.Id);
        }
    },
    
    onNew: function(){
        if (this.disabled || !this.canAdd) {
            return;
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkSearch.onNew] [' + this.getName() + '] ');
            PLOG.debug('[EntityLinkSearch.onNew] parameters: ' + this.parameters);
            PLOG.debug('[EntityLinkSearch.onNew] context: ' + this.context);
            PLOG.debug('[EntityLinkSearch.onNew] ignore triggers? ' + this.ignoreTriggers);
        }
        var delegate = this.setValue.createDelegate(this);
        var config = {
            aftersave: {
                fn: function(entity){
                    delegate(entity);
                }
            },
            scope: this
        };
        var parameters = this.buildParameters();
        if (Ext.isEmpty(parameters) || parameters.length == 0) {
            parameters = new Array();
        }
        if (!Ext.isEmpty(this.context)) {
            parameters.push(this.context);
        }
        if (parameters.length == 0 || this.ignoreTriggers) {
            this.entity.link.New(config);
        }
        else {
            this.entity.link.NewFromEntity(parameters, config);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkSearch.onNew] ->');
        }
    },
    
    markInvalid: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.markInvalid]  [' + this.getName() + '] <-');
		}
        if (this.contextTriggers.length == 0 || this.isContextValid()) {
            Karma.Controls.EntityLinkCombo.superclass.markInvalid.call(this);
            return;
        }
        var msg = 'Falta especificar: ';
        for (var idx = 0; idx < this.contextTriggers.length; idx++) {
            if (!this.contextTriggers.isSet) {
                msg += this.contextTriggers[idx].name;
                if (idx <= this.contextTriggers.lenght - 1) {
                    msg += ', ';
                }
            }
        }
        Karma.Controls.EntityLinkCombo.superclass.markInvalid.call(this, msg);
    },
    
    buildSubQuery: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.buildSubQuery]  [' + this.getName() + '] <-');
		}
        var subquery = '';
        if (!this.ignoreTriggers) {
            for (var idx = 0; idx < this.contextTriggers.length; idx++) {
                subquery += this.contextTriggers[idx].queryValue;
                if (idx < this.contextTriggers.length - 1) {
                    subquery += ' and ';
                }
            }
        }
        if (subquery != '' && this.preContext.length >= 1) {
            subquery += ' and ';
        }
        for (var idx = 0; idx < this.preContext.length; idx++) {
            subquery += this.preContext[idx].query;
            if (idx < this.preContext.length - 1) {
                subquery += ' and ';
            }
        }
        if ((this.contextTriggers.length >= 1 || this.preContext.length >= 1) && this.subquery != null) {
            subquery += ' and ' + this.subquery;
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLink.onTrigger1Click] The subQuery: ' + subquery);
        }
        return subquery;
    },
    
    buildParameters: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.buildParameters]  [' + this.getName() + '] <-');
		}
        var parameters = new Array();
        if (!this.ignoreTriggers) {
            for (var idx = 0; idx < this.contextTriggers.length; idx++) {
                parameters.push({
                    Id: this.contextTriggers[idx].Id
                });
            }
        }
        for (var idx = 0; idx < this.preContext.length; idx++) {
            if (!Ext.isEmpty(this.preContext[idx].Id)) {
                parameters.push({
                    Id: this.preContext[idx].Id
                });
            }
            if (!Ext.isEmpty(this.preContext[idx].value)) {
                parameters.push(this.preContext[idx].value);
            }
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLink.buildParameters] Parameters: ' + parameters);
        }
        return parameters;
    },
    
    changeIcon: function(iconCls){
        this.getTrigger(1).removeClass(this.currentTriggerClass);
        this.getTrigger(1).addClass(iconCls);
        this.currentTriggerClass = iconCls;
    },
    
    setTriggerBehavior: function(behavior){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.setTriggerBehavior]  [' + this.getName() + '] current behavior: ' +
            	this.currentBehavior + ', new behavior: ' + behavior);
        }
        if (this.currentBehavior == behavior) 
            return;
        
        switch (behavior) {
            case 'search':
                this.changeIcon(this.searchTriggerClass);
                break;
            case 'open':
                this.changeIcon(this.openTriggerClass);
                break;
        }
        
        this.currentBehavior = behavior;
    },
	
	disableNew: function() {
		if(!this.canAdd) return;
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.disableNew]  [' + this.getName() + '] <-');
		}
		this.triggers[0].addClass('x-hide-display');
	},
	
	enableNew: function() {
		if(!this.canAdd) return;
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.enableNew]  [' + this.getName() + '] <-');
		}
		this.triggers[0].removeClass('x-hide-display');
	}
    
});
Karma.EL = Karma.Controls.EntityLinkCombo;
Ext.reg('entity.link', Karma.Controls.EntityLinkCombo);




Karma.Tools.Importer.MainForm = Ext.extend(Ext.Window, {

    title: 'Importador',
    
    width: 450,
    
    height: 300,
    
    modal: true,
    
    initComponent: function(){
        var store = new Karma.Data.JsonStore({
            proxy: new Karma.Data.HttpProxy({
                url: Karma.Conf.ServiceInvoker,
                method: 'POST'
            }),
            baseParams: {
                Service: Karma.Conf.ImporterService,
                Method: Karma.Conf.ImporterEntitiesMethod,
                Parameters: null,
                Depth: 2
            },
            autoLoad: true,
            autoSave: false,
            reader: new Ext.data.JsonReader({
                root: 'Result',
                successProperty: 'Success',
                idProperty: 'FullName',
                fields: [{
                    name: 'Name',
                    type: 'string'
                }, {
                    name: 'FullName',
                    type: 'string'
                }]
            })
        });
        
        Ext.apply(this, {
            layout: 'fit',
            bbar: new Ext.ux.StatusBar({
                id: 'importerStatusbar',
                defaultText: '',
                busyText: 'Procesando...'
            }),
            items: [{
                xtype: 'tabpanel',
                activeItem: 0,
                items: [{
                    title: 'Generar Layout',
                    xtype: 'form',
                    frame: true,
                    border: true,
                    labelWidth: 140,
                    defaults: {
                        anchor: '95%',
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'combo',
                        id: 'cmbEntities',
                        fieldLabel: 'Seleccione la entidad',
                        emptyText: 'Seleccione una entidad...',
                        displayField: 'Name',
                        valueField: 'FullName',
                        allowBlank: false,
                        mode: 'local',
                        forceSelection: true,
                        disableKeyFilter: true,
						triggerAction: 'all',
                        store: store
                    }],
                    buttons: [{
                        text: 'Generar Layout',
                        handler: function(){
                            var prevent = window.onbeforeunload;
                            window.onbeforeunload = null;
                            
                            var cmb = this.findById('cmbEntities');
                            var entity = cmb.getValue();
                            Ext.getCmp('importerStatusbar').setStatus({
                                text: 'Generando layout',
                                iconCls: 'ok-icon',
                                clear: true
                            });
                            var body = Ext.getBody();
                            var frame = body.createChild({
                                tag: 'iframe',
                                cls: 'x-hidden',
                                id: 'download_layout_iframe',
                                name: 'iframe'
                            });
                            var form = body.createChild({
                                tag: 'form',
                                method: 'GET',
                                cls: 'x-hidden',
                                id: 'download_layout_form',
                                action: 'Service/Importer/' + entity,
                                target: '_self'
                            });
                            form.dom.submit();
                            window.onbeforeunload = prevent;
                        },
                        scope: this
                    }]
                }, {
                    title: 'Importar archivo',
                    xtype: 'form',
                    id: 'layoutUploadForm',
                    fileUpload: true,
                    monitorValid: true,
                    frame: true,
                    border: true,
                    labelWidth: 120,
                    defaults: {
                        anchor: '95%',
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'combo',
                        id: 'cmbUploadEntities',
                        fieldLabel: 'Seleccione la entidad',
                        emptyText: 'Seleccione una entidad...',
                        displayField: 'Name',
                        valueField: 'FullName',
                        allowBlank: false,
                        mode: 'local',
                        forceSelection: true,
                        disableKeyFilter: true,
						triggerAction: 'all',
                        store: store
                    }, {
                        xtype: 'fileuploadfield',
                        allowBlank: false,
                        fieldLabel: 'Archivo de datos',
						buttonCfg: {
			                iconCls: 'upload-icon'
			            }
                    }, {
                        xtype: 'checkbox',
                        hideLabel: true,
                        boxLabel: 'Actualizar registros existentes? (sobreescritura)'
                    }],
                    buttons: [{
                        text: 'Importar archivo',
                        handler: function(){
                            Ext.getCmp('importerStatusbar').setStatus({
                                text: 'Procesando layout',
                                iconCls: 'ok-icon',
                                clear: true
                            });
							var cmb = this.findById('cmbUploadEntities');
                            var entity = cmb.getValue();
                            var form = this.findById('layoutUploadForm');
                            Ext.Ajax.request({
                                url: 'Service/Importer/' + entity,
                                method: 'POST',
                                form: form.getForm().getEl(),
                                isUpload: true,
                                success: function(response, opts){
                                    var result = Ext.decode(response.responseText);
                                    if (result.Success) {
	                                    Ext.getCmp('importerStatusbar').setStatus({
	                                        text: 'Layout importado exitosamente.',
	                                        iconCls: 'ok-icon',
	                                        clear: true
	                                    });
	                                    var myid = Ext.id();
	                                    Ext.ComponentMgr.create({
	                                        id: myid,
	                                        summary: result
	                                    }, 'summary.report');
	                                    this.fireEvent('activity');
	                                    Karma.WinManager.Instance.register(myid, 'Importador: Resultados');
                                    }
                                    else {
										if(result.Report) {
											Ext.Msg.show({
												title:'Error',
												msg: result.ErrorMessage,
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
											});
										} else {
		                                    var myid = Ext.id();
		                                    Ext.ComponentMgr.create({
		                                        id: myid,
		                                        summary: result
		                                    }, 'summary.report');
		                                    this.fireEvent('activity');
		                                    Karma.WinManager.Instance.register(myid, 'Importador: Resultados');
										}
                                    }
                                },
                                failure: function(response, opts){
                                    Ext.Msg.alert('Error', response.responseText);
                                    Ext.getCmp('importerStatusbar').setStatus({
                                        text: 'Ocurrio un error al tratar de realizar la importacion',
                                        iconCls: 'ok-icon',
                                        clear: true
                                    });
                                },
                                scope: this
                            });
                        },
                        scope: this
                    }]
                }]
            }]
        });
        Karma.Tools.Importer.MainForm.superclass.initComponent.apply(this, arguments);
        this.show();
    }
});
Ext.reg('importer', Karma.Tools.Importer.MainForm);



Karma.Tools.Importer.SummaryReport = Ext.extend(Ext.Window, {

    title: 'Importacion:Resultados',
    
    width: 700,
    
    height: 500,
	
	summary: null,
    
    initComponent: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[SummaryReport.initComponent] <-');
		}
		Ext.apply(this, {
            layout: 'fit',
            items: [{
                xtype: 'tabpanel',
                activeItem: 0,
				items:[{
					title: 'Resumen',
		            layout: 'fit',
					anchor: '100% 100%',
					items: [{
						xtype: 'form',
						title: 'Resumen del proceso de importacion ',
						anchor: '100% 100%',
						border: true,
						frame: true,
						labelWidth: 180,
						labelPad: 15,
		                defaults: {
		                    anchor: '80%',
		                    labelAlign: 'right',
							xtype: 'textfield',
							disabled: true
		                },
						items: [{
							fieldLabel: 'Entidad',
							value: this.summary.Entity
						},{
							fieldLabel: 'Registros del archivo',
							value: this.summary.TotalRecords
						}, {
							fieldLabel: 'Registros no procesados',
							value: this.summary.IgnoredRecords
						}, {
							fieldLabel: 'Registros procesados',
							value: this.summary.ProcessedRecords
						}, {
							fieldLabel: 'Registros nuevos',
							value: this.summary.Operations.Inserted
						}, {
							fieldLabel: 'Registros actualizados',
							value: this.summary.Operations.Updated
	                    }, {
	                        fieldLabel: 'Obsrvaciones',
	                        value: this.summary.Operations.Observations,
	                        xtype: 'textarea',
	                        height: 100,
	                        disabled: false,
	                        readOnly: true
                        }]
					}]
				}, {
					title: 'Detalle errores',
		            layout: 'fit',
					anchor: '100% 100%',
					items: [{
						xtype: 'grid',
						title: 'Descripcion de los errores en el proceso de imporacion',
						anchor: '100% 100%',
						border: true,
						frame: true,
						store: new Ext.data.GroupingStore({
				            reader: new Ext.data.JsonReader({
								root: 'Errors',
								fields: [
						            { name: "Line" },
						            { name: "Column" },
						            { name: "Property" },
						            { name: "Description" },
						            { name: "Type" },
						            { name: "Severity" }
						        ]
							}),
							remoteSort: false,
							autoLoad: true,
				            data: this.summary.Validations.ErrorSummary,
				            sortInfo:{ field: 'Type', direction: "ASC" },
				            groupField: 'Type'
				        }),
						columns: [
				            { header: "Linea", width: 20, sortable: true, dataIndex: 'Line' },
				            { header: "Columna", width: 20, sortable: true, dataIndex: 'Column' },
				            { header: "Nombre", width: 50, sortable: true, dataIndex: 'Property' },
				            { header: "Tipo", width: 30, sortable: true, dataIndex: 'Type' },
				            { header: "Gravedad", width: 30, sortable: true, dataIndex: 'Severity' },
				            { header: "Descripcion", width: 200, sortable: true, dataIndex: 'Description' }
				        ],
						stripeRows: true,
						sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
						view: new Ext.grid.GroupingView({
				            showPreview: true,
						    sortAscText : "Ordenar ascendente",
						    sortDescText : "Ordenar descendente",
						    columnsText : "Columnas",
							groupByText: 'Agrupar por este campo',
							showGroupsText: 'Agrupar',
						    autoFill: true,
						    forceFit: true,
							groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
				        })
					}]
				}]
			}]
		});
        Karma.Tools.Importer.SummaryReport.superclass.initComponent.apply(this, arguments);
        this.show();
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SummaryReport.initComponent] ->');
        }
	},
	
	getStore: function() {
		
	}
	
});
Ext.reg('summary.report', Karma.Tools.Importer.SummaryReport);


Karma.Tools.Shipper.MainForm = Ext.extend(Ext.Window, {

    title: 'Administrador de Mensajería',

    width: 450,

    height: 300,

    modal: true,

    initComponent: function() {
        var store = new Karma.Data.JsonStore({
            proxy: new Karma.Data.HttpProxy({
                url: Karma.Conf.ServiceInvoker,
                method: 'POST'
            }),
            baseParams: {
                Service: Karma.Conf.ImporterService,
                Method: Karma.Conf.ImporterEntitiesMethod,
                Parameters: null,
                Depth: 2
            },
            autoLoad: true,
            autoSave: false,
            reader: new Ext.data.JsonReader({
                root: 'Result',
                successProperty: 'Success',
                idProperty: 'FullName',
                fields: [{
                    name: 'Name',
                    type: 'string'
                }, {
                    name: 'FullName',
                    type: 'string'
}]
                })
            });

            Ext.apply(this, {
                layout: 'fit',
                bbar: new Ext.ux.StatusBar({
                    id: 'importerStatusbar',
                    defaultText: '',
                    busyText: 'Procesando...'
                }),
                onKeyupIdMsg: function() {
                    this.findById('txtObservaciones').focus(true, 0);
                    this.findById('txtObservaciones').setValue('');
                },
                onKeyupObsMsg: function() {
                    this.findById('txtFecha').focus();                    
                },                
                onKeyupFechaMsg: function() {
                    window.onbeforeunload = null;

                    var idMsg = this.findById('txtId');
                    var _obs = this.findById('txtObservaciones');
                    var _fecha = this.findById('txtFecha');

                    Ext.getCmp('importerStatusbar').setStatus({
                        text: 'Acusado',
                        iconCls: 'ok-icon',
                        clear: true
                    });                

                    
                    Ext.Ajax.request({
                        url: 'Service/Mensajeria',
                        method: 'POST',
                        isUpload: true,
                        params: {
                            solId: idMsg.getValue(),
                            obs: _obs.getValue(),
                            fecha: _fecha.getValue().format('d/M/y'),
                            entregado: true
                        },
                        success: function(response, opts) {
                            if (response.responseText == 'succeed') {
                                idMsg.setValue('');
                                _obs.setValue('');
                                idMsg.focus();
                                Ext.getCmp('importerStatusbar').setStatus({
                                    text: 'Acusado exitosamente.',
                                    iconCls: 'ok-icon',
                                    clear: true
                                });
                                return true;
                            } else {
                                var result = Ext.decode(response.responseText);
                                if (result.Report) {
                                    Ext.Msg.show({
                                        title: 'Error',
                                        msg: result.ErrorMessage,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        fn: function() {
                                            idMsg.focus(true, 0);
                                        }
                                    });
                                } else {
                                    this.fireEvent('activity');
                                }
                                idMsg.focus(true, 0);
                            }
                        },
                        failure: function(response, opts) {
                            Ext.Msg.alert('Error', response.responseText);
                            Ext.getCmp('importerStatusbar').setStatus({
                                text: 'Ocurrio un error al tratar de realizar la importacion',
                                iconCls: 'ok-icon',
                                clear: true
                            });
                        },
                        scope: this
                    });
                    
                    window.onbeforeunload = prevent;
                },
                
                items: [{
                    xtype: 'tabpanel',
                    activeItem: 0,
                    items: [{
                        title: 'Acusar',
                        xtype: 'form',
                        frame: true,
                        border: true,
                        labelWidth: 140,
                        defaults: {
                            anchor: '95%',
                            labelAlign: 'right'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Id Mensajería',
                                emptyText: 'Ingrese el número de mensajería...',
                                id: 'txtId',
                                allowBlank: false,
                                enableKeyEvents: true,
                                listeners: {
                                    'keyup': {
                                        fn: function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)
                                                this.onKeyupIdMsg();
                                        },
                                        scope: this
                                    },
                                    'afterrender': {
                                        fn: function(field) {
                                            field.focus();
                                        },
                                        scope: this
                                    }
                                }
                            },
                            {
                                xtype: 'textarea',
                                fieldLabel: 'Observaciones',
                                emptyText: 'Ingrese las observaciones del acuse...',
                                id: 'txtObservaciones',
                                enableKeyEvents: true,
                                listeners: {
                                    'keyup': {
                                        fn: function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)
                                                this.onKeyupObsMsg();
                                        },
                                        scope: this
                                    }
                                }
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: 'Fecha Entrega',
                                id: 'txtFecha',
                                enableKeyEvents: true,
                                value: new Date(),
                                format: 'd/m/Y',
                                listeners: {
                                    'keyup': {
                                        fn: function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)
                                                this.onKeyupFechaMsg();
                                        },
                                        scope: this
                                    }
                                }
}],
                        
                        buttons: [{
                            text: 'Acusar Entregado',
                            handler: function() {
                                var prevent = window.onbeforeunload;
                                window.onbeforeunload = null;

                                var idMsg = this.findById('txtId');
                                var idObs = this.findById('txtObservaciones');
                                var _fecha = this.findById('txtFecha');

                                Ext.getCmp('importerStatusbar').setStatus({
                                    text: 'Acusado',
                                    iconCls: 'ok-icon',
                                    clear: true
                                });

                                
                                Ext.Ajax.request({
                                    url: 'Service/Mensajeria',
                                    method: 'POST',
                                    isUpload: true,
                                    params: {
                                        solId: idMsg.getValue(),
                                        obs: idObs.getValue(),
                                        fecha: _fecha.getValue(),
                                        entregado: true
                                    },
                                    success: function(response, opts) {
                                        if (response.responseText == 'succeed') {
                                            idMsg.setValue('');
                                            idObs.setValue('');
                                            idMsg.focus();
                                            Ext.getCmp('importerStatusbar').setStatus({
                                                text: 'Acusado exitosamente.',
                                                iconCls: 'ok-icon',
                                                clear: true
                                            });
                                            return true;
                                        } else {
                                            var result = Ext.decode(response.responseText);
                                            if (result.Report) {
                                                Ext.Msg.show({
                                                    title: 'Error',
                                                    msg: result.ErrorMessage,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.ERROR,
                                                    fn: function() { idMsg.focus(true, 0); }
                                                });
                                            } else {
                                                this.fireEvent('activity');
                                            }
                                            idMsg.focus(true, 0);
                                        }
                                    },
                                    failure: function(response, opts) {
                                        Ext.Msg.alert('Error', response.responseText);
                                        Ext.getCmp('importerStatusbar').setStatus({
                                            text: 'Ocurrio un error al tratar de realizar la importacion',
                                            iconCls: 'ok-icon',
                                            clear: true
                                        });
                                    },
                                    scope: this
                                });
                                
                                window.onbeforeunload = prevent;
                            },
                            scope: this
                        },
                                {
                                    text: 'Acusar NO Entregado',
                                    handler: function() {
                                        var prevent = window.onbeforeunload;
                                        window.onbeforeunload = null;

                                        var idMsg = this.findById('txtId');
                                        var idObs = this.findById('txtObservaciones');


                                        Ext.getCmp('importerStatusbar').setStatus({
                                            text: 'Acusado',
                                            iconCls: 'ok-icon',
                                            clear: true
                                        });

                                        
                                        Ext.Ajax.request({
                                            url: 'Service/Mensajeria',
                                            method: 'POST',
                                            isUpload: true,
                                            params: {
                                                solId: idMsg.getValue(),
                                                obs: idObs.getValue(),
                                                entregado: false
                                            },
                                            success: function(response, opts) {
                                                if (response.responseText == 'succeed') {
                                                    idMsg.setValue('');
                                                    idObs.setValue('');
                                                    idMsg.focus();
                                                    Ext.getCmp('importerStatusbar').setStatus({
                                                        text: 'Acusado exitosamente.',
                                                        iconCls: 'ok-icon',
                                                        clear: true
                                                    });
                                                    return true;
                                                } else {
                                                    var result = Ext.decode(response.responseText);
                                                    if (result.Report) {
                                                        Ext.Msg.show({
                                                            title: 'Error',
                                                            msg: result.ErrorMessage,
                                                            buttons: Ext.Msg.OK,
                                                            icon: Ext.MessageBox.ERROR,
                                                            fn: function() { idMsg.focus(true, 0); }
                                                        });
                                                    } else {
                                                        this.fireEvent('activity');
                                                    }
                                                    idMsg.focus(true, 0);
                                                }
                                            },
                                            failure: function(response, opts) {
                                                Ext.Msg.alert('Error', response.responseText);
                                                Ext.getCmp('importerStatusbar').setStatus({
                                                    text: 'Ocurrio un error al tratar de realizar la importacion',
                                                    iconCls: 'ok-icon',
                                                    clear: true
                                                });
                                            },
                                            scope: this
                                        });
                                        
                                        window.onbeforeunload = prevent;
                                    },
                                    scope: this
}]
}]
}]
                    });

                    Karma.Tools.Shipper.MainForm.superclass.initComponent.apply(this, arguments);
                    this.findById('txtId').focus();
                    this.show();
                }
            });
                            Ext.reg('shipper', Karma.Tools.Shipper.MainForm);



Karma.Modules.Report.ReportViewer = Ext.extend(Ext.Window, {
	
	reportXType: 'report.listview',
	
	reportConfig: null,
	
    initComponent: function(){
		Ext.apply(this, {
			title: 'Report Viewer',
		    layout: 'vbox',
		    iconCls: 'icon-report-start',
		    border: true,
		    closable: true,
		    frame: true,
		    autoShow: true,
		    constraint: true,
		    collapsible: true,
		    modal: false,
		    minimizable: true,
		    maximizable: true,
		    maximized: true,
			resizable: true,
		    plain: true,
		    constrain: true,
			layoutConfig: {
				pack: 'start',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				height: 70,
				border: false,
				frame: false,
				preventBodyReset: true,
				html: '<h2><center>' + this.report.Name + '</center></h2>' + 
					'<center><p>'  + this.description + '</p></center>'
			},{
				flex: 1,
				xtype: this.reportXType,
				entity: this.entity,
				target: this.target,
				report: this.report,
				expression: this.expression,
				description: this.description
			}],
			listeners: {
                'minimize': {
                    fn: this.hide,
					scope: this
                }
            }
		});
		Karma.Modules.Report.ReportViewer.superclass.initComponent.apply(this, arguments);
		this.show();
	}
});

Ext.apply(Karma.Modules.Report.ReportViewer, {
    create: function(config){
        config.id = Ext.id();
        Ext.ComponentMgr.create(config, 'report.viewer');
        Karma.WinManager.Instance.register(config.id);
    }
});
Ext.reg('report.viewer', Karma.Modules.Report.ReportViewer);


Karma.Modules.Report.Entity = function(){
    Karma.Modules.Report.Entity.superclass.constructor.call(this, false, true);
}

Ext.extend(Karma.Modules.Report.Entity, Karma.Core.Entity, {
    id: 'Report.Entity',
    name: 'ReportBuilder',
	
	getMainPanel: function(target) {
        return {
            id: this.id + '-' + target.id,
            title: target.name,
			iconCls: 'icon-graph',
            items: {
				xtype: 'report.builder',
                entity: this,
				target: target
            }
        };
	},
	
	getWrapper: function(target) {
		return new ReporterWrapper(this, target);	
	}
});

Karma.Modules.Report.EntityWrapper = function(reporter, target){
	
	this.reporterEntity = reporter;
	this.targetEntity = target;
	
	this.id = this.reporterEntity.id + '-' + this.targetEntity.id;
	
    this.getMainPanel = function() {
        return this.reporterEntity.getMainPanel(this.targetEntity);
	};
	
	this.getId = function() {
		return this.id;
	};
}
ReporterWrapper = Karma.Modules.Report.EntityWrapper;

Karma.Modules.Report.Editor = Ext.extend(Ext.form.FormPanel, {
	
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            border: false,
            frame: false,
            defaultType: 'panel',
            defaults: {
                border: true,
                frame: false,
                defaultType: 'panel',
                defaults: {
                    border: true,
                    frame: true
                }
            },
            items: [{
                region: 'west',
                resizeTabs: true,
                split: true,
                collapsible: false,
                width: 200,
                layout: 'anchor',
                items: [{
                    title: 'Reportes',
                    anchor: '100%, 60%',
                    xtype: 'treepanel',
                    border: true,
                    frame: false,
                    loader: new Ext.tree.TreeLoader(),
                    root: this.root = new Ext.tree.TreeNode({
                        nodeType: 'async',
                        allowChildren: true,
                        expanded: true,
                        children: []
                    }),
                    autoScroll: true,
                    lines: false,
                    rootVisible: false,
                    listeners: {
                        'click': {
                            fn: this.onReportSelect,
                            scope: this
                        }
                    }
                }, {
                    anchor: '100%, 40%',
                    title: 'Descripcion del reporte',
                    layout: 'anchor',
                    items: {
                        name: 'descripcion',
                        xtype: 'textarea',
                        anchor: '100%, 100%',
                        disabled: true
                    }
                }]
            }, this.configuration = new Ext.form.FormPanel({
                title: 'Configuracion del reporte',
				iconCls: 'icon-graph',
                region: 'center',
				autoScroll: true,
				disabled: true,
				defaults: {
					'valid': { fn: this.onValidExpression, scope: this },
					'invalid': { fn: this.onInvalidExpression, scope: this },
					'addcriteria': { fn: this.onAddCriteria, scope: this },
					'removecriteria': { fn: this.onRemoveCriteria, scope: this }
				},
                items: [],
				tbar: ['->', this.resetBtn = new Ext.Button({
					iconCls: 'icon-report',
					text: 'Restaurar filtro',
					handler: this.onReset,
					scope: this
				}), this.execBtn = new Ext.Button({
					iconCls: 'icon-report-start',
					text: 'Ejecutar',
					handler: this.onExecute,
					scope: this,
					disabled: true
				})]
            })]
        });
        Karma.Modules.Report.Editor.superclass.initComponent.apply(this, arguments);
        this.entity.useInvoker('GetReportes', this.target.metadata.Id, {
            fn: this.setReportes,
            scope: this
        });
    },
	
	setReportes: function(reports) {
		Ext.each(reports, function(report) {
			this.root.appendChild({
                text: report.Name,
                leaf: true,
				iconCls: 'icon-graph',
                report: report
            });
			this.doLayout();
		}, this);
	},
	
    onReportSelect: function(node){
        this.report = node.attributes.report;
        this.getForm().findField('descripcion').setValue(this.report.Description);
		// configure filters
        
        this.resetBtn.disable();
        this.execBtn.enable();
        this.configuration.doLayout();
        this.configuration.enable();
    },
	
	setParameters: function(parameters) {
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[Report.Editor.setParameters] clean up');
		}
		this.parameters = parameters;
		this.configuration.removeAll();
		
		if(Ext.isEmpty(parameters)) {
			if(PLOG.isDebugEnabled()) {
				PLOG.debug('[Report.Editor.setParameters] no parameters.');
			}
			//this.clearBtn.disable();
			this.resetBtn.disable();
			this.execBtn.enable();
            this.configuration.doLayout();
            this.configuration.enable();
		} else {
			if(PLOG.isDebugEnabled()) {
				PLOG.debug('[Report.Editor.setParameters] process parameters. ');
			}
			Ext.each(parameters, function(parameter) {
				if(PLOG.isDebugEnabled()) {
					PLOG.debug('[Report.Editor.setParameters] Parameter: ' + parameter.Name + 
						', isVisible: ' + parameter.Visible + ', Type: ' + parameter.Type + 
						', Nullable: ' + parameter.Nullable + ', ValidValues: ' + parameter.ValidValues);
				}
				if (parameter.Visible) {
					if (parameter.Type == 'DateTime') {
						this.configuration.add({
							xtype: 'datefield',
							name: parameter.Name,
							fieldLabel: parameter.Name,
							allowBlank: parameter.Nullable,
							listeners: {
								'change': {
									fn: this.validate,
									scope: this
								}
							}
						});
					}
					else 
						if (parameter.Type == 'String') {
							if (Ext.isEmpty(parameter.ValidValues)) {
								this.configuration.add({
									xtype: 'textfield',
									name: parameter.Name,
									fieldLabel: parameter.Name,
									allowBlank: parameter.Nullable,
									listeners: {
										'change': {
											fn: this.validate,
											scope: this
										}
									}
								});
							}
							else {
								this.configuration.add({
									xtype: 'combo',
									name: parameter.Name,
									mode: 'local',
									fieldLabel: parameter.Name,
									displayField: 'Label',
									valueField: 'Value',
									labelSeparator: '',
									triggerAction: 'all',
									selectOnFocus: true,
									store: new Ext.data.JsonStore({
										data: parameter,
										idProperty: 'Value',
										root: 'ValidValues',
										fields: [{
											name: 'Value'
										}, {
											name: 'Label'
										}]
									}),
									allowBlank: parameter.Nullable,
									listeners: {
										'change': {
											fn: this.validate,
											scope: this
										}
									}
								});
							}
						}
						else 
							if (parameter.Type == 'Integer') {
								if (Ext.isEmpty(parameter.ValidValues)) {
									this.configuration.add({
										xtype: 'textfield',
										name: parameter.Name,
										fieldLabel: parameter.Name,
										allowBlank: parameter.Nullable,
										listeners: {
											'change': {
												fn: this.validate,
												scope: this
											}
										}
									});
								}
								else {
									this.configuration.add({
										xtype: 'combo',
										name: parameter.Name,
										mode: 'local',
										fieldLabel: parameter.Name,
										displayField: 'Label',
										valueField: 'Value',
										labelSeparator: '',
										triggerAction: 'all',
										selectOnFocus: true,
										store: new Ext.data.JsonStore({
											data: parameter,
											idProperty: 'Value',
											root: 'ValidValues',
											fields: [{
												name: 'Value'
											}, {
												name: 'Label'
											}]
										}),
										allowBlank: parameter.Nullable,
										listeners: {
											'change': {
												fn: this.validate,
												scope: this
											}
										}
									});
								}
							}
				}
			}, this);
			this.configuration.doLayout();
			this.configuration.enable();
		}
	},
	
	validate: function() {
		if(this.configuration.getForm().isValid()) {
			this.execBtn.enable();
		}
			this.resetBtn.disable();
	},
	
	onReset: function() {
		this.configuration.getForm().reset();
	},
	
	onExecute: function() {
		var qs = '';
		var pns = 'parameters=';
		Ext.each(this.parameters, function(parameter, index, allItems) {
			// collect all parameter names
			pns += parameter.Name;
			// build parameter query string
			var val = this.configuration.getForm().findField(parameter.Name).getValue();
			if (parameter.Type == 'DateTime') {
				val = val.format('d/m/Y');
			}
			qs += (parameter.Name + '=' + val);
			if (index < allItems.length -1) {
				pns += ',';
				qs += '&';
			}
		}, this);
		window.open('Service/ReportViewer.aspx?' + 'report=' + this.report.Type + '&' + pns + '&' + qs, 
			this.report.Name, 
			'left=100,top=100,width=800,height=600'); 
	}
	
});
Ext.reg('report.builder', Karma.Modules.Report.Editor);


Karma.Modules.Report.AndOrGroupingControl = Ext.extend(Ext.Panel, {
    
    entityDescription: null,
	
	criteria1: null,
	
	criteria2: null,
    
    initComponent: function(){
        Ext.apply(this, {
			frame: true,
			border: false,
			bodyStyle: 'padding: 10px 10px 10px 10px',
			defaultType: 'report.builder.wrapper',
			defaults: {
				entityDescription: this.entityDescription,
				listeners: {
					valid: { fn: this.onValidExpression, scope: this },
					invalid: { fn: this.onInvalidExpression, scope: this },
					addcriteria: { fn: this.onAddCriteria, scope: this },
					removecriteria: { fn: this.onRemoveCriteria, scope: this }
				}
			},
            items: [
			this.criteria1 || {},
			this.andor = new Ext.form.ComboBox({
				width: 40,
				editable: false,
				triggerAction: 'all',
				store: new Ext.data.ArrayStore({
					autoDestroy: true,
					data: [['0', 'Y'], ['1', 'O']],
					idIndex: 0,
					fields: ['Id', 'Operacion']
				}),
				displayField: 'Operacion',
				mode: 'local',
				valueField: 'Id',
				fieldLabel: ' ',
				labelSeparator: '',
				value: '0',
				allowBlank: false,
				value: this.operand
			}), 
			this.criteria2 || {}
			]
        });
        Karma.Modules.Report.AndOrGroupingControl.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'valid': true, 'invalid': true, 'addcriteria': true, 'removecriteria': true });
		this.criteria1 = this.items.get(0);
		this.criteria2 = this.items.get(2);
    },
    
    onAddCriteria: function(wrapper) {
		var index = this.items.indexOf(wrapper);
		wrapper.purgeListeners();
		var criteria = wrapper.getCriteria();
		var config = {
			flex:1,
			xtype: 'report.builder.grouping',
			criteria1: criteria.buildExpression()
		};
		this.remove(wrapper, true);
		this.insert(index, config);
		this.doLayout();
		this.fireEvent('invalid', this);
	},
    
    onRemoveCriteria: function(source, criteria){
		PLOG.debug('[AndOrGroupingControl.onRemoveCriteria] XType: ' + source.getXType() + 
			', criteria: ' + criteria);
		
		var index = this.items.indexOf(source);
		index = index == 0? 2 : 0;
		var control = this.remove(index);
		control.purgeListeners();
		var criteria = control.getCriteria();
		
		var ownerGroup = source.ownerCt;
		var rootGroup = ownerGroup.ownerCt;
		var groupIndex = rootGroup.items.indexOf(ownerGroup);
		ownerGroup.purgeListeners();
		rootGroup.remove(ownerGroup);
		
		rootGroup.insert(groupIndex, control);
		control.on('valid', this.onValidExpression, this);
		control.on('invalid', this.onInvalidExpression, this);
		control.on('addcriteria', this.onAddCriteria, this);
		control.on('removecriteria', this.onRemoveCriteria, this);
		rootGroup.doLayout();
    },
    
    onValidExpression: function(){
		if (this.isValid()) {
			if(PLOG.isDebugEnabled()) {
				PLOG.debug('[AndOrGroupingControl.onValidExpression] the expression is valid.');
			}
			this.fireEvent('valid', this);
		}
    },
    
    onInvalidExpression: function(){
        this.fireEvent('invalid', this);
    },
	
    isValid: function(){
        return this.criteria1.isValid() && this.criteria2.isValid();
    },
	
	buildExpression: function() {
		return {
			Expression: this.andor.getValue(),
			Criterions: [
				this.criteria1.buildExpression(),
				this.criteria2.buildExpression()
			]
		};
	},
	
	buildDescription: function() {
		return this.criteria1.buildDescription() + 
			(this.andor.getValue() == '0'? ' y ' : ' o ') +
			this.criteria2.buildDescription();
	}
	
});
Ext.reg('report.builder.grouping', Karma.Modules.Report.AndOrGroupingControl);


Karma.Modules.Report.CriteriaControl = Ext.extend(Ext.form.FormPanel, {
	
	canRemove: true,
	
	showAndOr: true,
	
	entityDescription: null,
	
	configuration: null,
	
	numericOperands: [['2', '='], ['6', '<'], ['7', '<='], 
		['8', '>'], ['9', '>='], ['10', 'entre'], ['11', 'lista'], ['15', 'distinto']],
	
	dateOperands: [['2', '='], ['6', '<'], ['7', '<='], 
		['8', '>'], ['9', '>='], ['10', 'entre'], ['11', 'distinto']],
	
	stringOperands: [['3', 'igual'], ['4', 'comience con'], 
		['5', 'termine con'], ['6', 'lista'], ['16', 'contenga'], 
		['14', 'no se parezca'], ['15', 'distinto']],
	
	enumOperands: [['2', '='], ['11', 'lista'], ['15', 'distinto']],
	
	booleanOperands: [['2', '=']],
	
    initComponent: function(){
		var configuration = this.configuration || {};
        Ext.apply(this, {
            layout: 'hbox',
			layoutConfig: {
                pack: 'start',
				align: 'stretch'
            },
			bodyStyle: 'padding: 0px 0px 0px 0px',
            defaults: {
                border: false,
                frame: false,
                layout: 'form',
                labelAlign: 'top',
                labelSeparator: ''
            },
            defaultType: 'panel',
            items: [{
				width: 200,
                items: this.property = new Ext.form.ComboBox({
					name: 'property',
                    width: 190,
					labelSeparator: '',
                    fieldLabel: 'Propiedad',
					mode: 'local',
					displayField: 'Expression',
					valueField:'Expression',
					labelSeparator: '',
					editable: false,
					triggerAction: 'all',
					selectOnFocus: true,
                    store: new Ext.data.ArrayStore({
                        data: this.entityDescription,
                        idIndex: 0,
						fields: ['Expression', 'Type']
                    }),
					listeners: {
						select: { fn: this.onSelect, scope: this },
						valid: { fn: this.onValidExpression, scope: this },
						invalid: { fn: this.onInvalidExpression, scope: this }
					},
					allowBlank: false,
					value: configuration.Expression
                })
            }, {
                width: 100,
                items: this.operand = new Ext.form.ComboBox({
					name: 'operand',
                    width: 90,
                    fieldLabel: 'Comparador',
					displayField:'Operacion',
					mode: 'local',
					valueField:'Id',
					labelSeparator: '',
					editable: false,
					triggerAction: 'all',
					selectOnFocus: true,
                    store: new Ext.data.ArrayStore({
                        data: this.configureOperandData(),
                        idIndex: 0,
						fields: ['Id', 'Operacion']
                    }),
					allowBlank: false,
					listeners: {
						valid: { fn: this.onValidExpression, scope: this },
						invalid: { fn: this.onInvalidExpression, scope: this },
					},
					value: configuration.Type
                })
            }, this.criteria = new Ext.Panel({
				layout: 'form',
                width: 200,
				defaults: {
                    fieldLabel: 'Valor',
					labelSeparator: '',
					width: 190,
					listeners: {
						valid: { fn: this.onValidExpression, scope: this },
						invalid: { fn: this.onInvalidExpression, scope: this },
					},
					allowBlank: false
				},
				defaultType: 'textfield',
                items: this.configureCriteria()
            })]
        });
        Karma.Modules.Report.CriteriaControl.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'valid': true, 'invalid': true });
    },
	
	onRender: function() {
		Karma.Modules.Report.CriteriaControl.superclass.onRender.apply(this, arguments);
		this.isValid();
	},

	onValidExpression: function() {
		if(this.isValid()) {
			if(PLOG.isDebugEnabled()) {
				PLOG.debug('[CriteriaControl.onValidExpression] the expression is valid.');
			}
			this.fireEvent('valid', this);			
		}
	},
	
	onInvalidExpression: function() {
		this.fireEvent('invalid', this);
	},
	
    isValid: function(){
        var valid = true;
        this.getForm().items.each(function(f){
            if (!f.isValid()) {
                valid = false;
                f.markInvalid();
            }
        });
        return valid;
    },
	
	getCriteria: function() { },
	
	onSelect: function(combo, record, index) {
		var type = record.data.Type;
		this.criteria.removeAll(true);
		this.operand.clearValue();
		this.operand.getStore().loadData(this.getOperandData(type));
		this.criteria.add(this.getCriteria(type));
		this.doLayout();
	},
	
	getCriteria: function(type) {
		var config;
		var ltype = type.toLowerCase();
		if(ltype === 'string') {
			config = { xtype: 'textfield' };
		}
		else if(ltype === 'datetime') {
			config = { xtype: 'datefield' };
		}
		else if(ltype === 'tnt64' || ltype === 'tnt32' || ltype === 'double') {
			config = { xtype: 'textfield' };
		}
		else if(ltype === 'boolean') {
			config = { xtype: 'textfield' };
		}
		else if(type.indexOf('Enum') != -1) {
			config = { xtype: 'enum.combo', enumName: type };
		}
		var config2 = {
			fieldLabel: 'Valor',
			labelSeparator: '',
			width: 190,
            name: 'criteria'
		};
		Ext.apply(config2, config);
		return config2;
	},
	
	getExpressionType: function(expression) {
		var type;
		Ext.each(this.entityDescription, function(desc) {
			if(desc[0] == expression) {
				type = desc[1];
				return false;
			}
		}, this);
		
		PLOG.debug('[CriteriaControl] the type of the expression: ' + type);
		return type;
	},
	
	getOperandData: function(type) {
		var ltype = type.toLowerCase();
		var store = [];
		if(ltype === 'string') {
			store = this.stringOperands;
		}
		else if(ltype === 'datetime') {
			store = this.dateOperands;
		}
		else if(ltype === 'int64' || ltype === 'int32' || 
			ltype === 'double') {
			store = this.numericOperands;
		}
		else if(ltype === 'boolean') {
			store = this.booleanOperands;
		}
		else if(type.indexOf('Enum') != -1) {
			store = this.enumOperands;
		}
		return store;
	},
	
	configureOperandData: function() {
		if(Ext.isEmpty(this.configuration)) {
			return this.numericOperands;
		} else {
			var type = this.getExpressionType(this.configuration.Expression);
			return this.getOperandData(type);
		}
	},
	
	configureCriteria: function() {
		if(Ext.isEmpty(this.configuration)) {
			return {
				name: 'criteria'
            };
		} else {
			var type = this.getExpressionType(this.configuration.Expression);
			return this.getCriteria(type);
		}
	},
	
	buildExpression: function() {
		return {
			Expression: this.property.getValue(),
			Type: this.operand.getValue(),
			OperandValues: this.buildCriteria(),
			DataType: this.property.getSelectedData().Type
		};
	},
	
	buildCriteria: function() {
		return [this.criteria.items.get(0).getValue()];
	},
	
	buildDescription: function() {
		return this.property.getDisplayValue() + ' ' +
			this.operand.getDisplayValue() + ' \'' +
			this.buildCriteriaDescription() + '\'';
	},
	
	buildCriteriaDescription: function() {
		var value = this.buildCriteria();
		var type = this.property.getSelectedData().Type;
		var formated;
		var ltype = type.toLowerCase();
		if(ltype === 'string') {
			formated = value;
		}
		else if(ltype === 'datetime') {
			formated = Ext.util.Format.date(value, 'd/m/Y');
		}
		else if(ltype === 'int64' || ltype === 'int32' || 
			ltype === 'double') {
			formated = value;
		}
		else if(ltype === 'boolean') {
			formated = value;
		}
		else if(type.indexOf('Enum') != -1) {
			formated = Karma.Data.EnumStore.findById(type, value);
		}
		return formated;
	}
	
});
Ext.reg('report.builder.criteria', Karma.Modules.Report.CriteriaControl);

Ext.override(Ext.form.ComboBox, {
	getDisplayValue: function() {
		return this.getStore().getById(this.getValue()).get(this.displayField);
	},
	getSelectedData: function() {
		return this.getStore().getById(this.getValue()).data;
	}
});


Karma.Modules.Report.CriteriaWrapper = Ext.extend(Ext.Panel, {

    canAdd: true,
    
    canRemove: true,
    
    entityDescription: null,
	
	configuration: null,
    
    initComponent: function(){
        Ext.apply(this, {
            layout: 'hbox',
			height: 60,
			frame: true,
			border: false,
            bodyStyle: 'padding: 0px 0px 0px 0px',
            layoutConfig: {
                pack: 'start',
				align: 'stretch'
            },
            items: [this.criteria = new Karma.Modules.Report.CriteriaControl({
                flex: 1,
				configuration: this.configuration,
                entityDescription: this.entityDescription,
				listeners: {
					valid: { fn: this.onValidExpression, scope: this },
					invalid: { fn: this.onInvalidExpression, scope: this }
				}
            }), {
				xtype: 'panel',
                width: 30,
                items: [this.addBtn = new Ext.Button({
                    iconCls: 'icon-plus',
                    handler: this.onAddCriteria,
                    scope: this,
					disabled: true,
                    hidden: !this.canAdd
                }), this.removeBtn = new Ext.Button({
                    iconCls: 'icon-minus',
                    handler: this.onRemoveCriteria,
                    scope: this,
                    hidden: true//!this.canRemove
                })]
            }]
        });
        Karma.Modules.Report.CriteriaWrapper.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'valid': true, 'invalid': true, 'addcriteria': true, 'removecriteria': true });
    },
    
    onAddCriteria: function(){
        this.fireEvent('addcriteria', this);
    },
    
    onRemoveCriteria: function(){
        this.fireEvent('removecriteria', this);
    },
    
    onValidExpression: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[CriteriaWrapper.onValidExpression] the expression is valid.');
		}
		this.addBtn.enable();
		this.fireEvent('valid', this);
	},
    
    onInvalidExpression: function(){
        this.fireEvent('invalid', this);
    },
    
    getCriteria: function(){
		return this.criteria;
    },
	
    isValid: function(){
        return this.criteria.isValid();
    },
	
	buildExpression: function() {
		return this.criteria.buildExpression();
	},
	
	buildDescription: function() {
		return this.criteria.buildDescription();
	}
});
Ext.reg('report.builder.wrapper', Karma.Modules.Report.CriteriaWrapper);


Karma.Modules.Report.ListReport = Ext.extend(Karma.List.ListBase, {
	
    initComponent: function(){
		Karma.Modules.Report.ListReport.superclass.initComponent.apply(this, arguments);
		this.getStore().load();
	},
    
    getGridControl: function() { 
        var listeners = this.getGridListeners();
        var columns = this.getGridColumns(this.report.Columns);
        var plugins = this.getPlugins(columns);
        var sm = this.getSelectionModel();
        var grid = {
                xtype: 'grid',
                id: this.getId() + '-grid',
                border: false,
                frame: false,
                store: this.getStore(),
                cm: new Ext.grid.ColumnModel(columns),
                stripeRows: true,
                sm: sm,
                listeners: listeners,
                view: this.getGridView(),
                loadMask: true,
                plugins: plugins
            };
        return grid;
    },
    
    processStore: function(){
        var _fields = this.getStoreColumns(this.report.Columns);
        return Karma.Data.GroupingStore.create(this.entity.service, _fields, 
			null, {
            Metadata: {
				Id: this.report.Id
			},
			Criterions: this.expression,
            Start: 0,
            PageSize: Karma.Conf.DefaultPageSize
        }, null, null, 'ExecuteListReport');
    },
	
	getMenuActions: function() {
        return [];
    },
	
	getGridListeners: function(){
        return {
            'bodyresize' : { fn: function(){ this.syncSize(); }, scope: this} 
        };
    },
	
	getStoreColumns: function(colDefinitions){
        var properties = [];
        Ext.each(colDefinitions, function(item, index){
            properties.push({
                name: item.Name,
				mapping: index
            });
        }, this);
        return properties;
    },

    getGridColumns: function(colDefinitions){
        var columns = [];
        Ext.each(colDefinitions, function(item, index){
			var xtype = 'gridcolumn';
			var format = null;
			var enumType = null;
			if (!Ext.isEmpty(item.Type)) {
				if (item.Type == 'number') {
					xtype= 'numbercolumn';
					format= '0,000.00';
				} else if (item.Type == 'date') {
					xtype= 'datecolumn';
					format= 'd/M/Y';
				} else if (item.Type.indexOf('Enum') != -1) {
					xtype= 'enumcolumn';
					enumType = item.Type;
				}
			}
            columns.push({
                header: item.Name,
				dataIndex: item.Name,
                sortable: false,
                hidden: false,
				format: format,
				xtype: xtype,
				enumType: enumType,
				groupable: item.Groupable
            });
        }, this);
        return columns;
    }

	
});
Ext.reg('report.listview', Karma.Modules.Report.ListReport);


Karma.Modules.Report.GraphReport = Ext.extend(Ext.Panel, {
	
    initComponent: function(){
		Ext.apply(this, {
			title: 'Graph report',
			items: []
		});
		Karma.Modules.Report.GraphReport.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('report.graphview', Karma.Modules.Report.GraphReport);


Karma.Modules.Report.Module= function (){
	Karma.Modules.Report.Module.superclass.constructor.call(this, arguments);
}

Ext.extend(Karma.Modules.Report.Module, Karma.Core.Module, {
	id: 'Karma.Reports',
	name: 'Reportes',
	section: 'rep',
	dependencies: [
		Karma.Modules.Report.Entity
	]
});
Karma.Reports = Karma.Modules.Report.Module;

Karma.Modules.System.Metadata.Entity = function(){
    Karma.Modules.System.Metadata.Entity.superclass.constructor.call(this);
}

Ext.extend(Karma.Modules.System.Metadata.Entity, Karma.Core.Entity, {
    id: 'Metadata.Entity',
    name: 'Diseñador',
	
	getMainPanel: function() {
        var editor = {
            id: this.id,
            title: this.name,
			iconCls: 'icon-advanced',
            items: {
				xtype: 'meta.designer',
                entity: this
            }
        };
        return editor;
	}
});


Karma.Modules.System.Metadata.Designer = Ext.extend(Ext.Panel, {
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            border: false,
            frame: false,
            defaultType: 'panel',
			defaults: {
                border: true,
                frame: false,
				defaults: {
	                border: false,
	                frame: false,
					entity: this.entity
				}
			},
            items: [{
                region: 'west',
                resizeTabs: true,
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                width: 270,
                layout: 'anchor',
                items: [{
					id: 'entity.browser',
					anchor: '100%, 40%',
                    xtype: 'meta.ebrowser',
					listeners: {
						'select': {
							fn: this.onEntitySelect,
							scope: this
						}
					}
                }, {
					id: 'entity.details',
					anchor: '100%, 60%',
                    xtype: 'meta.epgrid'
                }]
            }, {
                xtype: 'tabpanel',
                region: 'center',
                activeTab: 0,
                items: [{
					id: 'editor.builder',
                    xtype: 'meta.ebuilder'
                }, {
					id: 'searchlist.builder',
                    xtype: 'meta.slbuilder'
                }]
            }]
        });
        Karma.Modules.System.Metadata.Designer.superclass.initComponent.apply(this, arguments);
        Ext.getCmp('windows.view').collapse();
    },
	onEntitySelect:function(entity) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Designer] Entity:' + entity);
        }
        this.entity.useInvoker('GetDescription', entity, {
            fn: function(description){
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Designer] entity description: ' + description);
                }
				this.findById('entity.details').setDetails(description);
            },
            scope: this
        });
        this.entity.useInvoker('GetMetadata', entity, {
            fn: function(metadata){
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Designer] entity metadata: ' + metadata);
                }
				var editor = this.findById('editor.builder');
				var searchlist = this.findById('searchlist.builder');
				editor.clear();
				editor.setEntity(metadata);
				searchlist.clear();
				searchlist.setEntity(metadata);
            },
            scope: this
        });
	}
});

Ext.reg('meta.designer', Karma.Modules.System.Metadata.Designer);


Karma.Modules.System.Metadata.EntityBrowser = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Entity Browser',
            autoScroll: true,
            loader: new Ext.tree.TreeLoader(),
            rootVisible: false,
            lines: false,
            root: new Ext.tree.AsyncTreeNode({
                expanded: true,
                allowChildren: true
            })
        });
        Karma.Modules.System.Metadata.EntityBrowser.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
        this.entity.useInvoker('GetEntities', null, {
            fn: function(entities){
                var data = [];
                Ext.each(entities, function(entity){
                    if (PLOG.isDebugEnabled()) {
                        PLOG.debug('[EntityBrowser] entity: ' + entity);
                    }
                    data.push({
                        id: entity,
                        text: entity,
                        leaf: true,
                        listeners: {
                            click: {
                                fn: this.onSelect,
                                scope: this
                            }
                        }
                    });
                }, this);
                this.getRootNode().appendChild(data);
            },
            scope: this
        });
    },
    
    onSelect: function(node){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityBrowser] select: ' + node.text);
        }
        this.fireEvent('select', node.text);
    }
});

Ext.reg('meta.ebrowser', Karma.Modules.System.Metadata.EntityBrowser);


Karma.Modules.System.Metadata.EntityPropertyGrid = Ext.extend(Ext.Panel, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Entity Details',
            layout: 'fit',
            items: [{
                xtype: 'tabpanel',
                border: false,
                frame: false,
                tabPosition: 'bottom',
                activeTab: 0,
                defaultType: 'grid',
                items: [{
                    id: 'ed.properties',
                    title: 'Properties',
					ddGroup: 'propertiesDD',
					enableDragDrop: true,
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        root: 'Data',
                        idProperty: 'Name',
                        fields: ['Name', 'Type', 'IsEntity', 'Description']
                    }),
                    columns: [{
                        header: 'Name',
                        dataIndex: 'Name'
                    }, {
                        header: 'Type',
                        dataIndex: 'Type'
                    }, {
                        header: 'IsEntity',
                        dataIndex: 'IsEntity',
                        hidden: true
                    }, {
                        header: 'Description',
                        dataIndex: 'Description',
                        hidden: true
                    }]
                }, {
                    id: 'ed.aggregates',
                    title: 'Aggregates',
					ddGroup: 'aggregatesDD',
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        root: 'Data',
                        idProperty: 'Name',
                        fields: ['Name', 'TargetType']
                    }),
                    columns: [{
                        header: 'Name',
                        dataIndex: 'Name'
                    }, {
                        header: 'TargetType',
                        dataIndex: 'TargetType'
                    }]
                }, {
                    id: 'ed.operations',
                    title: 'Operations',
					ddGroup: 'operationsDD',
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        root: 'Data',
                        idProperty: 'Name',
                        fields: ['Name', 'ReturnType']
                    }),
                    columns: [{
                        header: 'Name',
                        dataIndex: 'Name'
                    }, {
                        header: 'ReturnType',
                        dataIndex: 'ReturnType'
                    }]
                }]
            }]
        });
        Karma.Modules.System.Metadata.EntityPropertyGrid.superclass.initComponent.apply(this, arguments);
    },
    setDetails: function(details){
        this.findById('ed.properties').getStore().loadData({
			Data: details.Properties
		});
        this.findById('ed.aggregates').getStore().loadData({
			Data: details.Aggregates
		});
        this.findById('ed.operations').getStore().loadData({
			Data: details.Operations
		});
    }
});

Ext.reg('meta.epgrid', Karma.Modules.System.Metadata.EntityPropertyGrid);


Karma.Modules.System.Metadata.EditorBuilder = Ext.extend(Ext.Panel, {
    fake: {
        security: {
            New: true,
            Update: true,
            Delete: true
        },
        editorW: 400,
        editorH: 400,
        service: '',
        getDisplayTitle: function(){}
    },
	editorDropTarget: null,
    initComponent: function(){
        Ext.apply(this, {
            title: 'Editor Builder',
            layout: 'fit',
            items: []
        });
        Karma.Modules.System.Metadata.EditorBuilder.superclass.initComponent.apply(this, arguments);
    },
    
    setEntity: function(entity){
        this.add({
			id: 'ed.preview',
            xtype: 'cmp.editor.win',
            x: 0,
            y: 0,
            title: 'Title',
            editorXType: 'cmp.editor.card',
            entity: this.fake,
            entityLinks: new Array(),
            editorProperties: {
                doLoad: function(){},
                doSubmit: function(){},
                doClose: function(){}
            },
            renderTo: this.getId()
        });
		this.doLayout();
		var editor = Ext.getCmp('ed.preview');
		var dropTarget = editor.body.dom;
		this.editorDropTarget = new Ext.dd.DropTarget(dropTarget, {
			ddGroup     : 'propertiesDD',
			notifyEnter : function(ddSource, e, data) {
			},
			notifyDrop  : function(ddSource, e, data){
				var selectedRecord = ddSource.dragData.selections[0];
				//ddSource.grid.store.remove(selectedRecord);
				return true;
			}
		});
    },
	
	clear: function(){
		this.remove('ed.preview');
		this.doLayout();
	}
});

Ext.reg('meta.ebuilder', Karma.Modules.System.Metadata.EditorBuilder);


Karma.Modules.System.Metadata.SearchListBuilder = Ext.extend(Ext.Panel, {
    fakeEntity: {
        security: {
            New: true,
            Update: true,
            Delete: true,
            Find: true,
            Export: true,
            Print: true
        },
        metadata: {
            Service: '',
            Consultas: [{
                Id: 0,
                Name: 'Test'
            }]
        },
        columns: [{
            Name: 'Id',
            Property: 'Id'
        }],
        sortings: ['Id'],
        views: [{
            Id: 0,
            Nombre: 'Normal'
        }]
    },
    initComponent: function(){
        Ext.apply(this, {
            title: 'SearchList Builder',
            layout: 'border',
            items: [{
                region: 'west',
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                width: 270,
                layout: 'anchor',
                items: [{
                    id: 'query.list',
                    xtype: 'meta.sl.query.list',
                    anchor: '100%, 40%',
                    listeners: {
                        'select': {
                            fn: this.onQuerySelect,
                            scope: this
                        }
                    }
                }, {
                    id: 'query.details',
                    anchor: '100%, 60%',
                    xtype: 'meta.sl.det'
                }]
            }, this.mainPanel = new Ext.Panel({
                region: 'center',
                layout: 'fit',
                items: []
            })]
        });
        Karma.Modules.System.Metadata.SearchListBuilder.superclass.initComponent.apply(this, arguments);
    },
    
    setEntity: function(entity){
        this.fakeEntity.metadata = entity;
        this.mainPanel.add({
            id: 'sl.preview',
            xtype: 'meta.sl',
            entity: this.fakeEntity,
            sortings: ['Id'],
            views: [{
                Id: 0,
                Nombre: 'Normal'
            }]
        });
        var list = this.findById('query.list');
        list.setQueries(entity.Queries);
        this.doLayout();
    },
    
    clear: function(){
        this.mainPanel.remove('sl.preview');
        var list = this.findById('query.list');
        list.clear();
        this.doLayout();
    },
    
    onQuerySelect: function(query) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[SearchListBuilder] Query:' + query);
        }
        var details = this.findById('query.details');
        details.setQuery(query);
        
        var sl = this.findById('sl.preview');
        sl.setQuery(query);
    }
});

Ext.reg('meta.slbuilder', Karma.Modules.System.Metadata.SearchListBuilder);


Karma.Modules.System.Metadata.QueryList = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function() {
        Ext.apply(this, {
            title: 'Query List',
            autoScroll: true,
            loader: new Ext.tree.TreeLoader(),
            rootVisible: false,
            lines: false,
            root: new Ext.tree.AsyncTreeNode({
                expanded: true,
                allowChildren: true
            })
        });
        Karma.Modules.System.Metadata.QueryList.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
    },
    
    onSelect: function(node){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[QueryList.onSelect] select: ' + node.text);
        }
        this.fireEvent('select', node.attributes.query);
    },
    
    setQueries: function(queries){
        if(this.getRootNode().hasChildNodes()) {
            this.clear();
        }
        if(!queries) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[QueryList.setQueries] the entity has no queries.');
            }
            return;
        }
        var data = [];
        Ext.each(queries, function(query){
            if(!query.LinkQuery) {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[QueryList.setQueries] query: ' + query.Nombre);
                }
                data.push({
                    text: query.Name,
                    leaf: true,
                    query: query,
                    listeners: {
                        click: {
                            fn: this.onSelect,
                            scope: this
                        }
                    }
                });
            }
        }, this);
        this.getRootNode().appendChild(data);
    },
    
    clear: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[QueryList.clear] <-');
        }
        if(!this.getRootNode().hasChildNodes()) {
            return;
        }
        var data = [];
        this.getRootNode().eachChild(function(node) {
            data.push(node);
        }, this);
        Ext.each(data, function(node) {
            node.remove();
        }, this);
    }
});
Ext.reg('meta.sl.query.list', Karma.Modules.System.Metadata.QueryList);	


Karma.Modules.System.Metadata.QueryDetails = Ext.extend(Ext.grid.PropertyGrid, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Query Details',
            clicksToEdit: 2,
            columnLines: true,
            stripeRows: true
        });
        Karma.Modules.System.Metadata.QueryDetails.superclass.initComponent.apply(this, arguments);
    },
    
    setQuery: function(query){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[QueryDetails.setQuery] query: ' + query);
        }
        this.setSource(query);
    }
});

Ext.reg('meta.sl.det', Karma.Modules.System.Metadata.QueryDetails);


Karma.Modules.System.Metadata.GridView = Ext.extend(Ext.grid.GridView, {
    initComponent: function(){
        Karma.Modules.System.Metadata.GridView.superclass.initComponent.apply(this, arguments);
        this.addEvents({
        	'remove': true
        });
    },
    
    renderUI: function(){
        Karma.Modules.System.Metadata.GridView.superclass.renderUI.apply(this, arguments);
        if(this.hmenu){
            this.hmenu.removeAll(true);
            this.propertiesMenu = new Ext.menu.Menu({ id: 'display-property-menu' });
            this.propertiesMenu.on({
                scope: this,
                beforeshow: this.beforePropertiesMenuShow,
                itemclick: this.handleHdMenuClick
            });
            this.hmenu.add(new Ext.menu.CheckItem({
                id: 'sortable',
                text: 'Sortable',
                checked: true
            }), new Ext.menu.CheckItem({
                id: 'visible',
                text: 'Visible',
                checked: true
            }), '-', {
                id: 'displayProperty',
                text: 'Display property',
                menu: this.propertiesMenu,
                iconCls: 'x-cols-icon'
            }, '-', {
                id: 'remove',
                text: 'Remove'
            });
        }
    },
    
    onHeaderClick : function(g, index){
        if(this.headersDisabled || !this.cm.isSortable(index)){
            return;
        }
        g.stopEditing(true);
    },

    handleHdMenuClick: function(item){
        var index = this.hdCtxIndex;
        var cm = this.cm;
        switch(item.itemId){
            case "sortable":
            	cm.setSortable(index, true);
                break;
            case "visible":
            	cm.setHidden(index, true);
                break;
            case "remove":
            	cm.removeColumn(index);
                break;
            
        }
        return true;
    },
    
    beforePropertiesMenuShow: function() {
        
    },
    
    handleHdDown : function(e, t){
        if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
            e.stopEvent();
            var hd = this.findHeaderCell(t);
            Ext.fly(hd).addClass('x-grid3-hd-menu-open');
            var index = this.getCellIndex(hd);
            this.hdCtxIndex = index;
            var ms = this.hmenu.items, cm = this.cm;
            this.hmenu.on("hide", function(){
                Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
            }, this, {single:true});
            this.hmenu.show(t, "tl-bl?");
        }
    }
});
Ext.reg('meta.sl.gridview', Karma.Modules.System.Metadata.GridView);


Karma.Modules.System.Metadata.ColumnModel = Ext.extend(Ext.grid.ColumnModel, {
    removeColumn : function(colIndex){
        var c = this.config[colIndex];
        this.dataMap = null;
        this.fireEvent("configchange", this);
    },

    addColumn : function(c, colIndex){
        this.config.splice(colIndex, 0, c);
        this.dataMap = null;
        this.fireEvent("configchange", this);
    },
    
    setHidden : function(colIndex, hidden){
        var c = this.config[colIndex];
        if(c.hidden !== hidden){
            c.hidden = hidden;
        }
    },

    setSortable : function(colIndex, sortable){
        var c = this.config[colIndex];
        if(c.sortable !== sortable){
            c.sortable = sortable;
        }
    }
});


Karma.Modules.System.Metadata.SearchList = Ext.extend(Karma.SL, {
    canNew: false,
    canDelete: false,
    initComponent: function(){
        Karma.Modules.System.Metadata.SearchList.superclass.initComponent.apply(this, arguments);
    },
    
    getGridView: function(){
        return new Karma.Modules.System.Metadata.GridView({
            showPreview: true,
            autoFill: true,
            forceFit: true
        });
    },
    
    getGridControl: function(){
        var grid = {
            xtype: 'grid',
            id: this.getId() + '-grid',
            border: false,
            frame: false,
            store: this.getStore(),
            cm: new Ext.grid.ColumnModel(this.columnmodel),
            stripeRows: true,
            sm: this.getSelectionModel(),
            view: this.getGridView(),
            loadMask: true,
            plugins: this.getPlugins(this.columnmodel),
            listeners: {
                headerclick: {
                    fn: function(colIndex, e){
                        //e.stopEvent();
                    },
                    scope: this
                },
                headercontextmenu: {
                    fn: function(colIndex, e){
                        e.stopEvent();
                    },
                    scope: this
                },
                render: {
                    fn: function(colIndex, e){
                        var sl = Ext.getCmp(this.getId() + '-grid');
                        var dropTargetEl = sl.getView().mainBody.dom;
                        this.dropTarget = new Ext.dd.DropTarget(dropTargetEl, {
                            ddGroup: 'propertiesDD',
                            notifyEnter: function(ddSource, e, data){
                            },
                            notifyDrop: function(ddSource, e, data){
                                // Generic function to add records.
                                function addRow(record, index, allItems){
                                    // Search for duplicates
                                    //var foundItem = secondGridStore.findExact('name', record.data.name);
                                    // if not found
                                    //if (foundItem == -1) {
                                        //secondGridStore.add(record);
                                        // Call a sort dynamically
                                        //secondGridStore.sort('name', 'ASC');
                                        //Remove Record from the source
                                        //ddSource.grid.store.remove(record);
                                    //}
                                }
                                // Loop through the selections
                                //Ext.each(ddSource.dragData.selections, addRow);
                                return true;
                            }
                        });
                        
                        this.dropTarget.lock();
                    },
                    scope: this
                }
            }
        };
        return grid;
    },
    
    setQuery: function(query) {
        if(!query) {
            return;
        }
        this.query = query;
        this.dropTarget.unlock();
        if(!query.Columns) {
            return;
        }
        this.configureGridColumns(query.Columns);
    },
    
    configureGridColumns: function(colDefinitions){
        var properties = [];
        var columns = [];
        Ext.each(colDefinitions, function(item){
        	properties.push({
        		name: item.Name
    		});
        	columns.push({
        		header: item.Name,
        		sortable: item.Sortable,
        		hidden: item.Hidden
        	});
        }, this);
        
        var store = new Ext.data.ArrayStore({
            autoDestroy: true,
            data: [],
            idIndex: 0,
            fields: properties
        });
        
        var sl = Ext.getCmp(this.getId() + '-grid');
        sl.reconfigure(store, new Karma.Modules.System.Metadata.ColumnModel(columns));
    },
    
    newRecord: function(){ },
    openRecord: function(){ },
    deleteRecord: function(){ },
    onExportExcel: function(){ },
    
    updateControls: function(value){
        this.searchfield.disable();
        this.paginbar.disable();
        this.cmbFilter.disable();
        this.exportBtn.disable();
        this.newToolbarButton.disable();
    }
});
Ext.reg('meta.sl', Karma.Modules.System.Metadata.SearchList);


Ext.ns('Karma.Modules.System.QueryEditor');

Karma.Modules.System.QueryEditor.Entity = function(){
    Karma.Modules.System.QueryEditor.Entity.superclass.constructor.call(this);
}

Ext.extend(Karma.Modules.System.QueryEditor.Entity, Karma.Core.Entity, {
    id: 'QueryEditor.Entity',
    name: 'Editor de Consultas',
	
	getMainPanel: function() {
        var editor = {
            id: this.id,
            title: this.name,
			iconCls: 'icon-advanced',
            items: {
				xtype: 'qe.editor',
                entity: this
            }
        };
        return editor;
	}
});


Karma.Modules.System.QueryEditor.Editor = Ext.extend(Ext.form.FormPanel, {
    initComponent: function(){
        this.gridId = Ext.id();
        Ext.apply(this, {
            layout: 'vbox',
            anchor: '100%',
            border: false,
            layoutConfig: {
                align: 'stretch',
                pack: 'start'
            },
            items: [{
                xtype: 'panel',
                title: 'Editor de Consultas',
                layout: 'form',
                anchor: '100%',
                border: false,
                frame: true,
                bodyStyle: 'padding: 10px 10px 0px 10px',
                labelWidth: 130,
                items: [{
                    xtype: 'textarea',
                    name: 'query',
                    fieldLabel: 'Consulta',
                    height: 150,
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                }, {
                    xtype: 'combo',
                    id: 'qlang',
                    editable: false,
                    triggerAction: 'all',
                    store: new Ext.data.ArrayStore({
                        autoDestroy: true,
                        data: [['HQL'], ['SQL']],
                        idIndex: 0,
                        fields: ['Id']
                    }),
                    displayField: 'Id',
                    mode: 'local',
                    valueField: 'Id',
                    fieldLabel: 'Lenguaje',
                    labelSeparator: '',
                    value: 'HQL',
                    allowBlank: false
                }],
                buttons: [{
                    text: 'Ejecutar',
                    handler: this.onExecute,
                    bindForm: true,
                    scope: this
                }]
            }, {
                xtype: 'tabpanel',
                anchor: '100%',
                flex: 1,
                activeItem: 0,
                layoutOnTabChange: true,
                items: [this.grid = new Ext.grid.GridPanel({
                    id: this.gridId,
                    title: 'Resultados',
                    store: this.store = new Ext.data.JsonStore({
                        autoDestroy: true,
                        fields: [ 'Id' ],
                        data: { Data: [] },
                        root: 'Data',
                        idProperty: 'Id'
                    }),
                    columns: [{
                        id: 'Id',
                        header: 'Id'
                    }],
                    viewConfig: {
                        forceFit: true
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    }),
                    frame: true,
                    bbar: this.pagingtoolbar = new Ext.PagingToolbar({
                        pageSize: 20,
                        store: this.store,
                        displayInfo: true,
                        plugins: new Ext.ux.ProgressBarPager()
                    })
                }), {
                    xtype: 'panel',
                    title: 'Resultado(Raw)',
                    collapsible: false,
                    anchor: '100%',
                    layout: 'fit',
                    items: [{
                        xtype: 'textarea',
                        name: 'rawresults',
                        anchor: '98% 98%',
                        readOnly: true
                    }]
                }]
            }]
        });
        Karma.Modules.System.QueryEditor.Editor.superclass.initComponent.apply(this, arguments);
    },
    
    onExecute: function(){
        var query = this.getForm().findField('query').getValue();
        var lang = this.getForm().findField('qlang').getValue();

        this.clean();
        Ext.MessageBox.show({
           msg: 'Executing query...',
           progressText: 'Saving...',
           width: 300,
           wait: true,
           waitConfig: { interval: 200 }
       });

        if (Ext.isEmpty(query)) {
            Ext.Msg.alert('Error', 'Debes ingresar una consulta antes de intentar ejecutarla');
            return;
        }
        this.entity.useInvoker('ExecuteQuery', {
            Query: query,
            Start: 0,
            PageSize: 10,
            QueryLang: lang
        }, {
            fn: function(resultado){
                this.getForm().findField('rawresults').setValue(Ext.encode(resultado));
                this.reconfigureGrid(resultado);
                Ext.MessageBox.hide();
            },
            scope: this
        }, {
            fn: function(resultado){
                if (Ext.isObject(resultado)) {
                    this.getForm().findField('rawresults').setValue(Ext.encode(resultado));
                }
                else {
                    this.getForm().findField('rawresults').setValue(resultado);
                }
                Ext.MessageBox.hide();
            },
            scope: this
        });
    },
    
    clean: function(data){
        this.getForm().findField('rawresults').setValue('');
        this.grid.getStore().removeAll();
    },

    reconfigureGrid: function(data){
        var properties = this.getPropertyNames(data.Data[0]);
        var store = new Ext.data.JsonStore({
            proxy: new Ext.ux.data.PagingMemoryProxy(data),
            autoDestroy: true,
            data: data,
            root: 'Data',
            idProperty: 'Id',
            fields: properties
        });
        var columns = this.buildColumnModel(properties);

        this.grid.reconfigure(store, new Ext.grid.ColumnModel(columns));
        this.pagingtoolbar.unbind();
        this.pagingtoolbar.bind(store);
    },

    getPropertyNames: function(data){
        var properties = [];
        for (var propertyName in data) {
            properties.push(propertyName);
        }
        return properties;
    },
    
    buildColumnModel: function(properties){
        var model = [];
        Ext.each(properties, function(property) {
            model.push({
                header: property,
                dataIndex: property
            });
        }, this);
        return model;
    }
    
});
Ext.reg('qe.editor', Karma.Modules.System.QueryEditor.Editor);


Karma.Modules.System.Module= function (){
	Karma.Modules.System.Module.superclass.constructor.call(this, arguments);
}

Ext.extend(Karma.Modules.System.Module, Karma.Core.Module, {
	id: 'Karma.System',
	name: 'Herramientas',
	section: 'sys',
	dependencies: [
		Karma.Modules.System.Metadata.Entity,
		Karma.Modules.System.QueryEditor.Entity
	]
});
Karma.System = Karma.Modules.System.Module;

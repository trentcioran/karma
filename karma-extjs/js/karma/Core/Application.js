/**
 * Proyecto: Karma
 * @author Mislas
 */

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
			LOG = PLOG;
			if(Ext.isIE){
				PLOG.addAppender(new log4javascript.PopUpAppender());
				PLOG.group('loggers');
			} else {
				PLOG.addAppender(new log4javascript.PopUpAppender());
			}
			if (Ext.isEmpty(logLevel)){
				PLOG.setLevel(log4javascript.Level.ALL);
			} else {
				PLOG.setLevel(logLevel);
			}
		} else {
			log4javascript.setEnabled(false);
		}
	};
	
	this.loadUserData = function(credentials, successCbk){
		mask.show();
		Karma.Util.AjaxHelper.call(//Karma.Conf.ServiceInvoker, 
			'data/user.json',
			this.logInService,'GetUsuario', 
			[ credentials[0], credentials[1] ], 
			2, /*Depth*/
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
		Karma.Util.AjaxHelper.call(//Karma.Conf.ServiceInvoker, 
			'data/metadata.json',
			this.metadataService,
			this.metadataMethod, 
			null, 
			0, /*Depth*/
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

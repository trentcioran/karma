/**
 * Proyecto: Karma
 * @author Mislas
 */

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

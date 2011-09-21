/**
 * Proyecto: Karma
 * @author Mislas
 */

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

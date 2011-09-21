/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */
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

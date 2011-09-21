/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */
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

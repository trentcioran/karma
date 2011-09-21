/**
* Proyecto: Karma
* @author Mislas
*/
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

                    /***REQUESTING SERVICE***/
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
                    /************************/
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
                        /*keys: [
                        { 
                        key: [Ext.EventObject.ENTER], handler: function() {
                        Ext.Msg.alert("Alert","Enter Key Event !");
                        }
                        }
                        ],*/
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

                                /***REQUESTING SERVICE***/
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
                                /************************/
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

                                        /***REQUESTING SERVICE***/
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
                                        /************************/
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


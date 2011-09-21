/**
 * Proyecto: Karma
 * @author Mislas
 */
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


/**
 * Proyecto: Karma
 * @author Mislas
 */
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
        /*this.entity.useInvoker('GetParametros', this.report.Path, {
            fn: this.setParameters,
            scope: this
        });*/
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

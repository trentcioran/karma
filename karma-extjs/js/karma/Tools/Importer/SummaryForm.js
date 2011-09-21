/**
 * Proyecto: Karma
 * @author Mislas
 */
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

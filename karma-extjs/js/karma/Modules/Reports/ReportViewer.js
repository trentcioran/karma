/**
 * Proyecto: Karma
 * @author Mislas
 */
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

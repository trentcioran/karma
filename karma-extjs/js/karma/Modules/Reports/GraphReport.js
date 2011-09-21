/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.GraphReport = Ext.extend(Ext.Panel, {
	
    initComponent: function(){
		Ext.apply(this, {
			title: 'Graph report',
			items: []
		});
		Karma.Modules.Report.GraphReport.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('report.graphview', Karma.Modules.Report.GraphReport);

/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.Entity = function(){
    Karma.Modules.Report.Entity.superclass.constructor.call(this, false, true);
}

Ext.extend(Karma.Modules.Report.Entity, Karma.Core.Entity, {
    id: 'Report.Entity',
    name: 'ReportBuilder',
	
	getMainPanel: function(target) {
        return {
            id: this.id + '-' + target.id,
            title: target.name,
			iconCls: 'icon-graph',
            items: {
				xtype: 'report.builder',
                entity: this,
				target: target
            }
        };
	},
	
	getWrapper: function(target) {
		return new ReporterWrapper(this, target);	
	}
});

Karma.Modules.Report.EntityWrapper = function(reporter, target){
	
	this.reporterEntity = reporter;
	this.targetEntity = target;
	
	this.id = this.reporterEntity.id + '-' + this.targetEntity.id;
	
    this.getMainPanel = function() {
        return this.reporterEntity.getMainPanel(this.targetEntity);
	};
	
	this.getId = function() {
		return this.id;
	};
}
ReporterWrapper = Karma.Modules.Report.EntityWrapper;
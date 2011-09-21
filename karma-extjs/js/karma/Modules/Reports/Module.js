/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.Module= function (){
	Karma.Modules.Report.Module.superclass.constructor.call(this, arguments);
}

Ext.extend(Karma.Modules.Report.Module, Karma.Core.Module, {
	id: 'Karma.Reports',
	name: 'Reportes',
	section: 'rep',
	dependencies: [
		Karma.Modules.Report.Entity
	]
});
Karma.Reports = Karma.Modules.Report.Module;
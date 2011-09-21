/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Module= function (){
	Karma.Modules.System.Module.superclass.constructor.call(this, arguments);
}

Ext.extend(Karma.Modules.System.Module, Karma.Core.Module, {
	id: 'Karma.System',
	name: 'Herramientas',
	section: 'sys',
	dependencies: [
		Karma.Modules.System.Metadata.Entity,
		Karma.Modules.System.QueryEditor.Entity
	]
});
Karma.System = Karma.Modules.System.Module;
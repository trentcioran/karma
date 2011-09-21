/**
 * @author trentcioran
 */

Sample.SampleModule = function (){
	Sample.SampleModule.superclass.constructor.call(this, arguments);
};

Ext.extend(Sample.SampleModule, Karma.Core.Module, {
	id: 'SampleModule',
	name: 'SampleModule',
	section: 'ops',
	dependencies: [ 
		Sample.SampleEntity
	]
});

/**
 * @author trentcioran
 */

Sample.Module.SampleEntity.Editor = Ext.extend(Karma.EBCard, {

	initComponent: function(){
		Ext.apply(this, {
			sections: [{
				title: 'General',
				items: [{
						fieldLabel: 'Nombre',
						name: 'Nombre'
					},{
						fieldLabel: 'Apellido paterno',
						name: 'ApellidoPaterno'
					},{
						fieldLabel: 'Apellido materno',
						name: 'ApellidoMaterno'
					},{
						fieldLabel: 'Email',
						name: 'Email',
						vtype: 'email'
					},{
						xtype: 'datefield',
						fieldLabel: 'Fecha nacimiento',
						name: 'FechaNacimiento',
						anchor: '60%'
					},{
						fieldLabel: 'RFC',
						name: 'Rfc',
						anchor: '60%'
					},{
						fieldLabel: 'CURP',
						name: 'Curp',
						anchor: '70%'
					},{
						fieldLabel: 'NombreCompleto',
						name: 'NombreCompleto',
						xtype: 'hidden'
					}
				]
			}]
		});
		Sample.Module.SampleEntity.Editor.superclass.initComponent.apply(this, arguments);
	}
	
});

Ext.reg('sample.editor', Sample.Module.SampleEntity.Editor);

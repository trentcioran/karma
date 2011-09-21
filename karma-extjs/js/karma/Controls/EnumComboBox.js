/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Controls.EnumComboBox = Ext.extend(Ext.form.ComboBox, {
	
	enumName: '',

	anchor:'90%',

	initComponent: function (){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumComboBox.initComponent] <-');
		}
		
		Ext.apply(this, {
			allowBlank:false,
			typeAhead: true,
			triggerAction: 'all',
			forceSelection:true,
			disableKeyFilter: true,
			displayField: 'Name',
			valueField: 'Id',
			autoShow: true,
			loadingText: 'cargando...',
			store: Karma.Data.EnumStore.create(this.enumName),
			mode: 'local',
			lazyInit: false
		});

		Karma.Controls.EnumComboBox.superclass.initComponent.apply(this, arguments);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumComboBox.initComponent] ->');
		}
	}
});

Karma.EComboBox = Karma.Controls.EnumComboBox;
Ext.reg('enum.combo', Karma.EComboBox);


/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */

Karma.Editor.layouts.Tab = Ext.extend(Karma.Editor.EditorBase, {
	defaultFormType: 'cmp.editor.frm',
	initComponent: function () {
		Ext.apply(this, {
			layout: 'fit',
			anchor: '100%',
			monitorValid: false,
			items: [this.mainPanel = new Ext.TabPanel({
				activeItem: 0,
				bodyStyle:'padding: 1px 0px 1px 1px',
				frame: true,
				layoutOnTabChange: true,
				forceLayout: false,
				deferredRender: false,
				defaultType: this.defaultFormType,
				defaults: {
					editor: this,
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
					value: this.value,
					isNew: this.isNew,
					layout: 'form',
					anchor: '90%',
					frame: true,
					border: true,
					allowBlank: false,
					labelWidth: 100,
					defaultType: 'textfield',
					defaults: {
						editor: this,
						principal: this.entity.security,
						bodyStyle:'padding: 1px 0px 1px 1px',
						anchor: '95%',
						allowBlank: false,
						selectOnFocus: true,
						msgTarget: 'side',
						validationDelay: 1000,
						listeners: {
							change: { 
								fn: function(field, newValue, oldValue) {
									this.fireEvent('change', field, newValue, oldValue);
								}, 
								scope: this 
							}
						}
					}
				},
				items: this.sections
			})]
		});
		Karma.Editor.layouts.Tab.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('cmp.editor.tab', Karma.Editor.layouts.Tab);
Karma.EBTab = Karma.Editor.layouts.Tab;

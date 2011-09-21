/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */
Karma.Editor.layouts.Simple = Ext.extend(Karma.Editor.EditorBase, {
    initComponent: function(){
        Ext.apply(this, {
            anchor: '100%',
            monitorValid: false,
            frame: true,
            border: true,
            allowBlank: false,
            labelWidth: 100,
            defaultType: 'textfield',
            defaults: {
				principal: this.entity.security,
                bodyStyle: 'padding: 1px 0px 1px 1px',
                anchor: '95%',
                allowBlank: false,
                selectOnFocus: true,
                msgTarget: 'side',
                validationDelay: 1000,
                listeners: {
                    change: {
                        fn: function(field, newValue, oldValue){
                            this.fireEvent('change', field, newValue, oldValue);
                        },
                        scope: this
                    }
                }
            },
			items: this.sections
        });
        Karma.Editor.layouts.Simple.superclass.initComponent.apply(this, arguments);
		this.mainpanel = this;
    },
	onBeforeSave: function(value) { return true; },
	onAfterSave: function(value) { },
	onBeforeUpdate: function(value) { return true; },
	onAfterUpdate: function(value) { },
	onBeforeOperation: function(op, value) { return true; },
	onAfterOperation: function(op, value) { },
	onLoad: function(value) { }
});
Ext.reg('cmp.editor.simple', Karma.Editor.layouts.Simple);
Karma.EBSimple = Karma.Editor.layouts.Simple;

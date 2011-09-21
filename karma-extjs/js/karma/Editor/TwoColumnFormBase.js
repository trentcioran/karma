/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */

Karma.Editor.TwoColumnFormBase = Ext.extend(Karma.Editor.FormBase, {
	initComponent: function (){
		var col1PanelId = Ext.id(), col2PanelId = Ext.id();
		Ext.apply(this, {
			layout: 'column',
			anchor: '90%',
			layoutConfig: {
				columns: 2
			},
			defaultType: 'panel',
			defaults: {
				editor: this,
				entity: this.entity,
				metadata: this.metadata,
				security: this.security,
				value: this.value,
				isNew: this.isNew,
				columnWidth:0.5,
				layout: 'form',
				border: false,
				frame: false,
				defaultType: 'textfield',
				bodyStyle:'padding: 10px 10px 0px 10px',
				labelWidth: 80,
				defaults: { 
					anchor: '95%',
					allowBlank: false,
					selectOnFocus: true,
					msgTarget: 'side',
					listeners: {
						change: {
							fn: function(field, newValue, oldValue) {
								this.fireEvent('change', field, newValue, oldValue);
							},
							scope: this
						},
						invalid: {
							fn: function(field, msg) {
								field.getEl().highlight();
								this.fireEvent('invalid', this, field, msg);
							},
							scope: this
						}
					}
				}
			},
			items: [{
				id: col1PanelId,
				items: this.column1items
			}, {
				id: col2PanelId,
				items: this.column2items
			}]
		});
		Karma.Editor.TwoColumnFormBase.superclass.initComponent.apply(this, arguments);
		this.col1Panel = this.findById(col1PanelId);
		this.col2Panel = this.findById(col2PanelId);
	},
	disableInternal: function(items) {
        items.each(function(item){
            item.disable();
        }, this);
	},
    disable: function(){
			this.disableInternal(this.col1Panel.items);
			this.disableInternal(this.col2Panel.items);
    }
});
Ext.reg('cmp.editor.card.frm2', Karma.Editor.TwoColumnFormBase);
Karma.FB2 = Karma.Editor.TwoColumnFormBase;

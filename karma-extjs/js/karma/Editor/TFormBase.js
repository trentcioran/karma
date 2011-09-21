/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */

Karma.Editor.TFormBase = Ext.extend(Karma.Editor.FormBase, {
	initComponent: function (){
        var col1PanelId = Ext.id(), col2PanelId = Ext.id(), col3PanelId = Ext.id();
        Ext.apply(this, {
            layout: 'border',
			editor: this.editor,
            defaultType: 'panel',
            items: [{
                region: 'north',
                layout: 'column',
                anchor: '95%',
                layoutConfig: {
                    columns: 2
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
                    columnWidth: 0.5,
					editor: this.editor,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaultType: 'textfield',
                    bodyStyle: 'padding: 10px 10px 0px 10px',
                    labelWidth: 100,
                    defaults: {
						editor: this.editor,
						entity: this.entity,
						metadata: this.metadata,
						security: this.security,
                        anchor: '95%',
                        allowBlank: false,
                        selectOnFocus: true,
                        msgTarget: 'side',
                        listeners: {
                            change: {
                                fn: function(field, newValue, oldValue){
                                    this.fireEvent('change', field, newValue, oldValue);
                                },
                                scope: this
                            },
                            invalid: {
                                fn: function(field, msg){
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
            }, {
                region: 'center',
                layout: 'vbox',
                layoutConfig: {
                    align: 'stretch',
                    pack: 'start'
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
					editor: this.editor,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaults: {
						editor: this.editor,
						entity: this.entity,
						metadata: this.metadata,
						security: this.security,
                        anchor: '95%',
                        listeners: {
                            change: {
                                fn: function(field, newValue, oldValue){
                                    this.fireEvent('change', field, newValue, oldValue);
                                },
                                scope: this
                            }
                        }
                    }
                },
                items: [{
                    id: col3PanelId,
                    flex: 1,
                    items: this.column3items
                }]
            }]
        });
        Karma.Editor.TFormBase.superclass.initComponent.apply(this, arguments);
        this.col1Panel = this.findById(col1PanelId);
        this.col2Panel = this.findById(col2PanelId);
        this.col3Panel = this.findById(col3PanelId);
    },
	disableInternal: function(items) {
        items.each(function(item){
            item.disable();
        }, this);
	},
    disable: function(){
			this.disableInternal(this.col1Panel.items);
			this.disableInternal(this.col2Panel.items);
			this.disableInternal(this.col3Panel.items);
    }
});
Ext.reg('cmp.editor.card.tfrm', Karma.Editor.TFormBase);
Karma.TFB = Karma.Editor.TFormBase;

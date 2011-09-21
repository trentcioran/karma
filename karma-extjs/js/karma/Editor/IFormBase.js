/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */

Karma.Editor.IFormBase = Ext.extend(Karma.Editor.FormBase, {
	initComponent: function (){
        var col1PanelId = Ext.id(), col2PanelId = Ext.id(), col3PanelId = Ext.id(), 
			col4PanelId = Ext.id(), col5PanelId = Ext.id();
        Ext.apply(this, {
            layout: 'border',
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
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaultType: 'textfield',
                    bodyStyle: 'padding: 10px 10px 0px 10px',
                    labelWidth: 80,
                    defaults: {
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
                    pack: 'start',
                },
                defaultType: 'panel',
                defaults: {
					entity: this.entity,
					metadata: this.metadata,
					security: this.security,
                    layout: 'form',
                    border: false,
                    frame: false,
                    defaults: {
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
                }, {
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
                        layout: 'form',
                        border: false,
                        frame: false,
                        defaultType: 'textfield',
                        bodyStyle: 'padding: 10px 10px 0px 10px',
                        labelWidth: 150,
                        defaults: {
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
						id: col4PanelId,
                        items: this.column4items
                    }, {
						id: col5PanelId,
                        items: this.column5items
                    }]
                }]
            }]
        });
        Karma.Editor.IFormBase.superclass.initComponent.apply(this, arguments);
        this.col1Panel = this.findById(col1PanelId);
        this.col2Panel = this.findById(col2PanelId);
        this.col3Panel = this.findById(col3PanelId);
        this.col4Panel = this.findById(col4PanelId);
        this.col5Panel = this.findById(col5PanelId);
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
			this.disableInternal(this.col4Panel.items);
			this.disableInternal(this.col5Panel.items);
    }
});
Ext.reg('cmp.editor.card.ifrm', Karma.Editor.IFormBase);
Karma.IFB = Karma.Editor.IFormBase;

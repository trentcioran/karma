/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */

Karma.Editor.layouts.Card = Ext.extend(Karma.Editor.EditorBase, {
	defaultFormType: 'cmp.editor.frm',
	initComponent: function () {
		Ext.apply(this, {
			layout: 'border',
			anchor: '100%',
			monitorValid: false,
			items: [new Ext.tree.TreePanel({
				xtype: 'treepanel',
				region: 'west',
				title: 'Secciones',
				width: 170,
				autoScroll: true,
				split:true,
				collapsible: true,
				collapseMode: 'mini',
				border: true,
				lines: false,
				rootVisible: false,
				root: this.menu = this.generateMenu(),
				listeners: { 
					click: { 
						fn: function(node) {
							this.mainPanel.getLayout().setActiveItem(this.menu.indexOf(node));
							this.mainPanel.doLayout();
							this.fireEvent('any');
						}, 
						scope: this 
					}
				}
			}), this.mainPanel = new Ext.Panel({
				layout: 'card',
				region: 'center',
				activeItem: 0,
				bodyStyle:'padding: 1px 0px 1px 1px',
				frame: true,
				deferredRender: true,
				layoutOnCardChange: true,
				forceLayout: false,
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
					allowBlank: false,
					labelWidth: 100,
					defaultType: 'textfield',
					listeners: {
						change: { 
							fn: function(field, newValue, oldValue) {
								this.fireEvent('change', field, newValue, oldValue);
							}, 
							scope: this 
						}
					},
					defaults: {
						security: this.security,
						editor: this,
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
		Karma.Editor.layouts.Card.superclass.initComponent.apply(this, arguments);
	},
	generateMenu: function () {
		var children = new Array();
		Ext.each(this.sections, function(section) {
			children.push({
				leaf: true,
				text: section.title
			});
		}, this);
		var root = new Ext.tree.AsyncTreeNode({
			text: 'Secciones',
			nodeType: 'async',
			expanded: true,
			children: children
		});
		return root;
	}
});
Ext.reg('cmp.editor.card', Karma.Editor.layouts.Card);
Karma.EBCard = Karma.Editor.layouts.Card;

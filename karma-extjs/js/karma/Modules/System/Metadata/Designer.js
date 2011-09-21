/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.Designer = Ext.extend(Ext.Panel, {
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            border: false,
            frame: false,
            defaultType: 'panel',
			defaults: {
                border: true,
                frame: false,
				defaults: {
	                border: false,
	                frame: false,
					entity: this.entity
				}
			},
            items: [{
                region: 'west',
                resizeTabs: true,
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                width: 270,
                layout: 'anchor',
                items: [{
					id: 'entity.browser',
					anchor: '100%, 40%',
                    xtype: 'meta.ebrowser',
					listeners: {
						'select': {
							fn: this.onEntitySelect,
							scope: this
						}
					}
                }, {
					id: 'entity.details',
					anchor: '100%, 60%',
                    xtype: 'meta.epgrid'
                }]
            }, {
                xtype: 'tabpanel',
                region: 'center',
                activeTab: 0,
                items: [{
					id: 'editor.builder',
                    xtype: 'meta.ebuilder'
                }, {
					id: 'searchlist.builder',
                    xtype: 'meta.slbuilder'
                }]
            }]
        });
        Karma.Modules.System.Metadata.Designer.superclass.initComponent.apply(this, arguments);
        Ext.getCmp('windows.view').collapse();
    },
	onEntitySelect:function(entity) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Designer] Entity:' + entity);
        }
        this.entity.useInvoker('GetDescription', entity, {
            fn: function(description){
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Designer] entity description: ' + description);
                }
				this.findById('entity.details').setDetails(description);
            },
            scope: this
        });
        this.entity.useInvoker('GetMetadata', entity, {
            fn: function(metadata){
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Designer] entity metadata: ' + metadata);
                }
				var editor = this.findById('editor.builder');
				var searchlist = this.findById('searchlist.builder');
				editor.clear();
				editor.setEntity(metadata);
				searchlist.clear();
				searchlist.setEntity(metadata);
            },
            scope: this
        });
	}
});

Ext.reg('meta.designer', Karma.Modules.System.Metadata.Designer);

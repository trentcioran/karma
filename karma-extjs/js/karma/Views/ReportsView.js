/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.View.ReportsView = Ext.extend(Ext.Panel, {

    title: 'Reportes',
    
    iconCls: 'icon-graph',
    
    section: 'ops',
    
	initComponent: function() {
		this.moduleMgr = Karma.Core.ModuleManager.Instance;
        var modules = this.process(this.moduleMgr.getAll());
        Ext.apply(this, {
            layout: 'accordion',
            border: false,
            headerCfg: {
                tag: 'center',
                cls: 'x-navigation-header'
            },
            layoutConfig: {
                titleCollapse: true,
                hideCollapseTool: false,
                animate: true
            },
            items: modules
        });
		Karma.View.ReportsView.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
	},
    
    onEntityClick: function(node){
        var entity = node.attributes.entity;
        this.fireEvent('select', entity);
    },
    
    process: function(modules){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ReportsView.process]<- ');
		}
        var _modules = new Array();
		var reporter = Karma.Core.ModuleManager.Instance.getEntity('ReportBuilder');
        Ext.each(modules, function(module, index){
            if (!module.isHidden()) {
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ReportsView.process] Processing module: ' + module.getName());
				}
				var hasEntityWithReports = false;
				var nodeArray = [];
				module.getEntities().each(function(entity, index){
					if (!entity.isHidden() && !Ext.isEmpty(entity.metadata.Reports)) {
						if (PLOG.isDebugEnabled()) {
							PLOG.debug('[ReportsView.process] Entity: ' + entity.getName() + 
								' has reports: ' + entity.metadata.ReportsPath);
						}
						hasEntityWithReports = true;
						nodeArray.push({
                            text: entity.getName(),
                            leaf: true,
							iconCls: 'icon-graph',
                            entity: reporter.getWrapper(entity)
                        });
                    }
                }, this);

                if (hasEntityWithReports) {
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[ReportsView.process] Adding menu for: ' + module.getName() + 
							', nodes: ' + nodeArray);
					}
	                _modules.push(new Ext.tree.TreePanel({
	                    title: module.getName(),
	                    loader: new Ext.tree.TreeLoader({
	                        preloadChildren: true
	                    }),
	                    root: {
							nodeType: 'async',
							allowChildren: true,
	                        expanded: true,
							children: nodeArray
	                    },
			            autoScroll: true,
		                rootVisible: false,
		                lines: false,
		                listeners: {
		                    'click': {
		                        fn: this.onEntityClick,
		                        scope: this
		                    }
		                }
	                }));
				}
            }
        }, this);
		return _modules;
    }
});

Ext.reg('reports.view', Karma.View.ReportsView);

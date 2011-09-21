/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Parts.ApplicationWindow = Ext.extend(Ext.Viewport, {

    hometabXType: null,
    
    timeout: null,
    
    footer: null,
    
    userDataXTemplate: null,
    
    activityMonitor: null,
    
    initComponent: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[ApplicationWindow.initComponent] <-');
        }
        Ext.apply(this, {
            layout: 'border',
            items: {
                region: 'center',
                xtype: 'panel',
                anchor: '100%',
                layout: 'border',
                closable: false,
                collapsible: false,
                minimizable: false,
                modal: true,
                constrain: true,
                plain: true,
                border: false,
                frame: false,
                resizable: false,
                onEsc: Ext.emptyFn,
                bodyStyle: 'padding:0px 0px 0px 0px; margin:0px 0px 0px 0px',
                tbar: [{
                    text: 'Principal',
                    iconCls: 'icon-application',
                    menu: {
                        items: [{
                            text: 'P&aacute;gina principal',
                            iconCls: 'icon-home',
                            handler: function(){
                                var container = this.findById('module.container');
                                container.setHomeTab();
                                this.fireEvent('activity');
                            },
                            scope: this
                        }, '-', {
                            text: 'Cerrar Sesi&oacute;n',
                            iconCls: 'icon-exit',
                            handler: this.onShutdown,
                            scope: this
                        }]
                    }
                }, {
                    xtype: 'menu.modules',
                    listeners: {
                        'activity': {
                            fn: function(){
                                this.fireEvent('activity');
                            },
                            scope: this
                        },
                        'select': {
                            fn: this.onEntitySelect,
                            scope: this
                        }
                    }
                }, {
                    xtype: 'menu.tools',
                    listeners: {
                        'activity': {
                            fn: function(){
                                this.fireEvent('activity');
                            },
                            scope: this
                        }
                    }
                }, {
                    xtype: 'menu.windows',
                    listeners: {
                        'activity': {
                            fn: function(){
                                this.fireEvent('activity');
                            },
                            scope: this
                        }
                    }
                }, {
                    xtype: 'menu.views'
                }, {
                    xtype: 'menu.help'
                }, {
                    iconCls: 'icon-home',
                    qtip: 'P&aacute;gina principal',
                    handler: function(){
                        var container = this.findById('module.container');
                        container.setHomeTab();
                        this.fireEvent('activity');
                    },
                    scope: this
                }, '->', 'Tema: ', {
                    xtype: 'themechanger'
                }, {
                    text: 'Cerrar Sesi&oacute;n',
                    iconCls: 'icon-exit',
                    handler: this.onShutdown,
                    scope: this
                }],
                items: [{
                    id: 'modules.view',
                    xtype: 'panel',
                    layout: 'accordion',
                    activeItem: 0,
                    enableTabScroll: true,
                    minTabWidth: 75,
                    tabMargin: 1,
                    resizeTabs: true,
                    split: true,
                    collapsible: true,
                    collapseMode: 'mini',
                    region: 'west',
                    tabPosition: 'bottom',
                    defaultType: 'panel',
                    width: 190,
                    defaults: {
                        headerCfg: {
                            tag: 'center',
                            cls: 'x-navigation-header'
                        }
                    },
                    layoutConfig: {
                        titleCollapse: true,
                        layoutOnTabChange: true,
                        animate: true
                    },
                    defaults: {
                        listeners: {
                            'select': {
                                fn: this.onEntitySelect,
                                scope: this
                            }
                        }
                    },
                    items: [{
                        xtype: 'modules.view'
                    }, {
                        xtype: 'reports.view'
                    }, {
                        xtype: 'system.view'
                    }, {
                        xtype: 'favorites.view'
                    }]
                }, {
                    id: 'module.container',
                    xtype: 'workpanel',
                    hometabXType: this.hometabXType,
                    listeners: {
                        'activity': {
                            fn: this.onActivityFound,
                            scope: this
                        }
                    }
                }, {
                    id: 'windows.view',
                    xtype: 'windows.view',
                    listeners: {
                        'any': {
                            fn: this.onActivityFound,
                            scope: this
                        },
                        'activity': {
                            fn: this.onActivityFound,
                            scope: this
                        }
                    }
                }],
                bbar: new Karma.Parts.StatusBar({
                    userData: Karma.Core.Principal.Instance.getData(),
                    footer: this.footer,
                    userDataXTemplate: this.userDataXTemplate
                })
            }
        });
        Karma.Parts.ApplicationWindow.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'about': true
        });
        this.addEvents({
            'shutdown': true
        });
        this.addEvents({
            'activity': true
        });
        this.getEl().fadeIn({
            easing: 'easeIn',
            duration: 1
        });
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[ApplicationWindow.initComponent] ->');
        }
    },
    
    onEntitySelect: function(entity){
        var container = this.findById('module.container');
        container.setEntityTab(entity);
        this.fireEvent('activity');
    },
    
    onShutdown: function(){
        if (Karma.Core.WindowManager.Instance.existsDirty()) {
            Ext.Msg.show({
                title: 'Guardar cambios?',
                msg: 'Existen ventanas con cambios pendientes. Deseas salir del sistema?',
                buttons: Ext.Msg.YESNO,
                fn: function(result){
                    if (result === 'yes') {
                        this.fireEvent('shutdown');
                    }
                },
                icon: Ext.MessageBox.QUESTION,
                scope: this
            });
        }
        else {
            this.fireEvent('shutdown');
        }
    },
    
    onActivityFound: function(){
        this.fireEvent('activity');
    }
    
});

Ext.reg('application.win', Karma.Parts.ApplicationWindow);

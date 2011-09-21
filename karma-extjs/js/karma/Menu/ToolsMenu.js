/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.ToolsMenu = Ext.extend(Ext.Button, {

    initComponent: function() {
        Ext.apply(this, {
            id: 'mnuTools',
            iconCls: 'icon-wrench',
            text: 'Herramientas',
            menu: {
                items: [{
                    text: 'Importador',
                    iconCls: 'icon-import',
                    handler: function() {
                        var myid = Ext.id();
                        Ext.ComponentMgr.create({
                            id: myid
                        }, 'importer');
                        this.fireEvent('activity');
                        Karma.WinManager.Instance.register(myid, 'Importador');
                    },
                    scope: this
                }, {
                    text: 'Mensajeria Masiva',
                    iconCls: 'icon-import',
                    handler: function() {                        
                        var myid = Ext.id();                                                
                        Ext.ComponentMgr.create({
                        id: myid
                        }, 'shipper');                        
                        this.fireEvent('activity');                        
                        Karma.WinManager.Instance.register(myid, 'ShipmentTracker');
                    },
                    scope: this
                }, {
                    text: 'Preferencias',
                    iconCls: 'icon-prefs',
                    handler: function() {
                    },
                    scope: this
                }, {
                    text: 'Avanzado',
                    iconCls: 'icon-advanced',
                    menu: {
                        items: [{
                            text: 'Habilitar depuracion Ext',
                            iconCls: 'icon-advanced',
                            handler: function() {
                                Ext.log('Enabling Ext debug console...');
                            },
                            scope: this
}]
                        }
}]
                    }
                });

                Karma.ToolsMenu.superclass.initComponent.apply(this, arguments);
                this.addEvents({
                    'activity': true
                });
            }
        });
Ext.reg('menu.tools', Karma.ToolsMenu);

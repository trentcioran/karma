/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.HelpMenu = Ext.extend(Ext.Button, {

    initComponent: function(){
        Ext.apply(this, {
            id: 'mnuAbout',
            iconCls: 'icon-help',
            text: 'Ayuda',
            menu: {
                items: [{
                    text: 'Ayuda',
                    iconCls: 'icon-help',
                    handler: function(){
                        Ext.ComponentMgr.create({}, Karma.Core.Configuration.ApplicationHelp);
                        this.fireEvent('activity');
                    },
                    scope: this
                }, '-', {
                    text: 'Acerca de ' + Karma.Core.Configuration.ApplicationName,
                    iconCls: 'icon-info',
                    handler: function(){
                        Ext.ComponentMgr.create({}, Karma.Core.Configuration.ApplicationAbout);
                        this.fireEvent('activity');
                    },
                    scope: this
                }, {
                    text: 'Acerca de ĸarмa',
                    iconCls: 'icon-info',
                    handler: function(){
                        new Karma.About();
                        this.fireEvent('activity');
                    },
                    scope: this
                }]
            }
        });
        
        Karma.HelpMenu.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'activity': true
        });
    }
});
Ext.reg('menu.help', Karma.HelpMenu);

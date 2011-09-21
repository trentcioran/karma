/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Controls.EntityLinkWindow = Ext.extend(Ext.Window, {

    parameters: null,
    
    columns: null,
    
    layout: 'form',
    
    border: true,
    
    closable: true,
    
    frame: true,
    
    autoShow: true,
    
    modal: true,
    
    minimizable: false,
    
    maximizable: false,
    
    plain: true,
    
    constrain: true,
    
    height: 350,        
    
    allowMultiple: false,
    
    initComponent: function(){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.initComponent] <-');
        }
        var linkSearch = {
            xtype: 'entity.search',
            anchor: '100% 100%',
            listeners: {
                'select': {
                    fn: this.onSelect,
                    scope: this
                }
            }
        };
        Ext.apply(linkSearch, this.parameters);
        Ext.apply(this, {
            items: linkSearch
        });
        Karma.Controls.EntityLinkWindow.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'select': true
        });
        this.doLayout();
        this.show();
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.initComponent] ->');
        }
    },
    
    onSelect: function(record){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.onSelect] <-');
        }
        this.fireEvent('select', record);
        if (!this.allowMultiple) {
            this.close();
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkWindow.onSelect] ->');
        }
    }
    
});

Ext.reg('entity.window', Karma.Controls.EntityLinkWindow);

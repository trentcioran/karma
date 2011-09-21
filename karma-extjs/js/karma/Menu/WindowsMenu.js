/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.WindowsMenu = Ext.extend(Ext.Button, {

    windowMgr: null,
    
    windows: new Ext.util.MixedCollection(),
    
    cursor: 0,
    
    innerMenu: null,
    
    nextOpt: null,
    
    prevOpt: null,
    
    windowsOpt: null,
    
    initComponent: function(){
        this.windowMgr = Karma.Core.WindowManager.Instance;
        this.windowMgr.on('register', this.onRegister, this);
        this.windowMgr.on('titlechange', this.onTitleChange, this);
        this.windowMgr.on('close', this.onClose, this);
        
        Ext.apply(this, {
            id: 'mnuWindows',
            text: 'Ventanas',
            iconCls: 'icon-windows',
            menu: {
                items: [this.nextOpt = new Ext.menu.Item({
                    text: 'Siguiente ventana',
                    iconCls: 'icon-window-next',
                    handler: this.onNextClick,
                    disabled: true,
                    scope: this
                }), this.prevOpt = new Ext.menu.Item({
                    text: 'Ventana anterior',
                    iconCls: 'icon-window-prev',
                    handler: this.onPrevClick,
                    disabled: true,
                    scope: this
                }), '-', this.windowsOpt = new Ext.menu.Item({
                    text: 'Ventanas',
                    menu: this.innerMenu = new Ext.menu.Menu({
                        defaults: {
                            iconCls: 'icon-window'
                        },
                        items: []
                    }),
                    iconCls: 'icon-windows',
                    disabled: true
                })]
            }
        });
        
        Karma.WindowsMenu.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            'any': true,
            'activity': true
        });
    },
    
    onWindowClick: function(menu){
        var winId = menu.initialConfig.text;
        this.showWindow(winId);
        this.fireEvent('activity');
    },
    
    onNextClick: function(){
        var win = Ext.WindowMgr.getActive();
        var idx = this.windows.indexOf(win.getId()) + 1;
        if (idx > this.windows.getCount() - 1) {
            idx = 0;
        }
        this.showWindow(this.windows.get(idx).initialConfig.text);
        this.fireEvent('activity');
    },
    
    onPrevClick: function(){
        var win = Ext.WindowMgr.getActive();
        var idx = this.windows.indexOf(win.getId()) - 1;
        if (idx < 0) {
            idx = this.windows.getCount() - 1;
        }
        this.showWindow(this.windows.get(idx).initialConfig.text);
        this.fireEvent('activity');
    },
    
    onRegister: function(win){
        var mnu = new Ext.menu.Item({
            text: win.title
        });
        mnu.on('click', this.onWindowClick, this)
        this.windows.add(win.getId(), mnu);
        this.innerMenu.add(mnu);
        
        this.nextOpt.setDisabled(false);
        this.prevOpt.setDisabled(false);
        this.windowsOpt.setDisabled(false);
    },
    
    onTitleChange: function(win, newTitle){
        var mnu = this.windows.get(win.getId());
        mnu.setText(newTitle);
    },
    
    onClose: function(winId){
        this.innerMenu.remove(this.windows.get(winId));
        this.windows.removeKey(winId);
        if (this.windows.getCount() === 0) {
            this.nextOpt.setDisabled(true);
            this.prevOpt.setDisabled(true);
            this.windowsOpt.setDisabled(true);
        }
    },
    
    showWindow: function(winId){
        var win = this.windowMgr.get(winId);
        if (!Ext.isEmpty(win)) {
            win.show();
            Ext.WindowMgr.bringToFront(win);
        }
        else {
            this.remove(this.windows[winId]);
            delete this.windows[winId];
        }
        this.fireEvent('any');
    }
    
});
Ext.reg('menu.windows', Karma.WindowsMenu);

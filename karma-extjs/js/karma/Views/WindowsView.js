/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.View.WindowsView = Ext.extend(Ext.tree.TreePanel, {
	
	windows: new Ext.tree.AsyncTreeNode({
		expanded: true,
		children: []
	}),
	
	windowMgr: null,
	
	nodeReferences: [],
	
	initComponent: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.initComponent] <-');
		}
		this.windowMgr = Karma.Core.WindowManager.Instance;
		this.windowMgr.on('register', this.onRegister, this);
		this.windowMgr.on('close', this.onClose, this);
		this.windowMgr.on('show', this.onShow, this);
		this.windowMgr.on('minimize', this.onMinimize, this);
		this.windowMgr.on('titlechange', this.onTitleChange, this);
		this.windowMgr.on('flush', this.onFlush, this);
		
		Ext.apply(this, {
			title: 'Ventanas abiertas',
			region: 'east',
			collapsible: true,
			split: true,
			iconClse: 'icon-windows',
			collapseMode: 'mini',
			width: 170,
			layoutConfig: {
		        titleCollapse: true,
		        animate: true
		    },
	        autoScroll: true,
			lines: false,
	        loader: new Ext.tree.TreeLoader(),
	        root: this.windows,
	        rootVisible: false
		});
		Karma.View.WindowsView.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'any' : true, 'activity': true });
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.initComponent] ->');
		}
	},
	
	onClick: function(node){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClick] <-');
		}
		var winId = node.attributes.windowId;
		var win = this.windowMgr.get(winId);
		if(!Ext.isEmpty(win)) {
			if (win.isVisible()) {
				win.hide();
			}
			else {
				win.show();
			}
		} else {
			PLOG.debug('[WindowsView.onClick] There is no window with the id [' + winId + ']');
			this.windows.removeChild(this.nodeReferences[winId]);
		}
		this.fireEvent('activity');
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClick] ->');
		}
	},
	
	onContextMenu: function(node, e) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onContextMenu] <-');
		}
		node.select();
		e.preventDefault();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onContextMenu] ->');
		}
	},
	
	onRegister: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onRegister] <-');
		}
		this.nodeReferences[win.getId()] = new Ext.tree.TreeNode({
			text: win.title,
			leaf: true,
			iconCls: 'icon-window',
			windowId: win.getId(),
			windowTitle: win.title,
			listeners: { 
				'dblclick': { fn: this.onClick, scope: this}, 
				'contextmenu': { fn: this.onContextMenu, scope: this}
			}
		});
		this.windows.appendChild(this.nodeReferences[win.getId()]);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onRegister] ->');
		}
	},
	
	onClose: function(winId) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClose] <-');
		}
		this.windows.removeChild(this.nodeReferences[winId]);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onClose] ->');
		}
	},
	
	onShow: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onShow] <-');
		}
		this.nodeReferences[win.getId()].select();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onShow] ->');
		}
	},
	
	onMinimize: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onMinimize] <-');
		}
		win.hide();
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onMinimize] ->');
		}
	},
	
	onFlush: function(win) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onFlush] <-');
		}
		var node = this.nodeReferences[win.getId()];
		node.setText(node.attributes.windowTitle);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onFlush] ->');
		}
	},
	
	onTitleChange: function(win, newTitle) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onTitleChange] <-');
		}
		var node = this.nodeReferences[win.getId()];
		node.attributes.windowTitle = newTitle;
		node.setText(node.attributes.windowTitle);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[WindowsView.onTitleChange] ->');
		}
	}
	
});

Ext.reg('windows.view', Karma.View.WindowsView);

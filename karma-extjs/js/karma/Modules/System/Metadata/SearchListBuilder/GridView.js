/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.GridView = Ext.extend(Ext.grid.GridView, {
    initComponent: function(){
        Karma.Modules.System.Metadata.GridView.superclass.initComponent.apply(this, arguments);
        this.addEvents({
        	'remove': true
        });
    },
    
    renderUI: function(){
        Karma.Modules.System.Metadata.GridView.superclass.renderUI.apply(this, arguments);
        if(this.hmenu){
            this.hmenu.removeAll(true);
            this.propertiesMenu = new Ext.menu.Menu({ id: 'display-property-menu' });
            this.propertiesMenu.on({
                scope: this,
                beforeshow: this.beforePropertiesMenuShow,
                itemclick: this.handleHdMenuClick
            });
            this.hmenu.add(new Ext.menu.CheckItem({
                id: 'sortable',
                text: 'Sortable',
                checked: true
            }), new Ext.menu.CheckItem({
                id: 'visible',
                text: 'Visible',
                checked: true
            }), '-', {
                id: 'displayProperty',
                text: 'Display property',
                menu: this.propertiesMenu,
                iconCls: 'x-cols-icon'
            }, '-', {
                id: 'remove',
                text: 'Remove'
            });
        }
    },
    
    onHeaderClick : function(g, index){
        if(this.headersDisabled || !this.cm.isSortable(index)){
            return;
        }
        g.stopEditing(true);
    },

    handleHdMenuClick: function(item){
        var index = this.hdCtxIndex;
        var cm = this.cm;
        switch(item.itemId){
            case "sortable":
            	cm.setSortable(index, true);
                break;
            case "visible":
            	cm.setHidden(index, true);
                break;
            case "remove":
            	cm.removeColumn(index);
                break;
            /*default:
                index = cm.getIndexById(item.itemId.substr(4));
                if(index != -1){
                    if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
                        this.onDenyColumnHide();
                        return false;
                    }
                    cm.setHidden(index, item.checked);
                }*/
        }
        return true;
    },
    
    beforePropertiesMenuShow: function() {
        /*var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            if(cm.config[i].fixed !== true && cm.config[i].hideable !== false){
                this.colMenu.add(new Ext.menu.CheckItem({
                    itemId: "property-"+cm.getColumnId(i),
                    text: cm.getColumnHeader(i),
                    checked: !cm.isHidden(i),
                    hideOnClick:false,
                    disabled: cm.config[i].hideable === false
                }));
            }
        }*/
    },
    
    handleHdDown : function(e, t){
        if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
            e.stopEvent();
            var hd = this.findHeaderCell(t);
            Ext.fly(hd).addClass('x-grid3-hd-menu-open');
            var index = this.getCellIndex(hd);
            this.hdCtxIndex = index;
            var ms = this.hmenu.items, cm = this.cm;
            this.hmenu.on("hide", function(){
                Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
            }, this, {single:true});
            this.hmenu.show(t, "tl-bl?");
        }
    }
});
Ext.reg('meta.sl.gridview', Karma.Modules.System.Metadata.GridView);


Karma.Modules.System.Metadata.ColumnModel = Ext.extend(Ext.grid.ColumnModel, {
    removeColumn : function(colIndex){
        var c = this.config[colIndex];
        this.dataMap = null;
        this.fireEvent("configchange", this);
    },

    addColumn : function(c, colIndex){
        this.config.splice(colIndex, 0, c);
        this.dataMap = null;
        this.fireEvent("configchange", this);
    },
    
    setHidden : function(colIndex, hidden){
        var c = this.config[colIndex];
        if(c.hidden !== hidden){
            c.hidden = hidden;
        }
    },

    setSortable : function(colIndex, sortable){
        var c = this.config[colIndex];
        if(c.sortable !== sortable){
            c.sortable = sortable;
        }
    }
});

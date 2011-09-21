/**
 * @author trentcioran
 */
Ext.ux.TreeComboBox = Ext.extend(Ext.form.ComboBox, {

    tree: null,
    
    treeId: 0,
    
    initComponent: function(){    
        this.treeId = Ext.id();
        this.focusLinkId = Ext.id();
        
		Ext.apply(this, {
            store: new Ext.data.SimpleStore({
                fields: [],
                data: [[]]
            }),
            editable: false,
            shadow: false,
            mode: 'local',
            triggerAction: 'all',
            maxHeight: 200,
            tpl: '<tpl for="."><div style="height:200px"><div id="' + this.treeId + '"></div><a href="#" class="x-grid3-focus" id="' + this.focusLinkId + '" tabIndex="-1"/></div></tpl>',
            selectedClass: '',
            onSelect: Ext.emptyFn,
            valueField: 'id'
        });
        var treeConfig = {
            border: false
        };
        Ext.apply(treeConfig, this.treeConfig);
        if (!treeConfig.root) {
            treeConfig.root = new Ext.tree.AsyncTreeNode({
                text: 'treeRoot',
                id: '0'
            });
        }
        this.tree = new Ext.tree.TreePanel(treeConfig);
        this.on('expand', this.onExpand);
        this.tree.on('click', this.onClick, this);
        Ext.ux.TreeComboBox.superclass.initComponent.call(this);        
    },
    
    onTriggerClick: function(){
        if (this.disabled) {
            return;
        }
        if (this.isExpanded()) {
            this.collapse();
        }
        else {
            this.onFocus({});
            if (this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            }
            else {
                this.doQuery(this.getRawValue());
            }
        }
    },
    
    onFocus: function(){
        Ext.ux.TreeComboBox.superclass.onFocus.call(this);
        Ext.get(this.focusLinkId).focus();
    },
    
    onClick: function(node){
        this.valueNotFoundText = node.text;
        this.setValue(node.id);
        this.collapse();
    },
    
    onExpand: function(){
        this.tree.render(this.treeId);
        this.tree.focus();
    }
    
});

Ext.reg("treecombobox", Ext.ux.TreeComboBox);

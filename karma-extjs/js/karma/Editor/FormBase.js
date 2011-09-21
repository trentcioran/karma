/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */
Karma.Editor.FormBase = Ext.extend(Ext.Panel, {
    hasAggregates: false,
    initComponent: function(){
        Karma.Editor.FormBase.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'change': true });
    },
    onBeforeSave: function(value){
		return true;
    },
    onBeforeUpdate: function(value){
		return true;
    },
    onAfterSave: function(value){
        this.enableAggregates(value);
        this.updateControls(value);
    },
    onAfterUpdate: function(value){
        this.updateControls(value);
    },
    onBeforeOperation: function(operation, value){
		return true;
    },
    onAfterOperation: function(operation, value){
    },
    onLoad: function(value){
        this.value = value;
        this.enableAggregates(value);
        this.updateControls(value);
    },
    getForm: function(){
        return this.editor.getForm();
    },
    disable: function(){
        this.items.each(function(item, index, all){
            if (item.disable) {
                item.disable();
            }
        }, this);
    }
});

Ext.reg('cmp.editor.frm', Karma.Editor.FormBase);
Karma.FB = Karma.Editor.FormBase;

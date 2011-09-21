
Ext.ux.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            this.store.baseParams = this.store.baseParams || {};
	        this.store.baseParams.Parameters.Criteria = '';
	        this.store.baseParams.Parameters.Start = 0;
	        this.store.reload();
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams.Parameters.Criteria = v;
        this.store.baseParams.Parameters.Start = 0;
        this.store.reload();
		if (v) {
	        this.triggers[0].show();
	        this.hasSearch = true;
		}
    }
});

Ext.reg('searchfield', Ext.ux.SearchField);

/**
* Karma
* @author Mislas
*/

Karma.Editor.Actions.ActionBase = Ext.extend(Ext.form.Action, {
    type: 'action.base',
    run: function(){
        Ext.Ajax.request(Ext.apply(
            this.createCallback(this.options), 
			this.getConfigObject()
		));
    },
    success: function(response){
        var value = this.processResponse(response);
        if(!value.Success){
			this.failureType = Ext.form.Action.SERVER_INVALID;
			this.Result = value;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(value.Result);
        this.form.afterAction(this, true);
    },
    failure : function(response){
        this.response = response;
        if(response.responseText){
			this.Result = this.processResponse(response);
        }
        this.failureType = Ext.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },
    handleResponse: function(response){
		var result = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
        return Ext.decode(result);
    },
    getParams: function(){
        return {
			Service: this.options.service,
			Method: this.getOperation(),
			Parameters: this.options.parameters || null,
			Depth: Karma.Conf.DefaultGetDepth
		};
    },
	getOperation: function() {
		return this.options.operation;
	},
	getConfigObject: function() {
		return {
            method: 'POST',
            url: Karma.Conf.ServiceInvoker,
            params: Ext.encode(this.getParams())
    	};
	}
});
Ext.form.Action.ACTION_TYPES['action.base'] = Karma.Editor.Actions.ActionBase;

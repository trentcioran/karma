/**
* Karma
* @author Mislas
*/

Karma.Editor.Actions.Load = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.load',
	
    run: function(){
        Ext.Ajax.request(Ext.apply(
            this.createCallback(this.options),{
	            method: 'POST',
	            url: Karma.Conf.ServiceInvoker,
	            params: Ext.encode({
					Service: this.options.service,
					Method: Karma.Conf.GetMethod,
					Parameters: this.options.parameters || null,
					Depth: Karma.Conf.DefaultGetDepth
				})
	    	}
		));
    },
    success: function(response){
        var value = this.processResponse(response);
        if(!value.Success){
			this.failureType = Ext.form.Action.SERVER_INVALID;
            this.form.afterAction(this, false);
            return;
        }
        this.form.setValues(value.Result);
        this.form.afterAction(this, true);
    },
    handleResponse: function(response){
		var result = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
        return Ext.decode(result);
    }
});
Ext.form.Action.ACTION_TYPES['action.load'] = Karma.Editor.Actions.Load;

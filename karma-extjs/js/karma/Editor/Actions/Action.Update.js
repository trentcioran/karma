/**
* Karma
* @author Mislas
*/

Karma.Editor.Actions.Update = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.update',
    run : function(){
        var o = this.options;
		o.operation = Karma.Conf.UpdateMethod;
		var parameters = this.getParams();
		if (Ext.isEmpty(parameters.Id) && parameters.Id != 0) {
			parameters.Method = Karma.Conf.UpdateMethod;
		}
        if (this.form.isValid()) {
			Ext.Ajax.request(Ext.apply(this.createCallback(o), {
				url: Karma.Conf.ServiceInvoker,
				method: 'POST',
				params: Ext.encode(this.getParams())
			}));
		}
		else {
			if (o.clientValidation !== false) {
				this.failureType = Ext.form.Action.CLIENT_INVALID;
				this.form.afterAction(this, false);
			}
		}
    }
});
Ext.form.Action.ACTION_TYPES['action.update'] = Karma.Editor.Actions.Update;

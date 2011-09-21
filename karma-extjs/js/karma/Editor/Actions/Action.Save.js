/**
* Karma
* @author Mislas
*/

Karma.Editor.Actions.Save = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.save',
    run : function(){
        var o = this.options;
		o.operation = Karma.Conf.SaveMethod;
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
Ext.form.Action.ACTION_TYPES['action.save'] = Karma.Editor.Actions.Save;

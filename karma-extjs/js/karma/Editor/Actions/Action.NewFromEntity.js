/**
* Karma
* @author Mislas
*/

Karma.Editor.Actions.NewFromEntity = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.newfromentity',
	getOperation: function() {
		this.options.operation = Karma.Conf.NewFromEntityMethod;
		return this.options.operation;
	}
});
Ext.form.Action.ACTION_TYPES['action.newfromentity'] = Karma.Editor.Actions.NewFromEntity;

/**
* Karma
* @author Mislas
*/

Karma.Editor.Actions.New = Ext.extend(Karma.Editor.Actions.ActionBase, {
    type : 'action.new',
	getOperation: function() {
		this.options.operation = Karma.Conf.NewMethod;
		return this.options.operation;
	}
});
Ext.form.Action.ACTION_TYPES['action.new'] = Karma.Editor.Actions.New;

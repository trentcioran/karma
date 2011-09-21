/**
 * Proyecto: Karma
 * @author Mislas
 */
Ext.ns('Karma.Modules.System.QueryEditor');

Karma.Modules.System.QueryEditor.Entity = function(){
    Karma.Modules.System.QueryEditor.Entity.superclass.constructor.call(this);
}

Ext.extend(Karma.Modules.System.QueryEditor.Entity, Karma.Core.Entity, {
    id: 'QueryEditor.Entity',
    name: 'Editor de Consultas',
	
	getMainPanel: function() {
        var editor = {
            id: this.id,
            title: this.name,
			iconCls: 'icon-advanced',
            items: {
				xtype: 'qe.editor',
                entity: this
            }
        };
        return editor;
	}
});

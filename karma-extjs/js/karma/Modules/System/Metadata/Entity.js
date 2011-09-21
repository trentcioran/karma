/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.Entity = function(){
    Karma.Modules.System.Metadata.Entity.superclass.constructor.call(this);
}

Ext.extend(Karma.Modules.System.Metadata.Entity, Karma.Core.Entity, {
    id: 'Metadata.Entity',
    name: 'Diseñador',
	
	getMainPanel: function() {
        var editor = {
            id: this.id,
            title: this.name,
			iconCls: 'icon-advanced',
            items: {
				xtype: 'meta.designer',
                entity: this
            }
        };
        return editor;
	}
});

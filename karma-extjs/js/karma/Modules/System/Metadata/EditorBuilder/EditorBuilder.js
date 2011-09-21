/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.EditorBuilder = Ext.extend(Ext.Panel, {
    fake: {
        security: {
            New: true,
            Update: true,
            Delete: true
        },
        editorW: 400,
        editorH: 400,
        service: '',
        getDisplayTitle: function(){}
    },
	editorDropTarget: null,
    initComponent: function(){
        Ext.apply(this, {
            title: 'Editor Builder',
            layout: 'fit',
            items: []
        });
        Karma.Modules.System.Metadata.EditorBuilder.superclass.initComponent.apply(this, arguments);
    },
    
    setEntity: function(entity){
        this.add({
			id: 'ed.preview',
            xtype: 'cmp.editor.win',
            x: 0,
            y: 0,
            title: 'Title',
            editorXType: 'cmp.editor.card',
            entity: this.fake,
            entityLinks: new Array(),
            editorProperties: {
                doLoad: function(){},
                doSubmit: function(){},
                doClose: function(){}
            },
            renderTo: this.getId()
        });
		this.doLayout();
		var editor = Ext.getCmp('ed.preview');
		var dropTarget = editor.body.dom;
		this.editorDropTarget = new Ext.dd.DropTarget(dropTarget, {
			ddGroup     : 'propertiesDD',
			notifyEnter : function(ddSource, e, data) {
			},
			notifyDrop  : function(ddSource, e, data){
				var selectedRecord = ddSource.dragData.selections[0];
				//ddSource.grid.store.remove(selectedRecord);
				return true;
			}
		});
    },
	
	clear: function(){
		this.remove('ed.preview');
		this.doLayout();
	}
});

Ext.reg('meta.ebuilder', Karma.Modules.System.Metadata.EditorBuilder);

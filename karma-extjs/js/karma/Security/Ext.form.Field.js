/**
 * Proyecto: Karma
 * @author Mislas
 */

Ext.override(Ext.form.Field, {
    initComponent : function(){
		if(!this.isVisible()) {
			this.hidden = true;
			this.hideLabel = true;
		}
		else {
			if(!this.isEditable()) {
				this.disabled = true;
			}
		}
        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            'focus',
            'blur',
            'specialkey',
            'change',
            'invalid',
            'valid'
        );
    },
    isVisible: function(){
		if(this.principal) {
			return this.principal.Editor.Fields.isVisible(this.name);
		}
		return true;
    },
    isEditable: function(){
		if (this.principal) {
			return this.principal.Editor.Fields.isEditable(this.name);
		}
		return true;
    }
});

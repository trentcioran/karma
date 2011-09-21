/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */
Ext.override(Ext.form.BasicForm, {
	
	setValues : function(values){
        if(Ext.isArray(values)){ // array of objects. Convert to object hash
            var valuesObject = {};
            for(var i = 0, len = values.length; i < len; i++){
                valuesObject[values[i].id] = values[i].value;
            }
            return this.setValues(valuesObject);
        } else { // object hash
            for (var i = 0, items = this.items.items, len = items.length; i < len; i++) {
                var field = items[i];
                var v;
				if (Ext.isEmpty(field.propertyName)) {
					v = values[field.id] || values[field.hiddenName || field.name];
				}
				else {
					v = values[field.propertyName] ? values[field.propertyName][field.originalName] : '';
                    if(PLOG.isDebugEnabled()) {
                        PLOG.debug('[BasicForm.setValues] propertyName: ' + field.propertyName +
                            ', Property: ' + field.name + ', value: ' + v);
                    }
				}
                if (typeof v !== 'undefined') {
                    field.setValue(v)
                    if(this.trackResetOnLoad){
                        field.originalValue = field.getValue();
                    }
                }
            }
        }
        return this;
    },

    getFieldValues : function(){
        var o = {};
        this.items.each(function(f){
			if (Ext.isEmpty(f.propertyName)) {
				var v = f.getValue();
                if(PLOG.isDebugEnabled()) {
				    PLOG.debug('[BasicForm.getFieldValues] Property: ' + f.name + ', value: ' + v);
                }
				if(Ext.isEmpty(v)) {
					o[f.name] = null;
				} else {
					o[f.name] = v;
				}
			}
			else {
				var v = f.getValue();
                if(PLOG.isDebugEnabled()) {
                    PLOG.debug('[BasicForm.getFieldValues] propertyName: ' + f.propertyName +
                        ', Property: ' + f.originalName + ', CompositeProperty: ' + f.name +
                        ', value: ' + v);
                }
				if (!o[f.propertyName]) {
					o[f.propertyName] = { };					
				}
				
				if(Ext.isEmpty(v)) {
					o[f.propertyName][f.originalName] = null;
				} else {
					o[f.propertyName][f.originalName] = v;
				}
			}
        });
        return o;
    }
	
});

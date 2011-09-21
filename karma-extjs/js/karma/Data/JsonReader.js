/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.JsonReader = Ext.extend(Ext.data.JsonReader, { 
	read : function(response){ 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader.read] <-');
		}
		var json = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader]currently reading [' + json + ']');
		}
		var o = eval('('+json+')'); 
		
		if(!o) { 
			throw {message: 'JsonReader.read: Json object not found'}; 
		} 
		if (o.Success){
			o = o.Result;
		} else {
			throw {message: o.ErrorMessage}; 
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[JsonReader.read] ->');
		}
		return Karma.Data.JsonReader.superclass.readRecords.call (this,o); 
	}
});

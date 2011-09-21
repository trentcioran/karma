/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.ArrayReader = Ext.extend(Ext.data.ArrayReader, { 
	read : function(response){ 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ArrayReader.read] <-');
		}
		var json = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ArrayReader]currently reading [' + json + ']');
		}
		var o = eval('('+json+')'); 
		
		if(!o) { 
			throw {message: 'ArrayReader.read: Json object not found'}; 
		} 
		if (o.Success){
			o = o.Result.Data;
		} else {
			throw {message: o.ErrorMessage}; 
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[ArrayReader.read] ->');
		}
		return Karma.Data.ArrayReader.superclass.readRecords.call (this,o); 
	}
});

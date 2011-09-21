/**
 * usage: ObjectAnalyzer().analyze(targetObject);
 * usage: ObjectAnalyzer().analyze(targetObject, depth);
* @author TrentCioran
*/

ObjectAnalyzer = function() {
	var indenteation = 0;
	var deep = -1;
	var currentDeep = 0;
	var type = 0; /* logging - 0, hashing - 1*/
	var hashedObject = '';
	
	var getIndentStr = function(){
		var tmp = new String(''), 
		tmp2 = new String('+');

		for(var idx = 0; idx < indenteation*2; idx++){
			tmp += tmp2;
		}
		return tmp;
	};
	
	var getDeepLevel = function(){
		return currentDeep;
	};
	
	var setDeepLevel = function(dl){
		deep = dl;
	};
	
	var setType = function(t){
		type = t;
	}
	
	var getHashedObject = function() {
		return hashedObject;
	};
	
	var canInspect = function (){
		if(deep > -1) {
			return currentDeep < deep;
		} else {
			return true;
		}
	};
	
	var write = function(str){
		if (type == 0) 
		{
			LOG.debug(getIndentStr().concat(str));
		}
		else
		{
			hashedObject += str;
		}
	};
	
	var incIndent = function (){
		currentDeep = indenteation;
		indenteation++;
	};
	
	var decIndent = function (){
		indenteation--;
		currentDeep = indenteation;
	};
	
	var isPrimitive = function(value){
		return !(Ext.isArray(value) || (Ext.type(value) == 'object'));
	};
	
	var selfAnalyze = function(target){
		if(Ext.type(target) == 'object'){
			if (type == 0)  
			{
				write('Analyzing inner object...');
			}
			
			if (canInspect()) {
				incIndent();
				if (type == 0) 
				{
					write('{');
				}
				$analyze(target);
				if (type == 0) 
				{
					write('}');
				}
				decIndent();
			}
		}
		else if(Ext.isArray(target)){
			if (type == 0)  
			{
				write('analyzing array values...');
			}
			if (canInspect()) {
				incIndent();
				if (type == 0) 
				{
					write('[');
				}
				getArrayValues(target);
				if (type == 0) 
				{
					write(']');
				}
				decIndent();
			}
		} else {
			if(!Ext.isEmpty(target)) {
				write(target);
			}
		}
	};
	
	var getAllProperties = function (target){
		for (var method in target) {
			if (typeof target[method] != 'function') {
				if (type == 1){
					write('|' + method + ':');
				} else {
					write('Property -> ' + method + ', type: ' + 
						Ext.type(target[method])+ ', value: ' + target[method]);
				}
				if(!isPrimitive(target[method])) {
					selfAnalyze(target[method]);
				}
			}
		}
	};
	
	var getAllMethods = function(target){
		for (var method in target) {
			if (typeof target[method] == 'function') {
				write('Method -> ' + method);
			}
		}
	};
	
	var getOwnMethods = function(target){
		for (var method in target) {
			if (typeof target[method] == 'function' && this.hasOwnProperty(method)) {
				write('Method -> ' + method);
			}
		}
	};
	
	var getArrayValues = function(target) {
		Ext.each(target, function(item){
			if (type == 0) {
				write('Array value -> ' + item);
			}
			selfAnalyze(item);
		});
	};
	
	var $analyze = function(target) {
		if (type == 0) {
			write('Analyzing object...' + Ext.type(target));
		}
		incIndent();
		
		getAllProperties(target);
		if (type == 0) {
			getAllMethods(target);
		}
		
		decIndent();
		if (type == 0) {
			write('Analysis ended.');
		}
	};

	return {
		analyze : function(target) {
			$analyze(target);
		},

		analyze : function(target, deepLevel) {
			setDeepLevel(deepLevel);
			$analyze(target);
		},

		hash : function(target) {
			setType(1);
			$analyze(target);
			return getHashedObject();
		}
	};
};


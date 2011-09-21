/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Factory.FactoryCache = function (){
	
	this.cache = new Ext.util.MixedCollection();
	
	this.add = function(key, value){
		this.cache.add(key, value);
	};
	
	this.add = function(regionkey, key, value){
		this.getRegion(regionkey).add(key, value);
	};
	
	this.getRegion = function(key){
		if (!this.cache.containsKey(key)) {
			this.cache.add(key, new Ext.util.MixedCollection());
		}
		return this.cache.get(key);
	};
	
	this.get = function(regionkey, key){
		if (!this.cache.containsKey(regionkey)) {
			return null;
		}
		return this.cache.get(regionkey).get(key);
	};

	this.containsKey = function(key) {
		return this.cache.containsKey(key);
	}
};


Ext.apply(Karma.Factory, {
	
	Cache: new Karma.Factory.FactoryCache()
	
});

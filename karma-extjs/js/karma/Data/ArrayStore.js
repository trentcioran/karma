/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.ArrayStore = Ext.extend(Ext.data.ArrayStore, {
    
    remoteSort : true,

    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
				if (p.Parameters.Sorting) {
					p.Parameters.Sorting[0].Field = this.sortInfo.field;
					if (this.sortInfo.direction == 'ASC') {
						p.Parameters.Sorting[0].Sort = '0';
					} else {
						p.Parameters.Sorting[0].Sort = '1';
					}
				}
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
            return true;
        } else {
          return false;
        }
    }
	
});

Ext.apply(Karma.Data.ArrayStore, {
	
	create: function(service, fields, parameters, method, id) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[ArrayStore.create] <-');
		}
		var proxy = new Karma.Data.HttpProxy({
			url: Karma.Conf.ServiceInvoker,
			method: 'POST'
		});
		var _id = Ext.isEmpty(id)? 'Id' : id;
		var _m = Ext.isEmpty(method)? Karma.Conf.FindMethod : method;
		var store = new Karma.Data.ArrayStore({
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: _m, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
	        idIndex: 0,
			fields: fields
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[ArrayStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[ArrayStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[ArrayStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[ArrayStore.load]');
			}
		}, this);
		return store;		
	}
	
});

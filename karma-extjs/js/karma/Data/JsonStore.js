/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.JsonStore = Ext.extend(Ext.data.Store, {
    
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

Ext.apply(Karma.Data.JsonStore, {
	
	create: function(service, fields, parameters, method, id) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[JsonStore.create] <-');
		}
		var proxy = new Karma.Data.HttpProxy({
			url: Karma.Conf.ServiceInvoker,
			method: 'POST'
		});
		var _id = Ext.isEmpty(id)? 'Id' : id;
		var reader = new Karma.Data.JsonReader({
			totalProperty: Karma.Conf.DefaultTotal,
			root: Karma.Conf.DefaultRoot,
			idProperty: _id
		}, Ext.data.Record.create(fields));
		var _m = Ext.isEmpty(method)? Karma.Conf.FindMethod : method;
		var store = new Karma.Data.JsonStore({
			root: Karma.Conf.DefaultRoot,
			totalProperty: Karma.Conf.DefaultTotal,
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: _m, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
	        reader: reader
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[JsonStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[JsonStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[JsonStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[JsonStore.load]');
			}
		}, this);
		return store;		
	}
	
});

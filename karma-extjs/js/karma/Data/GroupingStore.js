/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.GroupingStore = Ext.extend(Ext.data.GroupingStore, {

    remoteSort: true,

    load: function(options) {
        options = options || {};
        if (this.fireEvent("beforeload", this, options) !== false) {
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if (this.sortInfo && this.remoteSort) {
                var pn = this.paramNames;
                p.Parameters.Sorting[0].Field = this.sortInfo.field;                
                if (this.sortInfo.direction == 'ASC') {
                    p.Parameters.Sorting[0].Sort = '0';
                } else {
                    p.Parameters.Sorting[0].Sort = '1';
                }                
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
            return true;
        } else {
            return false;
        }
    },

    applySort: function() {
        Ext.data.GroupingStore.superclass.applySort.call(this);
        if (!this.groupOnSort && !this.remoteGroup) {
            var gs = this.getGroupState();
            if (gs && this.baseParams.Parameters.Sorting &&
				this.baseParams.Parameters.Sorting.length > 0 &&
				gs != this.baseParams.Parameters.Sorting[0].Field) {
                this.sortData(this.groupField);
            }
        }
    }

});

Ext.apply(Karma.Data.GroupingStore, {
	
	create: function(service, fields, groupField, parameters, listeners, localproxy, method) {
		if(PLOG.isDebugEnabled()){
			PLOG.debug('[GroupingStore.create] <-');
		}
		var proxy = null;
		
		if(localproxy) {
			proxy = localproxy;
		} else {
			proxy = new Karma.Data.HttpProxy({
				url: Karma.Conf.ServiceInvoker,
				method: 'POST'
			});
		}
		var reader = new Karma.Data.JsonReader({
			totalProperty: Karma.Conf.DefaultTotal,
			root: Karma.Conf.DefaultRoot,
			id: 'Id'
		}, Ext.data.Record.create(fields));
		var store = new Karma.Data.GroupingStore({
			root: Karma.Conf.DefaultRoot,
			totalProperty: Karma.Conf.DefaultTotal,
			proxy: proxy,
			baseParams: { 
				Service: service, 
				Method: method || Karma.Conf.FindMethod, 
				Parameters: parameters,
				Depth: Karma.Conf.DefaultFindDepth
			},
			remoteSort: true,
			remoteGroup: false,
	        reader: reader,
			groupField: groupField,
			listeners: listeners || {}
	    });

		proxy.on('loadexception', function(_this, options, response, err){
			if(PLOG.isDebugEnabled()){
				PLOG.debug('[GroupingStore.proxy.loadexception] Response: ' + response.responseText);
			}
			PLOG.error('[GroupingStore.proxy.loadexception] Error: ' + err);
		}, this);
		store.on('loadexception', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.error('[GroupingStore.loadexception]');
			}
		}, this);
		store.on('load', function(){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[GroupingStore.load]');
			}
		}, this);
		return store;		
	}
	
});

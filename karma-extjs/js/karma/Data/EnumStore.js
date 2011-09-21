/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.EnumStore = {};

Ext.apply(Karma.Data.EnumStore, {

	cache: new Array(),
	
	create: function(enumeration){
		var store = Karma.Data.EnumStore.cache[enumeration];
		if (Ext.isEmpty(store)) {
			Karma.Data.EnumStore.init();
			store = Karma.Data.EnumStore.cache[enumeration];
		}
		return store;
	},
	
	init: function(callback){
		
        Ext.Ajax.request({
            //url: Karma.Conf.ServiceInvoker,
			url: 'data/enum.json',
            method: 'GET',
            params: Ext.encode({ 
				Service: Karma.Conf.EnumService, 
				Method: Karma.Conf.EnumMethod, 
				Parameters: null
			}),
            success: function(response, options){
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[EnumStore.init] -> Result: ' + response.responseText);
				}
				var resp = Ext.decode(response.responseText);
				Ext.each(resp.Result, function(e){
					Karma.Data.EnumStore.initEnum(e);
				});
				callback.fn.createDelegate(callback.scope)();
			},
            failure: function(response, options){
				Ext.MessageBox.alert('Enums initialization failed', 
					'Unable initialize enum catalogs: ' + response.responseText);
				callback.fn.createDelegate(callback.scope)();
			}
        });
	},
	
	initEnum: function(enumeration){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EnumStore.initEnum] -> Enum: ' + enumeration.Name + ', Descriptions: ' + 
				enumeration.Description.length);
		}
		if(Ext.isEmpty(Karma.Data.EnumStore.cache[enumeration.Name])) {
			var proxy = new Ext.data.MemoryProxy([]);
			var reader = new Ext.data.JsonReader({
				root: 'Description',
				id: 'Id'
			}, Ext.data.Record.create([{ name: 'Id' }, { name: 'Name' }]));
			var store = new Ext.data.Store({
				root: 'Description',
				proxy: proxy,
				reader: reader,
				autoLoad: false,
				getLabelById: function(id){
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EnumStore.findById] <- Id: ' + id);
					}
					var record = this.getById(id);
					if (PLOG.isDebugEnabled()) {
						PLOG.debug('[EnumStore.findById] <- record: ' + record);
					}
					return record.get('Name');
				}
			});
			store.loadData(enumeration);
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EnumStore.initEnum] -> Data loaded: ' + store.getCount() + 
					', get first: ' + store.getAt(0));
			}
			Karma.Data.EnumStore.cache[enumeration.Name] = store;
		}
	}

});

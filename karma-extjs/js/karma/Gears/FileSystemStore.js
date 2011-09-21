/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Gears.FileSystemStore = function(manifest) {
	this.STORE_NAME = 'Karma.Cache';
	this.MANIFEST_FILENAME = manifest;
	this.initialized = false;
	
	this.localServer = null;
	this.store = null;
	this.resourceStore = null;

	if(!this.initialized) {
		this.init();
	}
};

Karma.Gears.FileSystemStore.prototype = {

	init: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.init] <-');
		}
		if (window.google && google.gears) {
			localServer = google.gears.factory.create("beta.localserver");
			store = localServer.createManagedStore(this.STORE_NAME);
			store.manifestUrl = this.MANIFEST_FILENAME;
			store.enabled = true;

			resourceStore = localServer.createStore(this.STORE_NAME + '_Libs');
			resourceStore.enabled = true;
			
			initialized = true;
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.init]initialized');
			}
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.init] ->');
		}
	},
	
	captureFiles: function(){
		if (window.google && google.gears && initialized) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.captureFiles]capturing files');
			}
			store.checkForUpdate();
			
			var timerId = window.setInterval(function(){
				if (store.currentVersion) {
					window.clearInterval(timerId);
				}
				else 
					if (store.updateStatus == 3) {
						PLOG.error("Error: " + store.lastErrorMessage);
						Ext.Msg.alert("Error: " + store.lastErrorMessage);
					}
			}, 500);
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.captureFiles] Store not initialized!!!');
			}
		}
	},
	
	removeStore: function(){
		if (window.google && google.gears && this.initialized) {
			localServer.removeManagedStore(STORE_NAME);
		}
	},
	
	capture: function(url){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.capture] Capturing: ' + url);
		}
		resourceStore.capture(url, function(url, success, captureId){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[FileSystemStore.capture] File captured: ' + url);
			}
		});
	},
	
	uncapture: function(url){
		resourceStore.remove(url);
	},
	
	isCaptured: function(url){
		if(Ext.isEmpty(url)) {
			return false;
		}
		var flag = resourceStore.isCaptured(url);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[FileSystemStore.isCaptured] url: ' + url + ', ' + flag);
		}
		return flag;
	}
	
};

Karma.ResourceStore = Karma.Gears.FileSystemStore;


Karma.Gears.MockStore = function(manifest) {};

Karma.Gears.MockStore.prototype = {	
	capture: function(url){},
	isCaptured: function(url){ return false; }
};

Ext.apply(Karma.Gears.FileSystemStore, {
	
	Instance: null
	
});

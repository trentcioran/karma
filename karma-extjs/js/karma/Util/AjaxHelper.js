/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Util.AjaxHelper = function(){};

Ext.apply(Karma.Util.AjaxHelper, {
	
	call: function (
			invoker, 
			service, 
			method, 
			params, 
			depth,
			onSuccessCbck, 
			onFailureCbck, 
			thescope,
			isUpload,
			theform) {
				
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('Invoker: ' + invoker);
			PLOG.debug('Service: ' + service);
			PLOG.debug('Method: ' + method);
			PLOG.debug('Parameters: ' + params);
			PLOG.debug('Depth: ' + depth);
		}
		if(!isUpload) {
			isUpload = false;
		}
		
		Ext.Ajax.request({
            url: invoker,
            method: theform? 'POST': 'GET',
			isUpload : isUpload,
			form: theform,
            jsonData: { 
				Service: service, 
				Method: method, 
				Parameters: params,
				Depth: depth 
			},
            success: function(response, options){
				var result = response.responseText.replace(new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+(-[0-9]+)?)\\)\\\\/\\"', 'g'), "$1new Date($2)");
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[ListadoBase.loadRecord.success] response: ' + result);
				}
				result = Ext.decode(result);
				if (result.Success){
					var delegate = onSuccessCbck.createDelegate(thescope, [result.Result]);
					delegate(result.Result);
				} else {
					if (PLOG.isDebugEnabled()) {
						PLOG.error('[AjaxHelper.loadRecord.failure] ErrMsg: ' + result.ErrorMessage);
						PLOG.error('[AjaxHelper.loadRecord.failure] ErrDet: ' + result.ErrorDetail);
					}
					if (result.Report){
						Ext.Msg.show({
							title:'Error',
							msg: result.ErrorMessage,
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.ERROR
						});
					}
					if (onFailureCbck) {
						var delegate = onFailureCbck.createDelegate(thescope)(result);
						delegate(result.ErrorMessage, result.ErrorDetail);
					} else {
						Ext.MessageBox.alert('Fallo', 'No se logro cargar el registro: ' + response.responseText);
					}
				}
			},
            failure: function(response, options){
				if (PLOG.isDebugEnabled()) {
					PLOG.error('[AjaxHelper.loadRecord.failure] response: ' + response.responseText);
				}
				if (onFailureCbck) {
					var delegate = onFailureCbck.createDelegate(thescope)(response.responseText);
					delegate();
				}
				Ext.MessageBox.alert('Fallo', 'No se logro cargar el registro: ' + response.responseText);
			},
			scope: thescope
        });
    }

});

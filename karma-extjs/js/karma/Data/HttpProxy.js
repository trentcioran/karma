/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Data.HttpProxy = Ext.extend(Ext.data.HttpProxy, {

    cacheResults: false,

    cache: null,

    generateKey: function(target) {
        var hash = ObjectAnalyzer().hash(target);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.generateKey] key : ' + hash);
        }
        return hash;
    },

    load: function(params, reader, callback, scope, arg) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy]Loading data...');
            
            ObjectAnalyzer().analyze(params);
        }
        this.conn.url = Karma.Conf.ServiceInvoker;
        if (this.fireEvent("beforeload", this, params) !== false) {
            var o = {
                params: params || {},
                request: {
                    callback: callback,
                    scope: scope,
                    arg: arg
                },
                reader: reader,
                callback: this.loadResponse,
                jsonData: params || {},
                scope: this
            };
            if (this.useAjax) {
                Ext.applyIf(o, this.conn);
                if (this.activeRequest) {
                    Ext.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Ext.Ajax.request(o);
            } else {
                this.conn.request(o);
            }
        } else {
            callback.call(scope || this, null, arg, false);
        }
    },

    loadResponse: function(o, success, response, params) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.loadResponse]<-');
        }
        var result;
        delete this.activeRequest;
        if (!success) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Error: ' + response.responseText);
            }
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        try {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Reading response');
            }
            result = o.reader.read(response);
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Response readed');
            }
        } catch (e) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[HttpProxy.loadResponse] Error while reading: ' + e);
            }
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[HttpProxy.loadResponse]->');
        }
    }
});


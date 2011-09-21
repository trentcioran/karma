/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Core.Entity = function(_lazyInit, _hidden){
    if (PLOG.isDebugEnabled()) {
        PLOG.debug('[Entity.ctor] <-');
    }
    if (Ext.isEmpty(_lazyInit)) {
        _lazyInit = false;
    }
    if (Ext.isEmpty(_hidden)) {
        _hidden = false;
    }
    
    this.security = null;
    this.metadata = null;
    this.initialized = false;
    this.lazyload = _lazyInit;
    this.hidden = _hidden;
    this.newCount = 1;
    
    this.addEvents({
        'load': true,
        'unload': true,
        'new': true,
        'open': true,
        'delete': true,
        'any': true,
        'activity': true
    });
    
    Karma.Core.Entity.superclass.constructor.call(this, arguments);
};

Ext.extend(Karma.Core.Entity, Ext.util.Observable, {
    id: null,
    name: null,
    service: null,
    columns: null,
    securityVisible: true,
    editorW: 600,
    editorH: 400,
    editorXType: null,
    getId: function() {
        return this.id;
    },
    getName: function() {
        return this.name;
    },
    searchlist: {},
    aggregatelist: {},
    entitylist: {},
    editableEntitylist: {},
    link: {},
    init: function() {
        this.configure();
        this.initialized = true;
        this.fireEvent('load', this);
    },
    getMainPanel: function() {
        var searchlist = {
            id: this.id,
            title: this.name,
            items: {
                id: this.id + '-search-form',
                listeners: this.getSearchListeners(),
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.service
            }
        };
        Ext.applyIf(searchlist.items, this.searchlist);
        return searchlist;
    },
    getSearchListeners: function() {
        var listeners = {
            'new': {
                fn: this.onNew,
                scope: this
            },
            'open': {
                fn: this.onOpen,
                scope: this
            },
            'delete': {
                fn: this.onDelete,
                scope: this
            },
            'activity': {
                fn: this.onAny,
                scope: this
            }
        };
        Ext.apply(listeners, this.getCustomListeners());
        return listeners;
    },
    isLazy: function() {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.isLazy] ->' + this.lazyLoad);
        }
        return this.lazyload;
    },
    isHidden: function() {
        return this.hidden;
    },
    isInitialized: function() {
        return this.initialized;
    },
    getCustomListeners: function() {
        return {};
    },
    getLinkQuery: function() {
        return this.metadata.LinkQuery;
    },
    getNewTitle: function() {
        return 'Nuevo';
    },
    getDisplayTitle: function(value) {
        var val = '';
        var titleProperty;
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.getDisplayTitle] the record...');
        }
        if (Ext.isEmpty(this.titleProperty)) {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Entity.getDisplayTitle] titleProperty is empty, take displayProperty...');
            }
            titleProperty = this.link.displayProperty;
        }
        else {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Entity.getDisplayTitle] titleProperty is not empty...');
            }
            titleProperty = this.titleProperty;
        }
        if (!Ext.isEmpty(value) && (value.Id > 0 || !Ext.isEmpty(value.get))) {
            if (Ext.type(titleProperty) === 'string') {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Entity.getDisplayTitle] titleProperty is string...');
                }
                val = value[titleProperty];
            }
            else
                if (Ext.type(titleProperty) === 'object') {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[Entity.getDisplayTitle] titleProperty is XTemplate...');
                }
                val = titleProperty.apply(value);
            }
            val = ' [ID: ' + value.Id + ']';
        }
        else {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[Entity.getDisplayTitle] is new record...');
            }
            val = this.getNewTitle(value);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.getDisplayProperty] display value : [' + titleProperty +
            '] from entity:' +
            val);
        }
        return val;
    },
    openWindow: function(record, listeners, editorProperties, useXtype) {
        
        if (Ext.isNumber(record)) {
            Ext.apply(editorProperties, {
                entityId: record,
                entity: this,
                security: this.security,
                metadata: this.metadata,
                listeners: listeners
            });
        }
        else {
            Ext.apply(editorProperties, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                value: record,
                listeners: listeners
            });
        }
        
        Karma.Editor.Window.create({
            editorXType: useXtype || this.editorXType,
            entity: this,
            security: this.security,
            metadata: this.metadata,
            isNew: editorProperties.isNew,
            width: this.editorW,
            height: this.editorH,
            editorProperties: editorProperties
        });
    },
    useInvoker: function(methodToInvoke, parameters, callback, errcbck) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.useInvoker] <-');
        }
        Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, this.service, methodToInvoke,
			parameters, Karma.Conf.DefaultGetDepth, function(result) {
			    if (callback) {
			        callback.fn.createDelegate(callback.scope)(result);
			    }
			}, function(response) {
			    if (errcbck) {
			        errcbck.fn.createDelegate(errcbck.scope)(response);
			    }
			}, this);
    },
    onOpen: function(id, listeners, useXtype, editorProperties) {
        id = parseInt(id);
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.onOpen] <- id: ' + id);
            PLOG.debug('[Entity.onOpen] <- useXtype: ' + useXtype);
        }
        var editorWin = Karma.WinManager.Instance.getIfExist(this, id);
        if (Ext.isEmpty(editorWin)) {
            editorProperties = editorProperties ||
            {};
            Ext.apply(editorProperties, {
                entityId: id,
                listeners: listeners,
                isNew: false
            });

            this.openWindow(id, listeners, editorProperties, useXtype || this.editorXType);
            
            this.fireEvent('open');
            this.fireEvent('activity');
        }
        else {
            editorWin.show();
        }
    },
    onNew: function(listeners, useXtype, editorProperties) {
        editorProperties = editorProperties ||
        {};
        Ext.apply(editorProperties, {
            listeners: listeners,
            isNew: true
        });
        this.openWindow(0, listeners, editorProperties, useXtype || this.editorXType);
        this.fireEvent('new');
        this.fireEvent('activity');
    },
    NewFromEntity: function(parameters, listeners, editorProperties, useXtype) {
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.NewFromEntity] <-');
            PLOG.debug('[Entity.NewFromEntity] Parameters, type: ' + Ext.type(parameters) +
            ', len: ' +
            parameters.length);
            if (Ext.type(parameters) == 'array') {
                Ext.each(parameters, function(parameter) {
                    PLOG.debug('[Entity.NewFromEntity] parameter value: ' + parameter.Id);
                }, this);
            }
        }
        if (Ext.type(parameters) == 'array' && parameters.length == 1) {
            parameters = parameters[0];
        }
        editorProperties = editorProperties ||
        {};
        Ext.apply(editorProperties, {
            listeners: listeners,
            isNew: true
        });

        this.useInvoker(Karma.Conf.NewFromEntityMethod, parameters, {
            fn: function(result) {
                this.openWindow(result, listeners, editorProperties, useXtype || this.editorXType);
                this.fireEvent('new');
                this.fireEvent('activity');
            },
            scope: this
        });
    },
    onDelete: function(id, callback) {
        Karma.Util.AjaxHelper.call(Karma.Conf.ServiceInvoker, this.service, Karma.Conf.DeleteMethod, id, 0, function(result) {
            callback.fn.createDelegate(callback.scope)();
        }, function() {
        }, this);
        this.fireEvent('delete');
        this.fireEvent('activity');
    },
    configure: function() {
        this.metadata = Karma.Core.Metadata.Instance.getEntity(this.name);
        this.security = Karma.Core.Principal.Instance.getEntity(this.name);
        this.service = this.metadata.Service;
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[Entity.configure] Entity [' + this.name + '], Service [' + this.service +
				'], Security [' + this.security + '], Metadata [' + this.metadata + ']');
        }
        this.Delete = this.onDelete.createDelegate(this);
        this.Open = this.onOpen.createDelegate(this);
        this.New = this.onNew.createDelegate(this);
        // EntityLink pre-configuration
        this.link.openWindow = this.openWindow.createDelegate(this);
        this.link.useInvoker = this.useInvoker.createDelegate(this);
        if (Ext.isEmpty(this.link.Open)) {
            this.link.Open = this.Open.createDelegate(this);
        }
        if (Ext.isEmpty(this.link.New)) {
            this.link.New = this.New.createDelegate(this);
        }
        if (Ext.isEmpty(this.link.NewFromEntity)) {
            this.link.NewFromEntity = this.NewFromEntity.createDelegate(this);
        }
    },
    onAny: function() {
        this.fireEvent('activity');
    },
    getConfig: function(type) {
        if (type == 'ag.list') {
            // AggregateList pre-configuration
            Ext.apply(this.aggregatelist, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            return this.aggregatelist;
        }
        if (type == 'entity.list') {
            // EntityList pre-configuration
            Ext.apply(this.entitylist, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            return this.entitylist;
        }
        
        if (type == 'eel.list') {
            // EntityList pre-configuration
            Ext.apply(this.editableEntitylist, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            return this.editableEntitylist;
        }
        
        if (type == 'entity.link') {
            // EntityLinkCombo pre-configuration
            Ext.apply(this.link, {
                entity: this,
                security: this.security,
                metadata: this.metadata,
                service: this.metadata.Service
            });
            
            
            return this.link;
        }
    }
});

/**
 * Proyecto: Karma
 * @author Mislas
 * @version 2.0
 */
Karma.Controls.EntityLinkCombo = Ext.extend(Ext.form.ComboBox, {

    entityName: null,
    
    contextTriggers: [],
    
    preContext: [],
    
    subquery: null,
    
    displayProperty: null,
    
    additionalProperties: [],
    
    ignoreTriggers: false,
    
    canAdd: true,
    
    enableKeyEvents: true,
    
    minChars: 0,
    
    searchTriggerClass: 'x-elink-search-trigger',
    
    openTriggerClass: 'x-elink-open-trigger',
    
	currentBehavior: 'search',
	
    valueField: 'Id',
    
    typeAhead: false,
    
    editable: true,
    
    loadingText: 'Buscando...',
    
    hideTrigger: false,
    
    minListWidth: 300,
    
    itemSelector: 'div.search-item',
    
    pageSize: Karma.Conf.DefaultPageSize,
	
	disabled: false,
    
    initComponent: function(){
		if(!this.entity) {
	        this.entity = Karma.Core.ModuleManager.Instance.getEntity(this.entityName);
	        this.metadata = this.entity.metadata;
	        this.security = this.entity.security;
	        this.columnstore = this.entity.columnstore;
		}
        
        if (Ext.isObject(this.contextTriggers) && !Ext.isArray(this.contextTriggers)) {
            this.contextTriggers = [this.contextTriggers];
        }
        else {
            if (!Ext.isArray(this.contextTriggers)) {
                Ext.Msg.alert('EntityLinkCombo.Error', this.getName() + 
					' does not have a valid value on contextTriggers property.');
            }
        }
        if (Ext.isObject(this.preContext) && !Ext.isArray(this.contextTriggers)) {
            this.preContext = [this.preContext];
        }
        else {
            if (!Ext.isArray(this.preContext)) {
                Ext.Msg.alert('EntityLinkCombo.Error', this.getName() + 
					' does not have a valid value on preContext property.');
            }
        }
        
        var tpl;
        if (this.entity.link.tpl) {
            tpl = this.entity.link.tpl;
        }
        else {
            if (Ext.type(this.entity.link.displayProperty) === 'object') {
                tpl = this.entity.link.displayProperty.html;
            }
            else {
                tpl = '{' + this.entity.link.displayProperty + '}';
            }
        }
        var _fields;
        if (Ext.isEmpty(this.query)) {
        	_fields = Karma.Factory.ColumnFactory.getColumnStore(this.entity.columns);
        } 
        else {
	        _fields = this.getStoreColumns(this.query.Columns);
		}
        Ext.apply(this, {
            store: Karma.Data.JsonStore.create(this.metadata.Service, _fields, {
                Query: this.query? this.query.Id: this.metadata.LinkQuery,
                SubQuery: this.subquery,
                Criteria: '',
                Start: 0,
                PageSize: Karma.Conf.DefaultPageSize
            }),
            displayField: this.entity.link.displayProperty,
            tpl: new Ext.XTemplate(
				'<tpl for="."><div class="{[xindex%2===0?"search-row-item":"search-row-item-alt"]}">', 
				'<div class="search-item">' + tpl + '</div></div></tpl>'),
            listeners: {
                keyup: {
                    fn: this.onKeyUp,
                    scope: this
                },
                keydown: {
                    fn: this.onKeyDown,
                    scope: this
                }
            }
        });
        Karma.Controls.EntityLinkCombo.superclass.initComponent.apply(this, arguments);
        this.addEvents({
            set: true,
            cleared: true,
            change: true
        });
        
        if (!Ext.isEmpty(this.security)) {
		    this.canAdd = this.canAdd && this.security.New;
		} else {
		    this.canAdd = false;
		}
		
        this.triggerConfig = {
            tag: 'span',
            cls: 'x-form-twin-triggers',
            cn: [{
                tag: 'img',
                src: Ext.BLANK_IMAGE_URL,
                cls: 'x-form-trigger x-elink-new-trigger'
            }, {
                tag: 'img',
                src: Ext.BLANK_IMAGE_URL,
                cls: 'x-form-trigger x-elink-search-trigger'
            }, {
                tag: 'img',
                src: Ext.BLANK_IMAGE_URL,
                cls: 'x-form-trigger x-elink-clear-trigger'
            }]
        };
    },
	
    onRender: function(index){
        Karma.Controls.EntityLinkCombo.superclass.onRender.apply(this, arguments);
		if(this.disabled) {
			this.triggers[0].addClass('x-hide-display');
			this.triggers[1].addClass('x-hide-display');
			this.triggers[2].addClass('x-hide-display');
		}
		else if(!this.canAdd) {
			this.triggers[0].addClass('x-hide-display');
		}
    },
	
    getTrigger: function(index){
        return this.triggers[index];
    },

    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
	        t.hide = function(){
	            var w = triggerField.wrap.getWidth();
	            this.dom.style.display = 'none';
	            triggerField.el.setWidth(w-triggerField.trigger.getWidth());
	        };
	        t.show = function(){
	            var w = triggerField.wrap.getWidth();
	            this.dom.style.display = '';
	            triggerField.el.setWidth(w-triggerField.trigger.getWidth());
	        };
	        var triggerIndex = 'Trigger'+(index+1);
	
	        if(this['hide'+triggerIndex]){
	            t.dom.style.display = 'none';
	        }
	        t.on("click", this['on'+triggerIndex+'Click'], this, {preventDefault:true});
	        t.addClassOnOver('x-form-trigger-over');
	        t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    onTrigger1Click: function() {
		if(this.disabled) {
			return;
		}
		this.onNew()
	},
	
    onTrigger2Click: function() {
        switch (this.currentBehavior) {
            case 'search':
				if(this.disabled) return;
                this.initQuery();
                break;
            case 'open':
                this.onOpen();
                break;
            default:
				if(this.disabled) return;
                this.initQuery();
        }
	},
    
    onTrigger3Click: function() {
		if(this.disabled) {
			return;
		}
		this.clearValue()
	},
    
    doQuery: function(q, forceAll){
        if (this.isContextValid()) {
            PLOG.debug('[EntityLinkCombo.doQuery] [' + this.getName() + '] query:' + q);
            q = Ext.isEmpty(q) ? '' : q;
            var qe = {
                query: q,
                forceAll: forceAll,
                combo: this,
                cancel: false
            };
            if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
                return false;
            }
            q = qe.query;
            forceAll = qe.forceAll;
            if (forceAll === true || (q.length >= this.minChars)) {
                if (this.lastQuery !== q) {
                    this.lastQuery = q;
                    if (this.mode == 'local') {
                        this.selectedIndex = -1;
                        if (forceAll) {
                            this.store.clearFilter();
                        }
                        else {
                            this.store.filter(this.displayField, q);
                        }
                        this.onLoad();
                    }
                    else {
                        this.store.baseParams.Parameters.Criteria = q;
                        this.store.baseParams.Parameters.SubQuery = this.buildSubQuery();
                        this.store.baseParams.Parameters.PageSize = this.pageSize ? this.pageSize : Karma.Conf.DefaultPageSize;
                        this.store.reload();
                        this.expand();
                    }
                }
                else {
                    this.selectedIndex = -1;
                    this.onLoad();
                }
            }
        }
    },
    
    setValue: function(val){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.setValue] [' + this.getName() + '] set value : [' + val + ']');
        }
        if (Ext.isEmpty(val)) return;
		
		this.setText(val);
        this.value = val;
        
        this.setTriggerBehavior('open');
		this.disableNew();
        this.fireEvent('set', this, val.Id, val);
    },
    
    setText: function(val){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.setText]  [' + this.getName() + '] <-');
		}
        var text = this.processDisplayValue(val);
        this.lastSelectionText = text;
        this.el.dom.value = (Ext.isEmpty(text) ? '' : text);
    },
    
    clearValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.clearValue]  [' + this.getName() + '] <-');
		}
        Karma.Controls.EntityLinkCombo.superclass.clearValue.apply(this, arguments);
        delete this.value;
        
        this.setTriggerBehavior('search');
		this.enableNew();
        this.fireEvent('cleared', this);
    },
    
    getValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.getValue]  [' + this.getName() + '] <-' +  this.value);
		}
        return Ext.isEmpty(this.value) ? null : {
            Id: this.value.Id
        };
    },
    
    getEntityValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.getEntityValue]  [' + this.getName() + '] <-' + this.value);
		}
        return this.value;
    },
    
    onSelect: function(record, index){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.onSelect]  [' + this.getName() + '] <-');
		}
        if (this.fireEvent('beforeselect', this, record, index) !== false) {
            this.setValue(record.data);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
        this.fireEvent('change', this, record.get('Id'), record.data);
    },
    
    findRecord: function(value){
        var record;
        if (this.store.getCount() > 0) {
            this.store.each(function(r){
                var text = this.processDisplayValue(r.data);
                if (text == value) {
                    record = r;
                    return false;
                }
            }, this);
        }
        return record;
    },
    
    beforeBlur: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.beforeBlur]  [' + this.getName() + '] <-');
		}
		if(this.disabled) return;
		
        var val = this.getRawValue();
        var rec = this.findRecord(val);
        if (Ext.isEmpty(rec)) {
			// set last value if exist
			if(Ext.isEmpty(this.value)) {
				this.clearValue();
			} else {
				this.setText(this.value);
			}
        }
        else {
            val = rec.data;
            this.setValue(val);
        }
    },
    
    initList: function(){
        if (!this.list) {
            var cls = 'x-combo-list';
            
            this.list = new Ext.Layer({
                parentEl: this.getListParent(),
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain: false
            });
            
            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if (this.syncFont !== false) {
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if (this.title) {
                this.header = this.list.createChild({
                    cls: cls + '-hd',
                    html: this.title
                });
                this.assetHeight += this.header.getHeight();
            }
            
            this.innerList = this.list.createChild({
                cls: cls + '-inner'
            });
            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
            this.mon(this.innerList, 'mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
            
            if (this.pageSize) {
                this.footer = this.list.createChild({
                    cls: cls + '-ft'
                });
                this.pageTb = new Karma.Ext.Grid.PagingToolbar({
                    store: this.store,
                    displayInfo: true,
                    renderTo: this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }
            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
                emptyText: this.listEmptyText
            });
            
            this.mon(this.view, 'click', this.onViewClick, this);
            
            this.bindStore(this.store, true);
            
            if (this.resizable) {
                this.resizer = new Ext.Resizable(this.list, {
                    pinned: true,
                    handles: 'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
                
                this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
            }
        }
    },
    
    onEmptyResults: function(){
        this.innerList.update('<div class="loading-indicator">No se encontraron registros</div>');
        this.restrictHeight();
        this.selectedIndex = -1;
    },
    
    processDisplayValue: function(v){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.processDisplayValue]  [' + this.getName() + '] get displayProperty for :' + v);
        }
        var val = '';
        if (Ext.type(this.entity.link.displayProperty) === 'string') {
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[EntityLinkCombo.processDisplayValue] displayProperty is string...[' +
                this.entity.link.displayProperty +
                ']');
            }
            val = v[this.entity.link.displayProperty];
        }
        else 
            if (Ext.type(this.entity.link.displayProperty) === 'object') {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[EntityLinkCombo.processDisplayValue]  displayProperty is XTemplate...[' +
                    this.entity.link.displayProperty.html +
                    ']');
                }
                val = this.entity.link.displayProperty.apply(v);
            }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.processDisplayValue] display value : ' + val);
        }
        return val;
    },
    
    processContextTriggers: function(form){
        Ext.each(this.contextTriggers, function(trigger){
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[EntityLinkCombo.processContextTrigger] [' + this.getName() + '] <- the trigger id: ' + trigger.id);
            }
            var item = form.findField(trigger.id);
            item.on('set', this.triggerSet, this);
            item.on('cleared', this.triggerCleared, this);
            trigger.name = item.fieldLabel;
            trigger.isSet = false;
        }, this);
    },
    
    triggerCleared: function(elink, value){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.triggerCleared]  [' + this.getName() + '] <- ');
        }
        this.clearValue();
        
        Ext.each(this.contextTriggers, function(trigger){
            if (elink.getName() === trigger.name) {
                trigger.queryValue = trigger.query;
                trigger.isSet = false;
                trigger.Id = 0;
            }
        }, this);
    },
    
    triggerSet: function(elink, _id){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.triggerSet]  [' + this.getName() + '] <- ' +
            ',trigger Id: ' +
            elink.getName() +
            ', value: ' +
            _id);
        }
        this.clearValue();
        Ext.each(this.contextTriggers, function(trigger){
            if (elink.getName() === trigger.id) {
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[EntityLinkCombo.triggerSet] Trigger found [' + trigger.name + ']');
                }
                trigger.queryValue = trigger.query.replace('?', _id);
                trigger.isSet = true;
                trigger.Id = _id;
                if (PLOG.isDebugEnabled()) {
                    PLOG.debug('[EntityLinkCombo.triggerSet] Query set [' + trigger.queryValue + ']');
                }
            }
        }, this);
    },
    
    isContextValid: function(){
        var allset = true;
        Ext.each(this.contextTriggers, function(trigger){
            if (!trigger.isSet) {
                allset = false;
            }
        }, this);
        return allset;
    },
    
    validateValue: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.validateValue]  [' + this.getName() + '] <-');
		}
        var valid;
        if (this.allowBlank) {
            valid = true;
        }
        else {
            valid = this.getValue() != null;
        }
        return valid;
    },
    
    onKeyUp: function(e){
        if (e.ctrlKey && e.getKey() == 65 || e.ctrlKey && e.getKey() == 97) {
            e.stopEvent();
            e.preventDefault();
            this.onOpen();
        }
        if (this.disabled) {
            e.stopEvent();
            e.preventDefault();
            return;
        }
        if (e.ctrlKey && e.getKey() == 32) {
            e.stopEvent();
            e.preventDefault();
            this.initQuery();
        }
        if (e.ctrlKey && e.getKey() == 78 || e.ctrlKey && e.getKey() == 110) {
            e.stopEvent();
            e.preventDefault();
            this.onNew();
        }
        
        if (e.getKey() >= 48 && e.getKey() <= 122) {
			this.setTriggerBehavior('search');
		}
    },
    
    onKeyDown: function(e){
		PLOG.debug('[EntityLinkCombo.beforeBlur]  [' + this.getName() + '] key code: ' + e.getKey());
        if (this.disabled && (e.getKey() == 8 || e.getKey() == 32)){
            e.stopEvent();
            e.preventDefault();
            return;
        }
        if (this.isContextValid()) {
            if (e.ctrlKey && e.getKey() == 32 || e.ctrlKey && e.getKey() == 78 ||
            e.ctrlKey && e.getKey() == 110 ||
            e.ctrlKey && e.getKey() == 65 ||
            e.ctrlKey && e.getKey() == 97) {
                e.stopEvent();
            }
        }
        else {
            this.markInvalid();
        }
    },
    
    disable: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.disable]  [' + this.getName() + '] <-');
		}
		
		this.triggers[0].addClass('x-hide-display');
		if(!this.value) {
			this.triggers[1].addClass('x-hide-display');
		}
		this.triggers[2].addClass('x-hide-display');
        this.disabled = true;
		this.addClass('x-item-disabled');
    },
    
    enable: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.enable]  [' + this.getName() + '] <-');
		}
		this.triggers[0].removeClass('x-hide-display');
		this.triggers[1].removeClass('x-hide-display');
		this.triggers[2].removeClass('x-hide-display');
        this.disabled = false;
		this.removeClass('x-item-disabled');
    },
    
    setDisabled: function(disabled){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.setDisabled]  [' + this.getName() + '] <-' + disabled);
		}
		if(disabled) {
			this.disable();
		} else {
			this.enable();
		}
    },
    
    onOpen: function(){
        if (Ext.isDefined(this.value)) {
            this.entity.link.Open(this.value.Id);
        }
    },
    
    onNew: function(){
        if (this.disabled || !this.canAdd) {
            return;
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkSearch.onNew] [' + this.getName() + '] ');
            PLOG.debug('[EntityLinkSearch.onNew] parameters: ' + this.parameters);
            PLOG.debug('[EntityLinkSearch.onNew] context: ' + this.context);
            PLOG.debug('[EntityLinkSearch.onNew] ignore triggers? ' + this.ignoreTriggers);
        }
        var delegate = this.setValue.createDelegate(this);
        var config = {
            aftersave: {
                fn: function(entity){
                    delegate(entity);
                }
            },
            scope: this
        };
        var parameters = this.buildParameters();
        if (Ext.isEmpty(parameters) || parameters.length == 0) {
            parameters = new Array();
        }
        if (!Ext.isEmpty(this.context)) {
            parameters.push(this.context);
        }
        if (parameters.length == 0 || this.ignoreTriggers) {
            this.entity.link.New(config);
        }
        else {
            this.entity.link.NewFromEntity(parameters, config);
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkSearch.onNew] ->');
        }
    },
    
    markInvalid: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.markInvalid]  [' + this.getName() + '] <-');
		}
        if (this.contextTriggers.length == 0 || this.isContextValid()) {
            Karma.Controls.EntityLinkCombo.superclass.markInvalid.call(this);
            return;
        }
        var msg = 'Falta especificar: ';
        for (var idx = 0; idx < this.contextTriggers.length; idx++) {
            if (!this.contextTriggers.isSet) {
                msg += this.contextTriggers[idx].name;
                if (idx <= this.contextTriggers.lenght - 1) {
                    msg += ', ';
                }
            }
        }
        Karma.Controls.EntityLinkCombo.superclass.markInvalid.call(this, msg);
    },
    
    buildSubQuery: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.buildSubQuery]  [' + this.getName() + '] <-');
		}
        var subquery = '';
        if (!this.ignoreTriggers) {
            for (var idx = 0; idx < this.contextTriggers.length; idx++) {
                subquery += this.contextTriggers[idx].queryValue;
                if (idx < this.contextTriggers.length - 1) {
                    subquery += ' and ';
                }
            }
        }
        if (subquery != '' && this.preContext.length >= 1) {
            subquery += ' and ';
        }
        for (var idx = 0; idx < this.preContext.length; idx++) {
            subquery += this.preContext[idx].query;
            if (idx < this.preContext.length - 1) {
                subquery += ' and ';
            }
        }
        if ((this.contextTriggers.length >= 1 || this.preContext.length >= 1) && this.subquery != null) {
            subquery += ' and ' + this.subquery;
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLink.onTrigger1Click] The subQuery: ' + subquery);
        }
        return subquery;
    },
    
    buildParameters: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.buildParameters]  [' + this.getName() + '] <-');
		}
        var parameters = new Array();
        if (!this.ignoreTriggers) {
            for (var idx = 0; idx < this.contextTriggers.length; idx++) {
                parameters.push({
                    Id: this.contextTriggers[idx].Id
                });
            }
        }
        for (var idx = 0; idx < this.preContext.length; idx++) {
            if (!Ext.isEmpty(this.preContext[idx].Id)) {
                parameters.push({
                    Id: this.preContext[idx].Id
                });
            }
            if (!Ext.isEmpty(this.preContext[idx].value)) {
                parameters.push(this.preContext[idx].value);
            }
        }
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLink.buildParameters] Parameters: ' + parameters);
        }
        return parameters;
    },
    
    changeIcon: function(iconCls){
        this.getTrigger(1).removeClass(this.currentTriggerClass);
        this.getTrigger(1).addClass(iconCls);
        this.currentTriggerClass = iconCls;
    },
    
    setTriggerBehavior: function(behavior){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[EntityLinkCombo.setTriggerBehavior]  [' + this.getName() + '] current behavior: ' +
            	this.currentBehavior + ', new behavior: ' + behavior);
        }
        if (this.currentBehavior == behavior) 
            return;
        
        switch (behavior) {
            case 'search':
                this.changeIcon(this.searchTriggerClass);
                break;
            case 'open':
                this.changeIcon(this.openTriggerClass);
                break;
        }
        
        this.currentBehavior = behavior;
    },
	
	disableNew: function() {
		if(!this.canAdd) return;
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.disableNew]  [' + this.getName() + '] <-');
		}
		this.triggers[0].addClass('x-hide-display');
	},
	
	enableNew: function() {
		if(!this.canAdd) return;
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLinkCombo.enableNew]  [' + this.getName() + '] <-');
		}
		this.triggers[0].removeClass('x-hide-display');
	}
    
});
Karma.EL = Karma.Controls.EntityLinkCombo;
Ext.reg('entity.link', Karma.Controls.EntityLinkCombo);

/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Controls.EntityLink = Ext.extend(Ext.form.TwinTriggerField, {
	
	metadata: null,
	
	entity: null,
	
	entityName: null,
	
	entityValue: {},
	
	displayValue: null,
	
	contextTriggers: [],
	
	preContext: [],
	
	subquery: null,
	
	displayProperty: null,
	
	additionalProperties: [],
	
	ignoreTriggers: false,
	
	canAdd: true,
	
	typeAhead: false,
	
	hideTrigger1: false,

	hideTrigger2: false,

    trigger1Class:'x-form-open-trigger',

    trigger2Class:'x-form-search-trigger',
		
	enableKeyEvents: true,
	
	style: 'text-decoration: underline; color: blue; cursor: pointer;',
	
	initComponent: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.initComponent] <-');
			PLOG.debug('[EntityLink.initComponent] Entity name: [' + this.entityName + ']');
		}
		if (Ext.isObject(this.contextTriggers) && !Ext.isArray(this.contextTriggers)) {
			this.contextTriggers = [this.contextTriggers];
		}
		else {
			if (!Ext.isArray(this.contextTriggers)) {
				Ext.Msg.alert('EntityLink.Error', this.getName() + ' does not have a valid value on contextTriggers property.');
			}
		}
		if (Ext.isObject(this.preContext) && !Ext.isArray(this.contextTriggers)) {
			this.preContext = [this.preContext];
		}
		else {
			if (!Ext.isArray(this.preContext)) {
				Ext.Msg.alert('EntityLink.Error', this.getName() + ' does not have a valid value on preContext property.');
			}
		}
		if (this.readOnly) {
			this.hideTrigger2 = true;
		}
		this.entity = Karma.Core.ModuleManager.Instance.getEntity(this.entityName);
		Ext.apply(this, {
			autoShow : false,
			lazyInit: true,
			forceSelection: true
		});
		Karma.Controls.EntityLink.superclass.initComponent.apply(this, arguments);
		this.on('keydown', function(me, e){ 
			e.stopEvent(); 
		}, this);
		this.addEvents({ 
			set: true, 
			cleared: true, 
			change: true 
		});
	},
	
	processContextTriggers: function(form){
		Ext.each(this.contextTriggers, function(trigger){
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processContextTrigger] <- Name: ' + this.getName() + ' the trigger id: ' + trigger.id);
			}
			var item = form.findField(trigger.id);
			item.on('set', this.triggerSet, this);
			item.on('cleared', this.triggerCleared, this);
			trigger.name = item.fieldLabel;
			trigger.isSet = false;
		}, this);
	},
	
	triggerCleared: function(elink, value) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.triggerCleared] <- Id: ' + elink.getName());
		}
		this.entityValue.set('Id', 0);
		Karma.Controls.EntityLink.superclass.setValue.call(this, '');

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
			PLOG.debug('[EntityLink.triggerSet] <- Id: ' + elink.getName() + 
				', value: ' + _id);
		}
		this.clearValue();
		Ext.each(this.contextTriggers, function(trigger){
			if (elink.getName() === trigger.id) {
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[EntityLink.triggerSet] Trigger found [' + trigger.name + ']');
				}
				trigger.queryValue = trigger.query.replace('?', _id);
				trigger.isSet = true;
				trigger.Id = _id;
				if (PLOG.isDebugEnabled()) {
					PLOG.debug('[EntityLink.triggerSet] Query set [' + trigger.queryValue + ']');
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

	setEntityValue: function(val) {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.setEntityValue] <- ' + this.getName());
		}
		this.entityValue = this.processEntity(val);
		var displayValue = this.processDisplayValue(this.entityValue);
		this.displayValue = Ext.isEmpty(displayValue) || displayValue == undefined? 'empty' : displayValue;
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.setEntityValue] Entity: ' + this.getName() + ', Property: ' +
				this.displayProperty + ', Field value: ' + this.displayValue);
		}
		Karma.Controls.EntityLink.superclass.setValue.call(this, this.displayValue);
		
		this.fireEvent('set', this, this.entityValue.get('Id'));
	},
	
	getEntityValue: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.getEntityValue] ');
		}
		if (Ext.isEmpty(this.entityValue) || Ext.isEmpty(this.entityValue.get) || 
			this.entityValue.get('Id') == 0) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.getEntityValue] entity value is empty...');
			}
			return null;
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.getEntityValue] ok, lets build the object with only the Id: ' + this.entityValue.get('Id'));
			}
			return { Id: this.entityValue.get('Id') };
		}
	},

	setValue: function(v) {
		if (!Ext.isEmpty(v)) {
			if (Ext.type(v) === 'object') {
				this.setEntityValue(v);
			}
			if (Ext.type(v) === 'string') {
				Karma.Controls.EntityLink.superclass.setValue.call(this, v);
			}
		} else {
			Karma.Controls.EntityLink.superclass.setValue.call(this, '');
		}
	},
	
	clearValue: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.clearValue] <-');
		}
		this.entityValue = null;
		if (this.isVisible()) {
			Karma.Controls.EntityLink.superclass.setRawValue.call(this, '');
		} else {
			Karma.Controls.EntityLink.superclass.setValue.call(this, '');
		}
		this.fireEvent('cleared');
	},
	
	getValue: function() {
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.getValue] ' + this.entityName + ', ' + this.name);
		}
		return this.getEntityValue();
	},
	
	getRawValue: function() {
		if (Ext.isEmpty(this.entityValue) || Ext.isEmpty(this.entityValue.get) || 
			this.entityValue.get('Id') == 0) {
			return null;
		} else {
			return this.entityValue;
		}
	},
	
	onTrigger2Click: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.onTrigger1Click] <-');
		}
		if (this.disabled) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger1Click] sorry, it is disabled.');
			}
			return;
		}
		if (this.isContextValid()){
			var subquery = '';
			var parameters = new Array();
			for(var idx = 0; idx < this.contextTriggers.length; idx++) {
				subquery += this.contextTriggers[idx].queryValue;
				parameters.push({
					Id: this.contextTriggers[idx].Id
				});
				if (idx < this.contextTriggers.length - 1) {
					subquery += ' and ';
				}
			}

			if (this.contextTriggers.length >= 1 && this.preContext.length >= 1) {
				subquery += ' and ';
			}

			for(var idx = 0; idx < this.preContext.length; idx++) {
				subquery += this.preContext[idx].query;
				if (!Ext.isEmpty(this.preContext[idx].Id)) {
					parameters.push({
						Id: this.preContext[idx].Id
					});
				} 
				if (!Ext.isEmpty(this.preContext[idx].value)) {
					parameters.push(this.preContext[idx].value);
				} 
				if (idx < this.preContext.length - 1) {
					subquery += ' and ';
				}
			}

			if ((this.contextTriggers.length >= 1 || this.preContext.length >= 1) && this.subquery != null) {
				subquery += ' and ' + this.subquery;
			}

			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger1Click] The subQuery: ' + subquery);
				PLOG.debug('[EntityLink.onTrigger1Click] Parameters: ' + parameters);
			}
			Ext.ComponentMgr.create({
				title: this.fieldLabel,
				parameters: {
					entity: this.entity,
					parameters: parameters,
					ignoreTriggers: this.ignoreTriggers,
					canAdd : this.canAdd,
					subquery: subquery
				},
				listeners: {
					'select': {
						fn: this.onSelect,
						scope: this
					}
				}
			}, 'entity.window');
		} else {
			var msg = 'Falta especificar: ';
			for(var idx = 0; idx < this.contextTriggers.length; idx++) {
				if (!this.contextTriggers.isSet) {
					msg += this.contextTriggers[idx].name;
					if (idx <= this.contextTriggers.lenght - 1) {
						msg += ', ';
					}
				}
			}
			this.markInvalid(msg);
		}
	},
	
	onTrigger1Click: function(){
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.onTrigger2Click] <-');
		}
		if (this.disabled) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger2Click] sorry, it is disabled.');
			}
			return;
		}
		if(Ext.isEmpty(this.entityValue) || Ext.isEmpty(this.entityValue.get) || 
			this.entityValue.get('Id') == 0) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.onTrigger2Click] sorry, it is null or empty.');
			}
			return;
		}
		this.entity.link.Open(this.entityValue.get('Id'));
	},
	
	onSelect: function(record){
		this.entityValue = this.processEntity(record);
		this.displayValue = this.processDisplayValue(this.entityValue);
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.onSelect] Entity: ' + this.getName() + ', Property: ' +
				this.displayProperty + ', Field value: ' + this.displayValue);
		}
		Karma.Controls.EntityLink.superclass.setValue.call(this, this.displayValue);
		this.fireEvent('set', this, this.entityValue.get('Id'), this.entityValue);
		this.fireEvent('change', this, this.entityValue.get('Id'), this.entityValue);
	},
	
	processEntity: function(val) {
		var entity;
		if (Ext.isEmpty(val.get)) {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processEntity] create new Record...');
			}
			Record = Ext.data.Record.create(this.entity.columnstore);
			entity = new Record(val, val.Id);
			entity.json = val;
		} else {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processEntity] the value is a record...');
			}
			entity = val;
		}
		return entity;
	},
	
	processDisplayValue: function(entity) {
		var val = '';
		if (Ext.type(this.entity.link.displayProperty) === 'string') {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processDisplayValue] displayProperty is string...');
			}
			val = entity.get(this.entity.link.displayProperty);
		} else 
		if (Ext.type(this.entity.link.displayProperty) === 'object') {
			if (PLOG.isDebugEnabled()) {
				PLOG.debug('[EntityLink.processDisplayValue]  displayProperty is XTemplate...');
			}
			val = this.entity.link.displayProperty.apply(entity.data);
		} 
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[Entity.getDisplayProperty] display value : [' + this.entity.link.displayProperty + 
				'] from entity:' + val);
		}
		return val;
	},
	
	validateValue: function() {
		var valid;
		if (this.allowBlank) {
			valid = true;
		}
		else {
			valid = this.getEntityValue() != null;
		}
		if (PLOG.isDebugEnabled()) {
			PLOG.debug('[EntityLink.validateValue] :' + valid);
		}
		return valid;
	}
	
});

//Karma.EL = Karma.Controls.EntityLink;
//Ext.reg('entity.link', Karma.EL);

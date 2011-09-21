/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.CriteriaControl = Ext.extend(Ext.form.FormPanel, {
	
	canRemove: true,
	
	showAndOr: true,
	
	entityDescription: null,
	
	configuration: null,
	
	numericOperands: [['2', '='], ['6', '<'], ['7', '<='], 
		['8', '>'], ['9', '>='], ['10', 'entre'], ['11', 'lista'], ['15', 'distinto']],
	
	dateOperands: [['2', '='], ['6', '<'], ['7', '<='], 
		['8', '>'], ['9', '>='], ['10', 'entre'], ['11', 'distinto']],
	
	stringOperands: [['3', 'igual'], ['4', 'comience con'], 
		['5', 'termine con'], ['6', 'lista'], ['16', 'contenga'], 
		['14', 'no se parezca'], ['15', 'distinto']],
	
	enumOperands: [['2', '='], ['11', 'lista'], ['15', 'distinto']],
	
	booleanOperands: [['2', '=']],
	
    initComponent: function(){
		var configuration = this.configuration || {};
        Ext.apply(this, {
            layout: 'hbox',
			layoutConfig: {
                pack: 'start',
				align: 'stretch'
            },
			bodyStyle: 'padding: 0px 0px 0px 0px',
            defaults: {
                border: false,
                frame: false,
                layout: 'form',
                labelAlign: 'top',
                labelSeparator: ''
            },
            defaultType: 'panel',
            items: [{
				width: 200,
                items: this.property = new Ext.form.ComboBox({
					name: 'property',
                    width: 190,
					labelSeparator: '',
                    fieldLabel: 'Propiedad',
					mode: 'local',
					displayField: 'Expression',
					valueField:'Expression',
					labelSeparator: '',
					editable: false,
					triggerAction: 'all',
					selectOnFocus: true,
                    store: new Ext.data.ArrayStore({
                        data: this.entityDescription,
                        idIndex: 0,
						fields: ['Expression', 'Type']
                    }),
					listeners: {
						select: { fn: this.onSelect, scope: this },
						valid: { fn: this.onValidExpression, scope: this },
						invalid: { fn: this.onInvalidExpression, scope: this }
					},
					allowBlank: false,
					value: configuration.Expression
                })
            }, {
                width: 100,
                items: this.operand = new Ext.form.ComboBox({
					name: 'operand',
                    width: 90,
                    fieldLabel: 'Comparador',
					displayField:'Operacion',
					mode: 'local',
					valueField:'Id',
					labelSeparator: '',
					editable: false,
					triggerAction: 'all',
					selectOnFocus: true,
                    store: new Ext.data.ArrayStore({
                        data: this.configureOperandData(),
                        idIndex: 0,
						fields: ['Id', 'Operacion']
                    }),
					allowBlank: false,
					listeners: {
						valid: { fn: this.onValidExpression, scope: this },
						invalid: { fn: this.onInvalidExpression, scope: this },
					},
					value: configuration.Type
                })
            }, this.criteria = new Ext.Panel({
				layout: 'form',
                width: 200,
				defaults: {
                    fieldLabel: 'Valor',
					labelSeparator: '',
					width: 190,
					listeners: {
						valid: { fn: this.onValidExpression, scope: this },
						invalid: { fn: this.onInvalidExpression, scope: this },
					},
					allowBlank: false
				},
				defaultType: 'textfield',
                items: this.configureCriteria()
            })]
        });
        Karma.Modules.Report.CriteriaControl.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'valid': true, 'invalid': true });
    },
	
	onRender: function() {
		Karma.Modules.Report.CriteriaControl.superclass.onRender.apply(this, arguments);
		this.isValid();
	},

	onValidExpression: function() {
		if(this.isValid()) {
			if(PLOG.isDebugEnabled()) {
				PLOG.debug('[CriteriaControl.onValidExpression] the expression is valid.');
			}
			this.fireEvent('valid', this);			
		}
	},
	
	onInvalidExpression: function() {
		this.fireEvent('invalid', this);
	},
	
    isValid: function(){
        var valid = true;
        this.getForm().items.each(function(f){
            if (!f.isValid()) {
                valid = false;
                f.markInvalid();
            }
        });
        return valid;
    },
	
	getCriteria: function() { },
	
	onSelect: function(combo, record, index) {
		var type = record.data.Type;
		this.criteria.removeAll(true);
		this.operand.clearValue();
		this.operand.getStore().loadData(this.getOperandData(type));
		this.criteria.add(this.getCriteria(type));
		this.doLayout();
	},
	
	getCriteria: function(type) {
		var config;
		var ltype = type.toLowerCase();
		if(ltype === 'string') {
			config = { xtype: 'textfield' };
		}
		else if(ltype === 'datetime') {
			config = { xtype: 'datefield' };
		}
		else if(ltype === 'tnt64' || ltype === 'tnt32' || ltype === 'double') {
			config = { xtype: 'textfield' };
		}
		else if(ltype === 'boolean') {
			config = { xtype: 'textfield' };
		}
		else if(type.indexOf('Enum') != -1) {
			config = { xtype: 'enum.combo', enumName: type };
		}
		var config2 = {
			fieldLabel: 'Valor',
			labelSeparator: '',
			width: 190,
            name: 'criteria'
		};
		Ext.apply(config2, config);
		return config2;
	},
	
	getExpressionType: function(expression) {
		var type;
		Ext.each(this.entityDescription, function(desc) {
			if(desc[0] == expression) {
				type = desc[1];
				return false;
			}
		}, this);
		
		PLOG.debug('[CriteriaControl] the type of the expression: ' + type);
		return type;
	},
	
	getOperandData: function(type) {
		var ltype = type.toLowerCase();
		var store = [];
		if(ltype === 'string') {
			store = this.stringOperands;
		}
		else if(ltype === 'datetime') {
			store = this.dateOperands;
		}
		else if(ltype === 'int64' || ltype === 'int32' || 
			ltype === 'double') {
			store = this.numericOperands;
		}
		else if(ltype === 'boolean') {
			store = this.booleanOperands;
		}
		else if(type.indexOf('Enum') != -1) {
			store = this.enumOperands;
		}
		return store;
	},
	
	configureOperandData: function() {
		if(Ext.isEmpty(this.configuration)) {
			return this.numericOperands;
		} else {
			var type = this.getExpressionType(this.configuration.Expression);
			return this.getOperandData(type);
		}
	},
	
	configureCriteria: function() {
		if(Ext.isEmpty(this.configuration)) {
			return {
				name: 'criteria'
            };
		} else {
			var type = this.getExpressionType(this.configuration.Expression);
			return this.getCriteria(type);
		}
	},
	
	buildExpression: function() {
		return {
			Expression: this.property.getValue(),
			Type: this.operand.getValue(),
			OperandValues: this.buildCriteria(),
			DataType: this.property.getSelectedData().Type
		};
	},
	
	buildCriteria: function() {
		return [this.criteria.items.get(0).getValue()];
	},
	
	buildDescription: function() {
		return this.property.getDisplayValue() + ' ' +
			this.operand.getDisplayValue() + ' \'' +
			this.buildCriteriaDescription() + '\'';
	},
	
	buildCriteriaDescription: function() {
		var value = this.buildCriteria();
		var type = this.property.getSelectedData().Type;
		var formated;
		var ltype = type.toLowerCase();
		if(ltype === 'string') {
			formated = value;
		}
		else if(ltype === 'datetime') {
			formated = Ext.util.Format.date(value, 'd/m/Y');
		}
		else if(ltype === 'int64' || ltype === 'int32' || 
			ltype === 'double') {
			formated = value;
		}
		else if(ltype === 'boolean') {
			formated = value;
		}
		else if(type.indexOf('Enum') != -1) {
			formated = Karma.Data.EnumStore.findById(type, value);
		}
		return formated;
	}
	
});
Ext.reg('report.builder.criteria', Karma.Modules.Report.CriteriaControl);

Ext.override(Ext.form.ComboBox, {
	getDisplayValue: function() {
		return this.getStore().getById(this.getValue()).get(this.displayField);
	},
	getSelectedData: function() {
		return this.getStore().getById(this.getValue()).data;
	}
});

/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.AndOrGroupingControl = Ext.extend(Ext.Panel, {
    
    entityDescription: null,
	
	criteria1: null,
	
	criteria2: null,
    
    initComponent: function(){
        Ext.apply(this, {
			frame: true,
			border: false,
			bodyStyle: 'padding: 10px 10px 10px 10px',
			defaultType: 'report.builder.wrapper',
			defaults: {
				entityDescription: this.entityDescription,
				listeners: {
					valid: { fn: this.onValidExpression, scope: this },
					invalid: { fn: this.onInvalidExpression, scope: this },
					addcriteria: { fn: this.onAddCriteria, scope: this },
					removecriteria: { fn: this.onRemoveCriteria, scope: this }
				}
			},
            items: [
			this.criteria1 || {},
			this.andor = new Ext.form.ComboBox({
				width: 40,
				editable: false,
				triggerAction: 'all',
				store: new Ext.data.ArrayStore({
					autoDestroy: true,
					data: [['0', 'Y'], ['1', 'O']],
					idIndex: 0,
					fields: ['Id', 'Operacion']
				}),
				displayField: 'Operacion',
				mode: 'local',
				valueField: 'Id',
				fieldLabel: ' ',
				labelSeparator: '',
				value: '0',
				allowBlank: false,
				value: this.operand
			}), 
			this.criteria2 || {}
			]
        });
        Karma.Modules.Report.AndOrGroupingControl.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'valid': true, 'invalid': true, 'addcriteria': true, 'removecriteria': true });
		this.criteria1 = this.items.get(0);
		this.criteria2 = this.items.get(2);
    },
    
    onAddCriteria: function(wrapper) {
		var index = this.items.indexOf(wrapper);
		wrapper.purgeListeners();
		var criteria = wrapper.getCriteria();
		var config = {
			flex:1,
			xtype: 'report.builder.grouping',
			criteria1: criteria.buildExpression()
		};
		this.remove(wrapper, true);
		this.insert(index, config);
		this.doLayout();
		this.fireEvent('invalid', this);
	},
    
    onRemoveCriteria: function(source, criteria){
		PLOG.debug('[AndOrGroupingControl.onRemoveCriteria] XType: ' + source.getXType() + 
			', criteria: ' + criteria);
		
		var index = this.items.indexOf(source);
		index = index == 0? 2 : 0;
		var control = this.remove(index);
		control.purgeListeners();
		var criteria = control.getCriteria();
		
		var ownerGroup = source.ownerCt;
		var rootGroup = ownerGroup.ownerCt;
		var groupIndex = rootGroup.items.indexOf(ownerGroup);
		ownerGroup.purgeListeners();
		rootGroup.remove(ownerGroup);
		
		rootGroup.insert(groupIndex, control);
		control.on('valid', this.onValidExpression, this);
		control.on('invalid', this.onInvalidExpression, this);
		control.on('addcriteria', this.onAddCriteria, this);
		control.on('removecriteria', this.onRemoveCriteria, this);
		rootGroup.doLayout();
    },
    
    onValidExpression: function(){
		if (this.isValid()) {
			if(PLOG.isDebugEnabled()) {
				PLOG.debug('[AndOrGroupingControl.onValidExpression] the expression is valid.');
			}
			this.fireEvent('valid', this);
		}
    },
    
    onInvalidExpression: function(){
        this.fireEvent('invalid', this);
    },
	
    isValid: function(){
        return this.criteria1.isValid() && this.criteria2.isValid();
    },
	
	buildExpression: function() {
		return {
			Expression: this.andor.getValue(),
			Criterions: [
				this.criteria1.buildExpression(),
				this.criteria2.buildExpression()
			]
		};
	},
	
	buildDescription: function() {
		return this.criteria1.buildDescription() + 
			(this.andor.getValue() == '0'? ' y ' : ' o ') +
			this.criteria2.buildDescription();
	}
	
});
Ext.reg('report.builder.grouping', Karma.Modules.Report.AndOrGroupingControl);

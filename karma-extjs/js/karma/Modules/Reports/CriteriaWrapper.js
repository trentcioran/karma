/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.Report.CriteriaWrapper = Ext.extend(Ext.Panel, {

    canAdd: true,
    
    canRemove: true,
    
    entityDescription: null,
	
	configuration: null,
    
    initComponent: function(){
        Ext.apply(this, {
            layout: 'hbox',
			height: 60,
			frame: true,
			border: false,
            bodyStyle: 'padding: 0px 0px 0px 0px',
            layoutConfig: {
                pack: 'start',
				align: 'stretch'
            },
            items: [this.criteria = new Karma.Modules.Report.CriteriaControl({
                flex: 1,
				configuration: this.configuration,
                entityDescription: this.entityDescription,
				listeners: {
					valid: { fn: this.onValidExpression, scope: this },
					invalid: { fn: this.onInvalidExpression, scope: this }
				}
            }), {
				xtype: 'panel',
                width: 30,
                items: [this.addBtn = new Ext.Button({
                    iconCls: 'icon-plus',
                    handler: this.onAddCriteria,
                    scope: this,
					disabled: true,
                    hidden: !this.canAdd
                }), this.removeBtn = new Ext.Button({
                    iconCls: 'icon-minus',
                    handler: this.onRemoveCriteria,
                    scope: this,
                    hidden: true//!this.canRemove
                })]
            }]
        });
        Karma.Modules.Report.CriteriaWrapper.superclass.initComponent.apply(this, arguments);
		this.addEvents({ 'valid': true, 'invalid': true, 'addcriteria': true, 'removecriteria': true });
    },
    
    onAddCriteria: function(){
        this.fireEvent('addcriteria', this);
    },
    
    onRemoveCriteria: function(){
        this.fireEvent('removecriteria', this);
    },
    
    onValidExpression: function(){
		if(PLOG.isDebugEnabled()) {
			PLOG.debug('[CriteriaWrapper.onValidExpression] the expression is valid.');
		}
		this.addBtn.enable();
		this.fireEvent('valid', this);
	},
    
    onInvalidExpression: function(){
        this.fireEvent('invalid', this);
    },
    
    getCriteria: function(){
		return this.criteria;
    },
	
    isValid: function(){
        return this.criteria.isValid();
    },
	
	buildExpression: function() {
		return this.criteria.buildExpression();
	},
	
	buildDescription: function() {
		return this.criteria.buildDescription();
	}
});
Ext.reg('report.builder.wrapper', Karma.Modules.Report.CriteriaWrapper);

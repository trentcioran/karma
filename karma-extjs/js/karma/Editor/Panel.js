/**
 * Proyecto: Karma
 * @author Mislas
 * @version 1.0
 * 
 * Override Ext.Panel to perfomr initialization of framework components 
 * instead of each Type of Form
 * 
 */

Ext.override(Ext.Panel, {

    createComponent: function(config) {
        // pre-processing        
        if (config.xtype) {
            if (config.xtype === 'datefield') {
                config.format = 'd/m/Y g:i:s A';
            }

            if (config.xtype === 'ag.list' || config.xtype === 'entity.list' ||
				config.xtype === 'entity.link' || config.xtype === 'eel.list') {

                var entity;
                var field = this.metadata.getField(config.name);

                if (field) {
                    entity = Karma.Core.ModuleManager.Instance.getEntity(field.EntityName);
                    config.query = field.Query;
                    config.searchquery = field.SearchQuery;
                }
                if (!entity) {
                    entity = Karma.Core.ModuleManager.Instance.getEntity(config.entityName);
                }
                Ext.apply(config, entity.getConfig(config.xtype));
                if (config.xtype === 'ag.list' || config.xtype === 'entity.list' || config.xtype === 'eel.list') {
                    this.hasAggregates = true;
                }
            }
        }
        if (this.propertyName) {
            config.propertyName = this.propertyName;
            config.originalName = config.name;
            config.name = this.propertyName + '.' + config.name;
        }
        if (config.fieldLabel && config.xtype != 'datefield') {
            config.invalidText = 'El campo ' + config.fieldLabel + ' es mandatorio.';
            config.blankText = 'El campo ' + config.fieldLabel + ' es mandatorio.';
        }
        var cmp = Ext.create(config, this.defaultType);
        // post-processing
        return cmp;
    },


    enableAggregates: function(value) {
        this.items.each(function(item) {
            if (item.getXType() === 'ag.list' || item.getXType() === 'entity.list' || item.getXType() === 'eel.list') {

                item.setParentEntity.createDelegate(item)(value);
            }
            else if (item.enableAggregates) {
                item.enableAggregates(value);
            }
        }, this);

    },    

    updateControls: function(value) {
        this.items.each(function(item) {
            if (item.getXType() === 'ag.list' || item.getXType() === 'entity.list' || item.getXType() === 'eel.list') {

                item.updateControls.createDelegate(item)(value);
            }
            else if (item.updateControls) {
                item.updateControls(value);
            }
        }, this);
    }

});


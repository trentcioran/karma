/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.QueryEditor.Editor = Ext.extend(Ext.form.FormPanel, {
    initComponent: function(){
        this.gridId = Ext.id();
        Ext.apply(this, {
            layout: 'vbox',
            anchor: '100%',
            border: false,
            layoutConfig: {
                align: 'stretch',
                pack: 'start'
            },
            items: [{
                xtype: 'panel',
                title: 'Editor de Consultas',
                layout: 'form',
                anchor: '100%',
                border: false,
                frame: true,
                bodyStyle: 'padding: 10px 10px 0px 10px',
                labelWidth: 130,
                items: [{
                    xtype: 'textarea',
                    name: 'query',
                    fieldLabel: 'Consulta',
                    height: 150,
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                }, {
                    xtype: 'combo',
                    id: 'qlang',
                    editable: false,
                    triggerAction: 'all',
                    store: new Ext.data.ArrayStore({
                        autoDestroy: true,
                        data: [['HQL'], ['SQL']],
                        idIndex: 0,
                        fields: ['Id']
                    }),
                    displayField: 'Id',
                    mode: 'local',
                    valueField: 'Id',
                    fieldLabel: 'Lenguaje',
                    labelSeparator: '',
                    value: 'HQL',
                    allowBlank: false
                }],
                buttons: [{
                    text: 'Ejecutar',
                    handler: this.onExecute,
                    bindForm: true,
                    scope: this
                }]
            }, {
                xtype: 'tabpanel',
                anchor: '100%',
                flex: 1,
                activeItem: 0,
                layoutOnTabChange: true,
                items: [this.grid = new Ext.grid.GridPanel({
                    id: this.gridId,
                    title: 'Resultados',
                    store: this.store = new Ext.data.JsonStore({
                        autoDestroy: true,
                        fields: [ 'Id' ],
                        data: { Data: [] },
                        root: 'Data',
                        idProperty: 'Id'
                    }),
                    columns: [{
                        id: 'Id',
                        header: 'Id'
                    }],
                    viewConfig: {
                        forceFit: true
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    }),
                    frame: true,
                    bbar: this.pagingtoolbar = new Ext.PagingToolbar({
                        pageSize: 20,
                        store: this.store,
                        displayInfo: true,
                        plugins: new Ext.ux.ProgressBarPager()
                    })
                }), {
                    xtype: 'panel',
                    title: 'Resultado(Raw)',
                    collapsible: false,
                    anchor: '100%',
                    layout: 'fit',
                    items: [{
                        xtype: 'textarea',
                        name: 'rawresults',
                        anchor: '98% 98%',
                        readOnly: true
                    }]
                }]
            }]
        });
        Karma.Modules.System.QueryEditor.Editor.superclass.initComponent.apply(this, arguments);
    },
    
    onExecute: function(){
        var query = this.getForm().findField('query').getValue();
        var lang = this.getForm().findField('qlang').getValue();

        this.clean();
        Ext.MessageBox.show({
           msg: 'Executing query...',
           progressText: 'Saving...',
           width: 300,
           wait: true,
           waitConfig: { interval: 200 }
       });

        if (Ext.isEmpty(query)) {
            Ext.Msg.alert('Error', 'Debes ingresar una consulta antes de intentar ejecutarla');
            return;
        }
        this.entity.useInvoker('ExecuteQuery', {
            Query: query,
            Start: 0,
            PageSize: 10,
            QueryLang: lang
        }, {
            fn: function(resultado){
                this.getForm().findField('rawresults').setValue(Ext.encode(resultado));
                this.reconfigureGrid(resultado);
                Ext.MessageBox.hide();
            },
            scope: this
        }, {
            fn: function(resultado){
                if (Ext.isObject(resultado)) {
                    this.getForm().findField('rawresults').setValue(Ext.encode(resultado));
                }
                else {
                    this.getForm().findField('rawresults').setValue(resultado);
                }
                Ext.MessageBox.hide();
            },
            scope: this
        });
    },
    
    clean: function(data){
        this.getForm().findField('rawresults').setValue('');
        this.grid.getStore().removeAll();
    },

    reconfigureGrid: function(data){
        var properties = this.getPropertyNames(data.Data[0]);
        var store = new Ext.data.JsonStore({
            proxy: new Ext.ux.data.PagingMemoryProxy(data),
            autoDestroy: true,
            data: data,
            root: 'Data',
            idProperty: 'Id',
            fields: properties
        });
        var columns = this.buildColumnModel(properties);

        this.grid.reconfigure(store, new Ext.grid.ColumnModel(columns));
        this.pagingtoolbar.unbind();
        this.pagingtoolbar.bind(store);
    },

    getPropertyNames: function(data){
        var properties = [];
        for (var propertyName in data) {
            properties.push(propertyName);
        }
        return properties;
    },
    
    buildColumnModel: function(properties){
        var model = [];
        Ext.each(properties, function(property) {
            model.push({
                header: property,
                dataIndex: property
            });
        }, this);
        return model;
    }
    
});
Ext.reg('qe.editor', Karma.Modules.System.QueryEditor.Editor);

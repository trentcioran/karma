/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Factory._ColumnFactory = function(){
    this.getGridColumnModel = function(thecolumns, ordenar){
        var columns = new Array();
	    columns[0] = new Ext.grid.RowNumberer();
        var _sortable = ordenar;
        
        Ext.each(thecolumns, function(item, index){
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[SearchListFactory.getColumnModel] Column: ' + item.Name +
                ', Property: ' +
                item.Property +
                ', Mostrar: ' +
                item.Mostrar);
            }
            var ocultar = false;
            if (!Ext.isEmpty(item.Mostrar)) {
                ocultar = !item.Mostrar;
            }
            if (!Ext.isEmpty(item.Tipo)) {
                switch (item.Tipo) {
                    case 'fecha':
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.DateField({
                                format: 'd/m/Y',
                                selectOnFocus: true
                            })
                        };
                        break;
                    case 'moneda':
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            renderer: 'usMoney',
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.NumberField({
                                allowBlank: false,
                                allowNegative: false,
                                selectOnFocus: true,
                                style: 'text-align:left'
                            })
                        };
                        break;
                    case 'flotante':
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.NumberField({
                                allowBlank: false,
                                style: 'text-align:left',
                                selectOnFocus: true
                            })
                        };
                        break;
                    case 'logico':
                        columns[index + 1] = new Ext.ux.CheckColumn({
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            width: 55
                        });
                        columns[index + 1].IsPlugin = true;
                        break;
                    case 'enum':
                        columns[index + 1] = new Karma.Ext.Grid.EnumColumn({
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            width: 55,
                            enumType: item.TipoEnum,
                            editor: new Karma.Controls.EnumComboBox({
                                enumName: item.TipoEnum,
                                lazyRender: true
                            })
                        });
                        columns[index + 1].IsPlugin = true;
                        break;
                    case 'entity':
                        columns[index + 1] = new Karma.Ext.Grid.EntityColumn({
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            width: 55,
                            property: item.EntityProperty,
                            entityName: item.EntityName
                        });
                        columns[index + 1].IsPlugin = true;
                        break;
                    default:
                        columns[index + 1] = {
                            header: item.Name,
                            dataIndex: item.Property,
                            sortable: _sortable,
                            hidden: ocultar,
                            editor: item.Editor ? item.Editor : new Ext.form.TextField({
                                allowBlak: false,
                                selectOnFocus: true
                            })
                        };
                }
            }
            else {
                columns[index + 1] = {
                    header: item.Name,
                    dataIndex: item.Property,
                    sortable: _sortable,
                    hidden: ocultar,
                    editor: item.Editor ? item.Editor : new Ext.form.TextField({
                        allowBlak: false,
                        selectOnFocus: true
                    })
                };
            }
        });
        return columns;
    };
    this.getColumnStore = function(thecolumns){
        var _fields = new Array();
        
        Ext.each(thecolumns, function(item, index){
            if (!Ext.isEmpty(item.Tipo)) {
                switch (item.Tipo) {
                    case 'fecha':
                        _fields[index] = {
                            name: item.Property,
                            type: 'date',
                            dateFormat: 'n/j h:ia'
                        };
                        break;
                    case 'logico':
                        _fields[index] = {
                            name: item.Property,
                            type: 'bool'
                        };
                        break;
                    case 'entero':
                        _fields[index] = {
                            name: item.Property,
                            type: 'int'
                        };
                        break;
                    case 'entity':
                        _fields[index] = {
                            name: item.Property
                        };
                        break;
                    case 'moneda':
                    case 'flotante':
                    default:
                        _fields[index] = {
                            name: item.Property,
                            type: 'float'
                        };
                }
            }
            else {
                _fields[index] = {
                    name: item.Property,
                    type: 'string'
                };
            }
        });
        return _fields;
    };
    this.getListViewColumnModel = function(thecolumns){
        var columns = new Array();
        
        Ext.each(thecolumns, function(item, index){
            if (PLOG.isDebugEnabled()) {
                PLOG.debug('[SearchListFactory.getColumnModel] Column: ' + item.Name +
                ', Property: ' +
                item.Property +
                ', Mostrar: ' +
                item.Mostrar);
            }
            var ocultar = false;
            if (!Ext.isEmpty(item.Mostrar) && !item.Mostrar) {
                return true;
            }
            if (!Ext.isEmpty(item.Tipo)) {
                switch (item.Tipo) {
                    case 'fecha':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: '{' + item.Property + ':date("d/m/Y")}'
                        });
                        break;
                    case 'moneda':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: '{' + item.Property + ':number("0,000.00")}'
                        });
                        break;
                    case 'flotante':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: '{' + item.Property + ':number("0.00")}'
                        });
                        break;
                    case 'logico':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property
                        });
                        break;
                    case 'enum':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: new Ext.XTemplate('{' + item.Property + ':this.getLabel}', {
                                enumType: item.TipoEnum,
                                getLabel: function(val){
									if (!val) return;
                                    return Karma.Data.EnumStore.create(this.enumType).findById(val);
                                }
                            })
                        });
                        break;
                    case 'entity':
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property,
                            tpl: new Ext.XTemplate('{' + item.Property + ':this.getLabel}', {
                                property: item.EntityProperty,
                                getLabel: function(val){
                                    return val[this.property];
                                }
                            })
                        });
                        break;
                    default:
                        columns.push({
                            header: item.Name,
                            dataIndex: item.Property
                        });
                }
            }
            else {
                columns.push({
                    header: item.Name,
                    dataIndex: item.Property
                });
            }
        });
        return columns;
    };
    
}
Ext.apply(Karma.Factory, {
    ColumnFactory: new Karma.Factory._ColumnFactory()
});

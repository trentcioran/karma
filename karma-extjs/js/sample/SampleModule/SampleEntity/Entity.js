/**
 * @author trentcioran
 */
Sample.Module.SampleEntity.Entity = function(){
    if (LOG.isDebugEnabled()) {
        LOG.debug('[Sample.Module.SampleEntity.Entity.ctor] <-');
    }
    Sample.Module.SampleEntity.Entity.superclass.constructor.call(this);
}

Ext.extend(Sample.Module.SampleEntity.Entity, Karma.Core.Entity, {
    id: 'SampleEntity',
    name: 'SampleEntity',
    editorXType: 'sample.editor',
    editorW: 770,
    editorH: 670,
    columns: [{
        Name: 'Id',
        Property: 'Id',
        Mostrar: false
    }, {
        Name: 'FieldA',
        Property: 'FieldA'
    }, {
        Name: 'DateField',
        Property: 'DateField',
        Tipo: 'fecha'		
    }, {
        Name: 'FieldB',
        Property: 'FieldB'
    }, {
        Name: 'FieldC',
        Property: 'FieldC'
    }, {
        Name: 'FieldD',
        Property: 'FieldD'
    }],
    
    searchlist: {
        canNew: false,        
        sortings: ['Id'],
        views: [{
            Id: 0,
            Nombre: 'Normal',
            Template: null
        }, {
            Id: 1,
            Nombre: 'Expandida',
            Template: null
        }],
        previewTemplate: null
    },
    link: {
        displayProperty: 'Id'
    }
});

Sample.SampleEntity = Sample.Module.SampleEntity.Entity;

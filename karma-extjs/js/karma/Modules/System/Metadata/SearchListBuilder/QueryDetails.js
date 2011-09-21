/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Modules.System.Metadata.QueryDetails = Ext.extend(Ext.grid.PropertyGrid, {
    initComponent: function(){
        Ext.apply(this, {
            title: 'Query Details',
            clicksToEdit: 2,
            columnLines: true,
            stripeRows: true
        });
        Karma.Modules.System.Metadata.QueryDetails.superclass.initComponent.apply(this, arguments);
    },
    
    setQuery: function(query){
        if (PLOG.isDebugEnabled()) {
            PLOG.debug('[QueryDetails.setQuery] query: ' + query);
        }
        this.setSource(query);
    }
});

Ext.reg('meta.sl.det', Karma.Modules.System.Metadata.QueryDetails);

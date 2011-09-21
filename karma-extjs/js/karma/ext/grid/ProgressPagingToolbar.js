/**
 * Proyecto: Karma
 * @author Mislas
 */
Karma.Ext.Grid.PagingToolbar = Ext.extend(Ext.PagingToolbar, {

    firstLoad: false,
    
	plugins: [new Ext.ux.grid.PageSizer({
        initialSize: Karma.Core.Configuration.DefaultPageSize
    }), new Ext.ux.ProgressBarPager()],
			
    initComponent: function(){
        Ext.apply(this, {
            pageSize: Karma.Core.Configuration.DefaultPageSize,
            displayMsg: 'Mostrando {0} - {1} de {2} registros',
            emptyMsg: 'No se encontraron registros para mostrar',
            beforePageText: "P&aacute;gina",
            afterPageText: "de {0}",
            beforePageSizeText: "Tama&ntilde;o de la p&aacute;gina",
            firstText: "Primer p&aacute;gina",
            prevText: "P&aacute;gina anterior",
            nextText: "Siguiente p&aacute;gina",
            lastText: "&Uacute;ltima p&aacute;gina",
            refreshText: "Actualizar",
            paramNames: {
                start: 'Page',
                limit: 'PageSize'
            }
        });
        Karma.Ext.Grid.PagingToolbar.superclass.initComponent.call(this);
    },
    
    doLoad: function(start){
        var opts = {}
        if (this.fireEvent('beforechange', this, opts) !== false) {
            var params = this.store.baseParams;
            params.Parameters.Start = start;
            params.Parameters.PageSize = this.pageSize;
            this.store.reload();
        }
    },
    
    onLoad: function(store, r, o){
        if (!this.rendered) {
            this.dsLoaded = [store, r, o];
            return;
        }
        this.cursor = this.store.baseParams.Parameters.Start;
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;
        
        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.inputItem.setValue(ap);
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    }
});


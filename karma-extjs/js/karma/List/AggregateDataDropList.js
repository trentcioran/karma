/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.List.AggregateDataDropList = Ext.extend(Karma.List.AggregateList, {
    
    addBulk: true,
    highlightNewRows: true,
    lineEndRE: /\r\n|\r|\n/,
    sepRe: /\s*\t\s*/,
    excelValuesField: null,
    
    initComponent: function(){
    
        if (PLOG.isDebugEnabled()) {
			PLOG.debug('[AggregateDataDropList.initComponent] <- Entity Name: ' + this.entityName);
		}
		this.service = 'Cognitum.Dominio.Cobranza.IIntegracionPagoService';
        Karma.List.AggregateDataDropList.superclass.initComponent.apply(this, arguments);
        
        this.addEvents({
			'beforedatadrop': true,
            'datadrop': true,
            'afterdatadrop': true
		});
		
        /*this.grid = Ext.getCmp(this.getId() + '-grid');
        
        Ext.apply(this, {
            changeValueTask: {
                run: function(){
                    this.dataDropped.call(this, null, this.excelValuesField);
                },
                interval: 100,
                scope: this
            },
            onResize: ((this.grid)?this.grid.onResize.createSequence(this.resizeDropArea):null)
        });
                
		if (this.grid) {
		
		    var v = this.grid.view;
    		
		    this.excelValuesField = Ext.DomHelper.insertAfter(v.scroller, {
                tag: 'textarea',
                id: Ext.id(),
                value: '',
                style: {
                    /*'font-size': '1px',
                    border: '0px none',
                    overflow: 'hidden',
                    color: '#fff',*
                    position: 'absolute',
                    top: v.mainHd.getHeight() + 'px',
                    left: '0px',
                    'background-color': '#fff',
                    margin: 0,
                    cursor: 'default'
                }
            }, true);
		    this.excelValuesField.setOpacity(0.1);
            this.excelValuesField.forwardMouseEvents();
            this.excelValuesField.on({
                mouseover: function(){
                    Ext.TaskMgr.start(this.changeValueTask);
                },
                mouseout: function(){
                    Ext.TaskMgr.stop(this.changeValueTask);
                },
                scope: this
            });
            
            this.resizeDropArea.call(this);
            
        }*/
        
        if (PLOG.isDebugEnabled()) {
			PLOG.debug('[AggregateDataDropList.initComponent] -> Entity Name: ' + this.entityName);
		}
        
    },
    
    resizeDropArea: function(){
        if (this.excelValuesField) {
            var v = this.grid.view,
                sc = v.scroller,
                scs = sc.getSize,
                s = {
                    width: sc.dom.clientWidth || (scs.width - v.getScrollOffset() + 2),
                    height: sc.dom.clientHeight || scs.height
                };
            this.excelValuesField.setSize(s);
        }
    },

    //  on change of data in textarea, create a Record from the tab-delimited contents.
    dataDropped: function(e, el){
        var nv = el.value;
        el.blur();
        if (nv !== '') {
          if (this.fireEvent('beforedatadrop',this,nv,el)){
            var store = this.grid.getStore(), Record = store.recordType;
            el.value = '';
            var rows = nv.split(this.lineEndRE), cols = this.grid.getColumnModel().getColumnsBy(function(c){
                return !c.hidden;
            }), fields = Record.prototype.fields, recs = [];
            this.fireEvent('datadrop',this,rows);
            if (cols.length && rows.length) {
                for (var i = 0; i < rows.length; i++) {
                    var vals = rows[i].split(this.sepRe), data = {};
                    if (vals.join('').replace(' ', '') !== '') {
                        for (var k = 0; k < vals.length; k++) {
                            var fldName = cols[k].dataIndex;
                            var fld = fields.item(fldName);
                            data[fldName] = fld ? fld.convert(vals[k]) : vals[k];
                        }
                        var newRec = new Record(data);
                        recs.push(newRec);
                        if (!this.addBulk){
                          store.add(newRec);
                          if (this.highlightNewRows){
                            var idx = store.indexOf(newRec);
                            this.grid.view.focusRow(idx);
                            Ext.get(this.grid.view.getRow(idx)).highlight();
                          }
                        }
                    }
                }
                if (this.addBulk && recs && recs.length){
                  store.add(recs);
                  if (this.highlightNewRows){
                    for (var i = 0; i < recs.length; i++){
                      var idx = store.indexOf(recs[i]);
                      this.grid.view.focusRow(idx);
                      Ext.get(this.grid.view.getRow(idx)).highlight();
                    }
                  }
                }
                this.fireEvent('afterdatadrop',this,recs);
                this.resizeDropArea.call(this);
            }
          }else{
            this.excelValuesField.value = '';
          }
        }
    },
	
	onBeforeAdd: function (id, selected, parentEntity) { },
	
	onBeforeDelete: function (id, selected, parentEntity) { }/*,
	
	getGridListeners: function(){
        return {
                'rowclick' : { fn: this.onContextMenu, scope: this },
                'bodyresize' : { fn: function(){ this.syncSize(); }, scope: this} 
            };
    }
    
	'beforedatadrop': function(){console.log(arguments);},
                      'datadrop': function(){console.log(arguments)},
                      'afterdatadrop': function(){console.log(arguments)}*/

});

Karma.ADDL = Karma.List.AggregateDataDropList;
Ext.reg('dda.list', Karma.ADDL);
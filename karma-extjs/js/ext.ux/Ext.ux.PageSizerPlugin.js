﻿/**
 * Ext.ux.grid.PageSizer 
 * Copyright (c) 2009-2010, galdaka@hotmail.com
 *
 * Ext.ux.grid.AutoRefresher is licensed under the terms of the
 *                  GNU Open Source GPL 3.0
 * license.
 *
 * Commercial use is prohibited. contact with galdaka@hotmail.com
 * if you need to obtain a commercial license.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/gpl.html>.
 *
 */

Ext.namespace('Ext.ux.grid');

Ext.ux.grid.PageSizer = Ext.extend(Ext.CycleButton, {
	initialSize: this.initialSize || 15,
	pageSizes: this.pageSizes || [10, 15, 20, 25, 30, 50, 75, 100, 200],
    addText: '&nbsp;registros(s) por p&#225;gina',
	initComponent: function(){
	    var ir=[];
		var at = this.addText ;
		var is = this.initialSize;
		Ext.each(this.pageSizes, function(ps){
			ir.push({
				text: '&nbsp;' + ps + at, 
				value: ps, 
				checked: ps==is ? true : false
			})
		});
		ir.push({
			text: '&nbsp; Todos', 
			value: 0, 
			checked: false
		})
		Ext.apply(this, {
		  	showText: true,
			prependText: '&nbsp;',
			items: ir
		})
		Ext.ux.grid.PageSizer.superclass.initComponent.apply(this, arguments);
	},
    init: function(pagingToolbar) { 
        pagingToolbar.on('render', this.onInitView, this);
    },
    onInitView: function(pagingToolbar) {
		pagingToolbar.insert(12, this);
        pagingToolbar.insert(12, '-');
        this.on('change', this.onPageSizeChanged, pagingToolbar);
    },
    onPageSizeChanged: function(cycleButton) {
        this.pageSize = parseInt(cycleButton.getActiveItem().value);
        this.doLoad(0);
    }
});

if(Ext.ux.grid.PageSizer){
  Ext.ux.grid.PageSizer.prototype.addText = "&nbsp;registros(s) por p&#225;gina";
}
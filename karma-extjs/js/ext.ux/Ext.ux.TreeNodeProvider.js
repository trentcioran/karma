/*
* Version 0.2.3
*
 * Ext.tree.TreeNodeProvider
 *
 * @author    Dott. Ing.  Marco Bellocchi
 * @date      24. April 2008
 * @license Ext.tree.TreeNodeProvider.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. 
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
*/

Ext.tree.TreeNodeProvider = function(cfg) {
    
    this.data = [];
    
    Ext.apply(this, cfg);
    
    if(!this.getNodes || (typeof this.getNodes != "function"))
        throw '!this.getNodes || typeof this.getNodes != "function"';
    
    this.setData = function(t_data) {
        this.data = t_data;
    }
    
    this.getData = function() {
        return this.data;
    }
}

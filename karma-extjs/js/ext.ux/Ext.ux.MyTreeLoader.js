/*
* Version 0.2.3
*
 * Ext.tree.MyTreeLoader
 *
 * @author    Dott. Ing.  Marco Bellocchi
 * @date      24. April 2008
 * @license Ext.tree.MyTreeLoader.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. 
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
*/

Ext.tree.MyTreeLoader = function(config){
    //@private
    var canFireLoadEvent = true;//private 
    //@private
    var treeNodeProvider = null;
    //@private
    var loading = false;
    
    Ext.apply(this, config);
    Ext.tree.MyTreeLoader.superclass.constructor.call(this, config);
    //TO FIX I need to do that for retro compatibility, but you MUST use getTreeNodeProvider to have access to it!
    treeNodeProvider = this.treeNodeProvider;
    
    //@private
    var processResponse = function(o, node, callback) {
        try {
            node.beginUpdate();
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            node.endUpdate();
        }
        catch(e){
            canFireLoadEvent = false;
            this.fireEvent("loadexception", this, node, treeNodeProvider.data);
        }
        // make sure we notify
        // the node that we finished
        if(typeof callback == "function"){
            callback();
        }
        if(canFireLoadEvent === true)
            this.fireEvent("load", this, node, treeNodeProvider.data);//Passing the data elaborated by the treeNodeProvider
    }.createDelegate(this);
    
    //@private
    var requestData = function(node, callback){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            loading = true;
            var nodesToAdd = null;
            try {
                nodesToAdd = treeNodeProvider.getNodes(treeNodeProvider.data);//Can fire an exception
            }
            catch(e){
                canFireLoadEvent = false;
                this.fireEvent("loadexception", this, node, treeNodeProvider.data);
            }
            if(typeof nodesToAdd != "undefined" && nodesToAdd != null)
                processResponse(nodesToAdd, node, callback);//Can not fire an exception
            loading = false;
        } 
        else {
            canFireLoadEvent = false;
        }
    }.createDelegate(this);
    
    //@public
    this.load = function(node, callback){
        canFireLoadEvent = true;//Reset the flag
        if(this.clearOnLoad){
           while(node.firstChild){
                var tmpNode = node.firstChild;
                node.removeChild(tmpNode);
                tmpNode.destroy();//Destroy actually cascades, see, http://extjs.com/forum/showthread.php?t=14993
            }
        }
        if(this.doPreload(node)){ // preloaded json children
            if(typeof callback == "function"){
                callback();
            }
        }
        else if(treeNodeProvider){
            requestData(node, callback);
        }
    }
    
    //@public
    this.isLoading = function(){
        return loading;
    }
    
    //@public
    this.updateTreeNodeProvider = function(obj){
        if(treeNodeProvider){
            treeNodeProvider.setData(obj);
        }
    }
    
    //@public
    this.getTreeNodeProvider =  function(){
            return treeNodeProvider;
    }
    //Set a new treeNodeProvider
    //@public
    this.setTreeNodeProvider = function(newTreeNodeProvider) {
        if(newTreeNodeProvider == null || (typeof newTreeNodeProvider =='undefined'))
            throw 'setTreeNodeProvider, newTreeNodeProvider == null || (typeof newTreeNodeProvider == undefined)';
        treeNodeProvider = newTreeNodeProvider;
    } 

};
Ext.tree.MyTreeLoader = Ext.extend(Ext.tree.MyTreeLoader, Ext.tree.TreeLoader);

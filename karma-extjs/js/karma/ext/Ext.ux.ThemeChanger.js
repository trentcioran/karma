/**
 * @author ramki_r
 */
Ext.ux.ThemeChanger = Ext.extend(Ext.form.ComboBox, {
    width: 100,
    preThemes: 'lib/ext/resources/css/ext-all.css',
    extThemes: [['Sin tema', 'lib/ext/resources/css/ext-all-notheme.css'], ['Azul', 'lib/ext/resources/css/ext-all.css'], ['Negro', 'lib/ext/resources/css/xtheme-black.css'], ['Gris', 'lib/ext/resources/css/xtheme-tp.css'], ['Olivo', 'lib/ext/resources/css/xtheme-olive.css'], ['Gris 2', 'lib/ext/resources/css/xtheme-darkgray.css'], ['Negro 2', 'lib/ext/resources/css/xtheme-slickness.css'], ['Grafito', 'lib/ext/resources/css/xtheme-slate.css']],
    defaultTheme: 1,
    cssId: 'Grafito',
	
    typeAhead: true,
    triggerAction: 'all',
    mode: 'local',
    editable: false,
    
    loadCssFile: function(filename, theCssId){
        if (theCssId) 
            var elem = document.getElementById(theCssId);
        if (elem && elem != null) {
            elem.setAttribute("href", filename);
        }
        else {
            elem = document.createElement("link");
            elem.setAttribute("rel", "stylesheet");
            elem.setAttribute("type", "text/css");
            elem.setAttribute("href", filename);
            if (theCssId) 
                elem.setAttribute("id", theCssId);
            document.getElementsByTagName("head")[0].appendChild(elem);
        }
    },
    
    changeTheme: function(obj, rec, themeChoice){
        this.defaultTheme = themeChoice;
        this.loadCssFile(rec.get(this.valueField), this.cssId);
        this.fireEvent('activity');
    },
    
    loadPreThemes: function(){
        if (this.preThemes) {
            if (this.preThemes instanceof Array) {
                for (var i = 0, len = this.preThemes.length; i < len; i++) {
                    this.loadCssFile(this.preThemes[i]);
                }
            }
            else {
                this.loadCssFile(this.preThemes);
            }
        }
    },
    
    loadPostThemes: function(){
        if (this.postThemes) {
            if (this.postThemes instanceof Array) {
                for (var i = 0, len = this.postThemes.length; i < len; i++) {
                    this.loadCssFile(this.postThemes[i]);
                }
            }
            else {
                this.loadCssFile(this.postThemes);
            }
        }
    },
    
    initComponent: function(){
        Ext.ux.ThemeChanger.superclass.initComponent.call(this);
        if (!this.store) {
            this.store = new Ext.data.SimpleStore({
                fields: ['displayname', 'cssFile'],
                data: this.extThemes
            });
        }
        if (!this.displayField) 
            this.displayField = 'displayname';
        if (!this.valueField) 
            this.valueField = 'cssFile';
        if (!this.value) 
            this.value = this.store.getAt(this.defaultTheme).get(this.valueField);
        
        this.on('select', this.changeTheme);
        
        this.loadPreThemes();
        this.changeTheme(this, this.store.getAt(this.defaultTheme), this.defaultTheme);
        this.loadPostThemes();
        this.addEvents({
            'activity': true
        });
    }
    
});
Ext.reg('themechanger', Ext.ux.ThemeChanger);

/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.About = Ext.extend(Ext.Window, {
	
	initComponent: function(){
		Ext.apply(this, {
			title: 'Acerca de ĸarмa&#8482',
			modal: false,
			closable: true,
			collapsible: false,
			draggable: true,
			minimizable: false,
			resizable: false,
			width: 300,
			height: 300,
			html: '<center><br/><img src="imgs/el-karma.png" style="width: 100px;" /><br/><br/><p><b>ĸarмa&#8482</b></p><br/><p> applιcaтιon plaтform</p><p>verѕιon ' + Karma.Version + ' </p><br/><p> aυтнor: joѕe мanυel ιѕlaѕ roмero</p><p>[тrenтcιoran@gмaιl.coм] </p><br/><p> &copy; y &reg; joѕe мanυel ιѕlaѕ roмero 2008 </p></center>'
		});
		
		Karma.About.superclass.initComponent.apply(this, arguments);
		this.show();
	}

});

Ext.reg('about', Karma.About);

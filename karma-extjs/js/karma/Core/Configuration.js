/**
 * Proyecto: Karma
 * @author Mislas
 */

Karma.Core.Configuration = function(){};

Ext.apply(Karma.Core.Configuration, {
	
	GenerateStaticIds: false,
	
	BaseDir: 'js/karma/',
	
	ServiceInvoker: 'Service/ServiceInvoker',
	
	ExportService: 'Service/Exporter',
	
	DescribeService: 'Describe',
	
	EnumService: 'Karma.Framework.Core.Domain.IEnumDescriptorService',
	
	EnumMethod: 'GetEnumDescriptions',
	
	LogInMethod: 'IniciaSesion',
	
	LogOutMethod: 'LogIn.aspx?x=out',
	
	ImporterService: 'Karma.Framework.Core.Domain.Tools.Import.IImporterService',
	
	ImporterEntitiesMethod: 'GetEntities',
	
	NewMethod: 'New',
	
	NewFromEntityMethod: 'NewFromEntity',
	
	GetMethod: 'Get',
	
	FindMethod: 'Find',
	
	SaveMethod: 'Save',
	
	UpdateMethod: 'Update',
	
	DeleteMethod: 'Delete',
	
	DefaultNewDepth: 2,
	
	DefaultSaveDepth: 2,
	
	DefaultGetDepth: 3,
	
	DefaultRoot: 'Data',
	
	DefaultTotal: 'Count',
	
	DateFormat: 'd/m/Y g:i:s A',
	
	DefaultPageSize: 20,

	DefaultFindDepth: 2,
	
	IsTest: false,

	ApplicationName: '',
	
	ApplicationAbout: '',
	
	ApplicationHelp: ''
	
});

Karma.Conf = Karma.Core.Configuration;

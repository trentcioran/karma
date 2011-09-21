<?xml version="1.0" encoding="utf-8"?>
<project path="" name="Karma - Application Platform" author="Jose Manuel Islas Romero [trentcioran@gmail.com]" version="0.7" copyright="Karma 0.7&#xD;&#xA;Copyright(c) 2008-2009, $author." output="$project\build" source="False" source-dir="$output\source" minify="False" min-dir="$output\build" doc="False" doc-dir="$output\docs" min-dair="$output\build">
  <target name="Everything" file="$output\karma.js" debug="True" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="karma.js" />
    <include name="Util\AjaxHelper.js" />
    <include name="Util\ListenerUtils.js" />
    <include name="Security\Ext.form.Field.js" />
    <include name="Core\Configuration.js" />
    <include name="Core\Metadata.js" />
    <include name="Core\Principal.js" />
    <include name="Core\ModuleManager.js" />
    <include name="Core\WindowManager.js" />
    <include name="Core\SessionManager.js" />
    <include name="Gears\FileSystemStore.js" />
    <include name="Data\EnumStore.js" />
    <include name="Factory\ColumnFactory.js" />
    <include name="Factory\FactoryCache.js" />
    <include name="Core\Entity.js" />
    <include name="Core\Module.js" />
    <include name="Core\Application.js" />
    <include name="Core\Window.js" />
    <include name="Menu\ViewsMenu.js" />
    <include name="Menu\WindowsMenu.js" />
    <include name="Menu\ToolsMenu.js" />
    <include name="Menu\ModulesMenu.js" />
    <include name="Menu\HelpMenu.js" />
    <include name="ext\grid\ProgressPagingToolbar.js" />
    <include name="ext\grid\EntityColumn.js" />
    <include name="ext\grid\EnumColumn.js" />
    <include name="ext\Ext.ux.SearchField.js" />
    <include name="ext\Ext.ux.ThemeChanger.js" />
    <include name="ext\Ext.ux.StatusBar.js" />
    <include name="Parts\StatusBar.js" />
    <include name="Parts\WorkPanel.js" />
    <include name="Parts\WorkPanelItem.js" />
    <include name="Parts\ApplicationWindow.js" />
    <include name="Forms\LogIn.js" />
    <include name="Forms\About.js" />
    <include name="Data\HttpProxy.js" />
    <include name="Data\JsonReader.js" />
    <include name="data\JsonStore.js" />
    <include name="data\JsonReader.js" />
    <include name="data\ArrayReader.js" />
    <include name="data\HttpProxy.js" />
    <include name="data\GroupingStore.js" />
    <include name="Data\JsonStore.js" />
    <include name="Data\GroupingStore.js" />
    <include name="Views\ViewMenuBase.js" />
    <include name="Views\WindowsView.js" />
    <include name="Views\ModulesView.js" />
    <include name="Views\ReportsView.js" />
    <include name="Views\FavoritesView.js" />
    <include name="Views\SystemView.js" />
    <include name="Editor\Panel.js" />
    <include name="Editor\BasicForm.js" />
    <include name="Editor\Actions\AcionBase.js" />
    <include name="Editor\Actions\Action.Load.js" />
    <include name="Editor\Actions\Action.NewFromEntity.js" />
    <include name="Editor\Actions\Action.New.js" />
    <include name="Editor\Actions\Action.Save.js" />
    <include name="Editor\Actions\Action.Update.js" />
    <include name="Editor\Window.js" />
    <include name="Editor\EditorBase.js" />
    <include name="Editor\FormBase.js" />
    <include name="Editor\TwoColumnFormBase.js" />
    <include name="Editor\IFormBase.js" />
    <include name="Editor\TFormBase.js" />
    <include name="Editor\layouts\Card.js" />
    <include name="Editor\layouts\Tab.js" />
    <include name="Editor\layouts\Simple.js" />
    <include name="List\RowEditorPlugin.js" />
    <include name="List\ListBase.js" />
    <include name="List\SearchList.js" />
    <include name="List\AggregateList.js" />
    <include name="List\InPlaceEditableAggregateList.js" />
    <include name="List\InPlaceEditableEntityList.js" />
    <include name="List\EntityList.js" />
    <include name="List\AggregateDataDropList.js" />
    <include name="Controls\EnumComboBox.js" />
    <include name="Controls\EntityLinkSearch.js" />
    <include name="Controls\EntityLinkWindow.js" />
    <include name="Controls\EntityLink.js" />
    <include name="Controls\EntityLinkCombo.js" />
    <include name="Core\View.js" />
    <include name="Tools\Importer\MainForm.js" />
    <include name="Tools\Importer\SummaryForm.js" />
    <include name="Tools\Shipping\MainForm.js" />
    <include name="Modules\Reports\ReportViewer.js" />
    <include name="Modules\Reports\Entity.js" />
    <include name="Modules\Reports\Editor.js" />
    <include name="Modules\Reports\AndOrGroupingControl.js" />
    <include name="Modules\Reports\CriteriaControl.js" />
    <include name="Modules\Reports\CriteriaWrapper.js" />
    <include name="Modules\Reports\ListReport.js" />
    <include name="Modules\Reports\GraphReport.js" />
    <include name="Modules\Reports\Module.js" />
    <include name="Modules\System\Metadata\Entity.js" />
    <include name="Modules\System\Metadata\Designer.js" />
    <include name="Modules\System\Metadata\Entity\EntityBrowser.js" />
    <include name="Modules\System\Metadata\Entity\EntityDetails.js" />
    <include name="Modules\System\Metadata\EditorBuilder\EditorBuilder.js" />
    <include name="Modules\System\Metadata\SearchListBuilder\SearchListBuilder.js" />
    <include name="Modules\System\Metadata\SearchListBuilder\QueryList.js" />
    <include name="Modules\System\Metadata\SearchListBuilder\QueryDetails.js" />
    <include name="Modules\System\Metadata\SearchListBuilder\GridView.js" />
    <include name="Modules\System\Metadata\SearchListBuilder\SearchList.js" />
    <include name="Modules\System\QueryEditor\Entity.js" />
    <include name="Modules\System\QueryEditor\Editor.js" />
    <include name="Modules\System\Module.js" />
  </target>
  <file name="layout\LayoutRegionLite.js" path="layout" />
  <file name="DDScrollManager.js" path="" />
  <file name="grid\AbstractColumnModel.js" path="grid" />
  <file name="data\ArrayAdapter.js" path="data" />
  <file name="data\DataAdapter.js" path="data" />
  <file name="data\HttpAdapter.js" path="data" />
  <file name="data\JsonAdapter.js" path="data" />
  <file name="data\ArrayProxy.js" path="data" />
  <file name="widgets\SimpleMenu.js" path="widgets" />
  <file name="CSS.js" path="" />
  <file name="CustomTagReader.js" path="" />
  <file name="Format.js" path="" />
  <file name="JSON.js" path="" />
  <file name="MixedCollection.js" path="" />
  <file name="data\DataSource.js" path="data" />
  <file name="yui-ext-dl.jsb" path="" />
  <file name="yui-ext.jsb" path="" />
  <file name="form\FloatingEditor.js" path="form" />
  <file name="anim\Actor.js" path="anim" />
  <file name="anim\Animator.js" path="anim" />
  <file name="data\AbstractDataModel.js" path="data" />
  <file name="data\DataModel.js" path="data" />
  <file name="data\DataSet.js" path="data" />
  <file name="data\DataStore.js" path="data" />
  <file name="data\DefaultDataModel.js" path="data" />
  <file name="data\JSONDataModel.js" path="data" />
  <file name="data\LoadableDataModel.js" path="data" />
  <file name="data\Set.js" path="data" />
  <file name="data\TableModel.js" path="data" />
  <file name="data\XMLDataModel.js" path="data" />
  <file name="form\DateField.js" path="form" />
  <file name="form\Field.js" path="form" />
  <file name="form\FieldGroup.js" path="form" />
  <file name="form\Form.js" path="form" />
  <file name="form\NumberField.js" path="form" />
  <file name="form\Select.js" path="form" />
  <file name="form\TextArea.js" path="form" />
  <file name="form\TextField.js" path="form" />
  <file name="grid\editor\CellEditor.js" path="grid\editor" />
  <file name="grid\editor\CheckboxEditor.js" path="grid\editor" />
  <file name="grid\editor\DateEditor.js" path="grid\editor" />
  <file name="grid\editor\NumberEditor.js" path="grid\editor" />
  <file name="grid\editor\SelectEditor.js" path="grid\editor" />
  <file name="grid\editor\TextEditor.js" path="grid\editor" />
  <file name="grid\AbstractGridView.js" path="grid" />
  <file name="grid\AbstractSelectionModel.js" path="grid" />
  <file name="grid\CellSelectionModel.js" path="grid" />
  <file name="grid\DefaultColumnModel.js" path="grid" />
  <file name="grid\EditorGrid.js" path="grid" />
  <file name="grid\EditorSelectionModel.js" path="grid" />
  <file name="grid\Grid.js" path="grid" />
  <file name="grid\GridDD.js" path="grid" />
  <file name="grid\GridEditor.js" path="grid" />
  <file name="grid\GridView.js" path="grid" />
  <file name="grid\GridViewLite.js" path="grid" />
  <file name="grid\PagedGridView.js" path="grid" />
  <file name="grid\RowSelectionModel.js" path="grid" />
  <file name="grid\SelectionModel.js" path="grid" />
  <file name="layout\BasicLayoutRegion.js" path="layout" />
  <file name="layout\BorderLayout.js" path="layout" />
  <file name="layout\BorderLayoutRegions.js" path="layout" />
  <file name="layout\ContentPanels.js" path="layout" />
  <file name="layout\LayoutManager.js" path="layout" />
  <file name="layout\LayoutRegion.js" path="layout" />
  <file name="layout\LayoutStateManager.js" path="layout" />
  <file name="layout\SplitLayoutRegion.js" path="layout" />
  <file name="menu\BaseItem.js" path="menu" />
  <file name="menu\CheckItem.js" path="menu" />
  <file name="menu\DateMenu.js" path="menu" />
  <file name="menu\Item.js" path="menu" />
  <file name="menu\Menu.js" path="menu" />
  <file name="menu\MenuMgr.js" path="menu" />
  <file name="menu\Separator.js" path="menu" />
  <file name="menu\TextItem.js" path="menu" />
  <file name="tree\AsyncTreeNode.js" path="tree" />
  <file name="tree\TreeDragZone.js" path="tree" />
  <file name="tree\TreeDropZone.js" path="tree" />
  <file name="tree\TreeFilter.js" path="tree" />
  <file name="tree\TreeLoader.js" path="tree" />
  <file name="tree\TreeNode.js" path="tree" />
  <file name="tree\TreeNodeUI.js" path="tree" />
  <file name="tree\TreePanel.js" path="tree" />
  <file name="tree\TreeSelectionModel.js" path="tree" />
  <file name="tree\TreeSorter.js" path="tree" />
  <file name="widgets\BasicDialog2.js" path="widgets" />
  <file name="widgets\InlineEditor.js" path="widgets" />
  <file name="widgets\TaskPanel.js" path="widgets" />
  <file name="widgets\TemplateView.js" path="widgets" />
  <file name="Anims.js" path="" />
  <file name="Bench.js" path="" />
  <file name="compat.js" path="" />
  <file name="CompositeElement.js" path="" />
  <file name="Date.js" path="" />
  <file name="DomHelper.js" path="" />
  <file name="DomQuery.js" path="" />
  <file name="Element.js" path="" />
  <file name="EventManager.js" path="" />
  <file name="Ext.js" path="" />
  <file name="Fx.js" path="" />
  <file name="KeyMap.js" path="" />
  <file name="KeyNav.js" path="" />
  <file name="Layer.js" path="" />
  <file name="State.js" path="" />
  <file name="Template.js" path="" />
  <file name="UpdateManager.js" path="" />
  <file name="yutil.js" path="" />
  <file name=".DS_Store" path="" />
  <file name="widgets\form\Select.js" path="widgets\form" />
  <file name="widgets\Notifier.js" path="widgets" />
  <file name="yui\dragdrop.js" path="yui" />
  <file name="yui-overrides.js" path="" />
  <file name="util\CustomTagReader.js" path="util" />
  <file name="widgets\Combo.js" path="widgets" />
  <file name="widgets\form\Validators.js" path="widgets\form" />
  <file name="experimental\ext-lang-en.js" path="experimental" />
  <file name="experimental\jquery-bridge.js" path="experimental" />
  <file name="experimental\prototype-bridge.js" path="experimental" />
  <file name="experimental\yui-bridge.js" path="experimental" />
  <file name="widgets\Frame.js" path="widgets" />
  <file name="widgets\.DS_Store" path="widgets" />
  <file name="widgets\layout\AutoLayout.js" path="widgets\layout" />
  <file name="widgets\TabPanel2.js" path="widgets" />
  <file name="widgets\panel\ButtonPanel.js" path="widgets\panel" />
  <file name="widgets\._.DS_Store" path="widgets" />
  <file name="._.DS_Store" path="" />
  <file name="experimental\Ajax.js" path="experimental" />
  <file name="experimental\Anims.js" path="experimental" />
  <file name="experimental\BasicDialog2.js" path="experimental" />
  <file name="experimental\BasicGridView.js" path="experimental" />
  <file name="experimental\GridView3.js" path="experimental" />
  <file name="experimental\GridViewUI.js" path="experimental" />
  <file name="experimental\ModelEventHandler.js" path="experimental" />
  <file name="experimental\TaskPanel.js" path="experimental" />
  <file name="experimental\UIEventHandler.js" path="experimental" />
  <file name="legacy\Actor.js" path="legacy" />
  <file name="legacy\Animator.js" path="legacy" />
  <file name="legacy\compat.js" path="legacy" />
  <file name="legacy\InlineEditor.js" path="legacy" />
  <file name="widgets\grid\Grid.js" path="widgets\grid" />
  <file name="widgets\panel\AutoLayout.js" path="widgets\panel" />
  <file name="widgets\panel\BorderLayout.js" path="widgets\panel" />
  <file name="widgets\panel\Container.js" path="widgets\panel" />
  <file name="widgets\panel\ContainerLayout.js" path="widgets\panel" />
  <file name="widgets\panel\Grid.js" path="widgets\panel" />
  <file name="widgets\panel\Panel.js" path="widgets\panel" />
  <file name="widgets\panel\TabPanel.js" path="widgets\panel" />
  <file name="widgets\panel\TreePanel.js" path="widgets\panel" />
  <file name="widgets\panel\Viewport.js" path="widgets\panel" />
  <file name="widgets\panel\Window.js" path="widgets\panel" />
  <file name="widgets\panel\WindowManager.js" path="widgets\panel" />
  <file name="widgets\BasicDialog.js" path="widgets" />
  <file name="experimental\GridExtensions.js" path="experimental" />
  <file name="widgets\layout\BasicLayoutRegion.js" path="widgets\layout" />
  <file name="widgets\layout\BorderLayoutRegions.js" path="widgets\layout" />
  <file name="widgets\layout\ContentPanels.js" path="widgets\layout" />
  <file name="widgets\layout\LayoutManager.js" path="widgets\layout" />
  <file name="widgets\layout\LayoutRegion.js" path="widgets\layout" />
  <file name="widgets\layout\LayoutStateManager.js" path="widgets\layout" />
  <file name="widgets\layout\ReaderLayout.js" path="widgets\layout" />
  <file name="widgets\layout\SplitLayoutRegion.js" path="widgets\layout" />
  <file name="widgets\form\Editor.js" path="widgets\form" />
  <file name="experimental\ext-base.js" path="experimental" />
  <file name="widgets\ViewPanel.js" path="widgets" />
  <file name="util\MasterTemplate.js" path="util" />
  <file name="widgets\form\Layout.js" path="widgets\form" />
  <file name="widgets\BorderLayout.js" path="widgets" />
  <file name="widgets\ColumnLayout.js" path="widgets" />
  <file name="widgets\ContainerLayout.js" path="widgets" />
  <file name="widgets\JsonView.js" path="widgets" />
  <file name="widgets\MenuButton.js" path="widgets" />
  <file name="widgets\View.js" path="widgets" />
  <file name="widgets\grid\AbstractGridView.js" path="widgets\grid" />
  <file name="state\State.js" path="state" />
  <file name="widgets\layout\AccordianLayout.js" path="widgets\layout" />
  <file name="widgets\QuickTips.js" path="widgets" />
  <file name="locale\ext-lang-sp.js" path="locale" />
  <file name="locale\ext-lang-no.js" path="locale" />
  <file name="widgets\layout\AbsoluteForm.js" path="widgets\layout" />
  <file name="widgets\layout\AbsoluteFormLayout.js" path="widgets\layout" />
  <file name="widgets\grid\GridColumn.js" path="widgets\grid" />
  <file name="widgets\chart\Base.js" path="widgets\chart" />
  <file name="legacy\layout\BasicLayoutRegion.js" path="legacy\layout" />
  <file name="legacy\layout\BorderLayout.js" path="legacy\layout" />
  <file name="legacy\layout\BorderLayoutRegions.js" path="legacy\layout" />
  <file name="legacy\layout\ContentPanels.js" path="legacy\layout" />
  <file name="legacy\layout\LayoutManager.js" path="legacy\layout" />
  <file name="legacy\layout\LayoutRegion.js" path="legacy\layout" />
  <file name="legacy\layout\LayoutStateManager.js" path="legacy\layout" />
  <file name="legacy\layout\ReaderLayout.js" path="legacy\layout" />
  <file name="legacy\layout\SplitLayoutRegion.js" path="legacy\layout" />
  <file name="legacy\AbstractGridView.js" path="legacy" />
  <file name="legacy\BasicDialog.js" path="legacy" />
  <file name="legacy\GridView2.js" path="legacy" />
  <file name="legacy\JsonView.js" path="legacy" />
  <file name="legacy\MasterTemplate.js" path="legacy" />
  <file name="legacy\View.js" path="legacy" />
  <file name="widgets\chart\FlashPanel.js" path="widgets\chart" />
  <file name="widgets\ListView.js" path="widgets" />
  <file name="ext.jsb" path="" />
  <file name="license.txt" path="" />
  <file name="data\Api.js" path="data" />
  <file name="data\Direct.js" path="data" />
  <file name="data\DirectProvider.js" path="data" />
  <file name="data\SimpleStore.js" path="data" />
  <file name="adapter\core\ext-base-begin.js" path="adapter\core" />
  <file name="adapter\core\ext-base-dom.js" path="adapter\core" />
  <file name="adapter\ext-base-dom-more.js" path="adapter" />
  <file name="adapter\core\ext-base-event.js" path="adapter\core" />
  <file name="adapter\core\ext-base-ajax.js" path="adapter\core" />
  <file name="adapter\core\ext-base-region.js" path="adapter\core" />
  <file name="adapter\core\ext-base-point.js" path="adapter\core" />
  <file name="adapter\core\ext-base-anim.js" path="adapter\core" />
  <file name="adapter\core\ext-base-anim-extra.js" path="adapter\core" />
  <file name="adapter\core\ext-base-end.js" path="adapter\core" />
  <file name="adapter\jquery-bridge.js" path="adapter" />
  <file name="adapter\prototype-bridge.js" path="adapter" />
  <file name="adapter\yui-bridge.js" path="adapter" />
  <file name="core\core\CompositeElementLite.js" path="core\core" />
  <file name="core\CompositeElementLite-more.js" path="core\" />
  <file name="core\CompositeElement.js" path="core\" />
  <file name="core\core\DomHelper.js" path="core\core" />
  <file name="core\DomHelper-more.js" path="core" />
  <file name="core\core\DomQuery.js" path="core" />
  <file name="core\core\Element.js" path="core\core" />
  <file name="core\Element-more.js" path="core" />
  <file name="core\Element.alignment.js" path="core" />
  <file name="core\core\Element.traversal.js" path="core\core" />
  <file name="core\core\Element.insertion.js" path="core\core" />
  <file name="core\Element.insertion-more.js" path="core" />
  <file name="core\core\Element.style.js" path="core\core" />
  <file name="core\Element.style-more.js" path="core" />
  <file name="core\core\Element.position.js" path="core\core" />
  <file name="core\Element.position-more.js" path="core" />
  <file name="core\core\Element.scroll.js" path="core\core" />
  <file name="core\Element.scroll-more.js" path="core" />
  <file name="core\core\Element.fx.js" path="core\core" />
  <file name="core\Element.fx-more.js" path="core" />
  <file name="core\Element.dd.js" path="core" />
  <file name="core\Element.legacy.js" path="core" />
  <file name="core\Element.keys.js" path="core" />
  <file name="core\core\EventManager.js" path="core\core" />
  <file name="core\EventManager-more.js" path="core" />
  <file name="core\core\Ext.js" path="core\core" />
  <file name="core\Ext-more.js" path="core" />
  <file name="core\core\Fx.js" path="core" />
  <file name="core\core\Template.js" path="core\core" />
  <file name="core\Template-more.js" path="core" />
  <file name="core\Error.js" path="core" />
  <file name="data\ArrayReader.js" path="data" />
  <file name="data\ArrayStore.js" path="data" />
  <file name="data\core\Connection.js" path="data\core" />
  <file name="data\Connection-more.js" path="data" />
  <file name="data\DataField.js" path="data" />
  <file name="data\DataProxy.js" path="data" />
  <file name="data\DataReader.js" path="data" />
  <file name="data\DataWriter.js" path="data" />
  <file name="data\JsonWriter.js" path="data" />
  <file name="data\DirectProxy.js" path="data" />
  <file name="data\DirectStore.js" path="data" />
  <file name="data\GroupingStore.js" path="data" />
  <file name="data\HttpProxy.js" path="data" />
  <file name="data\JsonReader.js" path="data" />
  <file name="data\JsonStore.js" path="data" />
  <file name="data\MemoryProxy.js" path="data" />
  <file name="data\Record.js" path="data" />
  <file name="data\ScriptTagProxy.js" path="data" />
  <file name="data\SortTypes.js" path="data" />
  <file name="data\Store.js" path="data" />
  <file name="data\StoreMgr.js" path="data" />
  <file name="data\Tree.js" path="data" />
  <file name="data\XmlReader.js" path="data" />
  <file name="data\XmlStore.js" path="data" />
  <file name="dd\DDCore.js" path="dd" />
  <file name="dd\DragSource.js" path="dd" />
  <file name="dd\DragTracker.js" path="dd" />
  <file name="dd\DragZone.js" path="dd" />
  <file name="dd\DropTarget.js" path="dd" />
  <file name="dd\DropZone.js" path="dd" />
  <file name="dd\Registry.js" path="dd" />
  <file name="dd\ScrollManager.js" path="dd" />
  <file name="dd\StatusProxy.js" path="dd" />
  <file name="direct\Direct.js" path="direct" />
  <file name="direct\Event.js" path="direct" />
  <file name="direct\JsonProvider.js" path="direct" />
  <file name="direct\PollingProvider.js" path="direct" />
  <file name="direct\Provider.js" path="direct" />
  <file name="direct\RemotingProvider.js" path="direct" />
  <file name="direct\Transaction.js" path="direct" />
  <file name="locale\ext-lang-af.js" path="locale" />
  <file name="locale\ext-lang-bg.js" path="locale" />
  <file name="locale\ext-lang-ca.js" path="locale" />
  <file name="locale\ext-lang-cs.js" path="locale" />
  <file name="locale\ext-lang-da.js" path="locale" />
  <file name="locale\ext-lang-de.js" path="locale" />
  <file name="locale\ext-lang-el_GR.js" path="locale" />
  <file name="locale\ext-lang-en.js" path="locale" />
  <file name="locale\ext-lang-en_GB.js" path="locale" />
  <file name="locale\ext-lang-es.js" path="locale" />
  <file name="locale\ext-lang-fa.js" path="locale" />
  <file name="locale\ext-lang-fi.js" path="locale" />
  <file name="locale\ext-lang-fr.js" path="locale" />
  <file name="locale\ext-lang-fr_CA.js" path="locale" />
  <file name="locale\ext-lang-gr.js" path="locale" />
  <file name="locale\ext-lang-he.js" path="locale" />
  <file name="locale\ext-lang-hr.js" path="locale" />
  <file name="locale\ext-lang-hu.js" path="locale" />
  <file name="locale\ext-lang-id.js" path="locale" />
  <file name="locale\ext-lang-it.js" path="locale" />
  <file name="locale\ext-lang-ja.js" path="locale" />
  <file name="locale\ext-lang-ko.js" path="locale" />
  <file name="locale\ext-lang-lt.js" path="locale" />
  <file name="locale\ext-lang-lv.js" path="locale" />
  <file name="locale\ext-lang-mk.js" path="locale" />
  <file name="locale\ext-lang-nl.js" path="locale" />
  <file name="locale\ext-lang-no_NB.js" path="locale" />
  <file name="locale\ext-lang-no_NN.js" path="locale" />
  <file name="locale\ext-lang-pl.js" path="locale" />
  <file name="locale\ext-lang-pt.js" path="locale" />
  <file name="locale\ext-lang-pt_BR.js" path="locale" />
  <file name="locale\ext-lang-pt_PT.js" path="locale" />
  <file name="locale\ext-lang-ro.js" path="locale" />
  <file name="locale\ext-lang-ru.js" path="locale" />
  <file name="locale\ext-lang-sk.js" path="locale" />
  <file name="locale\ext-lang-sl.js" path="locale" />
  <file name="locale\ext-lang-sr.js" path="locale" />
  <file name="locale\ext-lang-sr_RS.js" path="locale" />
  <file name="locale\ext-lang-sv_SE.js" path="locale" />
  <file name="locale\ext-lang-th.js" path="locale" />
  <file name="locale\ext-lang-tr.js" path="locale" />
  <file name="locale\ext-lang-ukr.js" path="locale" />
  <file name="locale\ext-lang-vn.js" path="locale" />
  <file name="locale\ext-lang-zh_CN.js" path="locale" />
  <file name="locale\ext-lang-zh_TW.js" path="locale" />
  <file name="state\CookieProvider.js" path="state" />
  <file name="state\Provider.js" path="state" />
  <file name="state\StateManager.js" path="state" />
  <file name="util\ClickRepeater.js" path="util" />
  <file name="util\Cookies.js" path="util" />
  <file name="util\CSS.js" path="util" />
  <file name="util\Date.js" path="util" />
  <file name="util\core\DelayedTask.js" path="util\core" />
  <file name="util\Format.js" path="util" />
  <file name="util\History.js" path="util" />
  <file name="util\core\JSON.js" path="util" />
  <file name="util\KeyMap.js" path="util" />
  <file name="util\KeyNav.js" path="util" />
  <file name="util\MixedCollection.js" path="util" />
  <file name="util\core\Observable.js" path="util\core" />
  <file name="util\Observable-more.js" path="util" />
  <file name="util\core\TaskMgr.js" path="util\core" />
  <file name="util\TaskMgr-more.js" path="util" />
  <file name="util\TextMetrics.js" path="util" />
  <file name="util\XTemplate.js" path="util" />
  <file name="util\UpdateManager.js" path="util" />
  <file name="widgets\chart\Chart.js" path="widgets\chart" />
  <file name="widgets\chart\EventProxy.js" path="widgets\chart" />
  <file name="widgets\chart\FlashComponent.js" path="widgets\chart" />
  <file name="widgets\chart\swfobject.js" path="widgets\chart" />
  <file name="widgets\form\Action.js" path="widgets\form" />
  <file name="widgets\form\BasicForm.js" path="widgets\form" />
  <file name="widgets\form\Checkbox.js" path="widgets\form" />
  <file name="widgets\form\CheckboxGroup.js" path="widgets\form" />
  <file name="widgets\form\Combo.js" path="widgets\form" />
  <file name="widgets\form\DateField.js" path="widgets\form" />
  <file name="widgets\form\DisplayField.js" path="widgets\form" />
  <file name="widgets\form\Field.js" path="widgets\form" />
  <file name="widgets\form\FieldSet.js" path="widgets\form" />
  <file name="widgets\form\Form.js" path="widgets\form" />
  <file name="widgets\form\Hidden.js" path="widgets\form" />
  <file name="widgets\form\HtmlEditor.js" path="widgets\form" />
  <file name="widgets\form\Label.js" path="widgets\form" />
  <file name="widgets\form\NumberField.js" path="widgets\form" />
  <file name="widgets\form\Radio.js" path="widgets\form" />
  <file name="widgets\form\RadioGroup.js" path="widgets\form" />
  <file name="widgets\form\TextArea.js" path="widgets\form" />
  <file name="widgets\form\TextField.js" path="widgets\form" />
  <file name="widgets\form\TimeField.js" path="widgets\form" />
  <file name="widgets\form\TriggerField.js" path="widgets\form" />
  <file name="widgets\form\VTypes.js" path="widgets\form" />
  <file name="widgets\grid\AbstractSelectionModel.js" path="widgets\grid" />
  <file name="widgets\grid\CellSelectionModel.js" path="widgets\grid" />
  <file name="widgets\grid\CheckboxSelectionModel.js" path="widgets\grid" />
  <file name="widgets\grid\Column.js" path="widgets\grid" />
  <file name="widgets\grid\ColumnDD.js" path="widgets\grid" />
  <file name="widgets\grid\ColumnModel.js" path="widgets\grid" />
  <file name="widgets\grid\ColumnSplitDD.js" path="widgets\grid" />
  <file name="widgets\grid\EditorGrid.js" path="widgets\grid" />
  <file name="widgets\grid\GridDD.js" path="widgets\grid" />
  <file name="widgets\grid\GridEditor.js" path="widgets\grid" />
  <file name="widgets\grid\GridPanel.js" path="widgets\grid" />
  <file name="widgets\grid\GridView.js" path="widgets\grid" />
  <file name="widgets\grid\GroupingView.js" path="widgets\grid" />
  <file name="widgets\grid\PropertyGrid.js" path="widgets\grid" />
  <file name="widgets\grid\RowNumberer.js" path="widgets\grid" />
  <file name="widgets\grid\RowSelectionModel.js" path="widgets\grid" />
  <file name="widgets\layout\AbsoluteLayout.js" path="widgets\layout" />
  <file name="widgets\layout\AccordionLayout.js" path="widgets\layout" />
  <file name="widgets\layout\AnchorLayout.js" path="widgets\layout" />
  <file name="widgets\layout\BorderLayout.js" path="widgets\layout" />
  <file name="widgets\layout\BoxLayout.js" path="widgets\layout" />
  <file name="widgets\layout\CardLayout.js" path="widgets\layout" />
  <file name="widgets\layout\ColumnLayout.js" path="widgets\layout" />
  <file name="widgets\layout\ContainerLayout.js" path="widgets\layout" />
  <file name="widgets\layout\FitLayout.js" path="widgets\layout" />
  <file name="widgets\layout\FormLayout.js" path="widgets\layout" />
  <file name="widgets\layout\TableLayout.js" path="widgets\layout" />
  <file name="widgets\list\ColumnResizer.js" path="widgets\list" />
  <file name="widgets\list\ListView.js" path="widgets\list" />
  <file name="widgets\list\Sorter.js" path="widgets\list" />
  <file name="widgets\menu\BaseItem.js" path="widgets\menu" />
  <file name="widgets\menu\CheckItem.js" path="widgets\menu" />
  <file name="widgets\menu\ColorMenu.js" path="widgets\menu" />
  <file name="widgets\menu\DateMenu.js" path="widgets\menu" />
  <file name="widgets\menu\Item.js" path="widgets\menu" />
  <file name="widgets\menu\Menu.js" path="widgets\menu" />
  <file name="widgets\menu\MenuMgr.js" path="widgets\menu" />
  <file name="widgets\menu\Separator.js" path="widgets\menu" />
  <file name="widgets\menu\TextItem.js" path="widgets\menu" />
  <file name="widgets\tips\QuickTip.js" path="widgets\tips" />
  <file name="widgets\tips\QuickTips.js" path="widgets\tips" />
  <file name="widgets\tips\Tip.js" path="widgets\tips" />
  <file name="widgets\tips\ToolTip.js" path="widgets\tips" />
  <file name="widgets\tree\AsyncTreeNode.js" path="widgets\tree" />
  <file name="widgets\tree\TreeDragZone.js" path="widgets\tree" />
  <file name="widgets\tree\TreeDropZone.js" path="widgets\tree" />
  <file name="widgets\tree\TreeEditor.js" path="widgets\tree" />
  <file name="widgets\tree\TreeEventModel.js" path="widgets\tree" />
  <file name="widgets\tree\TreeFilter.js" path="widgets\tree" />
  <file name="widgets\tree\TreeLoader.js" path="widgets\tree" />
  <file name="widgets\tree\TreeNode.js" path="widgets\tree" />
  <file name="widgets\tree\TreeNodeUI.js" path="widgets\tree" />
  <file name="widgets\tree\TreePanel.js" path="widgets\tree" />
  <file name="widgets\tree\TreeSelectionModel.js" path="widgets\tree" />
  <file name="widgets\tree\TreeSorter.js" path="widgets\tree" />
  <file name="widgets\Action.js" path="widgets" />
  <file name="widgets\BoxComponent.js" path="widgets" />
  <file name="widgets\Button.js" path="widgets" />
  <file name="widgets\ColorPalette.js" path="widgets" />
  <file name="widgets\Component.js" path="widgets" />
  <file name="widgets\ComponentMgr.js" path="widgets" />
  <file name="widgets\Container.js" path="widgets" />
  <file name="widgets\CycleButton.js" path="widgets" />
  <file name="widgets\DataView.js" path="widgets" />
  <file name="widgets\DatePicker.js" path="widgets" />
  <file name="widgets\Editor.js" path="widgets" />
  <file name="widgets\Layer.js" path="widgets" />
  <file name="widgets\LoadMask.js" path="widgets" />
  <file name="widgets\MessageBox.js" path="widgets" />
  <file name="widgets\PagingToolbar.js" path="widgets" />
  <file name="widgets\Panel.js" path="widgets" />
  <file name="widgets\PanelDD.js" path="widgets" />
  <file name="widgets\ProgressBar.js" path="widgets" />
  <file name="widgets\Resizable.js" path="widgets" />
  <file name="widgets\Shadow.js" path="widgets" />
  <file name="widgets\Slider.js" path="widgets" />
  <file name="widgets\SplitBar.js" path="widgets" />
  <file name="widgets\SplitButton.js" path="widgets" />
  <file name="widgets\TabPanel.js" path="widgets" />
  <file name="widgets\Toolbar.js" path="widgets" />
  <file name="widgets\Viewport.js" path="widgets" />
  <file name="widgets\Window.js" path="widgets" />
  <file name="widgets\WindowManager.js" path="widgets" />
  <file name="debug.js" path="" />
  <directory name="" />
  <file name="Controls\EntityLink.js" path="Controls" />
  <file name="Controls\EntityLinkSearch.js" path="Controls" />
  <file name="Controls\EntityLinkWindow.js" path="Controls" />
  <file name="Controls\EnumComboBox.js" path="Controls" />
  <file name="Core\Application.js" path="Core" />
  <file name="Core\Configuration.js" path="Core" />
  <file name="Core\Entity.js" path="Core" />
  <file name="Core\Metadata.js" path="Core" />
  <file name="Core\Module.js" path="Core" />
  <file name="Core\ModuleManager.js" path="Core" />
  <file name="Core\Principal.js" path="Core" />
  <file name="Core\SessionManager.js" path="Core" />
  <file name="Core\View.js" path="Core" />
  <file name="Core\Window.js" path="Core" />
  <file name="Core\WindowManager.js" path="Core" />
  <file name="Data\EnumStore.js" path="Data" />
  <file name="Data\GroupingStore.js" path="Data" />
  <file name="Data\HttpProxy.js" path="Data" />
  <file name="Data\JsonReader.js" path="Data" />
  <file name="Data\JsonStore.js" path="Data" />
  <file name="Editor\EditorBase.js" path="Editor" />
  <file name="Editor\Form.js" path="Editor" />
  <file name="Editor\Menu.js" path="Editor" />
  <file name="Editor\TwoColumnForm.js" path="Editor" />
  <file name="ext\grid\EntityColumn.js" path="ext\grid" />
  <file name="ext\grid\EnumColumn.js" path="ext\grid" />
  <file name="ext\grid\ProgressPagingToolbar.js" path="ext\grid" />
  <file name="ext\Ext.ux.SearchField.js" path="ext" />
  <file name="ext\Ext.ux.ThemeChanger.js" path="ext" />
  <file name="Factory\ColumnFactory.js" path="Factory" />
  <file name="Factory\FactoryCache.js" path="Factory" />
  <file name="Forms\About.js" path="Forms" />
  <file name="Forms\LogIn.js" path="Forms" />
  <file name="Gears\FileSystemStore.js" path="Gears" />
  <file name="List\AggregateList.js" path="List" />
  <file name="List\EntityList.js" path="List" />
  <file name="List\AggregateDataDropList.js" path="List" />
  <file name="List\RowEditorPlugin.js" path="List" />
  <file name="List\InPlaceEditableAggregateList.js" path="List" />
  <file name="List\InPlaceEditableEntityList.js" path="List" />
  <file name="List\ListBase.js" path="List" />
  <file name="List\SearchList.js" path="List" />
  <file name="Menu\ViewsMenu.js" path="Menu" />
  <file name="Menu\WindowsMenu.js" path="Menu" />
  <file name="Parts\ApplicationWindow.js" path="Parts" />
  <file name="Parts\StatusBar.js" path="Parts" />
  <file name="Parts\WorkPanel.js" path="Parts" />
  <file name="Parts\WorkPanelItem.js" path="Parts" />
  <file name="Util\AjaxHelper.js" path="Util" />
  <file name="Util\ListenerUtils.js" path="Util" />
  <file name="Views\ModulesView.js" path="Views" />
  <file name="Views\WindowsView.js" path="Views" />
  <file name="Menu\ToolsMenu.js" path="Menu" />
  <file name="Tools\Importer\MainForm.js" path="Tools\Importer" />
  <file name="Tools\Shipping\MainForm.js" path="Tools\Shipper" />
  <file name="ext\Ext.ux.StatusBar.js" path="ext" />
  <file name="karma.js" path="" />
  <file name="Tools\Importer\SummaryForm.js" path="Tools\Importer" />
  <file name="Editor\Window.js" path="Editor" />
  <file name="Editor\cardbased\EditorBase.js" path="Editor\cardbased" />
  <file name="Editor\cardbased\FormBase.js" path="Editor\cardbased" />
  <file name="Editor\Actions\AcionBase.js" path="Editor\Actions" />
  <file name="Editor\Actions\Load.js" path="Editor\Actions" />
  <file name="Editor\Actions\Submit.js" path="Editor\Actions" />
  <file name="Editor\Actions\Action.Submit.js" path="Editor\Actions" />
  <file name="Editor\Actions\Action.Load.js" path="Editor\Actions" />
  <file name="Editor\Actions\Action.Custom.js" path="Editor\Actions" />
  <file name="Editor\Actions\Action.NewFromEntity.js" path="Editor\Actions" />
  <file name="Editor\Actions\Action.New.js" path="Editor\Actions" />
  <file name="Views\ReportsView.js" path="Views" />
  <file name="Views\FavoritesView.js" path="Views" />
  <file name="Views\SystemView.js" path="Views" />
  <file name="Editor\tabbased\EditorBase.js" path="Editor\tabbased" />
  <file name="Editor\FormBase.js" path="Editor" />
  <file name="Editor\simple\EditorBase.js" path="Editor\simple" />
  <file name="Menu\ModulesMenu.js" path="Menu" />
  <file name="Editor\TwoColumnFormBase.js" path="Editor" />
  <file name="Views\ViewMenuBase.js" path="Views" />
  <file name="Editor\Actions\Action.Save.js" path="Editor\Actions" />
  <file name="Editor\Actions\Action.Update.js" path="Editor\Actions" />
  <file name="Editor\BasicForm.js" path="Editor" />
  <file name="Controls\EntityLinkCombo.js" path="Controls" />
  <file name="Security\Ext.form.Field.js" path="Security" />
  <file name="Editor\layouts\Card.js" path="Editor\layouts" />
  <file name="Editor\layouts\Simple.js" path="Editor\layouts" />
  <file name="Editor\layouts\Tab.js" path="Editor\layouts" />
  <file name="Editor\IFormBase.js" path="Editor" />
  <file name="Editor\TFormBase.js" path="Editor" />
  <file name="Modules\System\QueryEditor\Editor.js" path="Modules\System\QueryEditor" />
  <file name="Modules\System\QueryEditor\Entity.js" path="Modules\System\QueryEditor" />
  <file name="Modules\System\Module.js" path="Modules\System" />
  <file name="Modules\System\Metadata\Designer\Designer.js" path="Modules\System\Metadata\Designer" />
  <file name="Modules\System\Metadata\EditorBuilder\EditorBuilder.js" path="Modules\System\Metadata\EditorBuilder" />
  <file name="Modules\System\Metadata\Entity\EntityBrowser.js" path="Modules\System\Metadata\Entity" />
  <file name="Modules\System\Metadata\Entity\EntityPropertyGrid.js" path="Modules\System\Metadata\Entity" />
  <file name="Modules\System\Metadata\SearchListBuilder\SearchListBuilder.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\System\Metadata\Entity.js" path="Modules\System\Metadata" />
  <file name="Modules\System\Metadata\Entity\EntityDetails.js" path="Modules\System\Metadata\Entity" />
  <file name="Modules\System\Metadata\Designer.js" path="Modules\System\Metadata" />
  <file name="Menu\HelpMenu.js" path="Menu" />
  <file name="Modules\System\Metadata\SearchListBuilder\MockSearchList.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\System\Metadata\SearchListBuilder\GridPanel.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\System\Metadata\SearchListBuilder\QueryList.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\System\Metadata\SearchListBuilder\GridView.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\System\Metadata\SearchListBuilder\SearchList.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\System\Metadata\SearchListBuilder\QueryDetails.js" path="Modules\System\Metadata\SearchListBuilder" />
  <file name="Modules\Reports\Module.js" path="Modules\Reports" />
  <file name="Modules\Reports\Editor.js" path="Modules\Reports" />
  <file name="Modules\Reports\Entity.js" path="Modules\Reports" />
  <file name="Modules\Reports\CriteriaControl.js" path="Modules\Reports" />
  <file name="Modules\Reports\AndOrGroupingControl.js" path="Modules\Reports" />
  <file name="Data\ArrayReader.js" path="Data" />
  <file name="Modules\Reports\CriteriaWrapper.js" path="Modules\Reports" />
  <file name="Modules\Reports\GraphReport.js" path="Modules\Reports" />
  <file name="Modules\Reports\ListReport.js" path="Modules\Reports" />
  <file name="Modules\Reports\ReportViewer.js" path="Modules\Reports" />
  <file name="Editor\Panel.js" path="Editor" />
</project>
Ext.Loader.setPath('Ext.plugin', '.');
Ext.application({
	requires:[
		'Ext.plugin.DropdownMenu'
	],
	launch:function(){
		Ext.define('Country',{
			extend:'Ext.data.Model',
			config:{
				fields:[
					{name:'cn',type:'string'},
					{name:'name',type:'string'},
					{name:'selected',type:'boolean',defaultValue:false}
				]
			},
		});
		Ext.define('Province',{
			extend:'Ext.data.Model',
			config:{
				fields:[
					{name:'country_cn',type:'string'},
					{name:'name',type:'string'}
				]
			},
		});
		Ext.create('Ext.data.Store',{
			model:'Country',
			storeId:'Country',
			data:[
				{cn:'us', name:'United States'},
				{cn:'ca', name:'Canada'},
				{cn:'mex', name:'Mexico'}
			]
		});
		Ext.create('Ext.data.Store',{
			model:'Province',
			storeId:'Province',
			sorters:[{
				property:'name'
			}],
			data:[
				//Canadian Provinces
				{country_cn:'ca', name:'Alberta'},
				{country_cn:'ca', name:'British Columbia'},
				{country_cn:'ca', name:'Manitoba'},
				{country_cn:'ca', name:'New Brunswick'},
				{country_cn:'ca', name:'Nova Scotia'},
				{country_cn:'ca', name:'Ontario'},
				{country_cn:'ca', name:'Prince Edward Island'},
				{country_cn:'ca', name:'Quebec'},
				{country_cn:'ca', name:'Saskatchewan'},
				{country_cn:'ca', name:'Yukon Territory'},
				
				//US States (Provinces)
				{country_cn:'us', name:'Alaska'},
				{country_cn:'us', name:'Alabama'},
				{country_cn:'us', name:'Arkansas'},
				{country_cn:'us', name:'Arizona'},
				{country_cn:'us', name:'California'},
				{country_cn:'us', name:'Colorado'},
				{country_cn:'us', name:'Connecticut'},
				{country_cn:'us', name:'Delaware'},
				{country_cn:'us', name:'Florida'},
				{country_cn:'us', name:'Georgia'},
				{country_cn:'us', name:'Hawaii'},
				{country_cn:'us', name:'Iowa'},
				{country_cn:'us', name:'Idaho'},
				{country_cn:'us', name:'Illinois'},
				{country_cn:'us', name:'Indiana'},
				{country_cn:'us', name:'Kansas'},
				{country_cn:'us', name:'Kentucky'},
				{country_cn:'us', name:'Louisiana'},
				{country_cn:'us', name:'Massachusetts'},
				{country_cn:'us', name:'Maryland'},
				{country_cn:'us', name:'Maine'},
				{country_cn:'us', name:'Michigan'},
				{country_cn:'us', name:'Minnesota'},
				{country_cn:'us', name:'Missouri'},
				{country_cn:'us', name:'Mississippi'},
				{country_cn:'us', name:'Montana'},
				{country_cn:'us', name:'North Carolina'},
				{country_cn:'us', name:'North Dakota'},
				{country_cn:'us', name:'Nebraska'},
				{country_cn:'us', name:'New Hampshire'},
				{country_cn:'us', name:'New Jersey'},
				{country_cn:'us', name:'New Mexico'},
				{country_cn:'us', name:'Nevada'},
				{country_cn:'us', name:'New York'},
				{country_cn:'us', name:'Ohio'},
				{country_cn:'us', name:'Oklahoma'},
				{country_cn:'us', name:'Oregon'},
				{country_cn:'us', name:'Pennsylvania'},
				{country_cn:'us', name:'Rhode Island'},
				{country_cn:'us', name:'South Carolina'},
				{country_cn:'us', name:'South Dakota'},
				{country_cn:'us', name:'Tennessee'},
				{country_cn:'us', name:'Texas'},
				{country_cn:'us', name:'Utah'},
				{country_cn:'us', name:'Virginia'},
				{country_cn:'us', name:'Vermont'},
				{country_cn:'us', name:'Washington'},
				{country_cn:'us', name:'Wisconsin'},
				{country_cn:'us', name:'West Virginia'},
				{country_cn:'us', name:'Wyoming'}
			]
		});
		Ext.Viewport.add({
			xtype:'list',
			scrollable:true,
			itemTpl:'{name}, {[values.country_cn.toUpperCase()]}',
			disableSelection:true,
			store:'Province',
			emptyText:'No Provinces found for the selected Country',
			plugins:[{
				xclass:'Ext.plugin.DropdownMenu',
				toolbarRetriever:function(){
					return this.getMenuContainer().down('titlebar');
				},
				menu:{
					xtype:'list',
					store:'Country',
					itemTpl:'{name}',
					listeners:{
						select:function(list,record){
							var menuContainer = list.up('panel[cls=menuwrapper]').menuContainer;
							menuContainer.getStore().clearFilter();
							menuContainer.getStore().filter('country_cn',record.get('cn'))
						}
					}
				},
				menuButton:{
					iconCls:'arrow_down'
				}
			}],
			items:[
				{
					xtype:'titlebar',
					docked:'top',
					title:'DropdownMenu'
				}
			]
		});
	}
});
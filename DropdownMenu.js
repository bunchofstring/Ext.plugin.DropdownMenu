/*
Plugin: Ext.plugin.DropdownMenu
Version: 1.0 Beta
Tested: Sencha Touch 2.0.1.1
Author: Bunchofstring (Dave Mitchell)

Requirements:
1. None

Related Notes:
1. None

Example:
Ext.define('Country',{
	extend:'Ext.data.Model',
	config:{
		fields:[
			{name:'name',type:'string'},
			{name:'selected',type:'boolean',defaultValue:false}
		],
		identifier:{
			type:'uuid'
		},
		proxy:{
			id:'Country',
			type:'localstorage'
		}
	},
});
Ext.create('Ext.data.Store',{
	model:'Country',
	storeId:'Country',
	proxy:{
		id:'Country',
		type:'localstorage'
	},
	autoLoad:{
		callback:function(records){
			if(Ext.isEmpty(records)){
				this.setData([
					{name:'United States'},
					{name:'Canada'},
					{name:'Mexico'}
				]);
			}
		}
	},
	autoSync:true
});
Ext.Viewport.add({
	xtype:'list',
	scrollable:true,
	itemTpl:'{name}',
	store:'Country',
	plugins:[
		{
			xclass: 'Ext.plugin.RememberSelection',
			getDefaultSelectionRecords:function(list){
				var store = list.getStore();
				return [store.findRecord('name','United States')];
			}
		}
	]
});
*/
Ext.define('Ext.plugin.DropdownMenu',{
    extend:'Ext.Component',
    alias:'plugin.dropdownmenu',

    config:{
        //This function can be overridden. It should retrieve the toolbar to which the menu button will be added
        toolbarRetriever:function(){
        	var navigationView = Ext.ComponentQuery.query('navigationview:visible')[0];
        	var navigationBar = (navigationView) ? navigationView.getNavigationBar() : undefined;
        	var toolbar = Ext.ComponentQuery.query('toolbar:visible')[0];
        	var titlebar = Ext.ComponentQuery.query('titlebar:visible')[0];
        	return navigationBar || toolbar || titlebar;
        },
        
        menuWrapper:{
			xtype:'panel',
			layout:'fit',
			cls:'menuwrapper',
			width:200,
			height:200,
			modal:true,
			hideOnMaskTap:true,
			top:0,
			left:0
		},
		
		menuButton:{
			xtype:'button',
			iconCls:'menu',
			iconMask:true,
			align:'right'
		},
		
		menu:null,
		
		verticalShrinkWrap:true,
		
        //Private
        menuContainer:null,
    },
    
    statics:{
    	shrinkMenuWrapperToFit:function(menuWrapper){
			var contents = menuWrapper.getItems().first();
			var itemHeight = contents.element.down('.x-list-item').getHeight();
			var itemCount = contents.getStore().getCount();
			var calculatedHeight = itemHeight*itemCount+12;
			var containerHeight = menuWrapper.menuContainer.element.getHeight()-20;
			menuWrapper.setHeight((calculatedHeight < containerHeight) ? calculatedHeight : containerHeight);
		},
		clearDropdownMenu:function(menuContainer){
			if(menuContainer.menuButton){
				//If the menuWrapper contains a store-bound list, destroy the store
				var list = menuContainer.menuButton.menuWrapper.down('list');
				if(list){list.getStore().destroy();delete list.getStore();}
				
				//Sencha's destroy function expects container's items property to have a getAt function. Possible bug
				menuContainer.menuButton.menuWrapper.items = menuContainer.menuButton.menuWrapper.getItems();
				menuContainer.menuButton.menuWrapper.destroy();
				menuContainer.menuButton.hide();
				menuContainer.menuButton.destroy();
			}
		}
    },
	
	constructor:function(config){
    	Ext.applyIf(config,{
    		menu:{
				xtype:'list',
				itemTpl:'{label}',
				title:'foo',
				data:[
					{label:'No'},
					{label:'Menu'},
					{label:'Configured'},
				]
			}
    	});
    	this.callParent(arguments);
    },
	
	//Establishes the event handlers
    init:function(menuContainer){
        this.setMenuContainer(menuContainer);
        
        //Add the dropdown-related items at the appropriate time
        menuContainer.on({
        	//scope:this,
        	activate:Ext.Function.createDelayed(this.initDropdownMenu,1,this,[menuContainer])
        });
        
        //Delete the dropdown-related items at the appropriate time
		menuContainer.onBefore({
            erased:Ext.Function.createDelayed(this.self.clearDropdownMenu,1,this),
            destroy:Ext.Function.createDelayed(this.self.clearDropdownMenu,1,this),
            deactivate:Ext.Function.createDelayed(this.self.clearDropdownMenu,1,this)
        });
    },
    
    initDropdownMenu:function(menuContainer){
		
		//Activate fires before painted in some cases (i.e. initial activation)
		if(!menuContainer.isPainted() || menuContainer.up().getActiveItem() != menuContainer){return;}
		
		var menuButton = (this.getMenuButton().isDestroyed) ? this.getMenuButton().initialConfig : this.getMenuButton();
		var menuWrapper = (this.getMenuWrapper().isDestroyed) ? this.getMenuWrapper().initialConfig : this.getMenuWrapper();
		var menu = (this.getMenu().isDestroyed) ? this.getMenu().initialConfig : this.getMenu();
		
		//Add the MenuButton to the Toolbar
		menuButton = this.getToolbarRetriever().call(this).add(menuButton);
		menuWrapper = Ext.factory(Ext.apply(menuWrapper,{items:[menu]}));
		menu = menuWrapper.getItems().first();
		
		//Give some inter-Component awareness
		menuContainer.menuButton = menuButton;
		menuWrapper.menuContainer = menuContainer;
		menuButton.menuWrapper = menuWrapper;
		menu.menuButton = menuButton;
		menu.menuContainer = menuContainer;

		//Fake the painted event so RememberSelection handlers can do their thing
		var list = menuWrapper.down('list');
		if(list){list.fireEvent('painted')}

		//Replace the config objects with the components themselves
		this.setMenuButton(menuButton);
		this.setMenuWrapper(menuWrapper);
		this.setMenu(menu);

		menuButton.on('tap',function(menuButton){
			menuButton.menuWrapper.items = menuButton.menuWrapper.getItems();
			menuButton.menuWrapper.showBy(menuButton,'tr-br?');
		},this);

		menuWrapper.on({
			show:{
				scope:this,
				fn:function(menuWrapper){
					if(this.getVerticalShrinkWrap()){
						this.self.shrinkMenuWrapperToFit(menuWrapper);
					}
				}
			},
			tap:{
				scope:this,
				element:'element',
				fn:function(){
					//Hides the MenuWrapper when it or any item inside it is tapped
					menuWrapper.hide();
				}
			}
		});
    }
});

// Initialize your app
var myApp = new Framework7({
    material: true,
    swipePanel: true,
    init: false
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
});

//file

function onDeviceReady(){
	bluetoothInitialize();
}

function onMainPageInit(){
	// Create and show shopping list.
	createShoppingList(myApp);

	// Hook up event handlers
	$$("#new-item-name").keyup(suggest);
	$$("#add").click(function() {
		// Add new item to list.		
		var newItemInput = $$("#new-item-name");
 		addShoppingItem(newItemInput.val(), null);
		// Clear input and switch tabs.
		newItemInput.val('');
		myApp.showTab('#purchase-list-page');
	});
	$$("#scan").click(refreshBeacons);
}

document.addEventListener('deviceready', onDeviceReady, true);

myApp.onPageInit('main-page', onMainPageInit);
myApp.init();

function refreshBeacons() {
	getInventoryForBeacon("20CB0314-A24F-0815-AFF9-A98FEAA6F01B", 53341, 11111, function(storeInfo, storeInventory) {
		compareInventory(shoppingList.items, storeInfo, storeInventory, function(listItem, storeItem) {
			// Purchase item.
			purchaseItem(storeItem);
			// Remove item from shopping list.
			removeShoppingItem(listItem.text);
		})
	} );
}


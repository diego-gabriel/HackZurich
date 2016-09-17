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

function createListItem(item_media, item_title, item_after){
	var newListItem = $$('<li class="item-content">'+
							    '<div class="item-media">'+
							        item_media+
							    '</div>'+
							    '<div class="item-inner">'+
							        '<div class="item-title">'+
							            item_title+
							        '</div>'+
							        '<div class="item-after">'+
							            item_after+
							        '</div>'+
							    '</div>'+
							'</li>');
	return newListItem;
}

function addResults(resultString){
	var result = JSON.parse(resultString);
	var results = $$("#results");
	var currentRow;

	results.text("");
	$$("#suggestions-title").show();
	for(var i = 0; i < result.length; i++){
		var image = result[i].images.thumbnails;
		var newListItem = createListItem('<img src="'+image+'">', result[i].name, result[i].price+"$");
		results.append(newListItem);
	}
}

function suggest(){
	var value = $$("#new-item-name").val().trim();
	if (value != ""){
		$$.get("https://api.siroop.ch/product/search/?query="+value+"&limit=9&apikey=8ccd66bb1265472cbf8bed4458af4b07", {}, function(msg){
			addResults(msg);
		});
	} else { 
		console.log("kjahskdjahsd");
		$$("#suggestions-title").hide();
		$$("#results").text("");
	}
}
//file

function emptyStorage(){
	return [{ name:"Salami", ean:null}, { name:"Mittlerer Arabica Kaffee", ean:9182736451928}]
}

function getList(){
	var list;
	if (localStorage.itemList)
		list = JSON.parse(localStorage.itemList);
	else {
		list = emptyStorage();
		localStorage.itemList = JSON.stringify(list);
	}
	return list;
}

function saveItem(name, ean, __callback){
	var list = getList();	
	var size = Object.keys(list).length;
	var newItem = {name: name, ean: ean};
	list[size] = newItem
	localStorage.setItem("itemList", JSON.stringify(list));
	__callback(newItem);
}

function attemptSaveItem(){
	saveItem($$("#new-item-name").val(), null, onDataSaved);
}

function appendOnPurchaseList(item){
	$$("#purchase-list").append(createListItem("", item.name, item.ean));
}

function onDataSaved(obj){
	appendOnPurchaseList(obj);
}

function onDeviceReady(){
	bluetoothInitialize();
}

function onMainPageInit(){
	var list = getList();

	for(var i = 0; i < Object.keys(list).length; i++){
		appendOnPurchaseList(list[i]);
	}
}

$$("#new-item-name").keyup(suggest);

$$("#add").click(attemptSaveItem);
document.addEventListener('deviceready', onDeviceReady, true);

myApp.onPageInit('main-page', onMainPageInit);

myApp.init();

// Preload the shopping list.
_shoppingList = [{ text:"Salami", ean:null}, { text:"Mittlerer Arabica Kaffee", ean:"9182736451928"}];

getInventoryForBeacon("20CB0314-A24F-0815-AFF9-A98FEAA6F01B", 53341, 11111, function(storeInfo, storeInventory) {
	compareInventory(_shoppingList, storeInfo, storeInventory, function(listItem, storeItem) {
		// Purchase item.
		purchaseItem(storeItem);
		// TODO: Remove itemfrom shopping list. 
	})
} );

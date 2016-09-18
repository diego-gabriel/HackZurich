var shoppingList;

// TODO: Loads shopping items from local storage.
function loadShoppingItems(){
	var list;
/*	if (window.localStorage.itemList)
		list = JSON.parse(window.localStorage.itemList);
	else {
		list = emptyStorage();
		window.localStorage.itemList = JSON.stringify(list);
	}*/

    list = [{ text:"Salami", ean:null}, { text:"Mittlerer Arabica Kaffee", ean:"9182736451928"}];
	return list;
}

// Creates an updateable shopping list.
function createShoppingList(myApp) {
    var items = loadShoppingItems();
    shoppingList = myApp.virtualList('.list-block.virtual-list', {
        // Array with plain HTML items
        items: items,
        // Template 7 template to render each item
        template: '<li class="item-content">' +
                    '<div class="item-inner">{{text}}</div>' +
                '</li>'
    });
    shoppingList.update();
}

// Adds given item to shopping list.
function addShoppingItem(text, ean) {
	var newItem = {text: text, ean: ean};
    shoppingList.appendItem(newItem);
}

// Removes given item from shopping list.
function removeShoppingItem(text) {
    for (var i = 0; i < shoppingList.items.length; i++) {
        if (shoppingList.items[i].text == text) {
            shoppingList.deleteItem(i);
            return;
        }
    }
}

// Suggestion list

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

function createListItem(item_media, item_title, item_after){
	var newListItem = $$('<li class="item-content suggestion-item">'+
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

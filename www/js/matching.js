var shownModal = false;

function onStoreInfoRetrieved(storeInfo, storeInventory){
    compareInventory(shoppingList.items, storeInfo, storeInventory, function(listItem, storeItem) {
        // Purchase item.
        purchaseItem(storeItem);
        // TODO: Remove itemfrom shopping list. 
    });
}

// Compares shopping list with store inventory and alerts on matches.
function compareInventory(shoppingList, storeInfo, storeInventory, purchaseCallback) {
    for (var i = 0; i < shoppingList.length; i++) {
        var listItem = shoppingList[i];
        for (var j = 0; j < storeInventory.length; j++) {
            var storeItem = storeInventory[j];
            if (isMatch(listItem, storeItem) && !shownModal) {
                // Define message.
                var title =  'I\'ve found ' + listItem.text;
                var message = '\'' + storeItem.product.description + '\' is available at ' + storeInfo.name + '<br/><br/> Price: CHF ' + storeItem.price;  

                var currentListItem = listItem;
                var currentStoreItem = storeItem;

                // Show purchase dialog.
                myApp.modal({
                    title:  title,
                    text: message,
                    open: function(){alert("opened");},
                    close: function(){alert("closed");},
                    buttons: [
                    {
                        text: 'Purchase',
                        onClick: function() {
                            // Initiate purchase for matched item.
                            purchaseCallback(currentListItem, currentStoreItem);
                        }
                    },
                    {
                        text: 'Maybe later'
                    },
                    ]
                });
                // HACK only show one modal at a time
                shownModal = true;
                // HACK: Abort check after first item found to avoid late-binding references in callback.
                return;

//                // Skip to next item after first match found.
//                break;
            }
        }
    };
}

// Compares shopping list item and store item by text or ean.
function isMatch(listItem, storeItem) {
    if (listItem.ean != null) {
        // Compare EAN
        return listItem.ean == storeItem.product.ean;
    }
    else {
        // Compare text
        return storeItem.product.description.match(new RegExp(listItem.text));
    }
}

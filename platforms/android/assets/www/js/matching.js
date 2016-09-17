// Compares shopping list with store inventory and alerts on matches.
function compareInventory(shoppingList, storeInfo, storeInventory, purchaseCallback) {
    for (var i = 0; i < shoppingList.length; i++) {
        var listItem = shoppingList[i];
        for (var j = 0; j < storeInventory.length; j++) {
            var storeItem = storeInventory[j];
            if (isMatch(listItem, storeItem)) {
                // Define message.
                var title =  'I\'ve found ' + listItem.text;
                var message = '\'' + storeItem.product.description + '\' is available at ' + storeInfo.name + '<br/><br/> Price: CHF ' + storeItem.price;  

                // Show purchase dialog.
                myApp.modal({
                    title:  title,
                    text: message,
                    buttons: [
                    {
                        text: 'Purchase',
                        onClick: function() {
                            // Initiate purchase for matched item.
                            purchaseCallback(listItem, storeItem);
                        }
                    },
                    {
                        text: 'Maybe later'
                    },
                    ]
                });

                // Skip to next item after first match found.
                continue;
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

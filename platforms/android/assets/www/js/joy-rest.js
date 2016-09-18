const JOY_URI = "http://192.168.137.174:8080/peanut/api";

var _callback;

// Gets inventory for the given beacon.
function getInventoryForBeacon(uuid, majorId, minorId, callback) {

    _callback = callback;
    console.log("requesting "+uuid+" "+majorId+" "+minorId);
    // Create request body. 
    var storeRequest =
    {
        uuid: uuid,
        shops: [ {
            beacon: {
                majorId: majorId,
                minorId: minorId
            }
        } ]
    };

    // Get store for request. Use .ajax to be able to specify contentType.
    $$.ajax({ method:'POST', contentType:'application/json', dataType:'json', url: JOY_URI + "/store/getStore", data:JSON.stringify(storeRequest), success:getInventory });
}

// Gets inventory for the given store/shop.
function getInventory(storeResponse) {
    var shopId = storeResponse.id;

    $$.ajax({ method:'GET', dataType:'json', url:JOY_URI + "/store/products/" + shopId, success:function(inventoryResonse) { _callback(storeResponse,inventoryResonse); }});
}

// Purchases the given item from the given store.
function purchaseItem(storeItem) {
    // TODO: Purchase item from store.
    myApp.alert('Please pick up your item from the cashier.', 'Purchase successful');
}

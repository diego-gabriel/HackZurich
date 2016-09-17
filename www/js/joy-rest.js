const JOY_URI = "http://192.168.137.174:8080/peanut/api";

var _callback;

function getInventoryForBeacon(uuid, majorId, minorId, callback) {

    _callback = callback;

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

function getInventory(storeResponse) {
    var shopId = storeResponse.id;

    $$.get(JOY_URI + "/store/products/" + shopId, function(productResponse) {
        _callback(productResponse);
    });
}

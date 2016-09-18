var bluetoothService = null;
var interval = null;
var beaconBuffer = {};

function isRegisteredBeacon(mac_address){
 return mac_address == "F0:81:00:3F:FD:99";
}

function getBeaconInfo(mac_address){
	return {uuid: "20CB0314-A24F-0815-AFF9-A98FEAA6F01B", majorId: 53341, minorId: 11111};
}

function onBeaconFound(beaconData){
	getInventoryForBeacon(beaconData.uuid, beaconData.majorId, beaconData.minorId, function(storeInfo, storeInventory) {
		compareInventory(shoppingList.items, storeInfo, storeInventory, function(listItem, storeItem) {
			// Purchase item.
			purchaseItem(storeItem);
			// Remove item from shopping list.
			removeShoppingItem(listItem.text);
		})
	});
}

function bluetoothFindBeacons(){
	bluetoothle.startScan(bluetoothScanSuccess, bluetoothError, []);	
	setTimeout(function(){
		bluetoothle.stopScan(bluetoothStopped, bluetoothError);
		console.log("Bluetooth just stopped");
	}, 1000);
}

function bluetoothScanSuccess(obj){
	if (obj.status == "scanResult" && isRegisteredBeacon(obj.address)){
		if (!beaconBuffer[obj.address]){
			onBeaconFound(getBeaconInfo(obj.address));
			beaconBuffer[obj.address] = true;
		}
	}
}

function bluetoothReady(){
	console.log("Bluetooth ready");
}

function bluetoothStopped(){
	console.log("Bluetooth scan stopped");
}

function bluetoothError(){
	console.log("Bluetooth error");
}

function bluetoothInitialize(){
	bluetoothle.initialize(bluetoothReady, bluetoothError, true);
	bluetoothService = cordova.plugins.myService;
	go();
}

//SERVICE

function go() {
   bluetoothService.getStatus(function(r){startService(r)}, function(e){handleError(e)});
};


function handleError(data) {
	alert("Error: " + data.ErrorMessage);
	alert(JSON.stringify(data));
	updateView(data);
}


function startService(data) {
   if (data.ServiceRunning) {
      enableTimer(data);
   } else {
      bluetoothService.startService(function(r){enableTimer(r)}, function(e){handleError(e)});
   }
}

function enableTimer(data) {
   if (data.TimerEnabled) {
      registerForUpdates(data);
   } else {
      bluetoothService.enableTimer(10000, function(r){registerForUpdates(r)}, function(e){handleError(e)});
   }
}

function registerForUpdates(data) {
	if (!data.RegisteredForUpdates)
		bluetoothService.registerForUpdates(function(){
			if (interval == null){
				interval = setInterval(function(){
			    	console.log("Service");
			    	bluetoothFindBeacons();
			    	console.log(JSON.stringify(beaconBuffer));
				}, 5000);
				setTimeout(function(){
					clearInterval(interval);
					interval = null;
				}, 55000);
			}
		}, function(e){handleError(e)});
}
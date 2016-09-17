var bluetoothService = null;

function bluetoothReady(){
	console.log("Bluetooth ready");
	var result = bluetoothle.startScan(bluetoothScanning, bluetoothError, []);	
	setTimeout(function(){
		bluetoothle.stopScan(bluetoothStopped, bluetoothError);
		console.log("Bluetooth just stopped");
	}, 5000);
}

function bluetoothScanning(obj){
	if (obj.status == "scanResult" && obj.address == "F0:81:00:3F:FD:99"){
		console.log("Bluetooth: "+JSON.stringify(obj));
	}
}

function bluetoothStopped(){
	console.log("Bluetooth scan stopped");
}

function bluetoothError(){
	console.log("Bluetooth error");
}

function bluetoothInitialize(){
	//bluetoothle.initialize(bluetoothReady, bluetoothError, true);
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
      bluetoothService.enableTimer(500, function(r){registerForUpdates(r)}, function(e){handleError(e)});
   }
}

function registerForUpdates(data) {
	if (!data.RegisteredForUpdates)
		bluetoothService.registerForUpdates(function(){
		    console.log("Service");
		}, function(e){handleError(e)});
}
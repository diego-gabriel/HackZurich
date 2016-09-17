function bluetoothReady(){
	console.log("Bluetooth ready");
	var result = bluetoothle.startScan(bluetoothScanning, bluetoothError, []);	
	setTimeout(function(){
		bluetoothle.stopScan(bluetoothStopped, bluetoothError);
		console.log("Bluetooth just stopped");
	}, 1000);
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
	
	var res = bluetoothle.initialize(bluetoothReady, bluetoothError, true);
	console.log("Bluetooth: " + (JSON.stringify(res)));
}
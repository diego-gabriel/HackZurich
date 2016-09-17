// Initialize your app
var myApp = new Framework7({
    material: true,
    swipePanel: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
});

function addResults(resultString){
	var result = JSON.parse(resultString);
	var results = $$("#results");
	var currentRow;

	results.text("");
	$$("#suggestions-title").show();
	for(var i = 0; i < result.length; i++){
		var image = result[i].images.thumbnails;
		var newListItem = $$('<li class="item-content">'+
							    '<div class="item-media">'+
							        '<img src="'+image+'">'+
							    '</div>'+
							    '<div class="item-inner">'+
							        '<div class="item-title">'+
							            result[i].name+
							        '</div>'+
							        '<div class="item-after">'+
							            result[i].price+'$'+
							        '</div>'+
							    '</div>'+
							'</li>');
		results.append(newListItem);
	}
}

function suggest(){
	var value = $$("#new-item-name").val().trim();
	console.log(value);
	if (value != ""){
		console.log("-"+value);
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
function getList(){
	var list;
	if (localStorage.itemList)
		list = JSON.parse(localStorage.itemList);
	else {
		list = new Array();
		localStorage.itemList = JSON.stringify(list);
	}
	return list;
}
function saveNewItem(){
	var list = getList();
	var item = $$("#new-item-name").val();
	var size = Object.keys(list).length;
	list[size] = item;
	localStorage.setItem("itemList", JSON.stringify(list));
	console.log(list);
}

//bluetooth
function onDeviceReady(){
	var res = bluetoothle.initialize(bluetoothReady, bluetoothError, true);
	console.log("Bluetooth: " + (JSON.stringify(res)));

}

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
//end bluetooth


$$("#new-item-name").keyup(suggest);
$$("#add").click(saveNewItem);
document.addEventListener('deviceready', onDeviceReady, false);





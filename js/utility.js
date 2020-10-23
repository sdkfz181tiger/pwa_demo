"use strict";

// Show message
function showMsg(msg){
	console.log(msg);
	let li = $("<li>").text(msg);
	$("#msg_area").prepend(li);
}

// Register ServiceWorker
function registerServiceWorker(callback){
	if("serviceWorker" in navigator){
		navigator.serviceWorker.register("service_worker.js", 
			{scope: "./"}).then((reg)=>{
				showMsg("ServiceWorker registered");
				console.log("ServiceWorker registered", reg);
				callback();// Callback
			}).catch((error)=>{
				showMsg("Registration failed");
				console.log("Registration failed with", error);
			});
	}
}
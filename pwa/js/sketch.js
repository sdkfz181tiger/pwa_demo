"use strict";
//==========
// JavaScript

let dWidth, dHeight;
let canvas, ctx, sLine;

// Window
window.addEventListener("load", (e)=>{
	showMsg("onload");
	registerServiceWorker(init);
});

// Register ServiceWorker
function registerServiceWorker(callback){
	if("serviceWorker" in navigator){
		navigator.serviceWorker.register("./service_worker.js",
			{scope: "./"}).then((reg)=>{
				console.log("ServiceWorker registered", reg.scope);
				callback();// Callback
			}).catch((error)=>{
				showMsg("Registration failed");
				console.log("Registration failed with", error);
			});
	}
}

function init(){
	showMsg("init");

	// Window width, height
	dWidth = window.innerWidth;
	dHeight = window.innerHeight;
	// Canvas
	canvas  = document.getElementById("canvas");
	canvas.width = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, dWidth, dHeight);
	// Logo
	let logo = new Image();
	logo.src = "./pwa/images/logo512x512.png";
	logo.addEventListener("load", (e)=>{
		let scale = 0.7;
		if(dWidth<dHeight){
			let logoW = dWidth * scale;
			let logoH = e.target.height * logoW / e.target.width;
			let logoX = dWidth * 0.5 - logoW * 0.5;
			let logoY = dHeight * 0.5 - logoH * 0.5;
			ctx.drawImage(logo, logoX, logoY, logoW, logoH);
		}else{
			let logoH = dHeight * scale;
			let logoW = e.target.width * logoH / e.target.height;
			let logoX = dWidth * 0.5 - logoW * 0.5;
			let logoY = dHeight * 0.5 - logoH * 0.5;
			ctx.drawImage(logo, logoX, logoY, logoW, logoH);
		}
	});

	// Scanline
	sLine = new Scanline(canvas, ctx, dWidth, dHeight);
	sLine.init("./pwa/images/scanline.png");
	setTimeout(()=>{sLine.draw();}, 250);
}
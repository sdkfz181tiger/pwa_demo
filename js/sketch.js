"use strict";
//==========
// JavaScript

let dWidth, dHeight;
let canvas, ctx, sMng;

// Window
window.addEventListener("load", (e)=>{
	showMsg("onload");
	registerServiceWorker(init);
});

function init(){
	showMsg("init");

	// Window width, height
	dWidth = document.body.clientWidth;
	dHeight = document.body.clientHeight;
	// Canvas
	canvas  = document.getElementById("canvas");
	canvas.width  = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, dWidth, dHeight);

	// Logo
	let logo = new Image();
	logo.src = "./images/food_01.png";
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

	/*
	// Window width, height
	dWidth = document.body.clientWidth;
	dHeight = document.body.clientHeight;
	// Tile and Font size
	let min = (dWidth<dHeight) ? dWidth:dHeight;
	tSize = (min*0.8) / GRIDS;
	fSize = tSize * 0.5;
	// Canvas
	canvas  = document.getElementById("canvas");
	canvas.width  = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.font        = fSize + "px Arial";
	ctx.textAlign   = "center";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth   = 2;
	// SamegameManager
	let sX = dWidth/2  - GRIDS*tSize/2;
	let sY = dHeight/2 - GRIDS*tSize/2;
	sMng = new SamegameManager(sX, sY, palette.length);
	sMng.checkMtx();// Test
	update();// Update
	*/
}
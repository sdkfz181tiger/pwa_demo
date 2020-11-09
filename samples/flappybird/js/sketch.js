"use strict";
//==========
// JavaScript

let dWidth, dHeight;
let canvas, ctx, hm;

let flappy;

// Window
window.addEventListener("load", (e)=>{
	//showMsg("onload");
	init();
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
	ctx.font        = "16px Arial";
	ctx.textAlign   = "center";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth   = 2;

	// Hammer
	let options = {recognizers: [
		[Hammer.Tap, {event: "singletap"}]
	]};
	hm = new Hammer(document.body, options);
	hm.on("singletap", (e)=>{
		flappy.jump();
	});

	// Flappy
	flappy = new Flappy(ctx, dWidth*0.5, dHeight*0.5);

	update();
}

function update(){
	ctx.clearRect(0, 0, dWidth, dHeight);// Clear

	flappy.draw();

	setTimeout(update, 50);
}
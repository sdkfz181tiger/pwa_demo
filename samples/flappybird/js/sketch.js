"use strict";
//==========
// JavaScript

let dWidth, dHeight;
let canvas, ctx, hm;

let flappy, asteroid;

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
		flappy.jump(e);
	});

	// Flappy
	flappy = new Flappy(ctx, dWidth*0.5, dHeight*0.1);
	asteroid = new Asteroid(ctx, dWidth*0.5, dHeight*0.8, 100);

	update();
}

function update(){
	ctx.clearRect(0, 0, dWidth, dHeight);// Clear

	flappy.draw();
	asteroid.draw();

	if(asteroid.contains(flappy.x, flappy.y)){
		if(asteroid.detectCross(flappy)){
			line(flappy.x, flappy.y, flappy.x-flappy.vX, flappy.y-flappy.vY);
			circle(asteroid.x, asteroid.y, 5);
			return;
		}
	}

	flappy.bounceWalls(0, dWidth, 0, dHeight);
	setTimeout(update, 50);
}

function line(aX, aY, bX, bY){
	ctx.beginPath();
	ctx.moveTo(aX, aY);
	ctx.lineTo(bX, bY);
	ctx.closePath();
	ctx.stroke();
}

function circle(x, y, radius){
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.stroke();
}
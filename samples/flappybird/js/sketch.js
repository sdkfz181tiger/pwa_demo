"use strict";
//==========
// JavaScript

let dWidth, dHeight;
let canvas, ctx, hm;

let asteroid, balls;

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
	hm.on("singletap", (e)=>{ball.jump(e);});

	// Asteroid
	asteroid = new Asteroid(ctx, dWidth*0.5, dHeight*0.5, 200);
	// Balls
	balls = [];
	for(let i=0; i<30; i++){
		let x = dWidth*0.25 + dWidth*0.5*Math.random();
		let y = 0;
		let ball = new Ball(ctx, x, y);
		balls.push(ball);
	}

	update();
}

function update(){
	ctx.clearRect(0, 0, dWidth, dHeight);// Clear

	// Asteroid
	asteroid.draw();
	// Balls
	for(let ball of balls){
		// x Asteroid
		asteroid.intersects(ball);
		// x Walls
		ball.bounceWalls(0, dWidth, 0, dHeight);
		// Draw
		ball.draw();
	}

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
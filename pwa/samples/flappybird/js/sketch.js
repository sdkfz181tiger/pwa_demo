"use strict";
//==========
// JavaScript

const BIRD_GRAVITY = 1.2;
const BIRD_FORCE = -12.0;
const T_WIDTH = 30;
const T_PAD_X = 90;
const T_PAD_Y = 120;
const T_SPEED = -2.0;

let dWidth, dHeight;
let canvas, ctx, hm;

let tunnels, bird;

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
	hm.on("singletap", (e)=>{bird.jump(e);});

	// Tunnels
	let tSX = dWidth * 0.5;
	let tSY = dHeight * 0.5;
	let offsetY = 0;
	tunnels = [];
	for(let i=0; i<8; i++){
		let x = tSX + T_PAD_X * i;
		let y = tSY + offsetY;
		let tunnelT = new Tunnel(ctx, x, -5,
			T_WIDTH, y-T_PAD_Y*0.5, T_SPEED);
		tunnels.push(tunnelT);
		let tunnelB = new Tunnel(ctx, x, y+T_PAD_Y*0.5, 
			T_WIDTH, dHeight-y, T_SPEED);
		tunnels.push(tunnelB);
		offsetY = 60 - Math.random() * 120;
	}

	// Bird
	bird = new Bird(ctx, dWidth*0.25, dHeight*0.5);

	update();
}

function update(){
	ctx.clearRect(0, 0, dWidth, dHeight);// Clear
	let gOver = false;

	// Asteroid
	for(let i=0; i<tunnels.length; i++){
		let tunnel = tunnels[i];
		if(tunnel.intersects(bird)) gOver = true;
		tunnel.draw();
		if(0 < tunnel.x+T_WIDTH) continue;
		let n = (i<2) ? tunnels.length-(2-i):i-2;
		tunnel.x = tunnels[n].x + T_PAD_X;
	}

	// x Walls
	bird.bounceWalls(0, dWidth, 0, dHeight);
	bird.draw();

	if(gOver) return;
	setTimeout(update, 50);
}
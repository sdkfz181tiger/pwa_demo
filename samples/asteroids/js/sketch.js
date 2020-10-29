"use strict";
//==========
// JavaScript

const ROWS = 15;
const COLS = 10;

let dWidth, dHeight;
let canvas, ctx;

let ship;
let bullets;

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
	// Neon
	ctx.globalCompositeOperation = "lighter";

	// Ship, Bullets
	ship = new Ship(ctx, dWidth*0.5, dHeight*0.5, 15);
	bullets = [];

	//neonRect(125, 125, 50, 50, 13, 213, 252);

	update();
}

function update(){
	ctx.clearRect(0, 0, dWidth, dHeight);// Clear

	if(ship.x < 0) ship.x = dWidth;
	if(ship.y < 0) ship.y = dHeight;
	if(dWidth < ship.x) ship.x = 0;
	if(dHeight < ship.y) ship.y = 0;
	ship.draw();

	for(let i=bullets.length-1; 0<=i; i--){
		let bullet = bullets[i];
		if(bullet.x < 0) bullets.splice(i, 1);
		if(bullet.y < 0) bullets.splice(i, 1);
		if(dWidth < bullet.x) bullets.splice(i, 1);
		if(dHeight < bullet.y) bullets.splice(i, 1);
		bullet.draw();
	}

	setTimeout(update, 50);
}

// Keyboard
document.addEventListener("keydown", (e)=>{
	let key = e.keyCode;
	if(key == 37) ship.turnLeft();
	if(key == 39) ship.turnRight();
	if(key == 38) ship.thrust(10);
	if(key == 90){
		let bullet = new Bullet(ctx, ship.x, ship.y, 5, ship.deg, 14);
		bullets.push(bullet);
	}
});

document.addEventListener("keyup", (e)=>{
	let key = e.keyCode;
	if(key == 37) ship.turnStop();
	if(key == 39) ship.turnStop();
});

function neonRect(x, y, w, h, r, g, b){
	ctx.shadowBlur  = 10;
	ctx.shadowColor = "rgb("+r+","+g+","+b+")";
	ctx.strokeStyle = "rgba("+r+","+g+","+b+",0.2)";
	ctx.lineWidth   = 6.5;
	drawRectangle(x, y, w, h, 1.5);
	ctx.strokeStyle = "rgba("+r+","+g+","+b+",0.2)";
	ctx.lineWidth   = 5;
	drawRectangle(x, y, w, h, 1.5);
	ctx.strokeStyle = "rgba("+r+","+g+","+b+",0.2)";
	ctx.lineWidth   = 3.5;
	drawRectangle(x, y, w, h, 1.5);
	ctx.strokeStyle = "rgba("+r+","+g+","+b+",0.2)";
	ctx.lineWidth   = 2;
	drawRectangle(x, y, w, h, 1.5);
	ctx.strokeStyle = "#fff";
	ctx.lineWidth   = 1;
	drawRectangle(x, y, w, h, 1.5);
}

function drawRectangle(x, y, w, h, border){
	ctx.beginPath();
	ctx.moveTo(x+border, y);
	ctx.lineTo(x+w-border, y);
	ctx.quadraticCurveTo(x+w-border, y, x+w, y+border);
	ctx.lineTo(x+w, y+h-border);
	ctx.quadraticCurveTo(x+w, y+h-border, x+w-border, y+h);
	ctx.lineTo(x+border, y+h);
	ctx.quadraticCurveTo(x+border, y+h, x, y+h-border);
	ctx.lineTo(x, y+border);
	ctx.quadraticCurveTo(x, y+border, x+border, y);
	ctx.closePath();
	ctx.stroke();
}
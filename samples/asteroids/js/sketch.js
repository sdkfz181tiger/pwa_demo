"use strict";
//==========
// JavaScript

const MAX_BULLETS   = 10;
const MAX_ASTEROIDS = 20;
const AST_MIN       = 30;
const AST_BUF       = 20;
const AST_SIZE = AST_MIN + AST_BUF;

let dWidth, dHeight;
let canvas, ctx;

let ship;
let bullets;
let asteroids;

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

	// Ship, Bullets, Asteroids
	ship = new Ship(ctx, dWidth*0.5, dHeight*0.5, 15);
	bullets = [];
	asteroids = [];

	//neonRect(125, 125, 50, 50, 13, 213, 252);

	meteo();
	update();
}

function meteo(){
	if(asteroids.length < MAX_ASTEROIDS){
		let r = AST_MIN + AST_BUF * Math.random();
		asteroids.push(new Asteroid(ctx, -50, -50, r));
	}
	setTimeout(meteo, 2000);
}

function splitAsteroid(x, y, r){
	if(r < AST_SIZE*0.4) return;
	asteroids.push(new Asteroid(ctx, x, y, r*0.8));
	asteroids.push(new Asteroid(ctx, x, y, r*0.8));
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

	for(let a=asteroids.length-1; 0<=a; a--){
		let asteroid = asteroids[a];
		if(asteroid.x < -50) asteroid.x = dWidth;
		if(asteroid.y < -50) asteroid.y = dHeight;
		if(dWidth+50 < asteroid.x) asteroid.x = 0;
		if(dHeight+50 < asteroid.y) asteroid.y = 0;
		asteroid.draw();
		// Asteroid x Bullet
		for(let b=bullets.length-1; 0<=b; b--){
			let bullet = bullets[b];
			if(bullet.x < asteroid.x-AST_SIZE) continue;
			if(bullet.y < asteroid.y-AST_SIZE) continue;
			if(asteroid.x+AST_SIZE < bullet.x) continue;
			if(asteroid.y+AST_SIZE < bullet.y) continue;
			if(asteroid.contains(bullet.x, bullet.y)){
				splitAsteroid(asteroid.x, asteroid.y, asteroid.r);
				bullets.splice(b, 1);  // Remove
				asteroids.splice(a, 1);// Remove
			}
		}
	}

	setTimeout(update, 50);
}

// Keyboard
document.addEventListener("keydown", (e)=>{
	let key = e.keyCode;
	if(key == 37) ship.turnLeft();
	if(key == 39) ship.turnRight();
	if(key == 38) ship.thrust(10);
	if(key == 90 && bullets.length < MAX_BULLETS){
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
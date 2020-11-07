"use strict";
//==========
// JavaScript

const INV_ROWS = 5;
const INV_COLS = 11;
const INV_DOT  = 2;
const INV_STEP = INV_DOT * 10;

let invaders, cnt, dirX, dirY;
let sLine;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(16);
	showMsg("setup");

	// Invader
	invaders = [];
	cnt = 0;
	dirX = -1;
	dirY = 0;
	let sX = width * 0.5 - INV_STEP * (INV_COLS-1) * 0.5;
	let sY = height * 0.55;
	for(let r=0; r<INV_ROWS; r++){
		let num = Math.floor(Math.random() * MAX);
		for(let c=0; c<INV_COLS; c++){
			let x = Math.floor(sX + c * INV_STEP);
			let y = Math.floor(sY - r * INV_STEP);
			let invader = new Invader(x, y, num);
			invaders.push(invader);
		}
	}

	// Scanline
	// sLine = new Scanline(canvas, drawingContext, width, height);
	// sLine.init("../../images/scanline.png");
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);

	let r = Math.floor(cnt/INV_COLS);
	let c = Math.floor(cnt%INV_COLS);
	let i = cnt;
	if(0 < dirX) i = (r+1)*INV_COLS-(c+1);
	// Draw
	for(let invader of invaders) invader.draw();
	// Step
	invaders[i].step(dirX, dirY);

	if(invaders.length-1 < ++cnt){
		cnt = 0;
		if(dirY == 0){
			dirX = 0;
			dirY = 1;
		}else{
			dirY = 0;
		}
		for(let invader of invaders){
			if(invader.x < INV_STEP*2) dirX = 1;
			if(width-INV_STEP*2 < invader.x) dirX = -1;
		}
	}

	//sLine.draw();// Scanline
}

function mousePressed(){
	
}

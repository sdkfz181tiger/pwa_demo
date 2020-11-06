"use strict";
//==========
// JavaScript

const INV_ROWS = 3;
const INV_COLS = 5;
const INV_DOT  = 4;
const INV_SIZE = INV_DOT * 5;
const INV_PAD  = INV_SIZE * 2.5;

let invaders, counter;
let sLine;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(2);
	showMsg("setup");

	// Invader
	invaders = [];
	let sX = width * 0.5 - INV_PAD * (INV_COLS-1) * 0.5;
	let sY = height * 0.2;
	for(let r=0; r<INV_ROWS; r++){
		let num = Math.floor(Math.random() * MAX);
		for(let c=0; c<INV_COLS; c++){
			let x = Math.floor(sX + c * INV_PAD);
			let y = Math.floor(sY + r * INV_PAD);
			let invader = new Invader(x, y, num);
			invaders.push(invader);
		}
	}
	counter = 0;

	// Scanline
	//sLine = new Scanline(canvas, drawingContext, width, height);
	//sLine.init("../../images/scanline.png");
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);

	for(let invader of invaders){
		invader.draw();
	}

	//sLine.draw();// Scanline
}

function mousePressed(){
	
}

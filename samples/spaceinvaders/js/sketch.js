"use strict";
//==========
// JavaScript

const T_COLOR = [
	"#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673Ab7", "#3F51B5", 
	"#2196F3", "#03A9f4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", 
	"#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];

let invaders, counter;
let sLine;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(2);
	showMsg("setup");

	// Invader
	invaders = [];
	let startX = width * 0.5 - INV_PAD * INV_COLS * 0.5;
	let startY = height * 0.2;
	for(let r=0; r<INV_ROWS; r++){
		let num = Math.floor(Math.random() * MAX);
		for(let c=0; c<INV_COLS; c++){
			let x = startX + c * INV_PAD;
			let y = startY + r * INV_PAD;
			let invader = new Invader(width*0.5, height*0.5, num);
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

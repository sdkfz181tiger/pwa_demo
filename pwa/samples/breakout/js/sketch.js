"use strict";
//==========
// JavaScript

const ROWS    = 12;
const COLS    = 10;

let ball, paddle, blocks;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(48);
	showMsg("setup");

	let bW = width / (COLS+2);
	let bH = height*0.5 / (ROWS+2);
	let sX = width*0.5 - bW*COLS*0.5;
	let sY = (ROWS+2)*bH;
	let bS = (bW<bH) ? bW*0.5:bH*0.5;

	// Ball
	ball = new Ball(width*0.5, height*0.8, width*0.02);
	// Paddle
	paddle = new Paddle(width*0.5-bW*0.5, height-bH*3.0, bW, bH);
	// Block
	blocks = [];
	for(let r=0; r<ROWS; r++){
		for(let c=0; c<COLS; c++){
			let x = sX + bW * c;
			let y = sY - bH * r;
			let color = COLORS[r%COLORS.length];
			let block = new Block(x, y, bW, bH, color);
			blocks.push(block);
		}
	}
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);

	// Ball
	ball.draw();

	// x Wall
	ball.bounceWalls(0, width, 0, height);

	// x Paddle
	paddle.draw();
	if(ball.intersects(paddle)){
		if(ball.shutout(paddle)) ball.bounce(paddle);
	}

	// x Block
	let last = -1;
	for(let block of blocks) block.draw();
	for(let i=blocks.length-1; 0<=i; i--){
		let block = blocks[i];
		if(!ball.intersects(block)) continue;
		if(!ball.shutout(block)) continue;
		last = i;// Last block
		i = blocks.length-1;// Loop
	}
	// Remove
	if(ball.bounce() && last != -1) blocks.splice(last, 1);
}

function mousePressed(){
	// Move
	paddle.moveTo(mouseX, paddle.y);
}

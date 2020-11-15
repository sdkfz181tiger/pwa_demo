"use strict";
//==========
// JavaScript

const ROWS    = 17;
const COLS    = 7;
const BLOCK_P = 10;

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
	ball = new Ball(width*0.5, height*0.8, bS);
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
	if(ball.intersects(paddle)) ball.bounce(paddle);

	// x Block
	for(let block of blocks) block.draw();
	for(let i=blocks.length-1; 0<=i; i--){
		let block = blocks[i];
		if(!ball.intersects(block)) continue;
		if(!ball.bounce(block)) continue;
		blocks.splice(i, 1);// Splice
		break;
	}
}

function mousePressed(){
	// Move
	paddle.moveTo(mouseX, paddle.y);
}

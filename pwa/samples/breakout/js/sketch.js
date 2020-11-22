"use strict";
//==========
// JavaScript

const ROWS    = 12;
const COLS    = 10;

let paddle, balls, blocks;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(48);
	showMsg("setup");

	let bW = width / (COLS+2);
	let bH = height*0.5 / (ROWS+2);
	let sX = width*0.5 - bW*COLS*0.5;
	let sY = (ROWS+2)*bH;
	let bS = (bW<bH) ? bW*0.5:bH*0.5;

	// Paddle
	paddle = new Paddle(width*0.5-bW*0.5, height-bH*3.0, bW, bH);
	// Balls
	balls = [];
	for(let b=0; b<30; b++){
		let spd = 5;
		let deg = b * 5 + 220;
		let ball = new Ball(width*0.5, height*0.8, width*0.015);
		ball.setSpeed(spd, deg);
		balls.push(ball); 
	}

	// Blocks
	blocks = [];
	for(let r=0; r<ROWS; r++){
		for(let c=0; c<COLS; c++){
			let x = sX + bW * c;
			let y = sY - bH * r;
			let block = new Block(x, y, bW, bH);
			blocks.push(block);
		}
	}
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);

	paddle.draw();// Paddle

	// Balls
	for(let b=0; b<balls.length; b++){
		let ball = balls[b];
		ball.draw();// Draw
		ball.bounceWalls(0, width, 0, height);// x Wall
		// x Paddle
		if(ball.intersects(paddle)){
			if(ball.shutout(paddle)) ball.bounce(paddle);
		}
		if(height*0.7 < ball.y) continue;
		// x Block
		let last = -1;
		for(let i=blocks.length-1; 0<=i; i--){
			let block = blocks[i];
			if(!ball.intersects(block)) continue;
			if(!ball.shutout(block)) continue;
			last = i;// Last block
			i = blocks.length-1;// Loop
		}
		// Remove
		if(ball.bounce() && last != -1){
			if(blocks[last].damage()) blocks.splice(last, 1);
		}
	}

	// Blocks
	for(let block of blocks) block.draw();
}

function mousePressed(){
	// Move
	paddle.moveTo(mouseX, paddle.y);
}

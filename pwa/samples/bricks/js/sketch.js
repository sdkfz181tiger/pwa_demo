"use strict";
//==========
// JavaScript

let paddle, blocks, balls;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(48);
	showMsg("setup");

	const tBox = [[0,0],[1,0],[1,1],[0,1]];
	const tTrA = [[0,0],[1,1],[0,1]];
	const tTrB = [[0,0],[1,0],[0,1]];
	const tTrC = [[0,0],[1,0],[1,1]];
	const tTrD = [[1,0],[1,1],[0,1]];
	const types = [
		[null, tTrC, tBox, tTrB, null],
		[tTrD, null, tBox, null, tTrA],
		[tBox, null, tBox, null, tBox],
		[tBox, null, null, null, tBox],
		[tTrC, tBox, null, tBox, tTrB],
	];

	const rows = types.length;
	const cols = types[0].length;

	let bW = 50;
	let bH = 50;
	let sX = width*0.5 - bW*cols*0.5;
	let sY = height*0.5 - bH*2;

	// Paddle
	paddle = new Paddle(width*0.5-bW*0.5, height-bH*2.0, bW, bH);

	// Block
	blocks = [];
	for(let r=0; r<rows; r++){
		for(let c=0; c<cols; c++){
			let x = sX + c * bW;
			let y = sY + r * bW;
			let type = types[r][c];
			if(type == null) continue;
			let block = new Block(x, y, bW, bH, type);
			blocks.push(block);
		}
	}

	// Balls
	balls = [];
	for(let b=0; b<10; b++){
		let size = 5;
		let spd  = 5;
		let deg  = (b+1)*2 + 180;
		let ball = new Ball(width*0.5, height*0.8, size);
		ball.setSpeed(spd, deg);
		balls.push(ball); 
	}
}

function draw(){
	background(0);
	stroke(200); strokeWeight(2); fill(33);

	//paddle.draw();// Paddle

	// Blocks
	for(let a=0; a<blocks.length; a++){
		blocks[a].draw();
		for(let b=0; b<balls.length; b++){
			blocks[a].intersects(balls[b]);// x Ball
		}
	}

	// Balls
	for(let ball of balls){
		ball.bounceWalls(0, width, 0, height);// x Wall
		ball.draw();
	}
}

function mousePressed(){
	// Move
}

"use strict";
//==========
// JavaScript

const ROWS    = 2;
const COLS    = 1;

let paddle, block, balls;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(48);
	showMsg("setup");

	let bW = 60;
	let bH = 60;
	let sX = width*0.5 - bW*COLS*0.5;
	let sY = height*0.5 - bH;

	// Paddle
	paddle = new Paddle(width*0.5-bW*0.5, height-bH*2.0, bW, bH);

	// Block
	block = new Block(width*0.4, height*0.5, 100, 100);

	// Balls
	balls = [];
	for(let b=0; b<10; b++){
		let size = 10;
		let spd = 10;
		let deg = (b+1)*10 + 180;
		let ball = new Ball(width*0.5, height*0.8, size);
		ball.setSpeed(spd, deg);
		balls.push(ball); 
	}
}

function draw(){
	background(0);
	stroke(200); strokeWeight(2); fill(33);

	//paddle.draw();// Paddle

	// Block
	block.draw();
	
	// Balls
	for(let b=0; b<balls.length; b++){
		let ball = balls[b];
		block.intersects(ball);// x Block
		ball.bounceWalls(0, width, 0, height);// x Wall
		ball.draw();// Draw
	}
}

function mousePressed(){
	// Move
}

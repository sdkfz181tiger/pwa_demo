"use strict";
//==========
// JavaScript

const tBox = [[0,0],[1,0],[1,1],[0,1]];
const tTrA = [[0,0],[1,1],[0,1]];
const tTrB = [[0,0],[1,0],[0,1]];
const tTrC = [[0,0],[1,0],[1,1]];
const tTrD = [[1,0],[1,1],[0,1]];

const types = [
	[null, tTrC, tBox, tBox, null, null],
	[tTrD, null, tBox, tBox, null, tTrA],
	[tBox, null, tTrC, tTrB, null, tBox],
	[tBox, null, null, null, null, tBox],
	[tTrC, tTrA, null, null, tTrD, tTrB],
];

let balls, blocks;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(48);
	showMsg("setup");

	const rows = types.length;
	const cols = types[0].length;

	let bW = width / 9;
	let bH = bW;
	let sX = width*0.5 - bW*cols*0.5;
	let sY = height*0.5;

	// Balls
	balls = [];
	for(let i=0; i<1; i++){
		let size = 4;
		let spd  = 4;
		let deg  = i + 180;
		let ball = new Ball(width*0.5+100, 120, size);
		ball.setSpeed(spd, deg);
		balls.push(ball); 
	}

	// Block
	blocks = [];
	for(let r=rows-1; 0<=r; r--){
		for(let c=0; c<cols; c++){
			let x = sX + c * bW;
			let y = sY - (rows-r) * bW;
			let type = types[r][c];
			if(type == null) continue;
			let block = new Block(x, y, bW, bH, type);
			blocks.push(block);
		}
	}
}

function draw(){
	background(0);
	stroke(200); strokeWeight(2); fill(33);

	// Intersect
	for(let a=0; a<balls.length; a++){
		let cnt = 0;
		for(let b=0; b<blocks.length; b++){
			if(blocks[b].intersects(balls[a])){
				cnt++;
				if(100 < cnt){
					console.log("Too much!!", b);
					break;
				}
				b = 0;
			}
		}
	}
	// Blocks
	for(let block of blocks) block.draw();
	// Balls
	for(let ball of balls){
		ball.bounceWalls(0, width, 0, height);// x Wall
		ball.draw();
	}
}

function mousePressed(){
	draw();
}

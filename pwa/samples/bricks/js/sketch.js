"use strict";
//==========
// JavaScript

const ptns = [
	[[1,0],[1,1],[0,1]],
	[[1,0],[2,0],[2,1],[1,1]],
	[[2,0],[3,1],[2,1]],
	[[0,2],[1,2],[1,3]],
	[[1,2],[2,2],[2,3],[1,3]],
	[[2,2],[3,2],[2,3]]
];

let balls, tris;
let tMinX, tMaxX;
let tMinY, tMaxY;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(32);
	showMsg("setup");

	const tRows = 3;
	const tCols = 3;
	const tSize = width / 9;
	const tX = width*0.5 - tSize*tCols*0.5;
	const tY = height*0.5 - tSize*tRows*0.5;

	tMinX = tX;
	tMaxX = tX + tSize * tCols;
	tMinY = tY;
	tMaxY = tY + tSize * tRows;

	// Balls
	balls = [];
	for(let i=180; i<360; i+=4){
		let ball = new Ball(width*0.5, height-30, 6);
		ball.setSpeed(8, i);
		balls.push(ball); 
	}

	// Triangles
	tris = [];
	for(let ptn of ptns){
		let tri = new Triangle(tX, tY, tSize, ptn);
		tris.push(tri);
	}
}

function draw(){
	background(0);
	stroke(200); strokeWeight(2); fill(33);

	// Intersect
	for(let i=0; i<balls.length; i++){
		let ball = balls[i];
		bounceWalls(ball);// x Walls
		bounceTriangles(ball);// x Triangles
		ball.draw();
	}
	// Triangles
	for(let tri of tris) tri.draw();
}

function bounceWalls(ball){
	ball.bounceWalls(0, width, 0, height);
}

function bounceTriangles(ball){
	if(ball.x < tMinX) return;
	if(tMaxX < ball.x) return;
	if(ball.y < tMinY) return;
	if(tMaxY < ball.y) return;
	for(let t=0; t<tris.length; t++){
		tris[t].intersects(ball);
	}
}

function mousePressed(){
	
}

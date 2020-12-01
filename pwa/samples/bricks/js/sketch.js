"use strict";
//==========
// JavaScript

const O = [[0,0],[1,0],[1,1],[0,1]];
const A = [[0,0],[1,1],[0,1]];
const B = [[0,0],[1,0],[0,1]];
const C = [[0,0],[1,0],[1,1]];
const D = [[1,0],[1,1],[0,1]];
const X = null;

const ptns = [
	[O, X, D, A],
	[C, A, C, A],
	[D, B, D, B],
	[O, A, C, O],
	[C, B, X, C],
	[X, X, X, X],
	[X, X, X, X],
	[X, X, X, X]
];

let sBar, gLine;
let balls, tris;
let tMinX, tMaxX;
let tMinY, tMaxY;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(32);
	rectMode(CENTER);
	showMsg("setup");

	const tRows = ptns.length;
	const tCols = ptns[0].length;
	const tSize = width / 10;
	const tX = width*0.5 - tSize*tCols*0.5;
	const tY = height*0.5 - tSize*tRows*0.5;

	tMinX = tX;
	tMaxX = tX + tSize * tCols;
	tMinY = tY;
	tMaxY = tY + tSize * tRows;

	// Slidebar, Guideline
	sBar = new Slidebar(width*0.5, height-40, width*0.2, width*0.02);
	gLine = new Guideline(width*0.5, height-60);

	// Balls
	balls = [];
	for(let i=180; i<270; i+=3){
		if(i%45==0) continue;
		let ball = new Ball(width*0.5, height*0.75, 4);
		ball.setSpeed(2, i);
		balls.push(ball); 
	}

	// Triangles
	tris = [];
	for(let r=0; r<tRows; r++){
		for(let c=0; c<tCols; c++){
			let ptn = ptns[r][c];
			if(ptn == null) continue;
			let sX = tX + c * tSize;
			let sY = tY + r * tSize;
			let tri = new Triangle(sX, sY, tSize, ptn);
			tris.push(tri);
		}
	}
}

function draw(){
	background(0);
	stroke(200); strokeWeight(1); fill(33);

	// Slidebar
	sBar.draw();
	gLine.draw();

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
	if(!sBar) return;
	sBar.touchBegan(mouseX, mouseY);
}

function mouseDragged(){
	if(!sBar) return;
	sBar.touchMoved(mouseX, mouseY);
	if(sBar.isHandling){
		gLine.setDeg(sBar.percent);
	}
}

function mouseReleased(){
	if(!sBar) return;
	sBar.touchEnded(mouseX, mouseY);
}

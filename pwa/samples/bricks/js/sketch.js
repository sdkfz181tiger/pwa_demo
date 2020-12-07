"use strict";
//==========
// JavaScript

const O = [[0,0],[1,0],[1,1],[0,1]];
const A = [[0,0],[1,1],[0,1]];
const B = [[0,0],[1,0],[0,1]];
const C = [[0,0],[1,0],[1,1]];
const D = [[1,0],[1,1],[0,1]];
const X = null;
const BALL_SPD = 4;

// const ptns = [
// 	[O, B, X, D, A],
// 	[C, A, X, C, A],
// 	[D, O, B, D, B],
// 	[O, A, X, C, O],
// 	[C, O, X, X, C],
// 	[X, B, X, X, D],
// 	[X, X, X, X, X],
// 	[X, X, X, X, X]
// ];

const ptns = [
	[O, O, O, O, O],
	[O, O, O, O, O],
	[O, O, O, O, O],
	[O, O, O, O, O],
	[O, O, O, O, O],
	[O, O, O, O, O],
	[X, X, X, X, X],
	[X, X, X, X, X]
];

let tMinX, tMaxX;
let tMinY, tMaxY;
let sBar, gLine;
let tris, balls;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
	rectMode(CENTER);
	showMsg("setup");

	const tRows = ptns.length;
	const tCols = ptns[0].length;
	const tSize = (width<height) ? width/10:height/10;
	const tX = width*0.5 - tSize*tCols*0.5;
	const tY = height*0.5 - tSize*tRows*0.5;

	tMinX = tX;
	tMaxX = tX + tSize * tCols;
	tMinY = tY;
	tMaxY = tY + tSize * tRows;

	// Slidebar, Guideline
	sBar = new Slidebar(width*0.5, height-40, width*0.2, tSize*0.2);
	gLine = new Guideline(width*0.5, height*0.5+tSize*3);

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

	// Balls
	balls = [];
	setTimeout(shotBall, 5000);
}

function draw(){
	background(0);
	stroke(200); strokeWeight(1); fill(33);

	// Slidebar
	sBar.draw();
	gLine.draw();
	drawDummy();// Dummy

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

function drawDummy(){
	let ball = new Ball(gLine.x, gLine.y, 2);
	ball.setSpeed(BALL_SPD, gLine.deg);
	for(let i=0; i<90; i++){
		ball.bounceWalls(0, width, 0, height);
		for(let t=0; t<tris.length; t++){
			tris[t].intersects(ball);
		}
		ball.draw();
	}
}

function shotBall(){
	// Splice
	if(30 < balls.length) balls.splice(0, 1);

	let x = gLine.x;
	let y = gLine.y;
	let ball = new Ball(x, y, 8);
	ball.setSpeed(BALL_SPD, gLine.deg);
	balls.push(ball); 

	setTimeout(shotBall, 100);// Recursive
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
		gLine.setPercent(sBar.percent);
	}
}

function mouseReleased(){
	if(!sBar) return;
	sBar.touchEnded(mouseX, mouseY);
}

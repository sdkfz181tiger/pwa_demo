"use strict";
//==========
// JavaScript

const MINO_I = [
	[0, 1, 0, 0,
	 0, 1, 0, 0,
	 0, 1, 0, 0,
	 0, 1, 0, 0],
	[0, 0, 0, 0,
	 1, 1, 1, 1,
	 0, 0, 0, 0,
	 0, 0, 0, 0]
];

const MINO_L = [
	[0, 2, 0, 0,
	 0, 2, 0, 0,
	 0, 2, 2, 0,
	 0, 0, 0, 0],
	[0, 0, 0, 0,
	 0, 2, 2, 2,
	 0, 2, 0, 0,
	 0, 0, 0, 0],
	[0, 0, 0, 0,
	 0, 2, 2, 0,
	 0, 0, 2, 0,
	 0, 0, 2, 0],
	[0, 0, 0, 0,
	 0, 0, 2, 0,
	 2, 2, 2, 0,
	 0, 0, 0, 0]
];

const MINO_J = [
	[0, 0, 3, 0,
	 0, 0, 3, 0,
	 0, 3, 3, 0,
	 0, 0, 0, 0],
	[0, 0, 0, 0,
	 0, 3, 0, 0,
	 0, 3, 3, 3,
	 0, 0, 0, 0],
	[0, 0, 0, 0,
	 0, 3, 3, 0,
	 0, 3, 0, 0,
	 0, 3, 0, 0],
	[0, 0, 0, 0,
	 3, 3, 3, 0,
	 0, 0, 3, 0,
	 0, 0, 0, 0]
];

const MINO_O = [
	[0, 0, 0, 0,
	 0, 4, 4, 0,
	 0, 4, 4, 0,
	 0, 0, 0, 0]
];

const MINO_Z = [
	[0, 0, 0, 0,
	 0, 5, 5, 0,
	 0, 0, 5, 5,
	 0, 0, 0, 0],
	[0, 0, 0, 0,
	 0, 0, 5, 0,
	 0, 5, 5, 0,
	 0, 5, 0, 0]
];

const MINO_S = [
	[0, 0, 0, 0,
	 0, 6, 6, 0,
	 6, 6, 0, 0,
	 0, 0, 0, 0],
	[0, 6, 0, 0,
	 0, 6, 6, 0,
	 0, 0, 6, 0,
	 0, 0, 0, 0]
];

const MINO_T = [
	[0, 0, 0, 0,
	 0, 7, 0, 0,
	 7, 7, 7, 0,
	 0, 0, 0, 0],
	[0, 7, 0, 0,
	 0, 7, 7, 0,
	 0, 7, 0, 0,
	 0, 0, 0, 0],
	[0, 0, 0, 0,
	 0, 7, 7, 7,
	 0, 0, 7, 0,
	 0, 0, 0, 0],
	[0, 0, 7, 0,
	 0, 7, 7, 0,
	 0, 0, 7, 0,
	 0, 0, 0, 0]
];

const MINOS  = [MINO_I, MINO_L, MINO_J, MINO_O, MINO_S, MINO_Z, MINO_T];

const COLORS = ["#E60012", "#F39800", "#FFF100", "#009944", "#0068B7", "#1D2088", "#920783"];

const ROWS   = 18;
const COLS   = 10;

let dWidth, dHeight;
let canvas, ctx, bSize, fSize, oX, oY, tMng;
let bControll, bRotL, bRotR;

// Window
window.addEventListener("load", (e)=>{
	//showMsg("onload");
	init();
});

function init(){
	showMsg("init");

	// Window width, height
	dWidth  = document.body.clientWidth;
	dHeight = document.body.clientHeight;
	// Block size
	bSize = dHeight / (ROWS+6);
	fSize = bSize;
	// Canvas
	canvas = document.getElementById("canvas");
	canvas.width  = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.font        = fSize + "px Arial";
	ctx.textAlign   = "center";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth   = 2;
	// Offset
	oX = Math.floor(dWidth*0.5 - COLS*bSize*0.5);
	oY = Math.floor(bSize*1.5);
	// TetrisManager
	tMng = new TetrisManager(ROWS, COLS, MINOS, true);
	// Button
	bControll = new ButtonControl(dWidth*0.5-bSize*3, dHeight-bSize*3, 32);
	bRotL = new Button(dWidth*0.5+bSize*2, dHeight-bSize*2.5, 32);
	bRotR = new Button(dWidth*0.5+bSize*4, dHeight-bSize*2.5, 32);
	step();  // Step
	update();// Update
}

// Step
function step(){
	// GameOver
	if(tMng.isGameOver()){
		console.log("GAME OVER");
		return;
	}
	let dels = tMng.stepTetris();// Step
	if(0 < dels){
		showMsg("Deleted:" + dels + " lines!!");
		console.log("Deleted:" + dels + " lines!!");
	}
	//tMng.showConsole(tMng.getData());// Show
	setTimeout(step, 1000);
}

// Update
function update(){

	// Background
	ctx.fillStyle = "#333333";
	ctx.fillRect(0, 0, dWidth, dHeight);
	ctx.fillStyle = "#444444";
	ctx.fillRect(oX, oY, COLS*bSize, ROWS*bSize);
	// Text
	ctx.fillStyle = "#cccccc";
	ctx.fillText("Tetris!!", dWidth/2, bSize);
	// Tetris
	let data = tMng.getData();
	for(let r=0; r<ROWS; r++){
		for(let c=0; c<COLS; c++){
			let i = r*COLS + c;
			let x = oX + c*bSize;
			let y = oY + r*bSize;
			if(data[i] == 0) continue;
			ctx.fillStyle = COLORS[data[i]-1];
			ctx.fillRect(x, y, bSize-1, bSize-1);
		}
	}
	// Button
	bControll.draw(ctx);
	bRotL.draw(ctx);
	bRotR.draw(ctx);
	setTimeout(update, 100);
}

document.addEventListener("click", (e)=>{
	if(tMng.isGameOver()) return;
	if(bControll.clickLeft(e)) tMng.actionLeft();
	if(bControll.clickRight(e)) tMng.actionRight();
	if(bControll.clickDown(e)) tMng.actionDown();
	if(bRotL.click(e)) tMng.actionRotateL();
	if(bRotR.click(e)) tMng.actionRotateR();
});

// Keyboard
document.addEventListener("keydown", (e)=>{
	if(tMng.isGameOver()) return;
	let key = e.keyCode;
	// Left
	if(key == 37){
		tMng.actionLeft();
	}
	// Right
	if(key == 39){
		tMng.actionRight();
	}
	// Down
	if(key == 40){
		tMng.actionDown();
	}
	// Up
	if(key == 38){
		tMng.actionRotateL();
		//tMng.actionRotateR();
	}
});

class ButtonControl{

	constructor(x, y, size){
		this._x = x;
		this._y = y;
		this._size   = size*0.5;
		this._bLeft  = new Button(x-size, y, size);
		this._bRight = new Button(x+size, y, size);
		this._bDown  = new Button(x, y+size, size);
	}

	clickLeft(e){
		return this._bLeft.click(e);
	}

	clickRight(e){
		return this._bRight.click(e);
	}

	clickDown(e){
		return this._bDown.click(e);
	}

	draw(ctx){
		this._bLeft.draw(ctx);
		this._bRight.draw(ctx);
		this._bDown.draw(ctx);
	}
}

class Button{

	constructor(x, y, size){
		this._x = x - size*0.5;
		this._y = y - size*0.5;
		this._size = size;
	}

	click(e){
		let cX = e.clientX;
		let cY = e.clientY;
		if(cX < this._x) return false;
		if(this._x + this._size < cX) return false;
		if(cY < this._y) return false;
		if(this._y + this._size < cY) return false;
		return true;
	}

	draw(ctx){
		ctx.fillStyle = "#cccccc";
		ctx.fillRect(this._x, this._y, this._size, this._size);
	}
}
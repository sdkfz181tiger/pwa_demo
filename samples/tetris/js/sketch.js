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
const SIZE   = 16;

let dWidth, dHeight;
let canvas, ctx, oX, oY, tMng;

// Window
window.addEventListener("load", (e)=>{
	//showMsg("onload");
	init();
});

function init(){
	showMsg("init");

	// Window width, height
	dWidth = document.body.clientWidth;
	dHeight = document.body.clientHeight;
	// Canvas
	canvas = document.getElementById("canvas");
	canvas.width  = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.font        = SIZE + "px Arial";
	ctx.textAlign   = "center";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth   = 2;
	// Offset
	oX = Math.floor(dWidth / 2 - COLS * SIZE / 2);
	oY = Math.floor(dHeight / 2 - ROWS * SIZE / 2);
	// TetrisManager
	tMng = new TetrisManager(ROWS, COLS, MINOS, true);
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
	tMng.showConsole(tMng.getData());// Show
	setTimeout(step, 1000);
}

// Update
function update(){

	// Background
	ctx.fillStyle = "#333333";
	ctx.fillRect(0, 0, dWidth, dHeight);
	ctx.fillStyle = "#444444";
	ctx.fillRect(oX, oY, COLS*SIZE, ROWS*SIZE);
	// Text
	ctx.fillStyle = "#cccccc";
	ctx.fillText("Tetris!!", dWidth/2, dHeight/2-SIZE*ROWS/2-SIZE);

	let data = tMng.getData();
	for(let r=0; r<ROWS; r++){
		for(let c=0; c<COLS; c++){
			let i = r*COLS + c;
			let x = oX + c*SIZE;
			let y = oY + r*SIZE;
			if(data[i] == 0) continue;
			ctx.fillStyle = COLORS[data[i]-1];
			ctx.fillRect(x, y, SIZE-1, SIZE-1);
		}
	}
	setTimeout(update, 100);
}

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
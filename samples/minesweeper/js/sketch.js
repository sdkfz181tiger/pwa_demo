"use strict";
//==========
// JavaScript

const ROWS = 10;
const COLS = 10;

let dWidth, dHeight;
let pSize, tSize, fSize;
let canvas, ctx, oX, oY, mMng;

let lines = new Image();
lines.src = "./images/scanline.png";
let glcanvas, texture, hw, hh, w75;

// Window
window.addEventListener("load", (e)=>{
	showMsg("onload");

	try{
		glcanvas = fx.canvas();
	}catch(e){
		console.log(e);
		showMsg(e);
		return;
	}
	init();
});

function init(){
	showMsg("init");
	// Window width, height
	dWidth = document.body.clientWidth;
	dHeight = document.body.clientHeight;
	// Tile and Font size
	pSize = dHeight / (ROWS+2);
	tSize = pSize * 0.9;
	fSize = tSize * 0.9;
	// Canvas
	canvas  = document.getElementById("canvas");
	canvas.width  = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.font = fSize + "px Arial";
	ctx.textAlign = "center";

	// Offset
	oX = Math.floor(dWidth / 2 - COLS * pSize / 2);
	oY = Math.floor(dHeight / 2 - ROWS * pSize / 2);
	// MineSweeperManager
	mMng = new MineSweeperManager(ROWS, COLS, 8);
	
	// Test
	texture = glcanvas.texture(canvas);
	hw = dWidth / 2;
	hh = dHeight / 2;
	w75 = dWidth * 0.75;

	canvas.parentNode.insertBefore(glcanvas, canvas);
	canvas.style.display = "none";
	glcanvas.className = canvas.className;
	glcanvas.id = canvas.id;
	canvas.id = "old_" + canvas.id;

	setTimeout(update, 500);
}

function update(){
	show();// Show

	ctx.drawImage(lines, 0, 0, dWidth, dHeight);
	texture.loadContentsOf(canvas);
	glcanvas.draw(texture)
		.bulgePinch(hw, hh, w75, 0.2)
		.vignette(0.25, 0.75)
		.update();
	setTimeout(update, 500);
}

function show(){
	// Background
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(0, 0, dWidth, dHeight);

	ctx.fillStyle = "#F2E8CF";
	ctx.fillRect(oX, oY, COLS*pSize-1, ROWS*pSize-1);

	for(let r=0; r<ROWS; r++){
		for(let c=0; c<COLS; c++){
			let x = oX + c * pSize;
			let y = oY + r * pSize;

			let cell = mMng.getCell(r, c);
			if(cell == -1){
				ctx.fillStyle = "#6A994E";
				ctx.fillRect(x, y, tSize, tSize);
				continue;
			}
			if(cell == 0){
				ctx.fillStyle = "#A7C957";
				ctx.fillRect(x, y, tSize, tSize);
				continue;
			}
			if(0 < cell && cell < 9){
				ctx.fillStyle = "#386641";
				ctx.fillRect(x, y, tSize, tSize);
				ctx.fillStyle = "#ffffff";
				ctx.fillText(cell, x+tSize/2, y+tSize*0.9, tSize);
				continue;
			}
			if(cell == 9){
				ctx.fillStyle = "#BC4749";
				ctx.fillRect(x, y, tSize, tSize);
				ctx.fillStyle = "#ffffff";
				ctx.fillText("X", x+tSize/2, y+tSize*0.9, tSize);
				continue;
			}
		}
	}
	//mMng.consoleAll();
}

// Keyboard
document.addEventListener("click", (e)=>{
	let r = Math.floor((e.y - oY) / pSize);
	let c = Math.floor((e.x - oX) / pSize);
	if(mMng.search(r, c)){
		console.log("GAME OVER");
	}
	show();
});
"use strict";
//==========
// JavaScript

const COLORS = ["#233D4D", "#FE7F2D", "#FCCA46", "#A1C181", "#619B8A"];
const GRIDS  = 6;

let dWidth, dHeight;
let canvas, ctx, sMng;

let tSize, fSize;

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
	// Tile and Font size
	let min = (dWidth<dHeight) ? dWidth:dHeight;
	tSize = (min*0.8) / GRIDS;
	fSize = tSize * 0.5;
	// Canvas
	canvas  = document.getElementById("canvas");
	canvas.width  = dWidth;
	canvas.height = dHeight;
	// Context
	ctx = canvas.getContext("2d");
	ctx.font        = fSize + "px Arial";
	ctx.textAlign   = "center";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth   = 2;
	// SamegameManager
	let sX = dWidth/2  - GRIDS*tSize/2;
	let sY = dHeight/2 - GRIDS*tSize/2;
	sMng = new SamegameManager(sX, sY, COLORS.length);
	sMng.checkMtx();// Test
	update();// Update
}

// Update
function update(){
	// Clear
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, dWidth, dHeight);
	// Background
	let sX = dWidth/2  - GRIDS*tSize/2;
	let sY = dHeight/2 - GRIDS*tSize/2;
	ctx.fillStyle = "#222222";
	ctx.fillRect(sX, sY, GRIDS*tSize, GRIDS*tSize);
	// Matrix
	let mtx = sMng.getMtx();
	for(let r=0; r<GRIDS; r++){
		for(let c=0; c<GRIDS; c++){
			let tile = mtx[r][c];
			if(tile == null) continue;
			ctx.fillStyle = COLORS[Math.floor(tile.type%COLORS.length)];
			ctx.fillRect(tile.x, tile.y, tSize*0.98, tSize*0.98);
			ctx.fillStyle = "#ffffff";
			ctx.fillText(tile.type, tile.x+tSize*0.5, tile.y+tSize*0.7);
		}
	}
	setTimeout(update, 500);
}

function drawLine(x, y, w, c){
	ctx.strokeStyle = c;
	ctx.beginPath();
	ctx.moveTo(x+w/2, y);
	ctx.lineTo(x-w/2, y);
	ctx.stroke();
}

function drawTrp(x1, y1, w1, x2, y2, w2, c){
	ctx.fillStyle = c;
	ctx.beginPath();
	ctx.moveTo(x1+w1/2, y1);
	ctx.lineTo(x1-w1/2, y1);
	ctx.lineTo(x2-w2/2, y2);
	ctx.lineTo(x2+w2/2, y2);
	ctx.closePath();
	ctx.fill();
}

document.addEventListener("click", (e)=>{
	sMng.touchTiles(e.x, e.y);
	// Deleted
	let cnt = sMng.getChainCnt();
	if(0 < cnt){
		showMsg("Deleted:" + cnt + " tiles!!");
		console.log("Deleted:" + cnt + " tiles!!")
	}
});
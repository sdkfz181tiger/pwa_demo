"use strict";
//==========
// JavaScript

const palette = ["#233D4D", "#FE7F2D", "#FCCA46", "#A1C181", "#619B8A"];
const GRIDS  = 6;

let dWidth, dHeight;
let canvas, ctx, sMng;

let tSize, fSize;

// Window
window.addEventListener("load", (e)=>{
	showMsg("onload");
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
	sMng = new SamegameManager(sX, sY, palette.length);
	sMng.checkMtx();// Test
	update();// Update
}

// Update
function update(){
	// Clear
	ctx.fillStyle = "#333333";
	ctx.fillRect(0, 0, dWidth, dHeight);
	// Text
	ctx.fillStyle = "#cccccc";
	ctx.fillText("SameGame!!", dWidth/2, (dHeight-tSize*GRIDS)/4+fSize*0.5);
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
			ctx.fillStyle = palette[Math.floor(tile.type%palette.length)];
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
		showMsg("You deleted " + cnt + " tiles!!");
	}
});

//==========
// SamegameManager

class SamegameManager{

	constructor(sX, sY, types){
		this._sX     = sX;
		this._sY     = sY;
		this._types  = types;
		this._chains = [];
		this.initMatrix();
		this.compressV();
	}

	initMatrix(){
		this._mtx = this.createMtx();
		for(let r=0; r<GRIDS; r++){
			for(let c=0; c<GRIDS; c++){
				let x = this._sX + tSize * c;
				let y = this._sY + tSize * r;
				let type = Math.floor(Math.random()*this._types);
				this._mtx[r][c] = new Tile(r, c, x, y, type);
			}
		}
	}

	getChainCnt(){
		return this._chains.length;
	}

	compressV(){
		for(let c=GRIDS-1; 0<=c; c--){
			for(let r=GRIDS-1; 0<=r; r--){
				if(this._mtx[r][c] != null) continue;
				for(let v=r-1; 0<=v; v--){
					if(this._mtx[v][c] == null) continue;
					this.swapTiles(r, c, v, c);// Swap
					break;
				}
			}
		}
	}

	compressH(){
		for(let r=GRIDS-1; 0<=r; r--){
			for(let c=0; c<GRIDS-1; c++){
				if(this._mtx[r][c] != null) continue;
				for(let h=c+1; h<GRIDS; h++){
					if(this._mtx[r][h] == null) continue;
					this.swapTiles(r, c, r, h);// Swap
					break;
				}
			}
		}
	}

	swapTiles(aR, aC, bR, bC){
		this._mtx[aR][aC] = this._mtx[bR][bC];// Swap
		this._mtx[bR][bC] = null;
		let x = this._sX + tSize * aC;// Change
		let y = this._sY + tSize * aR;
		this._mtx[aR][aC].setParams(aR, aC, x, y);
	}

	createMtx(){
		let mtx = [];
		for(let r=0; r<GRIDS; r++){
			let line = [];
			for(let c=0; c<GRIDS; c++) line.push(null);
			mtx.push(line);
		}
		return mtx;
	}

	getMtx(){
		return this._mtx;
	}

	checkMtx(){
		let bar = "";
		for(let b=0; b<GRIDS*2+3; b++) bar += "=";
		bar += "\n";
		let str = bar;
		for(let r=0; r<GRIDS; r++){
			let line = "| ";
			for(let c=0; c<GRIDS; c++){
				line += (this._mtx[r][c]==null)?"  ":this._mtx[r][c].type+" ";
			}
			str += line + "|\n";
		}
		str += bar;
		console.log(str);
	}

	touchTiles(tX, tY){
		// Search
		this._chains = [];
		for(let r=0; r<GRIDS; r++){
			for(let c=0; c<GRIDS; c++){
				let tile = this._mtx[r][c];
				if(tile == null) continue;
				if(tile.isInside(tX, tY)){
					this.searchTiles(tile);
				}
			}
		}
		// Remove
		if(this._chains.length < 2) return;
		for(let tile of this._chains){
			this._mtx[tile.r][tile.c] = null;// Remove
		}
		this.compressV();// Compress
		this.compressH();// Compress
		this.checkMtx(); // Check
	}

	searchTiles(tile){
		this._chains.push(tile);// Push
		this.traseTile(tile, 0, 1);
		this.traseTile(tile, 0,-1);
		this.traseTile(tile, 1, 0);
		this.traseTile(tile,-1, 0);
	}

	isExists(tile){
		for(let target of this._chains){
			if(tile.r != target.r) continue;
			if(tile.c != target.c) continue;
			return true;
		}
		return false;
	}

	traseTile(tile, oR, oC){
		if(tile.r+oR < 0) return;
		if(tile.c+oC < 0) return;
		if(GRIDS-1 < tile.r+oR) return;
		if(GRIDS-1 < tile.c+oC) return;
		let target = this._mtx[tile.r+oR][tile.c+oC];
		if(target == null) return;
		if(tile.type != target.type) return;
		if(this.isExists(target)) return;
		this.searchTiles(target);
	}
}

class Tile{

	constructor(r, c, x, y, type){
		this.setParams(r, c, x, y);
		this._type = type;
	}

	setParams(r, c, x, y){
		this._r = r;
		this._c = c;
		this._x = x;
		this._y = y;
	}

	isInside(tX, tY){
		if(tX < this._x) return false;
		if(tY < this._y) return false;
		if(this._x+tSize < tX) return false;
		if(this._y+tSize < tY) return false;
		return true;
	}

	get r(){return this._r;}
	get c(){return this._c;}
	get x(){return this._x;}
	get y(){return this._y;}
	get type(){return this._type;}
}
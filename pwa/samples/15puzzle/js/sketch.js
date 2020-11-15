"use strict";
//==========
// JavaScript

const T_COLOR = [
	"#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673Ab7", "#3F51B5", 
	"#2196F3", "#03A9f4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", 
	"#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];
const F_COLOR = [
	"#333", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", 
	"#333", "#333", "#333", "#FFF", "#FFF", "#FFF", 
	"#333", "#333", "#333", "#333", "#FFF", "#FFF"];

let fMng, sX, sY, tiles;
let yukkuri;

function preload(){
	let rdm = Math.random() * 2;
	if(rdm < 1){
		yukkuri = loadImage("./images/y_reimu.png");
	}else{
		yukkuri = loadImage("./images/y_marisa.png");
	}
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(32);
	showMsg("setup");

	let pad = 32;
	let size = 30;
	if(width < height){
		pad = width / 5;
		size = pad * 0.95;
	}else{
		pad = height / 5;
		size = pad * 0.95;
	}
	let corner = size * 0.1;

	// 15Puzzle
	fMng = new FpzManager();
	fMng.consoleBoard();

	sX = width / 2 - pad * fMng.getGrids() / 2;
	sY = height / 2 - pad * fMng.getGrids() / 2;

	// Tiles
	tiles = [];
	let board = fMng.getBoard();
	for(let r=0; r<fMng.getGrids(); r++){
		for(let c=0; c<fMng.getGrids(); c++){
			tiles.push(new Tile(board[r][c], r, c, pad, size, corner));
		}
	}
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);
	for(let tile of tiles) tile.draw();
}

function mousePressed(){
	for(let tile of tiles){
		if(tile.contains(mouseX, mouseY)){
			let target = fMng.checkVH(tile.r, tile.c);
			if(target.r < 0 || target.c < 0) return;
			fMng.pushHistory(tile.r, tile.c, target.r, target.c);
			swapTiles(tile.r, tile.c, target.r, target.c);
			return;
		}
	}
	if(mouseX < 50 && mouseY < 50) autoMove();// Auto
}

function autoMove(){
	let history = fMng.popHistory();
	if(!history) return;
	fMng.swapGrid(history.tR, history.tC, history.fR, history.fC);
	swapTiles(history.tR, history.tC, history.fR, history.fC);
	setTimeout(autoMove, 100);
}

function swapTiles(fR, fC, tR, tC){
	let f = fR * fMng.getGrids() + fC;
	let t = tR * fMng.getGrids() + tC;
	tiles[f].change(tR, tC);
	tiles[t].change(fR, fC);
	let tmp = tiles[t];
	tiles[t] = tiles[f];
	tiles[f] = tmp;
	showMsg("Swap:" + tiles[t].num);
	fMng.consoleBoard();
}

class Tile{

	constructor(num, r, c, pad, size, corner){
		this._num    = num;
		this._r      = r;
		this._c      = c;
		this._pad    = pad;
		this._size   = size;
		this._corner = corner;

		this._x   = sX + pad * c;
		this._y   = sY + pad * r;
		this._dX  = this._x;
		this._dY  = this._y;
	}

	get num(){return this._num;}
	get r(){return this._r;}
	get c(){return this._c;}

	set num(n){this._num = n;}
	set r(n){this._r = r;}
	set c(n){this._c = c;}

	change(r, c){
		this._r = r;
		this._c = c;
		this._dX = sX + this._pad * c;
		this._dY = sY + this._pad * r;
	}

	contains(x, y){
		if(x < this._x) return false;
		if(y < this._y) return false;
		if(this._x + this._size < x) return false;
		if(this._y + this._size < y) return false;
		return true;
	}

	draw(){
		// Move
		if(this.calcDistance() < 4){
			this._x = this._dX;
			this._y = this._dY;
		}else{
			this._x += (this._dX - this._x) / 2;
			this._y += (this._dY - this._y) / 2;
		}
		if(this._num != 0){
			let i = Math.floor(this._num%T_COLOR.length);
			// Background
			noStroke(); fill(T_COLOR[i]);
			square(this._x, this._y, this._size, this._size, this._corner);
			// Font
			fill(F_COLOR[i]); textSize(this._size*0.5); textAlign(CENTER);
			text(this._num, this._x+this._size/2, this._y+this._size*0.7);
		}else{
			image(yukkuri, this._x, this._y, this._size, this._size);
		}
	}

	calcDistance(){
		let x = this._dX - this._x;
		let y = this._dY - this._y;
		return x*x+y*y;
	}
}
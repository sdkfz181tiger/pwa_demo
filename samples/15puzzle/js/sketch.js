"use strict";
//==========
// JavaScript

const T_COLOR = [
	"#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", 
	"#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", 
	"#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];
const F_COLOR = [
	"#333", "#fff", "#fff", "#fff", "#fff", "#fff", 
	"#333", "#333", "#333", "#fff", "#fff", "#fff", 
	"#333", "#333", "#333", "#333", "#fff", "#fff"];

let fMng;
let tPadding, tSize, tCorner, tGrids;
let fontSize, sX, sY, tiles;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(32);
	showMsg("setup");

	// 15Puzzle
	fMng = new FpzManager();
	fMng.consoleBoard();

	if(width < height){
		tPadding = width / 5;
		tSize = tPadding * 0.95;
	}else{
		tPadding = height / 5;
		tSize = tPadding * 0.95;
	}

	tCorner = tSize * 0.1;
	tGrids  = fMng.getGrids();
	fontSize = tSize * 0.5;

	sX = width / 2 - tPadding * tGrids / 2;
	sY = height / 2 - tPadding * tGrids / 2;

	// Tiles
	tiles = [];
	let board = fMng.getBoard();
	for(let r=0; r<tGrids; r++){
		for(let c=0; c<tGrids; c++){
			tiles.push(new Tile(board[r][c], r, c));
		}
	}
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);
	square(sX, sY, tPadding*tGrids, tPadding*tGrids, tCorner);
	for(let tile of tiles) tile.draw();
}

function mousePressed(){
	for(let tile of tiles){
		if(tile.contains(mouseX, mouseY)){
			let target = fMng.checkVH(tile.r, tile.c);
			if(target.r < 0 || target.c < 0) return;
			swapTiles(tile.r, tile.c, target.r, target.c);
			return;
		}
	}
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

	constructor(num, r, c){
		this._num = num;
		this._r   = r;
		this._c   = c;
		this._x   = sX + tPadding * c;
		this._y   = sY + tPadding * r;
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
		this._dX = sX + tPadding * c;
		this._dY = sY + tPadding * r;
	}

	contains(x, y){
		if(x < this._x) return false;
		if(y < this._y) return false;
		if(this._x + tSize < x) return false;
		if(this._y + tSize < y) return false;
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
		if(this._num == 0) return;
		let i = Math.floor(this._num%T_COLOR.length);
		// Background
		noStroke(); fill(T_COLOR[i]);
		square(this._x, this._y, tSize, tSize, tCorner);
		// Font
		fill(F_COLOR[i]); textSize(fontSize); textAlign(CENTER);
		text(this._num, this._x+tSize/2, this._y+tSize-fontSize*0.6);
	}

	calcDistance(){
		let x = this._dX - this._x;
		let y = this._dY - this._y;
		return x*x+y*y;
	}
}
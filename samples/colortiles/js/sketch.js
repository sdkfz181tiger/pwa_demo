"use strict";
//==========
// JavaScript

const T_COLOR = [
	"#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", 
	"#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", 
	"#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];

let grids, tiles;
let pad, size, corner, sX, sY;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(32);
	showMsg("setup");

	grids = 1;
	tiles = [];
	replaceTiles();
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);
	for(let tile of tiles) tile.draw();
}

function mousePressed(){
	for(let tile of tiles){
		if(tile.contains(mouseX, mouseY)){
			console.log("Tap!!");
			replaceTiles();
			return;
		}
	}
}

function replaceTiles(){
	// Clear
	for(let i=tiles.length-1; 0<=i; i--) tiles.splice(i, 1);
	// Replace
	grids++;
	pad = 32;
	size = 30;
	if(width < height){
		pad = width / (grids+1);
		size = pad * 0.95;
	}else{
		pad = height / (grids+1);
		size = pad * 0.95;
	}
	corner = size * 0.1;
	sX = width / 2 - pad * grids / 2;
	sY = height / 2 - pad * grids / 2;
	// Tiles
	tiles = [];
	for(let r=0; r<grids; r++){
		for(let c=0; c<grids; c++){
			tiles.push(new Tile(r, c));
		}
	}
}

class Tile{

	constructor(r, c){
		this._r   = r;
		this._c   = c;
		this._x   = sX + pad * c;
		this._y   = sY + pad * r;
		this._dX  = this._x;
		this._dY  = this._y;
	}

	get r(){return this._r;}
	get c(){return this._c;}

	set r(n){this._r = r;}
	set c(n){this._c = c;}

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
		let i = Math.floor(grids%T_COLOR.length);
		// Background
		noStroke(); fill(T_COLOR[i]);
		square(this._x, this._y, size, size, corner);
	}

	calcDistance(){
		let x = this._dX - this._x;
		let y = this._dY - this._y;
		return x*x+y*y;
	}
}
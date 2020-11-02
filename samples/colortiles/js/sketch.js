"use strict";
//==========
// JavaScript

const T_COLOR = [
	"#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673Ab7", "#3F51B5", 
	"#2196F3", "#03A9f4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", 
	"#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];

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
	// Tiles, Color
	tiles = [];
	let colCorrect = T_COLOR[Math.floor(grids%T_COLOR.length)];
	let colIncorrect = getOtherColor(colCorrect);
	showMsg("o:" + colCorrect + " <-> " + "x:" + colIncorrect);
	let i = Math.floor(Math.random()*grids**2);
	for(let r=0; r<grids; r++){
		for(let c=0; c<grids; c++){
			if(r*grids+c == i){
				tiles.push(new Tile(colCorrect, true, r, c));
			}else{
				tiles.push(new Tile(colIncorrect, false, r, c));
			}
		}
	}
}

function getOtherColor(color){
	let rdm = Math.floor(60-Math.random()*120);
	let rgb = new RGBColor(color);
	rgb.r += rdm;
	rgb.g += rdm;
	rgb.b += rdm;
	if(rgb.r < 0)   rgb.r = 0;
	if(255 < rgb.r) rgb.r = 255;
	if(rgb.g < 0)   rgb.g = 0;
	if(255 < rgb.g) rgb.g = 255;
	if(rgb.b < 0)   rgb.b = 0;
	if(255 < rgb.b) rgb.b = 255;
	return rgb.toHex();
}

class Tile{

	constructor(color, correct, r, c){
		this._color = color;
		this._correct = correct;
		this._r  = r;
		this._c  = c;
		this._x  = sX + pad * c;
		this._y  = sY + pad * r;
		this._dX = this._x;
		this._dY = this._y;
	}

	get r(){return this._r;}
	get c(){return this._c;}

	set r(n){this._r = r;}
	set c(n){this._c = c;}

	contains(x, y){
		if(!this._correct) return false;
		if(x < this._x) return false;
		if(y < this._y) return false;
		if(this._x + size < x) return false;
		if(this._y + size < y) return false;
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
		// Background
		noStroke(); fill(this._color);
		square(this._x, this._y, size, size, corner);
	}

	calcDistance(){
		let x = this._dX - this._x;
		let y = this._dY - this._y;
		return x*x+y*y;
	}
}
"use strict";
//==========
// JavaScript

const T_COLOR = [
	"#FFFFFF", "#F9C74F", "#90BE6D", "#F9844A", "#43AA8B", 
	"#F8961E", "#4D908E", "#F3722C", "#577590", "#F94144", "#277DA1"];
const F_COLOR = [
	"#333333", "#333333", "#333333", "#333333", "#333333",
	"#333333", "#333333", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];

const T_GRIDS  = 4;

let tilePadding, tileSize, tileCorner, tiles;
let fontSize, sX, sY;
let lockFlg;
let fMng, hm;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(32);

	if(width < height){
		tilePadding = width / 5;
		tileSize = tilePadding * 0.95;
	}else{
		tilePadding = height / 5;
		tileSize = tilePadding * 0.95;
	}

	tileCorner = tileSize * 0.1;
	fontSize = tileSize * 0.5;

	sX = width / 2 - tilePadding * T_GRIDS / 2;
	sY = height / 2 - tilePadding * T_GRIDS / 2;
	lockFlg = false;

	// 15Puzzle
	fMng = new FpzManager();
	fMng.consoleBoard();

	// Hammer
	let options = {recognizers: [
		[Hammer.Pan, {direction: Hammer.DIRECTION_ALL, threshold:tileSize*0.5}]
	]};
	hm = new Hammer(document.body, options);
	hm.on("panleft panright panup pandown", (e)=>{
		// if(e.type == "panleft")  actionLeft();
		// if(e.type == "panright") actionRight();
		// if(e.type == "panup")    actionUp();
		// if(e.type == "pandown")  actionDown();
		hm.stop();// Stop
	});
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);
	square(sX, sY, tilePadding*T_GRIDS, tilePadding*T_GRIDS, tileCorner);
	for(let r=0; r<T_GRIDS; r++){
		for(let c=0; c<T_GRIDS; c++){
			//if(tiles[r][c]) tiles[r][c].draw();
		}
	}
}

class Tile{

	constructor(n, x, y){
		this._n = n;
		this._x = x;
		this._y = y;
		this._dX = x;
		this._dY = y;
	}

	setNum(n){
		this._n = n;
	}

	moveTo(gR, gC){
		this._dX = this._x + gC * tilePadding;
		this._dY = this._y + gR * tilePadding;
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
		if(this._n == 0) return;
		let i = Math.log2(this._n)%T_COLOR.length;
		// Background
		noStroke(); fill(T_COLOR[i]);
		square(this._x, this._y, tileSize, tileSize, tileCorner);
		// Font
		fill(F_COLOR[i]); textSize(fontSize); textAlign(CENTER);
		text(this._n, this._x+tileSize/2, this._y+tileSize-fontSize*0.6);
	}

	calcDistance(){
		let x = this._dX - this._x;
		let y = this._dY - this._y;
		return x*x+y*y;
	}
}
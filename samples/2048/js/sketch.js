"use strict";
//==========
// JavaScript

const T_COLOR = ["#233D4D", "#FE7F2D", "#FCCA46", "#A1C181", "#619B8A"];
const F_COLOR = ["#CCCCCC", "#333333", "#333333", "#333333", "#333333"];

const T_GRIDS  = 4;

let tilePadding, tileSize, tileCorner, tiles;
let fontSize, sX, sY;
let lockFlg;
let tMng, hm;

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

	// 2048
	tMng = new TzfeManager();
	tMng.randomPut();
	tMng.randomPut();
	tMng.consoleBoard();

	// Hammer
	let options = {recognizers: [
		[Hammer.Pan, {direction: Hammer.DIRECTION_ALL, threshold:tileSize*0.5}]
	]};
	hm = new Hammer(document.body, options);
	hm.on("panleft", (e)=>{
		hm.stop();
		actionLeft();
	});
	hm.on("panright", (e)=>{
		hm.stop();
		actionRight();
	});
	hm.on("panup", (e)=>{
		hm.stop();
		actionUp();
	});
	hm.on("pandown", (e)=>{
		hm.stop();
		actionDown();
	});

	// Reflesh
	this.refleshBoard();
}

function draw(){
	background(0, 0, 0);
	noStroke(); fill(33, 33, 33);
	square(sX, sY, tilePadding*T_GRIDS, tilePadding*T_GRIDS, tileCorner);
	for(let r=0; r<T_GRIDS; r++){
		for(let c=0; c<T_GRIDS; c++){
			if(tiles[r][c]) tiles[r][c].draw();
		}
	}
}

function keyPressed(){
	if(key == "ArrowLeft") actionLeft();
	if(key == "ArrowRight") actionRight();
	if(key == "ArrowUp") actionUp();
	if(key == "ArrowDown") actionDown();
}

function actionLeft(){
	if(lockFlg) return;
	if(!tMng.slideLeft()) return;
	lockFlg = true;
	tMng.consoleBoard();
	updateBoard();
}

function actionRight(){
	if(lockFlg) return;
	if(!tMng.slideRight()) return;
	lockFlg = true;
	tMng.consoleBoard();
	updateBoard();
}

function actionUp(){
	if(lockFlg) return;
	if(!tMng.slideUp()) return;
	lockFlg = true;
	tMng.consoleBoard();
	updateBoard();
}

function actionDown(){
	if(lockFlg) return;
	if(!tMng.slideDown()) return;
	lockFlg = true;
	tMng.consoleBoard();
	updateBoard();
}

function refleshBoard(){
	lockFlg = false;
	let board = tMng.getBoard();
	tiles = [];
	for(let r=0; r<T_GRIDS; r++){
		let line = [];
		for(let c=0; c<T_GRIDS; c++){
			let n = board[r][c];
			let x = sX + tilePadding * c;
			let y = sY + tilePadding * r;
			if(n != 0){
				line.push(new Tile(n, x, y));
			}else{
				line.push(null);
			}
		}
		tiles.push(line);
	}
}

function updateBoard(){
	// Move
	for(let r=0; r<T_GRIDS; r++){
		for(let c=0; c<T_GRIDS; c++){
			let move = tMng.getMove(r, c);
			if(move == null) continue;
			tiles[r][c].moveTo(move.gR, move.gC);
		}
	}
	// Reflesh
	setTimeout(()=>{
		tMng.randomPut();
		refleshBoard();
	}, 250);
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
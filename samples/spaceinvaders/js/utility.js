"use strict";
//==========
// Show message
function showMsg(msg){
	console.log(msg);
	let li = $("<li>").text(msg);
	$("#msg_area").prepend(li);
}

//==========
// FpzManager

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

let seed = "";
for(let i=0; i<40; i++) seed += "1";
const MAX = parseInt(seed, 2);
const INV_ROWS = 1;
const INV_COLS = 1;
const INV_PAD  = 32;

const COLORS = [
	"#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673Ab7", "#3F51B5", 
	"#2196F3", "#03A9f4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", 
	"#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];

class Invader{

	constructor(x, y, num){
		this._x = x; this._y = y;
		this._str   = num.toString(2);
		this._color = COLORS[num%COLORS.length];
		this._size  = 10;

		console.log(this._str);

		// Pattern
		if(this._str.length < 40){
			let total  = 40 - this._str.length;
			let prefix = "";
			for(let i=0; i<total; i++) prefix += "0";
			this._str = prefix + this._str;
		}
	}

	draw(){

		fill("#FFFFFF");
		rect(this._x, this._y, 5, 5);

		stroke(this._color);
		fill(this._color);

		// Body
		for(let i=0; i<this._str.length; i++){
			if(this._str[i] === "1"){
				let odd = i % 4;
				let lX = this._x + this._size * odd;
				let lY = this._y + this._size * Math.floor(i/4);
				square(lX, lY, this._size);
				let rX = this._x - this._size * (odd-9);
				let rY = lY
				square(rX, rY, this._size);
			}
		}
	}

	setPosition(x, y){
		this._x = x; this._y = y;
	}
}
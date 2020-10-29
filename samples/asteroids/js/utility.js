"use strict";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

let TBL_COS = [];
let TBL_SIN = [];
for(let i=0; i<360; i++){
	TBL_SIN.push(Math.sin(i*DEG_TO_RAD));
	TBL_COS.push(Math.cos(i*DEG_TO_RAD));
}

// Show message
function showMsg(msg){
	console.log(msg);
	let li = $("<li>").text(msg);
	$("#msg_area").prepend(li);
}

//==========
// Ship

class Ship{

	constructor(ctx, x, y, r){
		this._ctx = ctx;
		this._x   = x;
		this._y   = y;
		this._r   = r;
		this._deg = 270;
		this._spd = 0;
		this._vX  = 0;
		this._vY  = 0;
	}

	setSpeed(deg, spd){
		this._deg = Math.floor(deg);
		this._spd = Math.floor(spd);
	}

	turnLeft(){
		this._deg -= 8;
		if(this._deg < 0) this._deg += 360;
	}

	turnRight(){
		this._deg += 8;
		if(360 <= this._deg) this._deg -= 360;
	}

	thrust(spd){
		this._spd = spd;
	}

	shot(){

	}

	draw(){
		this._spd *= 0.9;
		this._x += this._spd * TBL_COS[this._deg];
		this._y += this._spd * TBL_SIN[this._deg];
		let aD = Math.floor(this._deg) % 360;
		let bD = Math.floor(this._deg+150) % 360;
		let cD = Math.floor(this._deg+210) % 360;
		let aX = this._x+this._r*TBL_COS[aD];
		let aY = this._y+this._r*TBL_SIN[aD];
		let bX = this._x+this._r*TBL_COS[bD];
		let bY = this._y+this._r*TBL_SIN[bD];
		let cX = this._x+this._r*TBL_COS[cD];
		let cY = this._y+this._r*TBL_SIN[cD];
		this._ctx.beginPath();
		this._ctx.moveTo(aX, aY);
		this._ctx.lineTo(bX, bY);
		this._ctx.lineTo(cX, cY);
		this._ctx.closePath();
		this._ctx.stroke();
	}
}
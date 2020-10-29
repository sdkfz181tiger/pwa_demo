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
		this._trn = 0;
	}

	get x(){return this._x;}
	get y(){return this._y;}
	get deg(){return this._deg;}
	set x(n){this._x = n;}
	set y(n){this._y = n;}
	set deg(n){this._deg = n;}

	setSpeed(deg, spd){
		this._deg = Math.floor(deg);
		this._spd = Math.floor(spd);
	}

	turnLeft(){this._trn = -10;}
	turnRight(){this._trn = 10;}
	turnStop(){this._trn = 0;}
	thrust(spd){this._spd = spd;}

	draw(){
		// Speed
		this._spd *= 0.99;
		if(1 < this._spd){
			this._x += this._spd * TBL_COS[this._deg];
			this._y += this._spd * TBL_SIN[this._deg];
		}else{
			this._spd = 0;
		}
		// Turn
		if(this._trn != 0){
			this._deg += this._trn;
			if(this._deg < 0) this._deg += 360;
			if(360 <= this._deg) this._deg -= 360;
		}
		// Shape
		let aD = Math.floor(this._deg) % 360;
		let bD = Math.floor(this._deg+150) % 360;
		let cD = Math.floor(this._deg+180) % 360;
		let dD = Math.floor(this._deg+210) % 360;
		let aX = this._x+this._r*TBL_COS[aD];
		let aY = this._y+this._r*TBL_SIN[aD];
		let bX = this._x+this._r*TBL_COS[bD];
		let bY = this._y+this._r*TBL_SIN[bD];
		let cX = this._x+this._r*TBL_COS[cD]*0.5;
		let cY = this._y+this._r*TBL_SIN[cD]*0.5;
		let dX = this._x+this._r*TBL_COS[dD];
		let dY = this._y+this._r*TBL_SIN[dD];
		this._ctx.beginPath();
		this._ctx.moveTo(aX, aY);
		this._ctx.lineTo(bX, bY);
		this._ctx.lineTo(cX, cY);
		this._ctx.lineTo(dX, dY);
		this._ctx.closePath();
		this._ctx.stroke();
	}
}

class Bullet{

	constructor(ctx, x, y, r, deg, spd){
		this._ctx = ctx;
		this._x   = x;
		this._y   = y;
		this._r   = r;
		this._deg = Math.floor(deg);
		this._spd = Math.floor(spd);
	}
	
	get x(){return this._x;}
	get y(){return this._y;}

	draw(){
		this._x += this._spd * TBL_COS[this._deg];
		this._y += this._spd * TBL_SIN[this._deg];
		this._ctx.beginPath();
		this._ctx.rect(
			this._x-this._r*0.5, this._y-this._r*0.5, 
			this._r, this._r);
		this._ctx.closePath();
		this._ctx.stroke();
	}
}

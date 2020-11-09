"use strict";
//==========
// Show message
function showMsg(msg){
	console.log(msg);
	let li = $("<li>").text(msg);
	$("#msg_area").prepend(li);
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

let TBL_COS = [];
let TBL_SIN = [];
for(let i=0; i<360; i++){
	TBL_SIN.push(Math.sin(i*DEG_TO_RAD));
	TBL_COS.push(Math.cos(i*DEG_TO_RAD));
}

//==========
// Flappy

class Flappy{

	constructor(ctx, x, y, size=8, color="#FFFFFF"){
		this._ctx     = ctx;
		this._pos     = new Vec2(x, y);
		this._vel     = new Vec2(0, 0);
		this._size    = size;
		this._color   = color;
		this._gravity = 1.2;
		this._forceY  = -18.0;
	}

	get x(){return this._pos.x;}
	get y(){return this._pos.y;}
	set x(n){this._pos.x = n;}
	set y(n){this._pos.y = n;}

	jump(e){
		if(this._pos.x < e.center.x) this._vel.x = 4;
		if(e.center.x < this._pos.x) this._vel.x = -4;
		this._vel.y = this._forceY;
	}

	bounceWalls(l, r, t, b){
		if(this._pos.x < l){
			this._pos.x = r;
			return;
		}
		if(r < this._pos.x){
			this._pos.x = l;
			return;
		}
		if(b < this._pos.y){
			this._pos.y = b;
			this._vel.x *= 0.8;
			this._vel.y *= -0.8;
			if(Math.abs(this._vel.x) < 0.2) this._vel.x = 0.0;
			if(Math.abs(this._vel.y) < 1) this._vel.y = 0.0;
			return;
		}
	}

	draw(){
		// Velocity
		this._vel.y += this._gravity;
		this._pos.x += this._vel.x;
		this._pos.y += this._vel.y;
		// Draw
		this._ctx.beginPath();
		this._ctx.rect(
			this.x-this._size*0.5,
			this.y-this._size*0.5,
			this._size, this._size);
		this._ctx.closePath();
		this._ctx.stroke();
	}
}

/*
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

	turnLeft(){this._trn = -2;}
	turnRight(){this._trn = 2;}
	turnStop(){this._trn = 0;}
	thrust(spd){this._spd = spd;}
	break(){
		this._trn = 0;
		this._spd = 0;
	}

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

//==========
// Asteroid

class Asteroid{

	constructor(ctx, x, y, r){
		this._ctx = ctx;
		this._x   = x;
		this._y   = y;
		this._r   = r;
		this._rot = 0;

		let spd = 1 + Math.random() * 3;
		let deg = Math.floor(Math.random() * 360);
		this._vX = spd * TBL_COS[deg];
		this._vY = spd * TBL_SIN[deg];

		this._rads = [];
		for(let i=0; i<6; i++){
			let rdm = 0.7+Math.random()*0.3;
			this._rads.push(this._r*rdm);
		}
	}

	get x(){return this._x;}
	get y(){return this._y;}
	get r(){return this._r;}
	set x(n){this._x = n;}
	set y(n){this._y = n;}

	draw(){
		this._x += this._vX;
		this._y += this._vY;

		this._rot += 1;
		if(360 <= this._rot) this._rot -= 360;
		let pD = Math.floor(360/this._rads.length);
		let aX = this._x + this._rads[0]*TBL_COS[this._rot];
		let aY = this._y + this._rads[0]*TBL_SIN[this._rot];
		this._ctx.beginPath();
		this._ctx.moveTo(aX, aY);
		for(let i=1; i<this._rads.length; i++){
			let bD = Math.floor(this._rot + pD*i) % 360;
			let bX = this._x + this._rads[i]*TBL_COS[bD];
			let bY = this._y + this._rads[i]*TBL_SIN[bD];
			this._ctx.lineTo(bX, bY);
		}
		this._ctx.closePath();
		this._ctx.stroke();
	}

	contains(x, y){
		let pD = Math.floor(360/this._rads.length);
		for(let i=0; i<this._rads.length-1; i++){
			let aD = Math.floor(this._rot + pD*i) % 360;
			let bD = Math.floor(this._rot + pD*(i+1)) % 360;
			let aX = this._x + this._rads[i]*TBL_COS[aD];
			let aY = this._y + this._rads[i]*TBL_SIN[aD];
			let bX = this._x + this._rads[i+1]*TBL_COS[bD];
			let bY = this._y + this._rads[i+1]*TBL_SIN[bD];
			if(!isRight(aX, aY, bX, bY, x, y)) return false;
		}
		return true;
	}
}

//==========
// Bullet

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
*/

//==========
// Vector

class Vec2{

	constructor(x, y){
		this._x = x; 
		this._y = y;
	}

	get x(){return this._x;}
	get y(){return this._y;}
	set x(n){this._x = n;}
	set y(n){this._y = n;}
}

function isRight(fromX, fromY, toX, toY, pX, pY){
	let c = {x:fromX, y:fromY};
	let v = {x:toX-fromX, y:toY-fromY};
	let u = calcVerticalR(v);
	let p = {x:pX-fromX, y:pY-fromY};
	let dot = calcDot(u, p);
	let cos = dot / (calcLength(u) * calcLength(p));
	if(0 < cos) return true;
	return false;
}

function calcVerticalL(v){return {x:v.y, y:v.x*-1.0};}
function calcVerticalR(v){return {x:v.y*-1.0, y:v.x};}
function calcDot(v1, v2){return v1.x*v2.x+v1.y*v2.y;}
function calcLength(v){return Math.sqrt(v.x*v.x+v.y*v.y);}
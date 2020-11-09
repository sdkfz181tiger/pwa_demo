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
	get vX(){return this._vel.x;}
	get vY(){return this._vel.y;}
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
		if(b < this._pos.y + this._size*0.5){
			this._pos.y = b - this._size*0.5;
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

//==========
// Asteroid

class Asteroid{

	constructor(ctx, x, y, r){
		this._ctx = ctx;
		this._x   = x;
		this._y   = y;
		this._r   = r;
		this._rot = Math.random() * 360;

		let spd = 1 + Math.random() * 3;
		let deg = Math.floor(Math.random() * 360);
		this._vX = spd * TBL_COS[deg];
		this._vY = spd * TBL_SIN[deg];

		this._rads = [];
		for(let i=0; i<3; i++){
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
		//this._x += this._vX;
		//this._y += this._vY;
		//this._rot += 1;
		//if(360 <= this._rot) this._rot -= 360;

		let pD = Math.floor(360/this._rads.length);
		this._ctx.beginPath();
		for(let i=0; i<this._rads.length; i++){
			let aD = Math.floor(this._rot + pD*i) % 360;
			let aX = this._x + this._rads[i]*TBL_COS[aD];
			let aY = this._y + this._rads[i]*TBL_SIN[aD];
			this._ctx.lineTo(aX, aY);
		}
		this._ctx.closePath();
		this._ctx.stroke();
	}

	contains(x, y){
		let pD = Math.floor(360/this._rads.length);
		for(let i=0; i<this._rads.length; i++){
			let n = (i < this._rads.length-1) ? i+1 : 0;
			let aD = Math.floor(this._rot + pD*i) % 360;
			let bD = Math.floor(this._rot + pD*n) % 360;
			let aX = this._x + this._rads[i]*TBL_COS[aD];
			let aY = this._y + this._rads[i]*TBL_SIN[aD];
			let bX = this._x + this._rads[n]*TBL_COS[bD];
			let bY = this._y + this._rads[n]*TBL_SIN[bD];
			if(!isRight(aX, aY, bX, bY, x, y)) return false;
		}
		return true;
	}

	detectCross(ball){
		let preX = ball.x - ball.vX;
		let preY = ball.y - ball.vY;

		let pD = Math.floor(360/this._rads.length);
		for(let i=0; i<this._rads.length; i++){
			let n = (i < this._rads.length-1) ? i+1 : 0;
			let aD = Math.floor(this._rot + pD*i) % 360;
			let bD = Math.floor(this._rot + pD*n) % 360;
			let aX = this._x + this._rads[i]*TBL_COS[aD];
			let aY = this._y + this._rads[i]*TBL_SIN[aD];
			let bX = this._x + this._rads[n]*TBL_COS[bD];
			let bY = this._y + this._rads[n]*TBL_SIN[bD];
			if(checkCross(aX, aY, bX, bY, preX, preY, ball.x, ball.y)){
				calcCross(aX, aY, bX, bY, preX, preY, ball.x, ball.y);
				return true;
			}
		}
		return false;
	}
}

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

	get magnitude(){
		let mag = Math.sqrt(this._x**2+this._y**2);
		return mag;
	}

	get normalize(){
		let mag = this.magnitude;
		return new Vec2(this._x/mag, this._y/mag);
	}

	add(v){
		this._x += v.x;
		this._y += v.y;
		return this;
	}

	sub(v){
		this._x -= v.x;
		this._y -= v.y;
		return this;
	}

	times(n){
		this.x *= n;
		this.y *= n;
		return this;
	}

	dot(v){
		return this._x * v.x + this._y * v.y;
	}

	cross(v){
		return this._x * v.y - this._y * v.x;
	}
}

function isRight(fromX, fromY, toX, toY, pX, pY){
	let v = new Vec2(toX-fromX, toY-fromY);
	let u = new Vec2(v.y*-1.0, v.x);
	let p = new Vec2(pX-fromX, pY-fromY);
	let dot = u.dot(p);
	let cos = dot / (u.magnitude * p.magnitude);
	if(0 < cos) return true;
	return false;
}

function calcDistance(v1, v2){
	return Math.sqrt((v2.x-v1.x)**2 + (v2.y-v1.y)**2);
}

function checkCross(aX, aY, bX, bY, cX, cY, dX, dY){
	let a = (cX-dX)*(aY-cY)+(cY-dY)*(cX-aX);
	let b = (cX-dX)*(bY-cY)+(cY-dY)*(cX-bX);
	let c = (aX-bX)*(cY-aY)+(aY-bY)*(aX-cX);
	let d = (aX-bX)*(dY-aY)+(aY-bY)*(aX-dX);
	return a*b<0 && c*d<0;
}

function calcCross(aX, aY, bX, bY, cX, cY, dX, dY){
	let dev = (bY-aY)*(dX-cX)-(bX-aX)*(dY-cY);
	let d1  = cY*dX-cX*dY;
	let d2  = aY*bX-aX*bY;
	let x   = (d1*(bX-aX)-d2*(dX-cX)) / dev;
	let y   = (d1*(bY-aY)-d2*(dY-cY)) / dev;
	let col = new Vec2(x, y);
	circle(col.x, col.y, 2);

	let dist  = Math.sqrt((col.x-dX)**2 + (col.y-dY)**2);
	console.log(dist);
	let wFrom = new Vec2(aX, aY);
	let wTo   = new Vec2(bX, bY);
	let vFrom = new Vec2(cX, cY);
	let vTo   = new Vec2(dX, dY);

	let vWall = new Vec2(wTo.x-wFrom.x, wTo.y-wFrom.y);
	let radW  = Math.atan2(vWall.y, vWall.x);

	let uWall = new Vec2(vWall.y, vWall.x*-1.0);
	let radU  = Math.atan2(uWall.y, uWall.x);

	let vRay  = new Vec2(vFrom.x-col.x, vFrom.y-col.y);
	let radR  = Math.atan2(vRay.y, vRay.x);

	let radT = radR + (radU-radR)*2;
	let tX = col.x + dist * Math.cos(radT);
	let tY = col.y + dist * Math.sin(radT);
	line(col.x, col.y, tX, tY);
	circle(tX, tY, 2);

}
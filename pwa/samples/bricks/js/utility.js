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

let TBL_COS = [];
let TBL_SIN = [];
for(let i=0; i<360; i++){
	TBL_SIN.push(Math.sin(i*DEG_TO_RAD));
	TBL_COS.push(Math.cos(i*DEG_TO_RAD));
}

const REF_H = 180;
const REF_V = 90;

const RAINBOW = [
	"#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673Ab7", "#3F51B5", 
	"#2196F3", "#03A9f4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", 
	"#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];

const COLORS = [
	"#111111", "#222222", "#333333", "#444444", "#555555", "#666666", 
	"#777777", "#888888", "#999999", "#999999", "#AAAAAA", "#BBBBBB", 
	"#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"];

class Ball{

	constructor(x, y, size=8, color="#FFFFFF"){
		this._pos   = new Vec2(x, y);
		this._vel   = new Vec2(0, 0);
		this._size  = size;
		this._color = color;
		this._ref   = null;
	}

	get x(){return this._pos.x;}
	get y(){return this._pos.y;}
	get vX(){return this._vel.x;}
	get vY(){return this._vel.y;}
	set x(n){this._pos.x = n;}
	set y(n){this._pos.y = n;}

	setSpeed(speed, deg){
		let rad = DEG_TO_RAD * deg;
		let x = speed * Math.cos(rad);
		let y = speed * Math.sin(rad);
		this._vel.x = x;
		this._vel.y = y;
	}

	bounceWalls(l, r, t, b){
		if(this._pos.x < l){
			this._pos.x = l;
			this._vel.x *= -1;
			return;
		}
		if(r < this._pos.x){
			this._pos.x = r;
			this._vel.x *= -1;
			return;
		}
		if(this._pos.y < t){
			this._pos.y = t;
			this._vel.y *= -1;
			return;
		}
		if(b < this._pos.y){
			this._pos.y = b;
			this._vel.y *= -1;
			return;
		}
	}

	bounce(){
		if(this._ref == null) return false;
		if(this._ref == REF_H) this._vel.x *= -1;
		if(this._ref == REF_V) this._vel.y *= -1;
		this._ref = null;// Reset
		return true;
	}

	reflect(x, y, rad){
		this._pos.x = x;
		this._pos.y = y;
		let mag = this._vel.magnitude;
		this._vel.x = mag * Math.cos(rad);
		this._vel.y = mag * Math.sin(rad);
	}

	draw(){
		this._pos.x += this._vel.x;
		this._pos.y += this._vel.y;
		fill(this._color);
		circle(this._pos.x, this._pos.y, this._size);
	}
}

class Paddle{

	constructor(x, y, w, h, color="#FFFFFF"){
		this._x     = x;
		this._y     = y;
		this._w     = w;
		this._h     = h;
		this._color = color;
		this._tX    = x;
		this._tY    = y;
	}

	get x(){return this._x;}
	get y(){return this._y;}
	get w(){return this._w;}
	get h(){return this._h;}
	set x(n){this._pos.x = n;}
	set y(n){this._pos.y = n;}

	moveTo(tX, tY){
		this._tX = tX - this._w*0.5;
		this._tY = tY;
	}

	draw(){
		let dX = this._tX - this._x;
		let dY = this._tY - this._y;
		this._x += dX * 0.5;
		this._y += dY * 0.5;
		fill(this._color);
		rect(this._x, this._y, this._w, this._h);
	}
}

//==========
// Block

class Block{

	constructor(x, y, w, h, arr){
		this._x = x;
		this._y = y;
		this._w = w + 2;
		this._h = h + 2;
		this._pts = [];
		for(let pts of arr){
			let x = this._x + pts[0] * this._w;
			let y = this._y + pts[1] * this._h;
			let vec = new Vec2(x, y);
			this._pts.push(vec);
		}
	}

	get x(){return this._x;}
	get y(){return this._y;}
	get w(){return this._w;}
	get h(){return this._h;}
	set x(n){this._x = n;}
	set y(n){this._y = n;}

	draw(){
		for(let i=0; i<this._pts.length; i++){
			let n = (i < this._pts.length-1) ? i+1 : 0;
			let aX = this._pts[i].x;
			let aY = this._pts[i].y;
			let bX = this._pts[n].x;
			let bY = this._pts[n].y;
			line(aX, aY, bX, bY);
		}
	}

	intersects(ball){
		if(!this.containsArea(ball)) return false;
		if(!this.containsVec2(ball)) return false;
		this.crosses(ball);
		return true;
	}

	containsArea(ball){
		if(ball.x < this._x) return false;
		if(this._x+this._w < ball.x) return false;
		if(ball.y < this._y) return false;
		if(this._y+this._h < ball.y) return false;
		return true;
	}

	containsVec2(ball){
		for(let i=0; i<this._pts.length; i++){
			let n = (i < this._pts.length-1) ? i+1 : 0;
			let aX = this._pts[i].x;
			let aY = this._pts[i].y;
			let bX = this._pts[n].x;
			let bY = this._pts[n].y;
			if(!isRight(aX, aY, bX, bY, ball.x, ball.y)) return false;
		}
		return true;
	}

	crosses(ball){
		let preX = ball.x - ball.vX;
		let preY = ball.y - ball.vY;
		let pD = Math.floor(360/this._pts.length);
		for(let i=0; i<this._pts.length; i++){
			let n = (i < this._pts.length-1) ? i+1 : 0;
			let aX = this._pts[i].x;
			let aY = this._pts[i].y;
			let bX = this._pts[n].x;
			let bY = this._pts[n].y;
			if(checkCross(aX, aY, bX, bY, preX, preY, ball.x, ball.y)){
				let ref = calcCross(aX, aY, bX, bY, preX, preY, ball.x, ball.y);
				ball.reflect(ref.x, ref.y, ref.rad);
				return;
			}
		}
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
	let dev   = (bY-aY)*(dX-cX)-(bX-aX)*(dY-cY);
	let d1    = cY*dX-cX*dY;
	let d2    = aY*bX-aX*bY;
	let pX    = (d1*(bX-aX)-d2*(dX-cX)) / dev;
	let pY    = (d1*(bY-aY)-d2*(dY-cY)) / dev;
	let dist  = Math.sqrt((pX-dX)**2 + (pY-dY)**2);
	let vWall = new Vec2(bX-aX, bY-aY);
	let radW  = Math.atan2(vWall.y, vWall.x);
	let uWall = new Vec2(vWall.y, vWall.x*-1.0);
	let radU  = Math.atan2(uWall.y, uWall.x);
	let vRay  = new Vec2(cX-pX, cY-pY);
	let radR  = Math.atan2(vRay.y, vRay.x);
	let radV  = radR + (radU-radR)*2;
	let vX    = pX + dist * Math.cos(radV);
	let vY    = pY + dist * Math.sin(radV);
	return {x:vX, y:vY, rad:radV};
}
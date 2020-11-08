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

const COLORS = [
	"#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673Ab7", "#3F51B5", 
	"#2196F3", "#03A9f4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", 
	"#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];

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

class Ball{

	constructor(x, y, size=8, color="#FFFFFF"){
		this._pos   = new Vec2(x, y);
		this._vel   = new Vec2(-8, -4);
		this._size  = size;
		this._color = color;
	}

	get x(){return this._pos.x;}
	get y(){return this._pos.y;}
	set x(n){this._pos.x = n;}
	set y(n){this._pos.y = n;}

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

	intersects(target){
		if(this.x < target.x) return false;
		if(target.x+target.w < this.x) return false;
		if(this.y < target.y) return false;
		if(target.y+target.h < this.y) return false;
		return true;
	}

	bounce(target){
		let preX = this._pos.x - this._vel.x*2;
		let preY = this._pos.y - this._vel.y*2;
		line(this._pos.x, this._pos.y, preX, preY);
		// Cross lines
		if(this.checkCross(this._pos.x, this._pos.y, preX, preY,
			target.x, target.y, target.x+target.w, target.y)){
			//console.log("top");
			this._pos.y = target.y;
			this._vel.y *= -1;
			return true;
		}
		if(this.checkCross(this.x, this.y, preX, preY,
			target.x, target.y+target.h, target.x+target.w, target.y+target.h)){
			//console.log("bottom");
			this._pos.y = target.y+target.h;
			this._vel.y *= -1;
			return true;
		}
		if(this.checkCross(this.x, this.y, preX, preY,
			target.x, target.y, target.x, target.y+target.h)){
			//console.log("left");
			this._pos.x = target.x;
			this._vel.x *= -1;
			return true;
		}
		if(this.checkCross(this.x, this.y, preX, preY,
			target.x+target.w, target.y, target.x+target.w, target.y+target.h)){
			//console.log("right");
			this._pos.x = target.x+target.w;
			this._vel.x *= -1;
			return true;
		}
		return false;
	}

	checkCross(aX, aY, bX, bY, cX, cY, dX, dY){
		let a = (cX-dX)*(aY-cY)+(cY-dY)*(cX-aX);
		let b = (cX-dX)*(bY-cY)+(cY-dY)*(cX-bX);
		let c = (aX-bX)*(cY-aY)+(aY-bY)*(aX-cX);
		let d = (aX-bX)*(dY-aY)+(aY-bY)*(aX-dX);
		return a*b<0 && c*d<0;
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

class Block{

	constructor(x, y, w, h, color="#FFFFFF"){
		this._x     = x;
		this._y     = y;
		this._w     = w;
		this._h     = h;
		this._color = color;
	}

	get x(){return this._x;}
	get y(){return this._y;}
	get w(){return this._w;}
	get h(){return this._h;}
	set x(n){this._pos.x = n;}
	set y(n){this._pos.y = n;}

	draw(){
		fill(this._color);
		rect(this._x, this._y, this._w, this._h);
	}
}
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

const D_LEFT  = 0;
const D_RIGHT = 1;
const D_UP    = 2;
const D_DOWN  = 3;

class FpzManager{

	constructor(){
		this._grids = 4;
		this._board = [
			[ 1, 2, 3, 4],
			[ 5, 6, 7, 8],
			[ 9,10,11,12],
			[13,14,15, 0]
		];
		this._histories = [];
		this.wanderGrid(3, 3, -1, 100);
	}

	getGrids(){return this._grids;}

	getBoard(){return this._board;}

	pushHistory(fR, fC, tR, tC){
		let history = {fR:fR, fC:fC, tR:tR, tC:tC};
		this._histories.push(history);
	}

	popHistory(){
		let l = this._histories.length - 1;
		if(l < 0) return null;
		let history = this._histories[l];
		this._histories.splice(l, 1);
		return history;
	}

	checkVH(r, c){
		if(this.checkZero(r-1, c)) return this.swapGrid(r, c, r-1, c);
		if(this.checkZero(r+1, c)) return this.swapGrid(r, c, r+1, c);
		if(this.checkZero(r, c-1)) return this.swapGrid(r, c, r, c-1);
		if(this.checkZero(r, c+1)) return this.swapGrid(r, c, r, c+1);
		return {r:-1, c:-1};
	}

	checkZero(r, c){
		if(r < 0) return false;
		if(c < 0) return false;
		if(this._grids-1 < r) return false;
		if(this._grids-1 < c) return false;
		if(this._board[r][c] != 0) return false;
		return true;
	}

	wanderGrid(r, c, prev, cnt){
		if(cnt <= 0) return;
		let dirs = [];
		for(let i=0; i<4; i++) dirs.push(i);
		for(let i=dirs.length-1; 0<i; i--){
			let rdm = Math.floor(Math.random()*i);
			let tmp = dirs[rdm];
			dirs[rdm] = dirs[i];
			dirs[i] = tmp;
		}
		for(let i=0; i<dirs.length; i++){
			let dir = dirs[i];
			let rev = -1;
			if(prev == D_LEFT) rev = D_RIGHT;
			if(prev == D_RIGHT) rev = D_LEFT;
			if(prev == D_UP) rev = D_DOWN;
			if(prev == D_DOWN) rev = D_UP;
			if(dir == rev) continue;
			let oR = 0;
			let oC = 0;
			if(dir == D_LEFT){
				if(c-1<0) continue;
				oC--;
			}
			if(dir == D_RIGHT){
				if(this._grids-1<c+1) continue;
				oC++;
			}
			if(dir == D_UP){
				if(r-1<0) continue;
				oR--;
			}
			if(dir == D_DOWN){
				if(this._grids-1<r+1) continue;
				oR++;
			}
			this._histories.push({fR:r, fC:c, tR:r+oR, tC:c+oC});
			this.swapGrid(r, c, r+oR, c+oC);
			this.wanderGrid(r+oR, c+oC, dir, cnt-1);
			return;
		}
	}

	swapGrid(fR, fC, tR, tC){
		let tmp = this._board[tR][tC];
		this._board[tR][tC] = this._board[fR][fC];
		this._board[fR][fC] = tmp;
		return {r:tR, c:tC};
	}

	consoleBoard(){
		let size = this._grids;
		let line = " 15-Puzzle ";
		while(line.length < 17){
			line = line + "-";
			if(line.length < 17) line = "-" + line;
		}
		line += "\n";
		for(let r=0; r<size; r++){
			line += "|";
			for(let c=0; c<size; c++){
				let n = this._board[r][c];
				if(n < 10){
					line += "  " + n;
				}else if(n < 100){
					line += " " + n;
				}else{
					line += n;
				}
				if(c < size-1) line += ",";
			}
			line += "|\n";
		}
		line += "-----------------";
		console.log(line);
	}
}
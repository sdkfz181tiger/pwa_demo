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

class FpzManager{

	constructor(){
		this._grids = 4;
		this._board = [];
		this.resetBoard();
	}

	resetBoard(){
		this._board = [
			[ 1, 2, 3, 4],
			[ 5, 6, 7, 8],
			[ 9,10,11,12],
			[13,14,15, 0]
		];
		this.wanderGrid(3, 3, 500);
	}

	getGrids(){return this._grids;}

	getBoard(){return this._board;}

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

	wanderGrid(r, c, cnt){
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
			let oR = 0;
			let oC = 0;
			if(dir == 0){// Left
				if(c-1<0) continue;
				oC--;
			}
			if(dir == 1){// Right
				if(this._grids-1<c+1) continue;
				oC++;
			}
			if(dir == 2){// Up
				if(r-1<0) continue;
				oR--;
			}
			if(dir == 3){// Down
				if(this._grids-1<r+1) continue;
				oR++;
			}
			this.swapGrid(r, c, r+oR, c+oC);
			this.wanderGrid(r+oR, c+oC, cnt-1);
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
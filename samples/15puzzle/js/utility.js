"use strict";

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
		this._board = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		this.resetBoard();
	}

	resetBoard(){
		let nums = [];
		for(let i=0; i<this._grids**2; i++) nums.push(i);
		for(let i=nums.length-1; 0<i; i--){
			let rdm = Math.floor(Math.random()*i);
			let tmp = nums[rdm];
			nums[rdm] = nums[i];
			nums[i] = tmp;
		}
		for(let i=0; i<this._grids**2; i++){
			let r = Math.floor(i/this._grids);
			let c = Math.floor(i%this._grids);
			this._board[r][c] = nums[i];
		}
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
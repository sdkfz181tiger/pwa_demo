"use strict";

//==========
// Scanline

class Scanline{

	constructor(canvas, ctx, w, h){
		this._canvas   = canvas;
		this._ctx      = ctx;
		this._w        = w;
		this._h        = h;
		this._glcanvas = null;
		this._image    = null;
		this._texture  = null;
		try{
			this._glcanvas = fx.canvas();
		}catch(e){
			console.log(e);
			showMsg("You can't use glcanvas...");
			return;
		}
	}

	init(path){
		if(!this._glcanvas) return;
		this._image = new Image();
		this._image.src = path;
		this._texture = this._glcanvas.texture(this._canvas);
		this._canvas.parentNode.insertBefore(this._glcanvas, this._canvas);
		this._canvas.style.display = "none";
		this._glcanvas.className = this._canvas.className;
		this._glcanvas.id = this._canvas.id;
		this._canvas.id = "old_" + this._canvas.id;
	}

	draw(){
		if(!this._glcanvas) return;
		this._ctx.drawImage(this._image, 0, 0, this._w, this._h);
		this._texture.loadContentsOf(this._canvas);
		this._glcanvas.draw(this._texture)
			.bulgePinch(this._w*0.5, this._h*0.5, this._w*0.75, 0.2)
			.vignette(0.25, 0.75).update();
	}
}
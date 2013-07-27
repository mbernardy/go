function Board(){
	"use strict";

	var _$root = $('<canvas id="board" width="500" height="500"></canvas>');
	var _ctx;
	var _xStep;
	var _yStep;

	var rows = 9;
	var cols = 9; 
	var padding;


	function _init(){
		var elem = _$root.get(0);
		_ctx = elem.getContext('2d');



		_bindEvents();
	}

	function _bindEvents(){

		var plays = 0;
		var orange = "#FFAE00";
		var black  = "#000000"
		_$root.on('click', function(e){
			var x, y;
			x = e.pageX - padding;
			var col = Math.floor(x / _xStep);

			y = e.pageY - padding;
			var row = Math.floor(y / _yStep);

			var color = plays++ % 2 == 0 ? black : orange;
			_drawPiece(row, col, color);

		});
	}

	function _drawPiece(row, col, color){
		console.log("Trying to draw piece at ", row, col);

		var x = padding + (col * _xStep);
		var y = padding + (row * _yStep);
		_ctx.beginPath();
		_ctx.arc(x, y, _xStep/2, 0, 2 * Math.PI );
		_ctx.fillStyle = color;
		_ctx.fill();

	}


	this.draw = function(){

		_xStep = _$root.width() / cols;
		_yStep = _$root.height() / rows;
		padding = _xStep / 2;


		var leftX = padding;
		var rightX = _$root.width() - padding;
		var topY = padding;
		var bottomY = _$root.height() - padding;

		//draw the horizontal lines
		var y = topY;
		for(var i=0; i < rows; i++){
			_ctx.moveTo(leftX, y);
			_ctx.lineTo(rightX, y);
			_ctx.stroke();

			y += _yStep;
		}
		
		var x = leftX;
		for(var i=0; i < cols; i++){
			_ctx.moveTo(x, topY);
			_ctx.lineTo(x, bottomY);
			_ctx.stroke();

			x += _xStep;
		}

	}

	this.get$Root = function(){
		return _$root;
	}

	_init();

}
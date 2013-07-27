function Board(){
	"use strict";

	var _$root = $('<canvas id="board" width="500" height="500"></canvas>');
	var _ctx;
	var _xStep;
	var _yStep;

	var rows = 9;
	var cols = 9; 
	var padding;
	var plays = 0;
	var orange =  "rgba(255, 175, 0, 1.0)";
	var phantom_orange = "rgba(255, 175, 0, 0.5)"
	var black  = "rgba(0, 0, 0, 1.0)"
	var phantom_black = "rgba(0, 0, 0, 0.5)"

	//underlying two dimensional array [col, row] representing board state
	var board;

	function _init(){
		var elem = _$root.get(0);
		_ctx = elem.getContext('2d');
		_bindEvents();

		board = new Array(cols);
		for(var i=0; i < cols; i++){
			board[i] = new Array(rows);
		}
	}

	function _bindEvents(){
		_$root.on('click', function(e){
			var position = _getPosition(e.pageX, e.pageY);
			_drawPiece(position.row, position.column);
		});

		var last;
		_$root.on('mousemove', function(e){
			var position = _getPosition(e.pageX, e.pageY);
			if(last){
				var last_position = _getPosition(last.pageX, last.pageY);
				if(position.row != last_position.row || position.column != last_position.column){
					_clearPhantom(last_position.row, last_position.column);
					_drawPhantom(position.row, position.column);
				}
			}else{
				_drawPhantom(position.row, position.column);
			}
			last = e;
		});
	}

	function _getPosition(x, y){
		var col = Math.floor(x / _xStep);
		var row = Math.floor(y / _yStep);
		return {
			column : col,
			row : row
		}
	}

	function _getColor(phantom){
		if(phantom){
			return plays % 2 == 0 ? phantom_black : phantom_orange;
		}else{
			return plays % 2 == 0 ? black : orange;
		}
	}

	function _drawPiece(row, col){
		
		if(board[col][row]){
			return;
		}
		board[col][row] = true;

		var x = padding + (col * _xStep);
		var y = padding + (row * _yStep);
		_ctx.beginPath();
		_ctx.arc(x, y, _xStep/2, 0, 2 * Math.PI );
		_ctx.fillStyle = _getColor();
		_ctx.fill();
		plays++;
	}

	function _clearPhantom(row, col){
		if(board[col][row]){
			return;
		}

		//clear the phantom
		var x = col * _xStep;
		var y = row * _yStep;
		_ctx.beginPath();
		_ctx.clearRect(x, y, _xStep, _yStep);
		_ctx.closePath();

		//redraw the board grid;

		

		_ctx.beginPath();
		_ctx.strokeStyle= black;
		//vertical line
		var yStep = _yStep;
		console.log(row);
		if( row == 0){
			y += padding;
			yStep /= 2;
		}
		if( row +1 == rows){
			yStep /= 2;
		}
		_ctx.moveTo(x + _xStep/2, y);
		_ctx.lineTo(x + _xStep/2, y + yStep);
		if(row == 0){
			y -= padding; 
		}


		//horizontal line
		var xStep = _xStep;
		if( col == 0){
			x += padding;
			xStep /= 2;
		}
		if( col + 1 == cols ){
			xStep /= 2;
		}

		_ctx.moveTo(x, y + _yStep/2);
		_ctx.lineTo(x + xStep, y + _yStep/2);
		_ctx.stroke();
	}

	function _drawPhantom(row, col){
		if(board[col][row]){
			return;
		}

		var x = padding + (col * _xStep);
		var y = padding + (row * _yStep);
		_ctx.beginPath();
		_ctx.arc(x, y, _xStep/2, 0, 2 * Math.PI );
		_ctx.fillStyle = _getColor(true);
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
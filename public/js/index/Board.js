function Board(){

	var _$root = $('<canvas id="board" width="500" height="500"></canvas>');

	var rows = cols = 9;
	//pixels between edge of game board and edge of canvas
	var padding = 20;

	function _getColSpacing(){
		var boardWidth = _$root.width() - 2 * padding;
		return boardWidth / (cols - 1);
	}

	function _getRowSpacing(){
		var boardHeight = _$root.height() - 2 * padding;
		return boardHeight / (rows - 1);
	}


	this.draw = function(){
		var elem = _$root.get(0);
		var ctx = elem.getContext('2d');

		var leftX = padding;
		var rightX = _$root.width() - padding;
		var topY = padding;
		var bottomY = _$root.height() - padding;

		var yStep = _getRowSpacing();
		var xStep = _getColSpacing();

		//draw the horizontal lines
		var y = topY;
		for(var i=0; i < rows; i++){
			ctx.moveTo(leftX, y);
			ctx.lineTo(rightX, y);
			ctx.stroke();

			y += yStep;
		}
		
		var x = leftX;
		for(var i=0; i < cols; i++){
			ctx.moveTo(x, topY);
			ctx.lineTo(x, bottomY);
			ctx.stroke();

			x += xStep;
		}

	}

	this.get$Root = function(){
		return _$root;
	}

}
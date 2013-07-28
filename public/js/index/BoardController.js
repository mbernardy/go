function BoardController(){
	"use strict";

	var players = [];
	var player_id_counter = 1;

	var NO_PLAY = {
		added: [],
		removed : []
	}

	var row_count = 9;
	var col_count = 9;

	//underlying two dimensional array [col, row] representing board state
	var board;


	function _init(){
		board = new Array(col_count);
		for(var i=0; i < col_count; i++){
			board[i] = new Array(row_count);
		}
	}

	function _getInitialLiberties(col, row){
		var liberties = 4;
		if(row == 0 || row + 1 == row_count){
			liberties--;
		}
		if(col == 0 || col + 1 == col_count){
			liberties--;
		}

		return liberties;
	}

	function _getState(col, row){
		var state = board[col][row];
		if(!state){
			state = {
				occupied : false,
				liberties : _getInitialLiberties(col, row)
			}
			board[col][row] = state;
		}

		return state;
	}

	this.addPlayer = function addPlayer(player){
		players.push(player);
		//if the player doesnt' have an id assign one to it
		if(!player.id){
			player.id = player_id_counter++;
		}
	}

	this.positionOccupied = function(col, row){
		return board[col][row] && board[col][row].occupied;
	}

	//remove liberties of ajoining stones due to a stone played at col, row
	function _removeLiberties(col, row){
		//top
		if(row - 1 >=0){
			_getState(col, row -1).liberties--;
		}
		//right
		if(col + 1 < col_count){
			_getState(col +1, row).liberties--;
		}
		//bottom
		if(row +1 < col_count){
			_getState(col, row + 1).liberties--;
		}
		//left
		if(col -1 >=0 ){
			_getState(col-1, row).liberties--;
		}
	}

	//add liberties to adjoing stones due to a stone removed from col, row
	function _addLiberties(col, row){
		//top
		if(row - 1 >=0){
			_getState(col, row -1).liberties++;
		}
		//right
		if(col + 1 < col_count){
			_getState(col +1, row).liberties++;
		}
		//bottom
		if(row +1 < col_count){
			_getState(col, row + 1).liberties++;
		}
		//left
		if(col -1 >=0 ){
			_getState(col-1, row).liberties++;
		}
	}


	this.play = function play(col, row, player_id){

		var state = _getState(col, row);
		if(state.occupied){
			return NO_PLAY
		}

		if(state.liberties == 0){
			return NO_PLAY
		}

		state.occupied = true;

		_removeLiberties(col, row);


		var removed = _resolveLiberties();
		return {
			added : [[col, row]],
			removed : removed
		}

	}

	function _resolveLiberties(){
		var to_remove = [];
		for(var col = 0; col < col_count; col++){
			for(var row =0; row < row_count; row++){
				var state = _getState(col, row);
				if(state.liberties == 0){
					to_remove.push([col, row]);
				}
			}
		}
		return to_remove;
	}

	_init();
}
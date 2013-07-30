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

	function _removeStone(col, row){
		var state = _getState(col, row);
		state.occupied = false;
		state.player_id= false;
		_addLiberties(col, row);
	}


	this.play = function play(col, row, player_id){

		var state = _getState(col, row);
		if(state.occupied){
			return NO_PLAY
		}

		//play the stone and see if it lives;
		_removeLiberties(col, row);
		state.player_id = player_id;



		// 2.
		function foe_fn(col2, row2){
			var state2 = _getState(col2, row2);
			return state2.occupied && state2.player_id != state.player_id;
		}
		var foes = _getNeighbors(col, row, foe_fn);
		for(var i=0; i < foes.length; i++){
			var position = foes[i];
			var key = position[0] + "" + position[1]
			if(visited[key]){
				continue;
			}
			visited[key] = true;
			if(!_isAlive(position[0], position[1], visited)){
				return true;
			}
		}

		if(_isAlive(col, row, {})){
			state.occupied = true;
			var removed = _getDeadStones(col, row);
			removed.forEach(function(position){
				_removeStone(position[0], position[1]);
			})
			return {
				added : [[col, row]],
				removed : removed
			}
		}else{
			_removeStone(col, row);
			return NO_PLAY;
		}
	}

	function _isAlive(col, row, visited){

		// There are two ways in which a stone is alive
		// 1. The space has 1 or more liberties
		// 2. The space her zero liberties but connects to a friendly group that has one or more

		var state = _getState(col, row);
		// 1.
		if(state.liberties > 0){
			return true;
		}

		// 2.
		function friend_fn(col2, row2){
			var state2 = _getState(col2, row2);
			return state2.occupied && state2.player_id == state.player_id;
		}
		var friends = _getNeighbors(col, row, friend_fn);
		for(var i=0; i < friends.length; i++){
			var position = friends[i];
			var key = position[0] + "" + position[1]
			if(visited[key]){
				continue;
			}
			visited[key] = true;
			if(_isAlive(position[0], position[1], visited)){
				return true;
			}
		}

		return false;

	}

	function _getNeighbors(col, row, filter_fn){

		var state = _getState(col, row);
		var player = state.player_id;
		var neighbors = [];

		//top
		if(row - 1 >=0){
			if(filter_fn(col, row -1)){
				neighbors.push([col, row-1]);
			}
		}
		//right
		if(col + 1 < col_count){
			if(filter_fn(col+1, row)){
				neighbors.push([col+1, row]);
			}
		}
		//bottom
		if(row + 1 < row_count){
			if(filter_fn(col, row+1)){
				neighbors.push([col, row+1]);
			}
		}
		//left
		if(col -1 >=0 ){
			if(filter_fn(col-1, row)){
				neighbors.push([col-1, row]);
			}
		}

		return neighbors;
	}


	//returns all stones part of this group
	function _getGroup(col, row, visited){
		if(visited[ col + "" + row]){
			return [];
		}
		visited[col + "" + row] = true;

		var result = [[col, row]];
		var state = _getState(col, row);
		function friend_fn(col2, row2){
			var state2 = _getState(col2, row2);
			return state2.occupied && state2.player_id == state.player_id;
		}
		var friends = _getNeighbors(col, row, friend_fn);
		for(var i=0; i < friends.length; i++){
			var position = friends[i];
			result = result.concat(_getGroup(position[0], position[1], visited));
		}

		return result;
	}

	function _getDeadStones(col, row){
		var to_remove = [];
		var state = _getState(col, row);

		function foe_fn(col2, row2){
			var state2 = _getState(col2, row2);
			return state2.occupied && state2.player_id != state.player_id;
		}
		var foes = _getNeighbors(col, row, foe_fn);
		foes.forEach(function(position){
			if(!_isAlive(position[0], position[1], {})){
				var group = _getGroup(position[0], position[1], {});
				to_remove = to_remove.concat(group);
			}
		});


		return to_remove;
	}

	_init();
}
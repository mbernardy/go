function BoardPosition(){


	var id;
	var occupied = false;
	var liberties;
	var player_id = null;
	var neighbors;

	this.playStone = function(player_id){
		this.occupied = true;
		this.player_id = player_id;
	}

	this.removeStone = function(){
		this.occupied = false;
		this.player_id = null;
	}

	this.getGroup = function(){

	}




	//return true if this position is in atari
	this.isKillable = function(){
		if ( liberties > 1 ){
			return false;
		}





	}

}
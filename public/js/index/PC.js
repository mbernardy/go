function PC(){
	var board = new Board();
	$('.board').append(board.get$Root());
	board.draw();
}

$(function(){
	new PC();
})
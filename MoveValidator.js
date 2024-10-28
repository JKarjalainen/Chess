class MoveValidator {
	constructor() {
	}

	static pawnMoveIsValid(start, end, board) {
		let piece = board[start.y][start.x];
		let endPiece = board[end.y][end.x]; 
		let diff = start.y - end.y;
		if(piece.color == COLORS.BLACK) diff *= -1;

		if(diff < 1) {
			return false;
		}

		// eating
		if(end.x != start.x) {
			if(endPiece.isEmpty() || endPiece.color == piece.color) return false;
			if(diff > 1) return false;	
			return true;
		}

		if(!endPiece.isEmpty()) return false;

		if(!piece.hasMoved && diff == 2) {
			let inFront = piece.color == COLORS.BLACK ? board[end.y-1][end.x] : board[start.y-1][end.x];
			console.log(inFront);
			if(inFront.isEmpty()) return true;

		}

		return diff < 2;


		return true;
	}
}

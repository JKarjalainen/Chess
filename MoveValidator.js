class MoveValidator {
	constructor() {
	}

	static #checkAllowedMoves(start, end, board, allowedMovesList) {
		const piece = board[start.y][start.x];
		const endPiece = board[end.y][end.x]; 

		let moveIsAllowed = allowedMovesList.some(moveArray => {
			return end.x == moveArray[0] && end.y == moveArray[1];	
		});
		
		let isEmptyOrEnemy = endPiece.isEmpty() || (!endPiece.isEmpty() && endPiece.color != piece.color);

		return moveIsAllowed && isEmptyOrEnemy;

	}
	static pawnMoveIsValid(start, end, board) {
		const piece = board[start.y][start.x];
		const endPiece = board[end.y][end.x]; 
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
			const inFront = piece.color == COLORS.BLACK ? board[end.y-1][end.x] : board[start.y-1][end.x];
			console.log(inFront);
			if(inFront.isEmpty()) return true;

		}

		return diff < 2;
	}

	static knightMoveIsValid(start, end, board) {
		const allowedMoves = [
			[start.x+1, start.y+2],
			[start.x-1, start.y+2],
			[start.x+1, start.y-2],
			[start.x-1, start.y-2],
			[start.x+2, start.y+1],
			[start.x+2, start.y-1],
			[start.x-2, start.y+1],
			[start.x-2, start.y-1],
		]

		return this.#checkAllowedMoves(start, end, board, allowedMoves);

	}

}

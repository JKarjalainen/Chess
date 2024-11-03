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

	static kingInCheck(board, turn) {
		let wholeBoard = [];
		board.forEach(row => {
			wholeBoard.push(...row);
		})

		let king = wholeBoard.find(piece => {
			return piece.color == turn && piece.pieceType == PIECES.KING;
		})

		let enemyPieces = wholeBoard.filter(p => {
			return !p.isEmpty() && p.color != turn;
		})

		let kingIsInCheck = enemyPieces.some(p => {
			switch(p.pieceType) {
				case PIECES.PAWN:
					return MoveValidator.pawnMoveIsValid(p.pos, king.pos, board);
				case PIECES.KNIGHT:
					return MoveValidator.knightMoveIsValid(p.pos, king.pos, board);
				case PIECES.ROOK:
					return MoveValidator.rookMoveIsValid(p.pos, king.pos, board);
				case PIECES.BISHOP:
					return MoveValidator.bishopMoveIsValid(p.pos, king.pos, board);
				case PIECES.QUEEN:
					return MoveValidator.queenMoveIsValid(p.pos, king.pos, board);
				case PIECES.KING:
					return MoveValidator.kingMoveIsValid(p.pos, king.pos, board)
			}			
		});
		
		return kingIsInCheck;	
	}

	static kingInCheckAfterMove(start, end, board, turn) {
		let piece = board[start.y][start.x];
		let endPiece = board[end.y][end.x];

		board[end.y][end.x] = piece;
		piece.pos = end;
		board[start.y][start.x] = new Piece(PIECES.EMPTY, 0, new Pos(start.x, start.y));

		let kingInCheck = this.kingInCheck(board, turn);

		//undo last move
		board[start.y][start.x] = piece;
		piece.pos = start;
		board[end.y][end.x] = endPiece;
			
		return kingInCheck;
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

	static rookMoveIsValid(start, end, board) {
		const allowedMoves = [];

		for(let i = start.x + 1; i < board[0].length; i++) {
			let piece = board[start.y][i];		
			allowedMoves.push([i, start.y]);	
			if(!piece.isEmpty()) break;
		}
		for(let i = start.x - 1; i >= 0; i--) {
			let piece = board[start.y][i];		
			allowedMoves.push([i, start.y]);	
			if(!piece.isEmpty()) break;
		}

		for(let i = start.y + 1; i < board.length; i++) {
			let piece = board[i][start.x];		
			allowedMoves.push([start.x, i]);	
			if(!piece.isEmpty()) break;
		}
		for(let i = start.y - 1; i >= 0; i--) {
			let piece = board[i][start.x];		
			allowedMoves.push([start.x, i]);	
			if(!piece.isEmpty()) break;
		}

		return this.#checkAllowedMoves(start, end, board, allowedMoves);
	}

	static bishopMoveIsValid(start, end, board) {
		const allowedMoves = [];

		for(let i = 1; i < board.length; i++) {
			let y = start.y + i;
			let x = start.x + i;

			if(board.length <= y || x >= board.length) break;

			let piece = board[y][x];
			allowedMoves.push([x, y]);
			if(!piece.isEmpty()) break;
		} 
		for(let i = 1; i < board.length; i++) {
			let y = start.y + i;
			let x = start.x - i;

			if(board.length <= y || x < 0) break;

			let piece = board[y][x];
			allowedMoves.push([x, y]);
			if(!piece.isEmpty()) break;
		} 
		for(let i = 1; i < board.length; i++) {
			let y = start.y - i;
			let x = start.x - i;

			if(y < 0 || x < 0) break;

			let piece = board[y][x];
			allowedMoves.push([x, y]);
			if(!piece.isEmpty()) break;
		} 
		for(let i = 1; i < board.length; i++) {
			let y = start.y - i;
			let x = start.x + i;

			if(y < 0 || board.length <= x) break;

			let piece = board[y][x];
			allowedMoves.push([x, y]);
			if(!piece.isEmpty()) break;
		} 

		return this.#checkAllowedMoves(start, end, board, allowedMoves);
	}

	static kingMoveIsValid(start, end, board) {
		const allowedMoves = [
			[start.x, start.y + 1],
			[start.x, start.y - 1],
			[start.x + 1, start.y],
			[start.x - 1, start.y],
			[start.x - 1, start.y - 1],
			[start.x - 1, start.y + 1],
			[start.x + 1, start.y + 1],
			[start.x + 1, start.y - 1],
		]

		return this.#checkAllowedMoves(start, end, board, allowedMoves);

	}

	static queenMoveIsValid(start, end, board) {
		return this.bishopMoveIsValid(start, end, board) || this.rookMoveIsValid(start, end, board);
	}

	static gameIsOver(board) {

	}

}

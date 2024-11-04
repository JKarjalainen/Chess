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
			let test = []
			switch(p.pieceType) {
				case PIECES.PAWN:
					test.push(MoveValidator.pawnMoveIsValid(p.pos, king.pos, board));
				case PIECES.KNIGHT:
					test.push(MoveValidator.knightMoveIsValid(p.pos, king.pos, board));
				case PIECES.ROOK:
					test.push(MoveValidator.rookMoveIsValid(p.pos, king.pos, board));
				case PIECES.BISHOP:
					test.push(MoveValidator.bishopMoveIsValid(p.pos, king.pos, board));
				case PIECES.QUEEN:
					test.push(MoveValidator.queenMoveIsValid(p.pos, king.pos, board));
				case PIECES.KING:
					test.push(MoveValidator.kingMoveIsValid(p.pos, king.pos, board))
			}			
			return test.some(x => x == true);
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

	static getPawnMoves(start, board) {
		const piece = board[start.y][start.x];
		const front = piece.color == COLORS.BLACK ? 1 : -1;
		const frontPos = start.y + front;
		const moves = [
			[start.x, frontPos]
		]

		if(!piece.hasMoved && board[frontPos][start.x].isEmpty()) {
			moves.push([start.x, start.y + front * 2]);
		}

		if(start.x > 0) {
			const pieceFrontLeft = board[frontPos][start.x - 1];
			if(!pieceFrontLeft.isEmpty() && pieceFrontLeft.color != piece.color)
				moves.push([start.x - 1, frontPos])
		} else if(start.x < 7) {
			const pieceFrontRight = board[frontPos][start.x + 1];
			if(!pieceFrontRight.isEmpty() && pieceFrontLeft.color != piece.color)
				moves.push([start.x + 1, frontPos])
		}
		return moves;
	}

	static knightMoveIsValid(start, end, board) {
		const allowedMoves = this.getKnightMoves(start);
		return this.#checkAllowedMoves(start, end, board, allowedMoves);

	}

	static getKnightMoves(start) {
		const allowedMoves = [
			[start.x+1, start.y+2],
			[start.x-1, start.y+2],
			[start.x+1, start.y-2],
			[start.x-1, start.y-2],
			[start.x+2, start.y+1],
			[start.x+2, start.y-1],
			[start.x-2, start.y+1],
			[start.x-2, start.y-1],
		];

		return allowedMoves.filter(move => {
			return (move[0] < 8 && move[0] >= 0) && (move[1] < 8 && move[1] >= 0)
		});
	}

	static rookMoveIsValid(start, end, board) {
		return this.#checkAllowedMoves(start, end, board, this.getRookMoves(start, board));
	}

	static getRookMoves(start, board) {
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
		return allowedMoves;
	}

	static bishopMoveIsValid(start, end, board) {
		const allowedMoves = this.getBishopMoves(start, board);
		return this.#checkAllowedMoves(start, end, board, allowedMoves);
	}

	static getBishopMoves(start, board) {
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
		return allowedMoves;
	}

	static kingMoveIsValid(start, end, board) {
		return this.#checkAllowedMoves(start, end, board, this.getKingMoves(start, board));

	}

	static getKingMoves(start, board) {
		const allowedMoves = [
			[start.x, start.y + 1],
			[start.x, start.y - 1],
			[start.x + 1, start.y],
			[start.x - 1, start.y],
			[start.x - 1, start.y - 1],
			[start.x - 1, start.y + 1],
			[start.x + 1, start.y + 1],
			[start.x + 1, start.y - 1],
		];
		return allowedMoves.filter(move => {
			return (move[0] < 8 && move[0] >= 0) && (move[1] < 8 && move[1] >= 0)
		});
	}

	static queenMoveIsValid(start, end, board) {
		return this.bishopMoveIsValid(start, end, board) || this.rookMoveIsValid(start, end, board);
	}

	static getValidMoves(piece, board, turn) {
		let moves = [];
		switch(piece.pieceType) {
			case PIECES.PAWN:
				moves.push(...this.getPawnMoves(piece.pos, board))
				break;
			case PIECES.KNIGHT:
				moves.push(...this.getKnightMoves(piece.pos));
				break;
			case PIECES.ROOK:
				moves.push(...this.getRookMoves(piece.pos, board));
				break;
			case PIECES.BISHOP:
				moves.push(...this.getBishopMoves(piece.pos, board));
				break;
			case PIECES.QUEEN:
				moves.push(...this.getBishopMoves(piece.pos, board), ...this.getRookMoves(piece.pos, board))
				break;
			case PIECES.KING:
				moves.push(...this.getKingMoves(piece.pos, board));
				break;
		}

		let validMoves = this.removeUnvalidMoves(piece, moves, board, turn);		
		return validMoves;
	}

	static removeUnvalidMoves(piece, moves, board, turn) {
		const newMoves = [];
		const allowedMoves = [];
		moves.forEach(move => {
			let end = board[move[1]][move[0]];
			let isEmptyOrEnemy = end.isEmpty() || (!end.isEmpty() && end.color != piece.color);
			if(isEmptyOrEnemy)
				newMoves.push(move);
		});

		newMoves.forEach(move => {
			let start = piece.pos;
			let end = new Pos(move[0], move[1]);
			let inCheck = this.kingInCheckAfterMove(start, end, board, turn)	
			if(!inCheck)
				allowedMoves.push(move);
		});

		return allowedMoves;
	}
}

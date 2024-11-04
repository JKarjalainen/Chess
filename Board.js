class Board {
	constructor(width) {
		this.width = width;
		this.spaceWidth = width / 8;
		this.board = this.createBoardArray();
		this.setUp();
		this.turn = COLORS.WHITE;
		this.holding = null;
		this.holdingStartPos = null;
		this.images = {
			0: [],
			1: []
		}
		this.loadImages();
	}

	loadImages() {
		for(let i = 1; i < 7; i++) {
			for(let j = 0; j < 2; j++) {
				let image = document.createElement("img");
				image.src = "./images/piece" + i + j + ".png";
				this.images[j][i] = image;
			}
		}
	}

	draw() {
		this.drawBackground();
		this.drawPieces();
	}
	drawBackground() {
		let black = false;
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 8; j++) {
				ctx.fillStyle = black ? "gray" : "white";
				black = !black;
				ctx.fillRect(this.spaceWidth*i, this.spaceWidth*j, this.spaceWidth, this.spaceWidth);
			}
			black = !black;
		}
	}

	drawPieces() {
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 8; j++) {
				let pos = new Pos(j, i);
				if(pos.canvasX == this.holdingStartPos?.canvasX && pos.canvasY == this.holdingStartPos?.canvasY) {
					continue;	
				}
				let piece = this.board[i][j];
				this.drawPieceAsImage(piece, pos);
				
			}
		}
	}


	getPieceInPos(pos) {
		return this.board[pos.y][pos.x];
	}

	drawHolding(pos) {
		if(!this.holding || this.holding.color != this.turn) { 
			this.holding = null;
			this.holdingStartPos = null;
			return; 
		}	
		let newPos = new Pos(pos.x - SQUARE_SIZE / 2, pos.y - SQUARE_SIZE / 2);
		this.drawPieceAsImage(this.holding, newPos, false);
	}

	movePieceInPos(start, end) {
		let piece = this.board[start.y][start.x];

		this.board[end.y][end.x] = piece;
		piece.pos = new Pos(end.x, end.y);
		this.board[start.y][start.x] = new Piece(PIECES.EMPTY, 0, new Pos(start.x, start.y));
		if(this.turn == COLORS.WHITE) this.turn = COLORS.BLACK;
		else if(this.turn == COLORS.BLACK) this.turn = COLORS.WHITE;

		piece.hasMoved = true;
	}

	moveIsValid(start, end) {
		if(start.equals(end)) return false;

		let piece = this.board[start.y][start.x];
		
		if(piece.isEmpty()) return false;
		if(piece.color != this.turn) return false;

		if(MoveValidator.kingInCheckAfterMove(start, end, this.board, this.turn)) {
			return false;
		}

		switch(piece.pieceType) {
			case PIECES.PAWN: 
				return MoveValidator.pawnMoveIsValid(start, end, this.board);	
			case PIECES.KNIGHT:
				return MoveValidator.knightMoveIsValid(start, end, this.board);
			case PIECES.ROOK:
				return MoveValidator.rookMoveIsValid(start, end, this.board);
			case PIECES.BISHOP:
				return MoveValidator.bishopMoveIsValid(start, end, this.board);
			case PIECES.QUEEN:
				return MoveValidator.queenMoveIsValid(start, end, this.board);
			case PIECES.KING:
				return MoveValidator.kingMoveIsValid(start, end, this.board);
		}

		return true;
	}

	drawPiece(piece, pos) {
		let drawingFunc = piece.color == COLORS.BLACK ? ctx.fillText.bind(ctx) : ctx.strokeText.bind(ctx);
		ctx.font = "35px serif";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		switch(piece.pieceType) {
			case PIECES.PAWN:
				drawingFunc("P", pos.canvasX, pos.canvasY);
				break;
			case PIECES.ROOK:
				drawingFunc("R", pos.canvasX, pos.canvasY);
				break;
			case PIECES.KNIGHT:
				drawingFunc("Kn", pos.canvasX, pos.canvasY);
				break;
			case PIECES.BISHOP:
				drawingFunc("B", pos.canvasX, pos.canvasY);
				break;
			case PIECES.KING:
				drawingFunc("K", pos.canvasX, pos.canvasY);
				break;
			case PIECES.QUEEN:
				drawingFunc("Q", pos.canvasX, pos.canvasY);
				break;
		}	
	}

	drawPieceAsImage(piece, pos, onGrid = true) {
		if(piece.pieceType == PIECES.EMPTY) return;

		let image = this.images[piece.color][piece.pieceType];
		if(onGrid)
			ctx.drawImage(image, pos.canvasX, pos.canvasY, SQUARE_SIZE, SQUARE_SIZE);
		else
			ctx.drawImage(image, pos.x, pos.y, SQUARE_SIZE, SQUARE_SIZE);
	}

	createBoardArray() {
		let board = [];
		for(let i = 0; i < 8; i++) {
			let row = [];
			for(let j = 0; j < 8; j++) {
				row.push(new Piece(PIECES.EMPTY, COLORS.WHITE, new Pos(i, j)));
			}
			board.push(row);
		}

		return board;
	}

	setUp() {
		//pawns
		const secondRow = 1;
		const seventhRow = 6;
		for(let i = 0; i < 8; i++) {
			this.board[secondRow][i] = new Piece(PIECES.PAWN, COLORS.BLACK, new Pos(i, secondRow));
			this.board[seventhRow][i] = new Piece(PIECES.PAWN, COLORS.WHITE, new Pos(i, seventhRow));
		}

		//rooks
		this.board[0][0] = new Piece(PIECES.ROOK, COLORS.BLACK, new Pos(0, 0));
		this.board[0][this.board.length-1] = new Piece(PIECES.ROOK, COLORS.BLACK, new Pos(this.board.length - 1, 0));
		this.board[this.board.length-1][0] = new Piece(PIECES.ROOK, COLORS.WHITE, new Pos(0, this.board.length - 1));
		this.board[this.board.length-1][this.board.length-1] = new Piece(PIECES.ROOK, COLORS.WHITE, new Pos(this.board.length - 1, this.board.length - 1));

		//knight
		this.board[0][1] = new Piece(PIECES.KNIGHT, COLORS.BLACK, new Pos(1, 0));
		this.board[0][6] = new Piece(PIECES.KNIGHT, COLORS.BLACK, new Pos(6, 0));
		this.board[7][1] = new Piece(PIECES.KNIGHT, COLORS.WHITE, new Pos(1, 7));
		this.board[7][6] = new Piece(PIECES.KNIGHT, COLORS.WHITE, new Pos(6, 7));

		//bishop
		this.board[0][2] = new Piece(PIECES.BISHOP, COLORS.BLACK, new Pos(2, 0));
		this.board[0][5] = new Piece(PIECES.BISHOP, COLORS.BLACK, new Pos(5, 0));
		this.board[7][2] = new Piece(PIECES.BISHOP, COLORS.WHITE, new Pos(2, 7));
		this.board[7][5] = new Piece(PIECES.BISHOP, COLORS.WHITE, new Pos(5, 7));

		//queen
		this.board[0][3] = new Piece(PIECES.QUEEN, COLORS.BLACK, new Pos(3, 0));
		this.board[7][3] = new Piece(PIECES.QUEEN, COLORS.WHITE, new Pos(3, 7));

		//king
		this.board[0][4] = new Piece(PIECES.KING, COLORS.BLACK, new Pos(4, 0));
		this.board[7][4] = new Piece(PIECES.KING, COLORS.WHITE, new Pos(4, 7));
	}

	checkWin() {
		if(!MoveValidator.kingInCheck(this.board, this.turn)) {
			return false;
		}

		let pieces = this.getWholeBoard().filter(piece => {
			return piece.color == this.turn && !piece.isEmpty();
		});

		let hasValidMoves = pieces.some(piece => {
			let validMoves = MoveValidator.getValidMoves(piece, this.board, this.turn);
			console.log(piece, validMoves);
			return validMoves.length > 0;
		})
		if(!hasValidMoves) {
			console.log("Win");
		}	
	}

	getWholeBoard() {
		const whole = [];
		this.board.forEach(e => {
			whole.push(...e);
		});

		return whole;
	}
}

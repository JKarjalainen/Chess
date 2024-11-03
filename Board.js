class Board {
	constructor(width) {
		this.width = width;
		this.spaceWidht = width / 8;
		this.board = this.createBoardArray();
		this.setUp();
		this.turn = COLORS.WHITE;
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
				ctx.fillRect(this.spaceWidht*i, this.spaceWidht*j, this.spaceWidht, this.spaceWidht);
			}
			black = !black;
		}
	}

	drawPieces() {
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 8; j++) {
				let pos = new Pos(j, i);
				let piece = this.board[i][j];
				this.drawPieceAsImage(piece, pos);
				
			}
		}
	}

	movePieceInPos(start, end) {
		let piece = this.board[start.y][start.x];

		this.board[end.y][end.x] = piece;
		this.board[start.y][start.x] = new Piece(PIECES.EMPTY, 0);
		if(this.turn == COLORS.WHITE) this.turn = COLORS.BLACK;
		else if(this.turn == COLORS.BLACK) this.turn = COLORS.WHITE;

		piece.hasMoved = true;
	}

	moveIsValid(start, end) {
		if(start.equals(end)) return false;

		let piece = this.board[start.y][start.x];
		let endPiece = this.board[end.y][end.x]; 
		
		if(piece.isEmpty()) return false;
		if(piece.color != this.turn) return false;

		switch(piece.pieceType) {
			case PIECES.PAWN: 
				return MoveValidator.pawnMoveIsValid(start, end, this.board);	
			case PIECES.KNIGHT:
				return MoveValidator.knightMoveIsValid(start, end, this.board);
			case PIECES.ROOK:
				return MoveValidator.rookMoveIsValid(start, end, this.board);
			case PIECES.BISHOP:
				return MoveValidator.bishopMoveIsValid(start, end, this.board);
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

	drawPieceAsImage(piece, pos) {
		if(piece.pieceType == PIECES.EMPTY) return;

		let image = document.createElement("img");
		image.src = "./images/piece" + piece.pieceType + piece.color + ".png";
		ctx.drawImage(image, pos.canvasX, pos.canvasY, SQUARE_SIZE, SQUARE_SIZE);
	}

	createBoardArray() {
		let board = [];
		for(let i = 0; i < 8; i++) {
			let row = [];
			for(let j = 0; j < 8; j++) {
				row.push(new Piece(PIECES.EMPTY, COLORS.WHITE));
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
			this.board[secondRow][i] = new Piece(PIECES.PAWN, COLORS.BLACK);
			this.board[seventhRow][i] = new Piece(PIECES.PAWN, COLORS.WHITE);
		}

		//rooks
		this.board[0][0] = new Piece(PIECES.ROOK, COLORS.BLACK);
		this.board[0][this.board.length-1] = new Piece(PIECES.ROOK, COLORS.BLACK);
		this.board[this.board.length-1][0] = new Piece(PIECES.ROOK, COLORS.WHITE);
		this.board[this.board.length-1][this.board.length-1] = new Piece(PIECES.ROOK, COLORS.WHITE);

		//knight
		this.board[0][1] = new Piece(PIECES.KNIGHT, COLORS.BLACK);
		this.board[0][6] = new Piece(PIECES.KNIGHT, COLORS.BLACK);
		this.board[7][1] = new Piece(PIECES.KNIGHT, COLORS.WHITE);
		this.board[7][6] = new Piece(PIECES.KNIGHT, COLORS.WHITE);

		//bishop
		this.board[0][2] = new Piece(PIECES.BISHOP, COLORS.BLACK);
		this.board[0][5] = new Piece(PIECES.BISHOP, COLORS.BLACK);
		this.board[7][2] = new Piece(PIECES.BISHOP, COLORS.WHITE);
		this.board[7][5] = new Piece(PIECES.BISHOP, COLORS.WHITE);

		//queen
		this.board[0][3] = new Piece(PIECES.QUEEN, COLORS.BLACK);
		this.board[7][3] = new Piece(PIECES.QUEEN, COLORS.WHITE);

		//king
		this.board[0][4] = new Piece(PIECES.KING, COLORS.BLACK);
		this.board[7][4] = new Piece(PIECES.KING, COLORS.WHITE);
	}
}

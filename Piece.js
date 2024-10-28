class Piece {
	constructor(pieceType, color) {
		this.pieceType = pieceType;
		this.color = color;
		this.hasMoved = false;
	}

	isEmpty() {
		return this.pieceType == PIECES.EMPTY;
	}
}

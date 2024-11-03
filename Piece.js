class Piece {
	constructor(pieceType, color, pos) {
		this.pieceType = pieceType;
		this.color = color;
		this.hasMoved = false;
		this.pos = pos;
	}

	isEmpty() {
		return this.pieceType == PIECES.EMPTY;
	}
}

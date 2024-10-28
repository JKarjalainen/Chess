class Pos {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.canvasX = x*BOARD_SIZE/8;
		this.canvasY = y*BOARD_SIZE/8;
		
	}

	equals(pos) {
		return this.x == pos.x && this.y == pos.y;
	}
}

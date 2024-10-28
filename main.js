"use strict"

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = BOARD_SIZE;
canvas.width = WIDTH;
canvas.height = WIDTH;
let mousedownX, mouseupX;
let mousedownY, mouseupY;

const board = new Board(WIDTH);

canvas.addEventListener("mousedown", (e) => {
	mousedownX = Math.floor(e.offsetX / WIDTH * 8);
	mousedownY = Math.floor(e.offsetY / WIDTH * 8);
});

canvas.addEventListener("mouseup", (e) => {
	mouseupX = Math.floor(e.offsetX / WIDTH * 8);
	mouseupY = Math.floor(e.offsetY / WIDTH * 8);

	if(board.moveIsValid(new Pos(mousedownX, mousedownY), new Pos(mouseupX, mouseupY))) {
		board.movePieceInPos(new Pos(mousedownX, mousedownY), new Pos(mouseupX, mouseupY));
	}
	update();
});

const update = () => {
	clearCanvas();
	board.draw();
}

const clearCanvas = () => {
	ctx.clearRect(0, 0, WIDTH, WIDTH);
}

update();
window.onload = () => {
	update();
}

const interval = setInterval(update(), 1000);

"use strict"

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = BOARD_SIZE;
canvas.width = WIDTH;
canvas.height = WIDTH;
let mousedownX, mouseupX;
let mousedownY, mouseupY;
let mousePos;

const board = new Board(WIDTH);

canvas.addEventListener("mousedown", (e) => {
	mousedownX = Math.floor(e.offsetX / WIDTH * 8);
	mousedownY = Math.floor(e.offsetY / WIDTH * 8);
	mousePos = getMousePos(canvas, e);	
	let pos = new Pos(mousedownX, mousedownY) 
	board.holding = board.getPieceInPos(pos);
	board.holdingStartPos = pos;
});

canvas.addEventListener("mouseup", (e) => {
	mouseupX = Math.floor(e.offsetX / WIDTH * 8);
	mouseupY = Math.floor(e.offsetY / WIDTH * 8);

	if(board.moveIsValid(new Pos(mousedownX, mousedownY), new Pos(mouseupX, mouseupY))) {
		board.movePieceInPos(new Pos(mousedownX, mousedownY), new Pos(mouseupX, mouseupY));
	}
	board.holding = null;
	board.holdingStartPos = null;
	update();
});

canvas.addEventListener("mousemove", e => {
	if(!board.holding) return;
	mousePos = getMousePos(canvas, e);	

})

const update = () => {
	clearCanvas();
	board.draw();
	board.drawHolding(mousePos);
	window.requestAnimationFrame(update);
}

const clearCanvas = () => {
	ctx.clearRect(0, 0, WIDTH, WIDTH);
}

update();
window.onload = () => {
	update();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Pos (
        (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
	);
}

window.requestAnimationFrame(update);


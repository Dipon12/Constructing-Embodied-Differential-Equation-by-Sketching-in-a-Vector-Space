// squareShape.js - Handles the square shape creation

export function drawSquare() {
    let shapeX = 200 + (window.innerWidth - 200) / 2;
    let shapeY = window.innerHeight / 2;
    let squareObj = { type: "square", x: shapeX, y: shapeY, size: 100 };
    window.movableObjects.push(squareObj);
  }
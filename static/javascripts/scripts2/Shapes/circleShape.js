// circleShape.js - Handles the circle shape creation

export function drawCircle() {
    let shapeX = 200 + (window.innerWidth - 200) / 2;
    let shapeY = window.innerHeight / 2;
    let circleObj = { type: "circle", x: shapeX, y: shapeY, r: 50 };
    window.movableObjects.push(circleObj);
  }
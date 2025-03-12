// triangleShape.js - Handles the triangle shape creation

export function drawTriangle() {
    let shapeX = 200 + (window.innerWidth - 200) / 2;
    let shapeY = window.innerHeight / 2;
    let triangleObj = { type: "triangle", x: shapeX, y: shapeY, halfWidth: 50, topOffset: 40, bottomOffset: 40 };
    window.movableObjects.push(triangleObj);
  }
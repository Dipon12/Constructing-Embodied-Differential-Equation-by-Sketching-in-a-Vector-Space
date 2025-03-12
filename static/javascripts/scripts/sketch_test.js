// Import the functions from separate files
import { createButton } from './button_test.js';
import { drawCircle } from './circle_test.js';

// Variables to store circle properties
let circleX = 200;
let circleY = 200;
let circleRadius = 50;
let isCircleVisible = false;

function setup() {
  createCanvas(400, 400);
  
  // Create the button and pass the callback function
  createButton(toggleCircle);
}

function draw() {
  background(220);
  
  // Only draw the circle if it's visible
  if (isCircleVisible) {
    drawCircle(circleX, circleY, circleRadius);
  }
}

// Callback function to toggle circle visibility
function toggleCircle() {
  isCircleVisible = !isCircleVisible;
}

// Make these functions available to the module imports
window.setup = setup;
window.draw = draw;
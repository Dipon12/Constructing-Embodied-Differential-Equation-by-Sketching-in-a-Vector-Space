// Function to draw a circle
export function drawCircle(x, y, radius) {
    // Set styling for the circle
    fill(100, 150, 255);
    stroke(50, 100, 200);
    strokeWeight(2);
    
    // Draw the circle
    circle(x, y, radius * 2);
  }
export function drawGrid() {

  console.log("Grid drawn.");
  const CELL_SIZE = 100;
  const GRID_COLOR = color(204, 204, 204, 51); 

  stroke(GRID_COLOR);
  strokeWeight(1);

  for (let x = 0; x < width; x += CELL_SIZE) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += CELL_SIZE) {
    line(0, y, width, y);
  }
}

export function windowResized() {
  console.log("Window Resized");
  resizeCanvas(windowWidth, windowHeight);
  background('#181818');
  drawGrid();
}

export function drawGrid(p) {
    const CELL_SIZE = 100;
    const GRID_COLOR = p.color(204, 204, 204, 51);
    p.stroke(GRID_COLOR);
    p.strokeWeight(1);
    for (let x = 0; x < p.width; x += CELL_SIZE) {
      p.line(x, 0, x, p.height);
    }
    for (let y = 0; y < p.height; y += CELL_SIZE) {
      p.line(0, y, p.width, y);
    }
  }
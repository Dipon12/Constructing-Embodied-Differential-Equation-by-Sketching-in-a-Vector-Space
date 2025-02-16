export function sketch(p) {
  const sidebarWidth = 200;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background('#181818');
    drawGrid(); // Sidebar will be drawn separately in index.js

    // Create a sample drawing tool button in the bottom third of the sidebar.
    drawToolButton = p.createButton('Tool 1');
    drawToolButton.position(20, p.windowHeight * 2 / 3 + 20);
  };

  function drawGrid() {
    const CELL_SIZE = 100;
    const GRID_COLOR = p.color(204, 204, 204, 51); // #ccc with 20% opacity

    p.stroke(GRID_COLOR);
    p.strokeWeight(1);

    // Define the drawing area to the right of the sidebar.
    let gridXStart = sidebarWidth;

    // Draw vertical grid lines for the drawing area.
    for (let x = gridXStart; x <= p.width; x += CELL_SIZE) {
      p.line(x, 0, x, p.height);
    }

    // Draw horizontal grid lines for the drawing area.
    for (let y = 0; y <= p.height; y += CELL_SIZE) {
      p.line(gridXStart, y, p.width, y);
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background('#181818');
    drawGrid(); // Sidebar will be drawn from index.js
    
    // Reposition the tool button inside the third section.
    if (drawToolButton) {
      drawToolButton.position(20, p.windowHeight * 2 / 3 + 20);
    }
  };

  // Expose sidebar drawing function (so it can be called from index.js)

}

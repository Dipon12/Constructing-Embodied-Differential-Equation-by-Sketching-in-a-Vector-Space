import { sketch } from "./grid.js"; // Import p5 sketch
import { drawSidebar } from "./sidebar.js"; // Import sidebar function

const p5Instance = new p5((p) => {
  const sidebarWidth = 200;
  const sketchInstance = sketch(p);

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background('#181818');

    // Draw sidebar using imported function
    drawSidebar(p, sidebarWidth);
  };

  p.draw = function () {
    // Call the draw function from the sketch instance
    sketchInstance.drawSidebar();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background('#181818');

    // Redraw sidebar on resize
    drawSidebar(p, sidebarWidth);
  };
});

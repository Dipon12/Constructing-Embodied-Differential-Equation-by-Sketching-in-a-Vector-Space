// sketch.js - Main entry point for the p5.js application
import { drawGrid } from "./interface/grid.js";
import { drawSidebar, addSidebarButtons } from "./interface/sidebar.js";
import {
  Pendulum,
  activatePendulumTool,
  handlePendulumPointerEvents,
} from "./tools/pendulumTool.js";
import {
  activatePencilTool,
  handlePencilPointerDown,
  handlePencilPointerMove,
  handlePencilPointerUp,
} from "./tools/pencilTool.js";
import {
  drawMovableObjects,
  hitTest,
  getObjectCenter,
  moveObjectTo,
} from "./utils/objectManager.js";
import { drawCircle } from "./shapes/circleShape.js";
import { drawSquare } from "./shapes/squareShape.js";
import { drawTriangle } from "./shapes/triangleShape.js";
import { GroupObject } from "./utils/groupObject.js";
import { 
  copyBrushButtonTool, 
  handleCopyBrushMousePressed as handleCopyBrushPointerDown, 
  handleCopyBrushMouseDragged as handleCopyBrushPointerMove, 
  handleCopyBrushMouseReleased as handleCopyBrushPointerUp, 
  drawCopyBrushElements,
  isCopyBrushModeActive
} from './tools/copyBrushTool.js';


import { 
  equationBrushButtonTool, 
  handleEquationBrushMousePressed,
  handleEquationBrushMouseDragged,
  handleEquationBrushMouseReleased,
  drawEquationBrushElements,
  isEquationBrushModeActive
} from './tools/equationBrushTool.js';

import {
  calculatorFunction,
  addCalculatorInterface,
} from "./tools/calculator.js";

// Global variables
let pendulumLayer, pendulum;
window.drawing = false;
let isPendulumActive = false;
let cellSize;

window.drawing = drawing;

// Expose functions globally for button callbacks
window.activatePendulumTool = activatePendulumTool;
window.activatePencilTool = activatePencilTool;
window.drawCircle = drawCircle;
window.drawSquare = drawSquare;
window.drawTriangle = drawTriangle;
window.copyBrushButtonTool = copyBrushButtonTool;
window.equationBrushButtonTool = equationBrushButtonTool;
window.calculatorFunction = calculatorFunction;

// Create a new p5 instance
const sketch = (p) => {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    updateGridSize(p);

    pendulumLayer = p.createGraphics(p.windowWidth, p.windowHeight);
    pendulumLayer.clear();

    // Initial draw of background, grid, sidebar and UI buttons
    p.background("#181818");
    drawGrid(p);
    drawSidebar(p);
    addSidebarButtons(p);
    addCalculatorInterface(p);
  };

  p.draw = function () {
    // Clear background each frame
    p.background("#181818");
    drawGrid(p);
    drawSidebar(p);
    drawMovableObjects(p);

    // Draw copy brush elements (loop and selection)
    drawCopyBrushElements(p);

    drawEquationBrushElements(p);

    if (isPendulumActive && pendulum) {
      pendulumLayer.clear();
      pendulum.update();
      pendulum.displayOnLayer(pendulumLayer);
    }
    p.image(pendulumLayer, 0, 0);
  };

  // Add pointer properties to make them accessible in the same way as mouse properties
  p.updatePointerCoords = function (event) {
    const rect = p.canvas.getBoundingClientRect();
    // Get coordinates in CSS pixels (no devicePixelRatio multiplication)
    p.pointerX = event.clientX - rect.left;
    p.pointerY = event.clientY - rect.top;
  };

  p.pointerPressed = function (event) {
    p.updatePointerCoords(event);

    // Only allow interactions in the drawing area (outside the sidebar)
    if (p.pointerX < 200) return;

    // Check for pendulum interactions
    if (handlePendulumPointerEvents(p, "down")) {
      return;
    }

    // Check for copy brush interactions
    if (handleCopyBrushPointerDown(p)) {
      return;
    }

    if (handleEquationBrushMousePressed(p)) {
      return;
    }

    // Check if pointer is over a movable object (topmost first)
    for (let i = window.movableObjects.length - 1; i >= 0; i--) {
      let obj = window.movableObjects[i];
      if (hitTest(obj, p.pointerX, p.pointerY, p)) {
        window.selectedObject = obj;
        let center = getObjectCenter(obj);
        window.dragOffset.x = p.pointerX - center.x;
        window.dragOffset.y = p.pointerY - center.y;
        return;
      }
    }

    // If no object hit and pencil mode is active, start a new free-hand stroke
    if (drawing) {
      handlePencilPointerDown(p);
    }
  };

  p.pointerDragged = function (event) {
    p.updatePointerCoords(event);

    // Check for pendulum interactions
    if (handlePendulumPointerEvents(p, "move")) {
      return;
    }

    // Check for copy brush interactions
    if (handleCopyBrushPointerMove(p)) {
      return;
    }

    if (handleEquationBrushMouseDragged(p)) {
      return;
    }

    if (window.selectedObject) {
      let newCenterX = p.pointerX - window.dragOffset.x;
      let newCenterY = p.pointerY - window.dragOffset.y;
      moveObjectTo(window.selectedObject, newCenterX, newCenterY);
    } else if (drawing) {
      handlePencilPointerMove(p);
    }
  };

  p.pointerReleased = function (event) {
    p.updatePointerCoords(event);

    // Check for pendulum interactions
    if (handlePendulumPointerEvents(p, "up")) {
      return;
    }

    // Check for copy brush interactions
    if (handleCopyBrushPointerUp(p)) {
      return;
    }

    if (handleEquationBrushMouseReleased(p)) {
      return;
    }

    if (window.selectedObject) {
      window.selectedObject = null;
    } else if (drawing) {
      handlePencilPointerUp(p);
    }
  };

  // Set up pointer event listeners
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    updateGridSize(p);

    pendulumLayer = p.createGraphics(p.windowWidth, p.windowHeight);
    pendulumLayer.clear();

    // Initial draw of background, grid, sidebar and UI buttons
    p.background("#181818");
    drawGrid(p);
    drawSidebar(p);
    addSidebarButtons(p);
    addCalculatorInterface(p);

    // Add pointer event listeners to the canvas
    p.canvas.addEventListener("pointerdown", p.pointerPressed);

    p.canvas.addEventListener("pointermove", function (event) {
      // Only consider it a drag if the pointer is down
      if (event.buttons > 0) {
        p.pointerDragged(event);
      }
    });

    p.canvas.addEventListener("pointerup", p.pointerReleased);
    p.canvas.addEventListener("pointercancel", p.pointerReleased);
    p.canvas.addEventListener("pointerleave", p.pointerReleased);

    // Prevent touch scrolling on the canvas
    p.canvas.style.touchAction = "none";
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background("#181818");
    drawGrid(p);
    drawSidebar(p);
    addSidebarButtons(p);
    addCalculatorInterface(p);
  };
};

function updateGridSize(p) {
  cellSize = p.max(50, p.min(100, p.width / 20));
}

// Initialize global state
window.movableObjects = [];
window.currentStroke = null;
window.selectedObject = null;
window.dragOffset = { x: 0, y: 0 };

// Create the p5 instance
new p5(sketch);

// pencilTool.js - Handles the pencil drawing tool functionality

export function activatePencilTool() {
  // Turn off other tools first
  if (window.isPendulumActive) {
    window.activatePendulumTool();
  }
  
  // Reset copy brush if active
  if (window.copyBrushButton && window.copyBrushButton.style('background-color') === 'rgb(204, 204, 204)') {
    window.copyBrushButtonTool();
  }
  
  // Reset equation brush if active
  if (window.equationBrushButton && window.equationBrushButton.style('background-color') === 'rgb(204, 204, 204)') {
    window.equationBrushButtonTool();
  }

  console.log("Pencil Button Pressed!");
  window.drawing = !window.drawing;
  if (window.drawing) {
    window.pencilButton.style('background-color', '#cccccc');
  } else {
    window.pencilButton.style('background-color', '#333333');
  }
}

// Handle pointer events for pencil tool
export function handlePencilPointerDown(p) {
  if (!window.drawing) return false;
  
  // Only start drawing if pointer is outside the sidebar
  if (p.pointerX <= 200) return false;
  
  window.currentStroke = { type: "stroke", points: [{ x: p.pointerX, y: p.pointerY }] };
  return true;
}

export function handlePencilPointerMove(p) {
  if (!window.drawing || !window.currentStroke) return false;
  
  // Only continue drawing if pointer is outside the sidebar
  if (p.pointerX <= 200) return true; // Return true to still handle the event
  
  window.currentStroke.points.push({ x: p.pointerX, y: p.pointerY });
  return true;
}

export function handlePencilPointerUp(p) {
  if (!window.drawing || !window.currentStroke) return false;
  
  // Only add the stroke if it has at least 2 points
  if (window.currentStroke.points.length >= 2) {
    // Add the completed stroke to movable objects
    window.movableObjects.push(window.currentStroke);
  }
  
  window.currentStroke = null;
  return true;
}
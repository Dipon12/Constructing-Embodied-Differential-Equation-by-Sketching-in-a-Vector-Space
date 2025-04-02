// copyBrushTool.js - Improved to handle group dragging and continuous copying
import { drawSingleObject } from '../utils/objectManager.js';
import { GroupObject } from '../utils/groupObject.js';
import { 
  createSelectionLoop,
  addPointToLoop,
  closeSelectionLoop,
  hideSelectionLoop,
  drawSelectionLoop,
  findObjectsInsideLoop
} from '../utils/selectionLoop.js';

let isCopyBrushActive = false;
let currentCopyLoop = null;
let copyTemplate = null;  // Store the original group as a template
let copySelection = null; // Current copy being dragged
let isDraggingCopy = false;
let isPlacingNewCopy = false; // Flag to track if we're creating a new copy or moving an existing one

export function copyBrushButtonTool() {
  isCopyBrushActive = !isCopyBrushActive;
  
  // Deactivate other drawing modes
  window.drawing = false;
  if (window.pencilButton) {
    window.pencilButton.style('background-color', '#333333');
  }
  
  // Deactivate equation brush if active
  if (window.equationBrushButton && window.equationBrushButton.style('background-color') === 'rgb(204, 204, 204)') {
    window.equationBrushButtonTool();
  }
  
  // Reset the drawing state
  if (window.currentStroke) {
    window.currentStroke = null;
  }

  // Reset copy state when deactivating
  if (!isCopyBrushActive) {
    currentCopyLoop = null;
    copyTemplate = null;
    copySelection = null;
    isDraggingCopy = false;
    isPlacingNewCopy = false;
  }

  if (window.copyBrushButton) {
    if (isCopyBrushActive) {
      window.copyBrushButton.style('background-color', '#cccccc');
    } else {
      window.copyBrushButton.style('background-color', '#333333');
    }
  }
}

export function handleCopyBrushMousePressed(p) {
  if (!isCopyBrushActive) return false;
  
  // If we're already dragging a copy, place it
  if (copySelection && isDraggingCopy) {
    // Only add to movable objects if it's a new copy
    if (isPlacingNewCopy) {
      // Add the group object to movable objects array
      window.movableObjects.push(copySelection);
      isDraggingCopy = false;
      copySelection = null;
      
      // Create a new copy to continue dragging
      createNewCopyFromTemplate(p);
      isDraggingCopy = true;
      isPlacingNewCopy = true;
    } else {
      // Just stop dragging
      isDraggingCopy = false;
      copySelection = null;
    }
    
    return true;
  }
  
  // Start a new copy loop if we don't have a template yet
  if (!copyTemplate) {
    currentCopyLoop = {
      type: "copyLoop",
      ...createSelectionLoop(p.mouseX, p.mouseY)
    };
    return true;
  } else {
    // Create a new copy from the template when clicking without dragging
    createNewCopyFromTemplate(p);
    isDraggingCopy = true;
    isPlacingNewCopy = true; // Mark as a new copy being placed
    return true;
  }
}

export function handleCopyBrushMouseDragged(p) {
  if (!isCopyBrushActive) return false;
  
  if (currentCopyLoop && !currentCopyLoop.isClosed) {
    // Add point to the loop
    addPointToLoop(currentCopyLoop, p.mouseX, p.mouseY);
    return true;
  }
  
  if (copySelection && isDraggingCopy) {
    // Move the copy selection to follow the mouse
    copySelection.moveTo(p.mouseX, p.mouseY);
    return true;
  }
  
  return false;
}

export function handleCopyBrushMouseReleased(p) {
  if (!isCopyBrushActive) return false;
  
  if (currentCopyLoop && !currentCopyLoop.isClosed) {
    // Complete the loop
    closeSelectionLoop(currentCopyLoop);
    
    if (currentCopyLoop.isClosed) {
      // Create copy template from objects inside the loop
      createCopyTemplate(p);
      
      // Hide the loop once completed
      hideSelectionLoop(currentCopyLoop);
      
      // Create the first copy and start dragging
      createNewCopyFromTemplate(p);
      isDraggingCopy = true;
      isPlacingNewCopy = true; // Mark as a new copy being placed
    } else {
      // Clear the loop if it wasn't successfully closed (too few points)
      currentCopyLoop = null;
    }
    
    return true;
  }
  
  return false;
}

function createCopyTemplate(p) {
  if (!currentCopyLoop || !currentCopyLoop.isClosed) return;
  
  // Find objects inside the loop
  const objectsToGroup = [];
  const objectsInside = findObjectsInsideLoop(currentCopyLoop, window.movableObjects);
  
  // Exit if no objects found
  if (objectsInside.length === 0) {
    return;
  }
  
  // Create deep copies of the objects for the template
  for (let obj of objectsInside) {
    const copy = JSON.parse(JSON.stringify(obj));
    objectsToGroup.push(copy);
  }
  
  // Create a template group
  copyTemplate = new GroupObject(objectsToGroup);
  copyTemplate.storeRelativePositions();
}

function createNewCopyFromTemplate(p) {
  if (!copyTemplate) return;
  
  // Clone the template to create a new copy
  copySelection = copyTemplate.clone();
  
  // Position at mouse cursor
  copySelection.moveTo(p.mouseX, p.mouseY);
}

export function drawCopyBrushElements(p) {
  // Draw the current copy loop with dashed lines if active
  if (currentCopyLoop && currentCopyLoop.isActive) {
    drawSelectionLoop(p, currentCopyLoop, p.color(255, 0, 0)); // Red for copy brush
  }
  
  // Draw the current selection being dragged
  if (copySelection && isDraggingCopy) {
    p.push();
    
    // Draw the group objects
    for (let obj of copySelection.members) {
      drawSingleObject(p, obj);
    }
    
    // Draw a bounding box around the group
    p.stroke(0, 255, 0, 150);
    p.strokeWeight(1);
    p.noFill();
    p.drawingContext.setLineDash([5, 5]);
    p.rect(copySelection.minX, copySelection.minY, copySelection.width, copySelection.height);
    p.drawingContext.setLineDash([]);
    
    p.pop();
  }
}

export function isCopyBrushModeActive() {
  return isCopyBrushActive;
}
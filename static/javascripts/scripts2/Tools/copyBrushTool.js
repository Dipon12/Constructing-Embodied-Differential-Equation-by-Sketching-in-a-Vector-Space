// copyBrushTool.js - Handles the copy brush tool functionality
import { drawSingleObject } from '../utils/objectManager.js';
import { GroupObject } from '../utils/groupObject.js';

let isCopyBrushActive = false;
let currentCopyLoop = null;
let copySelection = null;
let isDraggingCopy = false;
let copyOffset = { x: 0, y: 0 };

export function copyBrushButtonTool() {
  isCopyBrushActive = !isCopyBrushActive;
  
  // Deactivate other drawing modes
  window.drawing = false;
  if (window.pencilButton) {
    window.pencilButton.style('background-color', '#333333');
  }
  
  // Reset the drawing state
  if (window.currentStroke) {
    window.currentStroke = null;
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
    isDraggingCopy = false;
    
    // Add the group object to movable objects array
    window.movableObjects.push(copySelection);
    
    copySelection = null;
    return true;
  }
  
  // Start a new copy loop
  currentCopyLoop = {
    type: "copyLoop",
    points: [{ x: p.mouseX, y: p.mouseY }],
    isClosed: false
  };
  
  return true;
}

export function handleCopyBrushMouseDragged(p) {
  if (!isCopyBrushActive) return false;
  
  if (currentCopyLoop && !currentCopyLoop.isClosed) {
    // Add point to the loop
    currentCopyLoop.points.push({ x: p.mouseX, y: p.mouseY });
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
    // Complete the loop by adding the first point again
    if (currentCopyLoop.points.length > 2) {
      currentCopyLoop.isClosed = true;
      
      // Create copy of objects inside the loop
      createCopyOfObjectsInsideLoop(p);
      
      // Start dragging the copy
      isDraggingCopy = true;
    }
    
    // Clear the loop
    currentCopyLoop = null;
    
    return true;
  }
  
  return false;
}

function createCopyOfObjectsInsideLoop(p) {
  if (!currentCopyLoop || !currentCopyLoop.isClosed) return;
  
  const objectsToGroup = [];
  
  // Check each object if it's inside the loop
  for (let obj of window.movableObjects) {
    let isInside = false;
    
    if (obj.type === "circle") {
      isInside = isPointInPolygon(obj.x, obj.y, currentCopyLoop.points);
    } else if (obj.type === "square") {
      isInside = isPointInPolygon(obj.x, obj.y, currentCopyLoop.points);
    } else if (obj.type === "triangle") {
      isInside = isPointInPolygon(obj.x, obj.y, currentCopyLoop.points);
    } else if (obj.type === "stroke") {
      // For strokes, check if most points are inside
      let pointsInside = 0;
      for (let point of obj.points) {
        if (isPointInPolygon(point.x, point.y, currentCopyLoop.points)) {
          pointsInside++;
        }
      }
      isInside = pointsInside > obj.points.length / 2;
    } else if (obj.type === "group") {
      // For groups, check if the center is inside
      isInside = isPointInPolygon(obj.x, obj.y, currentCopyLoop.points);
    }
    
    if (isInside) {
      // Create a deep copy of the object
      const copy = JSON.parse(JSON.stringify(obj));
      objectsToGroup.push(copy);
    }
  }
  
  // If we found objects inside the loop, create a group
  if (objectsToGroup.length > 0) {
    const groupObj = new GroupObject(objectsToGroup);
    
    // Store relative positions for dragging
    groupObj.storeRelativePositions();
    
    // Set the copy selection to this grouped object
    copySelection = groupObj;
  }
}

// Function to check if a point is inside a polygon (the copy loop)
function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) && 
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

export function drawCopyBrushElements(p) {
  // Draw the current copy loop with dashed lines
  if (currentCopyLoop) {
    p.push();
    p.stroke(255, 0, 0);
    p.strokeWeight(2);
    p.noFill();
    
    // Draw dashed line
    p.drawingContext.setLineDash([5, 5]);
    
    p.beginShape();
    for (let point of currentCopyLoop.points) {
      p.vertex(point.x, point.y);
    }
    
    if (currentCopyLoop.isClosed) {
      p.endShape(p.CLOSE);
    } else {
      p.endShape();
    }
    
    p.drawingContext.setLineDash([]);
    p.pop();
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
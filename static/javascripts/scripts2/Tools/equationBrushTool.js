// equationBrushTool.js - Complete rewrite to match the copyBrushTool pattern
import { 
  createSelectionLoop,
  addPointToLoop,
  closeSelectionLoop,
  hideSelectionLoop,
  drawSelectionLoop,
  findObjectsInsideLoop,
  sortObjectsLeftToRight,
  calculateObjectSize,
  calculateDistance,
  getObjectCenter
} from '../utils/selectionLoop.js';

// Use global variables similar to copyBrushTool
let isEquationBrushActive = false;
let currentEquationLoop = null;
let isDraggingEquationSelection = false;

// Main function that gets called when the button is clicked
export function equationBrushButtonTool() {
  console.log("Equation Brush Button Clicked!");
  
  // Toggle the active state
  isEquationBrushActive = !isEquationBrushActive;
  
  // Deactivate other drawing modes
  window.drawing = false;
  if (window.pencilButton) {
    window.pencilButton.style('background-color', '#333333');
  }
  
  // Reset copy brush if active
  if (window.copyBrushButton && window.copyBrushButton.style('background-color') === 'rgb(204, 204, 204)') {
    window.copyBrushButtonTool();
  }
  
  // Reset the drawing state
  if (window.currentStroke) {
    window.currentStroke = null;
  }

  // Reset equation state when deactivating
  if (!isEquationBrushActive) {
    currentEquationLoop = null;
    isDraggingEquationSelection = false;
  }

  // Update button appearance - THIS IS THE KEY PART
  if (window.equationBrushButton) {
    if (isEquationBrushActive) {
      window.equationBrushButton.style('background-color', '#cccccc');
      console.log("Equation brush activated, button color changed");
    } else {
      window.equationBrushButton.style('background-color', '#333333');
      console.log("Equation brush deactivated, button color changed");
    }
  } else {
    console.error("equationBrushButton not found in window object");
  }
}

// Mouse/pointer event handlers
export function handleEquationBrushMousePressed(p) {
  if (!isEquationBrushActive) return false;
  
  console.log("Equation brush mouse pressed");
  
  // If we're already dragging a selection, finalize
  if (isDraggingEquationSelection) {
    isDraggingEquationSelection = false;
    processEquationData();
    
    // Reset the loop
    currentEquationLoop = null;
    return true;
  }
  
  // Start a new equation loop
  currentEquationLoop = {
    type: "equationLoop",
    ...createSelectionLoop(p.mouseX, p.mouseY)
  };
  
  return true;
}

export function handleEquationBrushMouseDragged(p) {
  if (!isEquationBrushActive) return false;
  
  if (currentEquationLoop && !currentEquationLoop.isClosed) {
    // Add point to the loop
    addPointToLoop(currentEquationLoop, p.mouseX, p.mouseY);
    return true;
  }
  
  return false;
}

export function handleEquationBrushMouseReleased(p) {
  if (!isEquationBrushActive) return false;
  
  console.log("Equation brush mouse released");
  
  if (currentEquationLoop && !currentEquationLoop.isClosed) {
    // Complete the loop
    closeSelectionLoop(currentEquationLoop);
    
    if (currentEquationLoop.isClosed) {
      console.log("Loop closed successfully");
      // Analyze objects inside the loop
      analyzeObjectsInsideLoop(p);
      
      // Start dragging the selection
      isDraggingEquationSelection = true;
      
      // Hide the selection loop after analysis
      hideSelectionLoop(currentEquationLoop);
    } else {
      // Clear the loop if it wasn't successfully closed (too few points)
      console.log("Loop not closed (too few points)");
      currentEquationLoop = null;
    }
    
    return true;
  }
  
  return false;
}

// Analysis and processing functions
function analyzeObjectsInsideLoop(p) {
  if (!currentEquationLoop || !currentEquationLoop.isClosed) return;
  
  // Find objects inside the loop
  const objectsInside = findObjectsInsideLoop(currentEquationLoop, window.movableObjects);
  console.log("Objects inside loop:", objectsInside.length);
  
  // Sort objects from left to right
  const sortedObjects = sortObjectsLeftToRight(objectsInside);
  
  // Arrays to store time (distances) and attributes (sizes)
  const timeArray = [];
  const attributeArray = [];
  
  // Group objects by type for analysis
  const groups = [];
  let currentGroup = null;
  let lastObjectCenter = null;
  
  // Process objects and identify groups
  for (let i = 0; i < sortedObjects.length; i++) {
    const obj = sortedObjects[i];
    const objCenter = getObjectCenter(obj);
    
    // Calculate size for all objects
    const size = calculateObjectSize(obj);
    attributeArray.push(size);
    
    // Add object to its appropriate group or create a new one
    if (obj.type === "group") {
      // Groups are already processed as their own entity
      groups.push(obj);
    } else {
      // Determine if this object belongs to a new or existing group
      if (!currentGroup || 
          (lastObjectCenter && calculateDistance(lastObjectCenter, objCenter) > 150)) {
        currentGroup = [obj];
        groups.push(currentGroup);
      } else {
        currentGroup.push(obj);
      }
    }
    
    lastObjectCenter = objCenter;
    
    // Calculate distance to the next object
    if (i < sortedObjects.length - 1) {
      const nextObj = sortedObjects[i + 1];
      const distance = calculateDistance(obj, nextObj);
      timeArray.push(distance);
    }
  }
  
  // Store the data for processing
  currentEquationLoop.objectsInside = sortedObjects;
  currentEquationLoop.groups = groups;
  currentEquationLoop.timeArray = timeArray;
  currentEquationLoop.attributeArray = attributeArray;
  
  console.log("Analysis complete:", {
    objects: sortedObjects.length,
    groups: groups.length,
    distances: timeArray,
    sizes: attributeArray
  });
}

function processEquationData() {
  if (!currentEquationLoop || !currentEquationLoop.timeArray || !currentEquationLoop.attributeArray) {
    console.log("No data to process");
    return;
  }
  
  // Send data to the backend
  sendArrays(currentEquationLoop.timeArray, currentEquationLoop.attributeArray);
}

async function sendArrays(timeArray, attributeArray) {
  const data = { timeArray, attributeArray };

  console.log("Inside sendArrays - data to be sent:", data);
  
  try {
    const response = await fetch('http://127.0.0.1:5000/diff_eqn_generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log('Processed result:', result);  // Processed result from Python
  } catch (error) {
    console.error('Error sending data to the backend:', error);
  }
}

// Drawing function
export function drawEquationBrushElements(p) {
  // Only proceed if equation brush is active or we have a loop
  if (!isEquationBrushActive && !currentEquationLoop) return;
  
  // Draw the current equation loop with dashed lines if it's active
  if (currentEquationLoop && currentEquationLoop.isActive) {
    console.log("Drawing equation loop");
    drawSelectionLoop(p, currentEquationLoop, p.color(0, 255, 0)); // Green for equation brush
  }
  
  // If the loop is closed and has analyzed objects, draw additional information
  if (currentEquationLoop && currentEquationLoop.isClosed && currentEquationLoop.objectsInside) {
    p.push();
    
    // Draw indicators for selected objects
    for (let i = 0; i < currentEquationLoop.objectsInside.length; i++) {
      const obj = currentEquationLoop.objectsInside[i];
      const center = getObjectCenter(obj);
      
      // Draw order number
      p.fill(0, 255, 0);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(i + 1, center.x, center.y - 20);
      
      // Draw size value
      if (currentEquationLoop.attributeArray && i < currentEquationLoop.attributeArray.length) {
        p.text(`S: ${Math.round(currentEquationLoop.attributeArray[i])}`, center.x, center.y + 20);
      }
      
      // Draw distance to next
      if (currentEquationLoop.timeArray && i < currentEquationLoop.timeArray.length) {
        const nextObj = currentEquationLoop.objectsInside[i + 1];
        const nextCenter = getObjectCenter(nextObj);
        
        // Draw line between objects
        p.stroke(0, 255, 0, 150);
        p.drawingContext.setLineDash([2, 2]);
        p.line(center.x, center.y, nextCenter.x, nextCenter.y);
        
        // Draw distance text
        p.fill(0, 255, 0);
        p.noStroke();
        p.text(`D: ${Math.round(currentEquationLoop.timeArray[i])}`, 
          (center.x + nextCenter.x) / 2, 
          (center.y + nextCenter.y) / 2 - 10);
      }
    }
    
    // Draw group visualization if we have groups
    if (currentEquationLoop.groups) {
      p.strokeWeight(2);
      p.stroke(0, 200, 255, 100);
      p.noFill();
      
      // Draw rectangles around each group
      currentEquationLoop.groups.forEach((group, groupIndex) => {
        if (Array.isArray(group)) {
          // Find bounding box for the group
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          
          group.forEach(obj => {
            const center = getObjectCenter(obj);
            let size = 0;
            
            if (obj.type === "circle") {
              size = obj.r;
              minX = Math.min(minX, center.x - size);
              maxX = Math.max(maxX, center.x + size);
              minY = Math.min(minY, center.y - size);
              maxY = Math.max(maxY, center.y + size);
            } else if (obj.type === "square") {
              size = obj.size / 2;
              minX = Math.min(minX, center.x - size);
              maxX = Math.max(maxX, center.x + size);
              minY = Math.min(minY, center.y - size);
              maxY = Math.max(maxY, center.y + size);
            } else if (obj.type === "triangle") {
              minX = Math.min(minX, obj.x - obj.halfWidth);
              maxX = Math.max(maxX, obj.x + obj.halfWidth);
              minY = Math.min(minY, obj.y - obj.topOffset);
              maxY = Math.max(maxY, obj.y + obj.bottomOffset);
            } else if (obj.type === "stroke") {
              for (let point of obj.points) {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                minY = Math.min(minY, point.y);
                maxY = Math.max(maxY, point.y);
              }
            }
          });
          
          // Add padding
          const padding = 10;
          minX -= padding;
          maxX += padding;
          minY -= padding;
          maxY += padding;
          
          // Draw the group bounding box
          p.rect(minX, minY, maxX - minX, maxY - minY);
          
          // Label the group
          p.fill(0, 200, 255);
          p.noStroke();
          p.text(`Group ${groupIndex + 1}`, (minX + maxX) / 2, minY - 10);
          
        } else if (group.type === "group") {
          // For existing group objects, draw around their bounds
          p.rect(group.minX - 10, group.minY - 10, 
                group.width + 20, group.height + 20);
                
          // Label the group
          p.fill(0, 200, 255);
          p.noStroke();
          p.text(`Group ${groupIndex + 1}`, group.x, group.minY - 10);
        }
      });
    }
    
    p.pop();
  }
}

// Helper function for other modules to check if the equation brush is active
export function isEquationBrushModeActive() {
  return isEquationBrushActive;
}
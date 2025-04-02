// selectionLoopTool.js - Shared functionality with additional updates

// Function to check if a point is inside a polygon
export function isPointInPolygon(x, y, polygon) {
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

// Function to get the center of an object based on its type
export function getObjectCenter(obj) {
  if (obj.type === "stroke") {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let p of obj.points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  } else if (obj.type === "group") {
    return { x: obj.x, y: obj.y };
  } else {
    return { x: obj.x, y: obj.y };
  }
}

// Function to create a selection loop
export function createSelectionLoop(mouseX, mouseY) {
  return {
    points: [{ x: mouseX, y: mouseY }],
    isClosed: false,
    isActive: true  // New property to track if loop should be visible
  };
}

// Function to add a point to a selection loop
export function addPointToLoop(loop, mouseX, mouseY) {
  if (!loop || loop.isClosed || !loop.isActive) return loop;
  loop.points.push({ x: mouseX, y: mouseY });
  return loop;
}

// Function to close a selection loop
export function closeSelectionLoop(loop) {
  if (!loop || loop.isClosed || !loop.isActive) return loop;
  if (loop.points.length > 2) {
    loop.isClosed = true;
  }
  return loop;
}

// Function to hide a selection loop
export function hideSelectionLoop(loop) {
  if (!loop) return loop;
  loop.isActive = false;
  return loop;
}

// Function to draw a selection loop
export function drawSelectionLoop(p, loop, strokeColor) {
  if (!loop || !loop.isActive) return;
  
  p.push();
  p.stroke(strokeColor);
  p.strokeWeight(2);
  p.noFill();
  
  // Draw dashed line
  p.drawingContext.setLineDash([5, 5]);
  
  p.beginShape();
  for (let point of loop.points) {
    p.vertex(point.x, point.y);
  }
  
  if (loop.isClosed) {
    p.endShape(p.CLOSE);
  } else {
    p.endShape();
  }
  
  p.drawingContext.setLineDash([]);
  p.pop();
}

// Function to find objects inside a selection loop
export function findObjectsInsideLoop(loop, movableObjects) {
  if (!loop || !loop.isClosed) return [];
  
  const objectsInside = [];
  
  for (let obj of movableObjects) {
    let isInside = false;
    
    if (obj.type === "circle") {
      isInside = isPointInPolygon(obj.x, obj.y, loop.points);
    } else if (obj.type === "square") {
      isInside = isPointInPolygon(obj.x, obj.y, loop.points);
    } else if (obj.type === "triangle") {
      isInside = isPointInPolygon(obj.x, obj.y, loop.points);
    } else if (obj.type === "stroke") {
      // For strokes, check if most points are inside
      let pointsInside = 0;
      for (let point of obj.points) {
        if (isPointInPolygon(point.x, point.y, loop.points)) {
          pointsInside++;
        }
      }
      isInside = pointsInside > obj.points.length / 2;
    } else if (obj.type === "group") {
      // For groups, check if the center is inside
      isInside = isPointInPolygon(obj.x, obj.y, loop.points);
    }
    
    if (isInside) {
      objectsInside.push(obj);
    }
  }
  
  return objectsInside;
}

// Function to sort objects from left to right
export function sortObjectsLeftToRight(objects) {
  return [...objects].sort((a, b) => {
    const centerA = getObjectCenter(a);
    const centerB = getObjectCenter(b);
    return centerA.x - centerB.x;
  });
}

// Function to calculate object size based on type
export function calculateObjectSize(obj) {
  let size = 0;
  if (obj.type === "circle") {
    size = obj.r * 2; // Diameter
  } else if (obj.type === "square") {
    size = obj.size;
  } else if (obj.type === "triangle") {
    size = obj.halfWidth * 2; // Full width
  } else if (obj.type === "stroke") {
    // For strokes, calculate the approximate size
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let point of obj.points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    size = Math.max(maxX - minX, maxY - minY);
  } else if (obj.type === "group") {
    size = Math.max(obj.width, obj.height);
  }
  return size;
}

// Function to calculate distance between two objects
export function calculateDistance(obj1, obj2) {
  const center1 = getObjectCenter(obj1);
  const center2 = getObjectCenter(obj2);
  return Math.sqrt(
    Math.pow(center2.x - center1.x, 2) +
    Math.pow(center2.y - center1.y, 2)
  );
}
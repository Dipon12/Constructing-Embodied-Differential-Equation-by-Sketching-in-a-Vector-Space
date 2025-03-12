// objectManager.js - Handles drawing and manipulating movable objects

export function drawMovableObjects(p) {
    // Draw stored objects
    for (let obj of window.movableObjects) {
      drawSingleObject(p, obj);
    }
    
    // Draw current free-hand stroke in real-time if it exists
    if (window.currentStroke) {
      p.stroke(255);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let point of window.currentStroke.points) {
        p.vertex(point.x, point.y);
      }
      p.endShape();
    }
  }
  
  // Helper function to draw a single object
  export function drawSingleObject(p, obj) {
    if (obj.type === "circle") {
      p.fill(255, 150);
      p.noStroke();
      p.ellipse(obj.x, obj.y, obj.r * 2, obj.r * 2);
    } else if (obj.type === "square") {
      p.fill(255, 150);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(obj.x, obj.y, obj.size, obj.size);
      p.rectMode(p.CORNER);
    } else if (obj.type === "triangle") {
      p.fill(255, 150);
      p.noStroke();
      let ax = obj.x, ay = obj.y - obj.topOffset;
      let bx = obj.x - obj.halfWidth, by = obj.y + obj.bottomOffset;
      let cx = obj.x + obj.halfWidth, cy = obj.y + obj.bottomOffset;
      p.triangle(ax, ay, bx, by, cx, cy);
    } else if (obj.type === "stroke") {
      p.stroke(255);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let point of obj.points) {
        p.vertex(point.x, point.y);
      }
      p.endShape();
    } else if (obj.type === "group") {
      // Draw group members
      for (let member of obj.members) {
        drawSingleObject(p, member);
      }
      
      // If this group is selected, draw a bounding box
      if (window.selectedObject === obj) {
        p.push();
        p.stroke(0, 255, 0, 150);
        p.strokeWeight(1);
        p.noFill();
        p.drawingContext.setLineDash([5, 5]);
        p.rect(obj.minX, obj.minY, obj.width, obj.height);
        p.drawingContext.setLineDash([]);
        p.pop();
      }
    }
  }
  
  export function hitTest(obj, mx, my, p) {
    if (obj.type === "circle") {
      return p.dist(mx, my, obj.x, obj.y) <= obj.r;
    } else if (obj.type === "square") {
      return mx >= obj.x - obj.size / 2 && mx <= obj.x + obj.size / 2 &&
             my >= obj.y - obj.size / 2 && my <= obj.y + obj.size / 2;
    } else if (obj.type === "triangle") {
      let ax = obj.x, ay = obj.y - obj.topOffset;
      let bx = obj.x - obj.halfWidth, by = obj.y + obj.bottomOffset;
      let cx = obj.x + obj.halfWidth, cy = obj.y + obj.bottomOffset;
      return pointInTriangle(mx, my, ax, ay, bx, by, cx, cy, p);
    } else if (obj.type === "stroke") {
      for (let point of obj.points) {
        if (p.dist(mx, my, point.x, point.y) < 5) return true;
      }
      return false;
    } else if (obj.type === "group") {
      // Check if the point is inside the group's bounding box
      return (mx >= obj.minX && mx <= obj.maxX && 
              my >= obj.minY && my <= obj.maxY);
    }
    return false;
  }
  
  function pointInTriangle(px, py, ax, ay, bx, by, cx, cy, p) {
    let areaOrig = p.abs(ax*(by - cy) + bx*(cy - ay) + cx*(ay - by));
    let area1 = p.abs(px*(by - cy) + bx*(cy - py) + cx*(py - by));
    let area2 = p.abs(ax*(py - cy) + px*(cy - ay) + cx*(ay - py));
    let area3 = p.abs(ax*(by - py) + bx*(py - ay) + px*(ay - by));
    return p.abs(areaOrig - (area1 + area2 + area3)) < 0.1;
  }
  
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
  
  export function moveObjectTo(obj, newCenterX, newCenterY) {
    if (obj.type === "stroke") {
      let center = getObjectCenter(obj);
      let dx = newCenterX - center.x;
      let dy = newCenterY - center.y;
      for (let p of obj.points) {
        p.x += dx;
        p.y += dy;
      }
    } else if (obj.type === "group") {
      // Move the entire group to the new center
      obj.moveTo(newCenterX, newCenterY);
    } else {
      obj.x = newCenterX;
      obj.y = newCenterY;
    }
  }
  
  // Function to check if an object is inside a bounding box
  export function isObjectInBoundingBox(obj, minX, minY, maxX, maxY) {
    if (obj.type === "circle") {
      return obj.x >= minX && obj.x <= maxX && obj.y >= minY && obj.y <= maxY;
    } else if (obj.type === "square") {
      // Check if all corners of the square are inside the box
      const halfSize = obj.size / 2;
      return (obj.x - halfSize >= minX && obj.x + halfSize <= maxX &&
              obj.y - halfSize >= minY && obj.y + halfSize <= maxY);
    } else if (obj.type === "triangle") {
      // Check if all vertices of the triangle are inside the box
      const ax = obj.x, ay = obj.y - obj.topOffset;
      const bx = obj.x - obj.halfWidth, by = obj.y + obj.bottomOffset;
      const cx = obj.x + obj.halfWidth, cy = obj.y + obj.bottomOffset;
      
      return (ax >= minX && ax <= maxX && ay >= minY && ay <= maxY &&
              bx >= minX && bx <= maxX && by >= minY && by <= maxY &&
              cx >= minX && cx <= maxX && cy >= minY && cy <= maxY);
    } else if (obj.type === "stroke") {
      // Check if all points of the stroke are inside the box
      for (let point of obj.points) {
        if (!(point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
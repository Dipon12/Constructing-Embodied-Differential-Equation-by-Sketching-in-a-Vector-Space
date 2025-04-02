// groupObject.js - Updated to ensure proper group movement

export class GroupObject {
  constructor(objects = []) {
    this.type = "group";
    this.members = objects;
    this.updateBounds();
  }

  updateBounds() {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    for (const obj of this.members) {
      if (obj.type === "stroke") {
        for (const point of obj.points) {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        }
      } else if (obj.type === "circle") {
        minX = Math.min(minX, obj.x - obj.r);
        maxX = Math.max(maxX, obj.x + obj.r);
        minY = Math.min(minY, obj.y - obj.r);
        maxY = Math.max(maxY, obj.y + obj.r);
      } else if (obj.type === "square") {
        minX = Math.min(minX, obj.x - obj.size/2);
        maxX = Math.max(maxX, obj.x + obj.size/2);
        minY = Math.min(minY, obj.y - obj.size/2);
        maxY = Math.max(maxY, obj.y + obj.size/2);
      } else if (obj.type === "triangle") {
        minX = Math.min(minX, obj.x - obj.halfWidth);
        maxX = Math.max(maxX, obj.x + obj.halfWidth);
        minY = Math.min(minY, obj.y - obj.topOffset);
        maxY = Math.max(maxY, obj.y + obj.bottomOffset);
      } else if (obj.type === "group") {
        // Handle nested groups
        minX = Math.min(minX, obj.minX);
        maxX = Math.max(maxX, obj.maxX);
        minY = Math.min(minY, obj.minY);
        maxY = Math.max(maxY, obj.maxY);
      }
    }
    
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.width = maxX - minX;
    this.height = maxY - minY;
    this.x = (minX + maxX) / 2;
    this.y = (minY + maxY) / 2;
  }
  
  // Store initial relative positions of all members
  storeRelativePositions() {
    for (const obj of this.members) {
      if (obj.type === "stroke") {
        obj.relativePoints = [];
        for (const point of obj.points) {
          obj.relativePoints.push({
            relX: point.x - this.x,
            relY: point.y - this.y
          });
        }
      } else if (obj.type === "group") {
        // Handle nested groups
        obj.relX = obj.x - this.x;
        obj.relY = obj.y - this.y;
        obj.storeRelativePositions(); // Recursively store positions for nested groups
      } else {
        obj.relX = obj.x - this.x;
        obj.relY = obj.y - this.y;
      }
    }
  }
  
  // Move the entire group to a new position
  moveTo(newX, newY) {
    const dx = newX - this.x;
    const dy = newY - this.y;
    
    for (const obj of this.members) {
      if (obj.type === "stroke") {
        for (let i = 0; i < obj.points.length; i++) {
          obj.points[i].x += dx;
          obj.points[i].y += dy;
        }
      } else if (obj.type === "group") {
        // Handle nested groups
        obj.moveTo(obj.x + dx, obj.y + dy);
      } else {
        obj.x += dx;
        obj.y += dy;
      }
    }
    
    this.x = newX;
    this.y = newY;
    this.minX += dx;
    this.maxX += dx;
    this.minY += dy;
    this.maxY += dy;
  }
  
  // Reset positions based on stored relative positions
  resetPositions(newX, newY) {
    this.x = newX;
    this.y = newY;
    
    for (const obj of this.members) {
      if (obj.type === "stroke") {
        for (let i = 0; i < obj.points.length; i++) {
          if (obj.relativePoints && i < obj.relativePoints.length) {
            obj.points[i].x = newX + obj.relativePoints[i].relX;
            obj.points[i].y = newY + obj.relativePoints[i].relY;
          }
        }
      } else if (obj.type === "group") {
        // Handle nested groups
        obj.resetPositions(newX + obj.relX, newY + obj.relY);
      } else {
        obj.x = newX + obj.relX;
        obj.y = newY + obj.relY;
      }
    }
    
    this.updateBounds();
  }
  
  // Create a deep copy of the group
  clone() {
    const clonedMembers = [];
    
    for (const obj of this.members) {
      if (obj.type === "group") {
        // Recursively clone nested groups
        const nestedClone = obj.clone();
        clonedMembers.push(nestedClone);
      } else {
        // Deep clone other object types
        const clonedObj = JSON.parse(JSON.stringify(obj));
        clonedMembers.push(clonedObj);
      }
    }
    
    const clone = new GroupObject(clonedMembers);
    clone.storeRelativePositions();
    return clone;
  }
}
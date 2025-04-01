// pendulumTool.js - Handles the pendulum tool functionality

export class Pendulum {
  constructor(originX, originY, armLength = 200) {
    this.originX = originX;
    this.originY = originY;
    this.armLength = armLength;
    this.angle = Math.PI / 4;
    this.angleVelocity = 0.0;
    this.angleAcceleration = 0.0;
    this.gravity = 0.4;
    this.damping = 0.995;
    this.isDragging = false;
  }
  
  update() {
    if (!this.isDragging) {
      this.angleAcceleration = (-this.gravity / this.armLength) * Math.sin(this.angle);
      this.angleVelocity += this.angleAcceleration;
      this.angleVelocity *= this.damping;
      this.angle += this.angleVelocity;
    }
  }
  
  displayOnLayer(layer) {
    let pendulumX = this.originX + this.armLength * Math.sin(this.angle);
    let pendulumY = this.originY + this.armLength * Math.cos(this.angle);
    layer.stroke(255);
    layer.strokeWeight(2);
    layer.line(this.originX, this.originY, pendulumX, pendulumY);
    layer.fill("#FFA500");
    layer.ellipse(pendulumX, pendulumY, 30, 30);
  }
  
  // New method to check if a point is on the pendulum bob
  isOnBob(x, y) {
    let pendulumX = this.originX + this.armLength * Math.sin(this.angle);
    let pendulumY = this.originY + this.armLength * Math.cos(this.angle);
    
    // Check if the point is within the pendulum bob (radius of 15)
    const distance = Math.sqrt(Math.pow(x - pendulumX, 2) + Math.pow(y - pendulumY, 2));
    return distance <= 15;
  }
  
  // Method to update pendulum position based on pointer
  updateFromPointer(x, y) {
    if (this.isDragging) {
      // Calculate new angle based on pointer position
      const deltaX = x - this.originX;
      const deltaY = y - this.originY;
      
      // Calculate new angle and constrain the pendulum length
      this.angle = Math.atan2(deltaX, deltaY);
      
      // Reset velocity when dragging
      this.angleVelocity = 0;
    }
  }
  
  startDrag() {
    this.isDragging = true;
  }
  
  stopDrag() {
    this.isDragging = false;
  }
}

export function activatePendulumTool() {
  window.isPendulumActive = !window.isPendulumActive;
  if (window.isPendulumActive) {
    window.pendulumButton.style('background-color', '#cccccc');
    window.pendulum = new Pendulum(window.innerWidth / 2, 100);
  } else {
    window.pendulumButton.style('background-color', '#333333');
  }
}

// Function to handle pendulum pointer events
export function handlePendulumPointerEvents(p, eventType) {
  if (!window.isPendulumActive || !window.pendulum) return false;
  
  const pendulum = window.pendulum;
  
  switch (eventType) {
    case 'down':
      if (pendulum.isOnBob(p.pointerX, p.pointerY)) {
        pendulum.startDrag();
        return true;
      }
      break;
      
    case 'move':
      if (pendulum.isDragging) {
        pendulum.updateFromPointer(p.pointerX, p.pointerY);
        return true;
      }
      break;
      
    case 'up':
      if (pendulum.isDragging) {
        pendulum.stopDrag();
        return true;
      }
      break;
  }
  
  return false;
}
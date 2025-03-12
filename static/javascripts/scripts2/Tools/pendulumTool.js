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
    }
    
    update() {
      this.angleAcceleration = (-this.gravity / this.armLength) * Math.sin(this.angle);
      this.angleVelocity += this.angleAcceleration;
      this.angleVelocity *= this.damping;
      this.angle += this.angleVelocity;
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
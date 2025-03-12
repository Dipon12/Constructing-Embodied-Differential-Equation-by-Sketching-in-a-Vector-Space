export class Pendulum {
    constructor(originX, originY, armLength = 200) {
      this.originX = originX;
      this.originY = originY;
      this.armLength = armLength;
  
      this.angle = Math.PI / 4; // Initial angle
      this.angleVelocity = 0.0;
      this.angleAcceleration = 0.0;
      this.gravity = 0.4; // Gravity strength
      this.damping = 0.995; // Damping factor (friction)
    }
  
    update() {
      // Calculate acceleration based on gravity and pendulum physics
      this.angleAcceleration = (-1 * this.gravity / this.armLength) * sin(this.angle);
      this.angleVelocity += this.angleAcceleration; 
      this.angleVelocity *= this.damping; // Apply damping (friction)
      this.angle += this.angleVelocity;
    }
  
    display() {
      // Calculate pendulum position
      let pendulumX = this.originX + this.armLength * sin(this.angle);
      let pendulumY = this.originY + this.armLength * cos(this.angle);
  
      // Draw pendulum arm
      stroke(0);
      strokeWeight(2);
      line(this.originX, this.originY, pendulumX, pendulumY);
  
      // Draw pendulum bob
      fill(0);
      ellipse(pendulumX, pendulumY, 30, 30);
    }
  }
  
function setup() {
  createCanvas(windowWidth, windowHeight);
  updateGridSize();


  pendulumLayer = createGraphics(windowWidth, windowHeight);
  pendulumLayer.clear();

  background('#181818');
  drawGrid();
  drawSidebar();
  addSidebarButtons();
}


function draw() {

  if (drawing && mouseIsPressed && mouseX > 200) { // Ensure drawing only happens outside the sidebar
      stroke(255);
      strokeWeight(2);
      line(pmouseX, pmouseY, mouseX, mouseY);
  }

  if (isPendulumActive) {
    pendulumLayer.clear(); // Clear only the pendulum layer
    pendulum.update();
    pendulum.displayOnLayer(pendulumLayer);
  }

  // Display the pre-rendered background and sidebar (static)
  image(pendulumLayer, 0, 0); // Draw the pendulum layer on top
}



function updateGridSize() {
  cellSize = max(50, min(100, width / 20)); // Adjust grid size dynamically
}

function drawGrid() {
  const CELL_SIZE = 100;
  const GRID_COLOR = color(204, 204, 204, 51); // #ccc with 0.2 opacity (51 in RGBA)

  stroke(GRID_COLOR);
  strokeWeight(1);

  for (let x = 0; x < width; x += CELL_SIZE) {
      line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += CELL_SIZE) {
      line(0, y, width, y);
  }
}

function drawSidebar() {
  const SIDEBAR_WIDTH = 200; // Width of the sidebar
  const SECTION_HEIGHT = height / 3; // Each section takes one-third of the height
  const BORDER_COLOR = '#FFFFFF';
  
  fill('#282828'); // Sidebar background color
  noStroke();
  rect(0, 0, SIDEBAR_WIDTH, height);
  
  stroke(BORDER_COLOR);
  strokeWeight(1);
  
  // Draw section dividers
  for (let i = 1; i < 3; i++) {
      line(0, i * SECTION_HEIGHT, SIDEBAR_WIDTH, i * SECTION_HEIGHT);
  }
}

function addSidebarButtons() {
  const SIDEBAR_WIDTH = 200;
  const SECTION_HEIGHT = height / 3;
  const BUTTON_SIZE = 30; // Increased size for better visibility
  const BUTTON_X = 10; // Adjusted for better alignment
  const THIRD_SECTION_BUTTON_Y = 2 * SECTION_HEIGHT + 20; // Position at top left of third section with better spacing


  // Second Section Buttons
  // Pendulum button pendulum
  const PENDULUM_Y = SECTION_HEIGHT + 20; // Position at top left of second section
  pendulumButton = createButton('🕰️');
  pendulumButton.position(BUTTON_X, PENDULUM_Y);
  pendulumButton.size(BUTTON_SIZE, BUTTON_SIZE);
  pendulumButton.style('background-color', '#333333');
  pendulumButton.style('border', '2px solid black');
  pendulumButton.style('border-radius', '10px'); // Rounded corners
  pendulumButton.style('font-size', '12px'); // Larger emoji
  pendulumButton.style('cursor', 'pointer'); // Change cursor on hover
  pendulumButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)'); // Subtle shadow
  pendulumButton.mousePressed(activatePendulumTool);



  // Third Section Buttons
  // Pencil button
  pencilButton = createButton('✏️');
  pencilButton.position(BUTTON_X, THIRD_SECTION_BUTTON_Y);
  pencilButton.size(BUTTON_SIZE, BUTTON_SIZE);
  pencilButton.style('background-color', '#333333');
  pencilButton.style('border', '2px solid black');
  pencilButton.style('border-radius', '10px'); // Rounded corners
  pencilButton.style('font-size', '12px'); // Larger emoji
  pencilButton.style('cursor', 'pointer'); // Change cursor on hover
  pencilButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)'); // Subtle shadow
  pencilButton.mousePressed(activatePencilTool);





  
}


drawing = false;
function activatePencilTool() {
  drawing = !drawing; // Toggle drawing mode
  if (drawing) {
      pencilButton.style('background-color', '#cccccc'); // Indicate active state
  } else {
      pencilButton.style('background-color', '#333333'); // Reset state
  }
}

isPendulumActive = false;
function activatePendulumTool() {
  isPendulumActive = !isPendulumActive; // Toggle drawing mode
  if (isPendulumActive) {
      pendulumButton.style('background-color', '#cccccc'); // Indicate active state
  } else {
      pendulumButton.style('background-color', '#333333'); // Reset state
  }

  pendulum = new Pendulum(width / 2, 100);
}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#181818');
  drawGrid();
  drawSidebar();
  addSidebarButtons();
}



// Predefined Function Pendulum
class Pendulum {
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

  displayOnLayer(layer) {  // Draw on the offscreen layer
    let pendulumX = this.originX + this.armLength * sin(this.angle);
    let pendulumY = this.originY + this.armLength * cos(this.angle);

    layer.stroke(255);
    layer.strokeWeight(2);
    layer.line(this.originX, this.originY, pendulumX, pendulumY);

    layer.fill("#FFA500");
    layer.ellipse(pendulumX, pendulumY, 30, 30);
  }
}


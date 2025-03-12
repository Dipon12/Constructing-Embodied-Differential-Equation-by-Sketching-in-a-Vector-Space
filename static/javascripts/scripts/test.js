// Global variable declarations
let calculatorDisplay, sinButton, cosButton, tanButton, xButton, x2Button, x3Button, expButton;
let clearButton, secondParenButton, plusButton, minusButton, multiplyButton, divisionButton;
let pendulumLayer, pendulum;
let drawing = false;
let isPendulumActive = false;
let cellSize;

// Array to store drawn (and movable) objects
let movableObjects = [];
// For free-hand drawing strokes
let currentStroke = null;
// For dragging an existing object
let selectedObject = null;
let dragOffset = { x: 0, y: 0 };

// --- Define functions early so they are in scope ---
function activatePendulumTool() {
  isPendulumActive = !isPendulumActive;
  if (isPendulumActive) {
    pendulumButton.style('background-color', '#cccccc');
  } else {
    pendulumButton.style('background-color', '#333333');
  }
  pendulum = new Pendulum(width / 2, 100);
}

function activatePencilTool() {
  drawing = !drawing;
  if (drawing) {
    pencilButton.style('background-color', '#cccccc');
  } else {
    pencilButton.style('background-color', '#333333');
  }
}

// Expose these functions globally for button callbacks.
window.activatePendulumTool = activatePendulumTool;
window.activatePencilTool = activatePencilTool;

// --- p5.js setup and draw ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  updateGridSize();

  pendulumLayer = createGraphics(windowWidth, windowHeight);
  pendulumLayer.clear();

  // Initial draw of background, grid, sidebar and UI buttons.
  background('#181818');
  drawGrid();
  drawSidebar();
  addSidebarButtons();
}

function draw() {
  // Clear background each frame.
  background('#181818');
  drawGrid();
  drawSidebar();
  drawMovableObjects();

  if (isPendulumActive) {
    pendulumLayer.clear();
    pendulum.update();
    pendulum.displayOnLayer(pendulumLayer);
  }
  image(pendulumLayer, 0, 0);
}

function updateGridSize() {
  cellSize = max(50, min(100, width / 20));
}

function drawGrid() {
  const CELL_SIZE = 100;
  const GRID_COLOR = color(204, 204, 204, 51);
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
  const SIDEBAR_WIDTH = 200;
  const SECTION_HEIGHT = height / 3;
  const BORDER_COLOR = '#FFFFFF';

  fill('#282828');
  noStroke();
  rect(0, 0, SIDEBAR_WIDTH, height);

  stroke(BORDER_COLOR);
  strokeWeight(1);
  for (let i = 1; i < 3; i++) {
    line(0, i * SECTION_HEIGHT, SIDEBAR_WIDTH, i * SECTION_HEIGHT);
  }
}

// --- Calculator Interface ---
function addCalculatorInterface() {
  const SIDEBAR_WIDTH = 200;
  const margin = 10;
  const gap = 5;
  const displayWidth = SIDEBAR_WIDTH - 2 * margin;
  const displayHeight = 30;

  if (!calculatorDisplay) {
    calculatorDisplay = createInput("");
    calculatorDisplay.attribute('readonly', '');
    calculatorDisplay.style('text-align', 'right');
    calculatorDisplay.style('font-size', '16px');
    calculatorDisplay.style('background-color', '#333333');
    calculatorDisplay.style('color', '#FFF');
  }
  calculatorDisplay.position(margin, margin);
  calculatorDisplay.size(displayWidth, displayHeight);

  // Slightly smaller buttons.
  const buttonWidth = 40;
  const buttonHeight = 25;
  const rowDisplayGap = 10;

  const firstRowY = margin + displayHeight + gap + rowDisplayGap;
  const secondRowY = firstRowY + buttonHeight + gap;
  const thirdRowY = secondRowY + buttonHeight + gap;
  const fourthRowY = thirdRowY + buttonHeight + gap;

  // For rows with 3 buttons, center them.
  const totalRowWidth3 = 3 * buttonWidth + 2 * gap;
  const startX3 = margin + (displayWidth - totalRowWidth3) / 2;
  // For row 4 (4 buttons), center them.
  const totalRowWidth4 = 4 * buttonWidth + 3 * gap;
  const startX4 = margin + (displayWidth - totalRowWidth4) / 2;

  // Row 1: sinx, cosx, tanx.
  if (!sinButton) {
    sinButton = createButton("sinx");
    sinButton.style('background-color', '#333333');
    sinButton.style('color', '#FFF');
    sinButton.style('border', '2px solid black');
    sinButton.style('border-radius', '5px');
    sinButton.mousePressed(() => calculatorFunction("sin("));
  }
  sinButton.position(startX3, firstRowY);
  sinButton.size(buttonWidth, buttonHeight);

  if (!cosButton) {
    cosButton = createButton("cosx");
    cosButton.style('background-color', '#333333');
    cosButton.style('color', '#FFF');
    cosButton.style('border', '2px solid black');
    cosButton.style('border-radius', '5px');
    cosButton.mousePressed(() => calculatorFunction("cos("));
  }
  cosButton.position(startX3 + buttonWidth + gap, firstRowY);
  cosButton.size(buttonWidth, buttonHeight);

  if (!tanButton) {
    tanButton = createButton("tanx");
    tanButton.style('background-color', '#333333');
    tanButton.style('color', '#FFF');
    tanButton.style('border', '2px solid black');
    tanButton.style('border-radius', '5px');
    tanButton.mousePressed(() => calculatorFunction("tan("));
  }
  tanButton.position(startX3 + 2 * (buttonWidth + gap), firstRowY);
  tanButton.size(buttonWidth, buttonHeight);

  // Row 2: x, x², x³.
  if (!xButton) {
    xButton = createButton("x");
    xButton.style('background-color', '#333333');
    xButton.style('color', '#FFF');
    xButton.style('border', '2px solid black');
    xButton.style('border-radius', '5px');
    xButton.mousePressed(() => calculatorFunction("x"));
  }
  xButton.position(startX3, secondRowY);
  xButton.size(buttonWidth, buttonHeight);

  if (!x2Button) {
    x2Button = createButton("x²");
    x2Button.style('background-color', '#333333');
    x2Button.style('color', '#FFF');
    x2Button.style('border', '2px solid black');
    x2Button.style('border-radius', '5px');
    x2Button.mousePressed(() => calculatorFunction("^(2)"));
  }
  x2Button.position(startX3 + buttonWidth + gap, secondRowY);
  x2Button.size(buttonWidth, buttonHeight);

  if (!x3Button) {
    x3Button = createButton("x³");
    x3Button.style('background-color', '#333333');
    x3Button.style('color', '#FFF');
    x3Button.style('border', '2px solid black');
    x3Button.style('border-radius', '5px');
    x3Button.mousePressed(() => calculatorFunction("^(3)"));
  }
  x3Button.position(startX3 + 2 * (buttonWidth + gap), secondRowY);
  x3Button.size(buttonWidth, buttonHeight);

  // Row 3: eˣ, Clear (C), and ")".
  if (!expButton) {
    expButton = createButton("eˣ");
    expButton.style('background-color', '#333333');
    expButton.style('color', '#FFF');
    expButton.style('border', '2px solid black');
    expButton.style('border-radius', '5px');
    expButton.mousePressed(() => calculatorFunction("exp("));
  }
  expButton.position(startX3, thirdRowY);
  expButton.size(buttonWidth, buttonHeight);

  if (!clearButton) {
    clearButton = createButton("C");
    clearButton.style('background-color', '#333333');
    clearButton.style('color', '#FFF');
    clearButton.style('border', '2px solid black');
    clearButton.style('border-radius', '5px');
    clearButton.mousePressed(() => calculatorFunction("clear"));
  }
  clearButton.position(startX3 + buttonWidth + gap, thirdRowY);
  clearButton.size(buttonWidth, buttonHeight);

  if (!secondParenButton) {
    secondParenButton = createButton(")");
    secondParenButton.style('background-color', '#333333');
    secondParenButton.style('color', '#FFF');
    secondParenButton.style('border', '2px solid black');
    secondParenButton.style('border-radius', '5px');
    secondParenButton.mousePressed(() => calculatorFunction(")"));
  }
  secondParenButton.position(startX3 + 2 * (buttonWidth + gap), thirdRowY);
  secondParenButton.size(buttonWidth, buttonHeight);

  // Row 4: +, –, *, and ÷.
  if (!plusButton) {
    plusButton = createButton("+");
    plusButton.style('background-color', '#333333');
    plusButton.style('color', '#FFF');
    plusButton.style('border', '2px solid black');
    plusButton.style('border-radius', '5px');
    plusButton.mousePressed(() => calculatorFunction("+"));
  }
  plusButton.position(startX4, fourthRowY);
  plusButton.size(buttonWidth, buttonHeight);

  if (!minusButton) {
    minusButton = createButton("–");
    minusButton.style('background-color', '#333333');
    minusButton.style('color', '#FFF');
    minusButton.style('border', '2px solid black');
    minusButton.style('border-radius', '5px');
    minusButton.mousePressed(() => calculatorFunction("–"));
  }
  minusButton.position(startX4 + buttonWidth + gap, fourthRowY);
  minusButton.size(buttonWidth, buttonHeight);

  if (!multiplyButton) {
    multiplyButton = createButton("*");
    multiplyButton.style('background-color', '#333333');
    multiplyButton.style('color', '#FFF');
    multiplyButton.style('border', '2px solid black');
    multiplyButton.style('border-radius', '5px');
    multiplyButton.mousePressed(() => calculatorFunction("*"));
  }
  multiplyButton.position(startX4 + 2 * (buttonWidth + gap), fourthRowY);
  multiplyButton.size(buttonWidth, buttonHeight);

  if (!divisionButton) {
    divisionButton = createButton("÷");
    divisionButton.style('background-color', '#333333');
    divisionButton.style('color', '#FFF');
    divisionButton.style('border', '2px solid black');
    divisionButton.style('border-radius', '5px');
    divisionButton.mousePressed(() => calculatorFunction("÷"));
  }
  divisionButton.position(startX4 + 3 * (buttonWidth + gap), fourthRowY);
  divisionButton.size(buttonWidth, buttonHeight);
}

function calculatorFunction(op) {
  if (op === "clear") {
    calculatorDisplay.value("");
  } else {
    let current = calculatorDisplay.value();
    calculatorDisplay.value(current + op);
  }
}

// --- End Calculator Interface ---

function addSidebarButtons() {
  addCalculatorInterface();

  const SIDEBAR_WIDTH = 200;
  const SECTION_HEIGHT = height / 3;
  const BUTTON_SIZE = 30;
  const BUTTON_X = 10;
  const THIRD_SECTION_BUTTON_Y = 2 * SECTION_HEIGHT + 20;
  const shapeButtonGap = 10;

  // Pendulum tool button.
  pendulumButton = createButton('🕰️');
  pendulumButton.position(BUTTON_X, SECTION_HEIGHT + 20);
  pendulumButton.size(BUTTON_SIZE, BUTTON_SIZE);
  pendulumButton.style('background-color', '#333333');
  pendulumButton.style('border', '2px solid black');
  pendulumButton.style('border-radius', '10px');
  pendulumButton.style('font-size', '12px');
  pendulumButton.style('cursor', 'pointer');
  pendulumButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  pendulumButton.mousePressed(activatePendulumTool);

  // Third Section Buttons: Pencil, Circle, Square, Triangle.
  pencilButton = createButton('✏️');
  pencilButton.position(BUTTON_X, THIRD_SECTION_BUTTON_Y);
  pencilButton.size(BUTTON_SIZE, BUTTON_SIZE);
  pencilButton.style('background-color', '#333333');
  pencilButton.style('border', '2px solid black');
  pencilButton.style('border-radius', '10px');
  pencilButton.style('font-size', '12px');
  pencilButton.style('cursor', 'pointer');
  pencilButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  pencilButton.mousePressed(activatePencilTool);

  // Copy Brush Button (Brush Icon)
  copyBrushButton = createButton('🖌️'); 
  copyBrushButton.position(BUTTON_X + BUTTON_SIZE + shapeButtonGap, THIRD_SECTION_BUTTON_Y);
  copyBrushButton.size(BUTTON_SIZE, BUTTON_SIZE);
  copyBrushButton.style('background-color', '#333333');
  copyBrushButton.style('border', '2px solid black');
  copyBrushButton.style('border-radius', '10px');
  copyBrushButton.style('font-size', '16px');
  copyBrushButton.style('cursor', 'pointer');
  copyBrushButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  copyBrushButton.mousePressed(copyBrushButtonTool);

  // Equation Button (Greek letter Icon)
  equationBrushButton = createButton('𝛑');
  equationBrushButton.position(BUTTON_X + 2*(BUTTON_SIZE + shapeButtonGap), THIRD_SECTION_BUTTON_Y);
  equationBrushButton.size(BUTTON_SIZE, BUTTON_SIZE);
  equationBrushButton.style('background-color', '#333333');
  equationBrushButton.style('border', '2px solid black');
  equationBrushButton.style('border-radius', '10px');
  equationBrushButton.style('font-size', '16px');
  equationBrushButton.style('cursor', 'pointer');
  equationBrushButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  equationBrushButton.mousePressed(equationBrushButtonTool);


  circleButton = createButton('⭕');
  circleButton.position(BUTTON_X, THIRD_SECTION_BUTTON_Y + BUTTON_SIZE + shapeButtonGap);
  circleButton.size(BUTTON_SIZE, BUTTON_SIZE);
  circleButton.style('background-color', '#333333');
  circleButton.style('border', '2px solid black');
  circleButton.style('border-radius', '10px');
  circleButton.style('font-size', '12px');
  circleButton.style('cursor', 'pointer');
  circleButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  circleButton.mousePressed(drawCircle);

  squareButton = createButton('■');
  squareButton.position(BUTTON_X + BUTTON_SIZE + shapeButtonGap, THIRD_SECTION_BUTTON_Y + BUTTON_SIZE + shapeButtonGap);
  squareButton.size(BUTTON_SIZE, BUTTON_SIZE);
  squareButton.style('background-color', '#333333');
  squareButton.style('border', '2px solid black');
  squareButton.style('border-radius', '10px');
  squareButton.style('font-size', '12px');
  squareButton.style('cursor', 'pointer');
  squareButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  squareButton.mousePressed(drawSquare);

  triangleButton = createButton('△');
  triangleButton.position(BUTTON_X + 2 * (BUTTON_SIZE + shapeButtonGap), THIRD_SECTION_BUTTON_Y + BUTTON_SIZE + shapeButtonGap);
  triangleButton.size(BUTTON_SIZE, BUTTON_SIZE);
  triangleButton.style('background-color', '#333333');
  triangleButton.style('border', '2px solid black');
  triangleButton.style('border-radius', '10px');
  triangleButton.style('font-size', '12px');
  triangleButton.style('cursor', 'pointer');
  triangleButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
  triangleButton.mousePressed(drawTriangle);
}


function copyBrushButtonTool(){
  console.log("Copy Brush Pressed");
}

function equationBrushButtonTool(){
  console.log("Equation Brush Pressed");
}

// --- Object Creation Functions ---
function drawCircle() {
  let shapeX = 200 + (width - 200) / 2;
  let shapeY = height / 2;
  let circleObj = { type: "circle", x: shapeX, y: shapeY, r: 50 };
  movableObjects.push(circleObj);
}

function drawSquare() {
  let shapeX = 200 + (width - 200) / 2;
  let shapeY = height / 2;
  let squareObj = { type: "square", x: shapeX, y: shapeY, size: 100 };
  movableObjects.push(squareObj);
}

function drawTriangle() {
  let shapeX = 200 + (width - 200) / 2;
  let shapeY = height / 2;
  let triangleObj = { type: "triangle", x: shapeX, y: shapeY, halfWidth: 50, topOffset: 40, bottomOffset: 40 };
  movableObjects.push(triangleObj);
}

// --- Drawing Movable Objects ---
function drawMovableObjects() {
  // Draw stored objects.
  for (let obj of movableObjects) {
    if (obj.type === "circle") {
      fill(255, 150);
      noStroke();
      ellipse(obj.x, obj.y, obj.r * 2, obj.r * 2);
    } else if (obj.type === "square") {
      fill(255, 150);
      noStroke();
      rectMode(CENTER);
      rect(obj.x, obj.y, obj.size, obj.size);
      rectMode(CORNER);
    } else if (obj.type === "triangle") {
      fill(255, 150);
      noStroke();
      let ax = obj.x, ay = obj.y - obj.topOffset;
      let bx = obj.x - obj.halfWidth, by = obj.y + obj.bottomOffset;
      let cx = obj.x + obj.halfWidth, cy = obj.y + obj.bottomOffset;
      triangle(ax, ay, bx, by, cx, cy);
    } else if (obj.type === "stroke") {
      stroke(255);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let p of obj.points) {
        vertex(p.x, p.y);
      }
      endShape();
    }
  }
  // Draw current free-hand stroke in real-time if it exists.
  if (currentStroke) {
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of currentStroke.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

// --- Mouse Interaction ---
function mousePressed() {
  // Only allow interactions in the drawing area (outside the sidebar)
  if (mouseX < 200) return;

  // Check if mouse is over a movable object (topmost first)
  for (let i = movableObjects.length - 1; i >= 0; i--) {
    let obj = movableObjects[i];
    if (hitTest(obj, mouseX, mouseY)) {
      selectedObject = obj;
      let center = getObjectCenter(obj);
      dragOffset.x = mouseX - center.x;
      dragOffset.y = mouseY - center.y;
      return;
    }
  }

  // If no object hit and pencil mode is active, start a new free-hand stroke.
  if (drawing) {
    currentStroke = { type: "stroke", points: [{ x: mouseX, y: mouseY }] };
  }
}

function mouseDragged() {
  if (selectedObject) {
    let newCenterX = mouseX - dragOffset.x;
    let newCenterY = mouseY - dragOffset.y;
    moveObjectTo(selectedObject, newCenterX, newCenterY);
  } else if (drawing && currentStroke) {
    currentStroke.points.push({ x: mouseX, y: mouseY });
  }
}

function mouseReleased() {
  if (selectedObject) {
    selectedObject = null;
  } else if (drawing && currentStroke) {
    movableObjects.push(currentStroke);
    currentStroke = null;
  }
}

// --- Helper Functions ---
function hitTest(obj, mx, my) {
  if (obj.type === "circle") {
    return dist(mx, my, obj.x, obj.y) <= obj.r;
  } else if (obj.type === "square") {
    return mx >= obj.x - obj.size / 2 && mx <= obj.x + obj.size / 2 &&
           my >= obj.y - obj.size / 2 && my <= obj.y + obj.size / 2;
  } else if (obj.type === "triangle") {
    let ax = obj.x, ay = obj.y - obj.topOffset;
    let bx = obj.x - obj.halfWidth, by = obj.y + obj.bottomOffset;
    let cx = obj.x + obj.halfWidth, cy = obj.y + obj.bottomOffset;
    return pointInTriangle(mx, my, ax, ay, bx, by, cx, cy);
  } else if (obj.type === "stroke") {
    for (let p of obj.points) {
      if (dist(mx, my, p.x, p.y) < 5) return true;
    }
    return false;
  }
  return false;
}

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  let areaOrig = abs(ax*(by - cy) + bx*(cy - ay) + cx*(ay - by));
  let area1 = abs(px*(by - cy) + bx*(cy - py) + cx*(py - by));
  let area2 = abs(ax*(py - cy) + px*(cy - ay) + cx*(ay - py));
  let area3 = abs(ax*(by - py) + bx*(py - ay) + px*(ay - by));
  return abs(areaOrig - (area1 + area2 + area3)) < 0.1;
}

function getObjectCenter(obj) {
  if (obj.type === "stroke") {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let p of obj.points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  } else {
    return { x: obj.x, y: obj.y };
  }
}

function moveObjectTo(obj, newCenterX, newCenterY) {
  if (obj.type === "stroke") {
    let center = getObjectCenter(obj);
    let dx = newCenterX - center.x;
    let dy = newCenterY - center.y;
    for (let p of obj.points) {
      p.x += dx;
      p.y += dy;
    }
  } else {
    obj.x = newCenterX;
    obj.y = newCenterY;
  }
}

// --- Pendulum Class ---
class Pendulum {
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
    this.angleAcceleration = (-this.gravity / this.armLength) * sin(this.angle);
    this.angleVelocity += this.angleAcceleration;
    this.angleVelocity *= this.damping;
    this.angle += this.angleVelocity;
  }
  displayOnLayer(layer) {
    let pendulumX = this.originX + this.armLength * sin(this.angle);
    let pendulumY = this.originY + this.armLength * cos(this.angle);
    layer.stroke(255);
    layer.strokeWeight(2);
    layer.line(this.originX, this.originY, pendulumX, pendulumY);
    layer.fill("#FFA500");
    layer.ellipse(pendulumX, pendulumY, 30, 30);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#181818');
  drawGrid();
  drawSidebar();
  addSidebarButtons();
}

// sidebar.js - Handles the drawing and buttons of the sidebar

export function drawSidebar(p) {
    const SIDEBAR_WIDTH = 200;
    const SECTION_HEIGHT = p.height / 3;
    const BORDER_COLOR = '#FFFFFF';
  
    p.fill('#282828');
    p.noStroke();
    p.rect(0, 0, SIDEBAR_WIDTH, p.height);
  
    p.stroke(BORDER_COLOR);
    p.strokeWeight(1);
    for (let i = 1; i < 3; i++) {
      p.line(0, i * SECTION_HEIGHT, SIDEBAR_WIDTH, i * SECTION_HEIGHT);
    }
  }
  
  export function addSidebarButtons(p) {
    const SIDEBAR_WIDTH = 200;
    const SECTION_HEIGHT = p.height / 3;
    const BUTTON_SIZE = 30;
    const BUTTON_X = 10;
    const THIRD_SECTION_BUTTON_Y = 2 * SECTION_HEIGHT + 20;
    const shapeButtonGap = 10;
  
    // Pendulum tool button
    window.pendulumButton = p.createButton('🕰️');
    window.pendulumButton.position(BUTTON_X, SECTION_HEIGHT + 20);
    window.pendulumButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.pendulumButton.style('background-color', '#333333');
    window.pendulumButton.style('border', '2px solid black');
    window.pendulumButton.style('border-radius', '10px');
    window.pendulumButton.style('font-size', '12px');
    window.pendulumButton.style('cursor', 'pointer');
    window.pendulumButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.pendulumButton.mousePressed(window.activatePendulumTool);
  
    // Pencil Button
    window.pencilButton = p.createButton('✏️');
    window.pencilButton.position(BUTTON_X, THIRD_SECTION_BUTTON_Y);
    window.pencilButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.pencilButton.style('background-color', '#333333');
    window.pencilButton.style('border', '2px solid black');
    window.pencilButton.style('border-radius', '10px');
    window.pencilButton.style('font-size', '12px');
    window.pencilButton.style('cursor', 'pointer');
    window.pencilButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.pencilButton.mousePressed(window.activatePencilTool);
  
    // Copy Brush Button
    window.copyBrushButton = p.createButton('🖌️'); 
    window.copyBrushButton.position(BUTTON_X + BUTTON_SIZE + shapeButtonGap, THIRD_SECTION_BUTTON_Y);
    window.copyBrushButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.copyBrushButton.style('background-color', '#333333');
    window.copyBrushButton.style('border', '2px solid black');
    window.copyBrushButton.style('border-radius', '10px');
    window.copyBrushButton.style('font-size', '16px');
    window.copyBrushButton.style('cursor', 'pointer');
    window.copyBrushButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.copyBrushButton.mousePressed(window.copyBrushButtonTool);
  
    // Equation Button
    window.equationBrushButton = p.createButton('𝛑');
    window.equationBrushButton.position(BUTTON_X + 2*(BUTTON_SIZE + shapeButtonGap), THIRD_SECTION_BUTTON_Y);
    window.equationBrushButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.equationBrushButton.style('background-color', '#333333');
    window.equationBrushButton.style('border', '2px solid black');
    window.equationBrushButton.style('border-radius', '10px');
    window.equationBrushButton.style('font-size', '16px');
    window.equationBrushButton.style('cursor', 'pointer');
    window.equationBrushButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.equationBrushButton.mousePressed(window.equationBrushButtonTool);
  
    // Circle Button
    window.circleButton = p.createButton('⭕');
    window.circleButton.position(BUTTON_X, THIRD_SECTION_BUTTON_Y + BUTTON_SIZE + shapeButtonGap);
    window.circleButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.circleButton.style('background-color', '#333333');
    window.circleButton.style('border', '2px solid black');
    window.circleButton.style('border-radius', '10px');
    window.circleButton.style('font-size', '12px');
    window.circleButton.style('cursor', 'pointer');
    window.circleButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.circleButton.mousePressed(window.drawCircle);
  
    // Square Button
    window.squareButton = p.createButton('■');
    window.squareButton.position(BUTTON_X + BUTTON_SIZE + shapeButtonGap, THIRD_SECTION_BUTTON_Y + BUTTON_SIZE + shapeButtonGap);
    window.squareButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.squareButton.style('background-color', '#333333');
    window.squareButton.style('border', '2px solid black');
    window.squareButton.style('border-radius', '10px');
    window.squareButton.style('font-size', '12px');
    window.squareButton.style('cursor', 'pointer');
    window.squareButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.squareButton.mousePressed(window.drawSquare);
  
    // Triangle Button
    window.triangleButton = p.createButton('△');
    window.triangleButton.position(BUTTON_X + 2 * (BUTTON_SIZE + shapeButtonGap), THIRD_SECTION_BUTTON_Y + BUTTON_SIZE + shapeButtonGap);
    window.triangleButton.size(BUTTON_SIZE, BUTTON_SIZE);
    window.triangleButton.style('background-color', '#333333');
    window.triangleButton.style('border', '2px solid black');
    window.triangleButton.style('border-radius', '10px');
    window.triangleButton.style('font-size', '12px');
    window.triangleButton.style('cursor', 'pointer');
    window.triangleButton.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.3)');
    window.triangleButton.mousePressed(window.drawTriangle);
  }
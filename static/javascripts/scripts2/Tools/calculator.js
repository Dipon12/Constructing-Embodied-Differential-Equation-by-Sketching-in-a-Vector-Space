// calculator.js - Handles the calculator functionality

// Global calculator buttons
let calculatorDisplay, sinButton, cosButton, tanButton, xButton, x2Button, x3Button, expButton;
let clearButton, secondParenButton, plusButton, minusButton, multiplyButton, divisionButton;

export function addCalculatorInterface(p) {
  const SIDEBAR_WIDTH = 200;
  const margin = 10;
  const gap = 5;
  const displayWidth = SIDEBAR_WIDTH - 2 * margin;
  const displayHeight = 30;

  if (!calculatorDisplay) {
    calculatorDisplay = p.createInput("");
    calculatorDisplay.attribute('readonly', '');
    calculatorDisplay.style('text-align', 'right');
    calculatorDisplay.style('font-size', '16px');
    calculatorDisplay.style('background-color', '#333333');
    calculatorDisplay.style('color', '#FFF');
  }
  calculatorDisplay.position(margin, margin);
  calculatorDisplay.size(displayWidth, displayHeight);

  // Slightly smaller buttons
  const buttonWidth = 40;
  const buttonHeight = 25;
  const rowDisplayGap = 10;

  const firstRowY = margin + displayHeight + gap + rowDisplayGap;
  const secondRowY = firstRowY + buttonHeight + gap;
  const thirdRowY = secondRowY + buttonHeight + gap;
  const fourthRowY = thirdRowY + buttonHeight + gap;

  // For rows with 3 buttons, center them
  const totalRowWidth3 = 3 * buttonWidth + 2 * gap;
  const startX3 = margin + (displayWidth - totalRowWidth3) / 2;
  // For row 4 (4 buttons), center them
  const totalRowWidth4 = 4 * buttonWidth + 3 * gap;
  const startX4 = margin + (displayWidth - totalRowWidth4) / 2;

  // Row 1: sinx, cosx, tanx
  if (!sinButton) {
    sinButton = p.createButton("sinx");
    sinButton.style('background-color', '#333333');
    sinButton.style('color', '#FFF');
    sinButton.style('border', '2px solid black');
    sinButton.style('border-radius', '5px');
    sinButton.mousePressed(() => calculatorFunction("sin("));
  }
  sinButton.position(startX3, firstRowY);
  sinButton.size(buttonWidth, buttonHeight);

  if (!cosButton) {
    cosButton = p.createButton("cosx");
    cosButton.style('background-color', '#333333');
    cosButton.style('color', '#FFF');
    cosButton.style('border', '2px solid black');
    cosButton.style('border-radius', '5px');
    cosButton.mousePressed(() => calculatorFunction("cos("));
  }
  cosButton.position(startX3 + buttonWidth + gap, firstRowY);
  cosButton.size(buttonWidth, buttonHeight);

  if (!tanButton) {
    tanButton = p.createButton("tanx");
    tanButton.style('background-color', '#333333');
    tanButton.style('color', '#FFF');
    tanButton.style('border', '2px solid black');
    tanButton.style('border-radius', '5px');
    tanButton.mousePressed(() => calculatorFunction("tan("));
  }
  tanButton.position(startX3 + 2 * (buttonWidth + gap), firstRowY);
  tanButton.size(buttonWidth, buttonHeight);

  // Row 2: x, x², x³
  if (!xButton) {
    xButton = p.createButton("x");
    xButton.style('background-color', '#333333');
    xButton.style('color', '#FFF');
    xButton.style('border', '2px solid black');
    xButton.style('border-radius', '5px');
    xButton.mousePressed(() => calculatorFunction("x"));
  }
  xButton.position(startX3, secondRowY);
  xButton.size(buttonWidth, buttonHeight);

  if (!x2Button) {
    x2Button = p.createButton("x²");
    x2Button.style('background-color', '#333333');
    x2Button.style('color', '#FFF');
    x2Button.style('border', '2px solid black');
    x2Button.style('border-radius', '5px');
    x2Button.mousePressed(() => calculatorFunction("^(2)"));
  }
  x2Button.position(startX3 + buttonWidth + gap, secondRowY);
  x2Button.size(buttonWidth, buttonHeight);

  if (!x3Button) {
    x3Button = p.createButton("x³");
    x3Button.style('background-color', '#333333');
    x3Button.style('color', '#FFF');
    x3Button.style('border', '2px solid black');
    x3Button.style('border-radius', '5px');
    x3Button.mousePressed(() => calculatorFunction("^(3)"));
  }
  x3Button.position(startX3 + 2 * (buttonWidth + gap), secondRowY);
  x3Button.size(buttonWidth, buttonHeight);

  // Row 3: eˣ, Clear (C), and ")"
  if (!expButton) {
    expButton = p.createButton("eˣ");
    expButton.style('background-color', '#333333');
    expButton.style('color', '#FFF');
    expButton.style('border', '2px solid black');
    expButton.style('border-radius', '5px');
    expButton.mousePressed(() => calculatorFunction("exp("));
  }
  expButton.position(startX3, thirdRowY);
  expButton.size(buttonWidth, buttonHeight);

  if (!clearButton) {
    clearButton = p.createButton("C");
    clearButton.style('background-color', '#333333');
    clearButton.style('color', '#FFF');
    clearButton.style('border', '2px solid black');
    clearButton.style('border-radius', '5px');
    clearButton.mousePressed(() => calculatorFunction("clear"));
  }
  clearButton.position(startX3 + buttonWidth + gap, thirdRowY);
  clearButton.size(buttonWidth, buttonHeight);

  if (!secondParenButton) {
    secondParenButton = p.createButton(")");
    secondParenButton.style('background-color', '#333333');
    secondParenButton.style('color', '#FFF');
    secondParenButton.style('border', '2px solid black');
    secondParenButton.style('border-radius', '5px');
    secondParenButton.mousePressed(() => calculatorFunction(")"));
  }
  secondParenButton.position(startX3 + 2 * (buttonWidth + gap), thirdRowY);
  secondParenButton.size(buttonWidth, buttonHeight);

  // Row 4: +, –, *, and ÷
  if (!plusButton) {
    plusButton = p.createButton("+");
    plusButton.style('background-color', '#333333');
    plusButton.style('color', '#FFF');
    plusButton.style('border', '2px solid black');
    plusButton.style('border-radius', '5px');
    plusButton.mousePressed(() => calculatorFunction("+"));
  }
  plusButton.position(startX4, fourthRowY);
  plusButton.size(buttonWidth, buttonHeight);

  if (!minusButton) {
    minusButton = p.createButton("–");
    minusButton.style('background-color', '#333333');
    minusButton.style('color', '#FFF');
    minusButton.style('border', '2px solid black');
    minusButton.style('border-radius', '5px');
    minusButton.mousePressed(() => calculatorFunction("–"));
  }
  minusButton.position(startX4 + buttonWidth + gap, fourthRowY);
  minusButton.size(buttonWidth, buttonHeight);

  if (!multiplyButton) {
    multiplyButton = p.createButton("*");
    multiplyButton.style('background-color', '#333333');
    multiplyButton.style('color', '#FFF');
    multiplyButton.style('border', '2px solid black');
    multiplyButton.style('border-radius', '5px');
    multiplyButton.mousePressed(() => calculatorFunction("*"));
  }
  multiplyButton.position(startX4 + 2 * (buttonWidth + gap), fourthRowY);
  multiplyButton.size(buttonWidth, buttonHeight);

  if (!divisionButton) {
    divisionButton = p.createButton("÷");
    divisionButton.style('background-color', '#333333');
    divisionButton.style('color', '#FFF');
    divisionButton.style('border', '2px solid black');
    divisionButton.style('border-radius', '5px');
    divisionButton.mousePressed(() => calculatorFunction("÷"));
  }
  divisionButton.position(startX4 + 3 * (buttonWidth + gap), fourthRowY);
  divisionButton.size(buttonWidth, buttonHeight);
}

export function calculatorFunction(op) {
  if (op === "clear") {
    calculatorDisplay.value("");
  } else {
    let current = calculatorDisplay.value();
    calculatorDisplay.value(current + op);
  }
}
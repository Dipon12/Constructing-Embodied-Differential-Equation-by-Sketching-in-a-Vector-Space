// pencilTool.js - Handles the pencil drawing tool functionality

export function activatePencilTool() {

    console.log("Pencil Button Pressed!");
    window.drawing = !window.drawing;
    if (window.drawing) {
      window.pencilButton.style('background-color', '#cccccc');
    } else {
      window.pencilButton.style('background-color', '#333333');
    }
  }
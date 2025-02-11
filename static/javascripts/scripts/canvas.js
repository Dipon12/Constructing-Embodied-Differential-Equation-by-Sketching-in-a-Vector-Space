var canvas = new fabric.Canvas('c',{
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#181818',
    selectionColor: 'rgba(100,100,100,0.3)',
    selectionLineWidth: 2,
    viewportTransform: [1, 0, 0, 1, 0, 0],
    imageSmoothingEnabled: false
  });
  
  // Set the background color of the canvas
  canvas.renderAll();
  
  var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 200,
    height: 200
  });
  
  // "add" rectangle onto canvas
  
  canvas.add(rect);
  console.log(rect.aCoords.tl.x)

  var pointsStat = [
    { x: 30, y: 50 },
    { x: 0, y: 0 },
    { x: 60, y: 0 },
 ];
 
 // Initiating a polyline object
 var polyline = new fabric.Polygon(pointsStat, {
    left: 100,
    top: 40,
    fill: "white",
    strokeWidth: 4,
 });
 
 // Adding it to the canvas
 canvas.add(polyline);

 canvas.renderAll();


const CELL_SIZE = 100;
//const CELL_SIZE = 150;  
const MAX_SCALE = 5;
const MIN_SCALE = 0.25;

const GRID_COLOR = "#ccc"; // Color for both main and finer grid lines
const MAIN_GRID_OPACITY = 0.2;  // Opacity for main grid lines 0.2
const FINE_GRID_OPACITY = 0.1;  // Opacity for finer grid lines 0.1
       // Size for the main grid cells
const FINE_CELL_SIZE = CELL_SIZE / 5;  // Size for finer grid cells (5x5 grid within each main grid cell)

//const MAX_SCALE = 20;  // Maximum zoom scale
//const MIN_SCALE = 0.25; // Minimum zoom scale
const slider = document.getElementById('slider');

window.onresize = function() {
    canvas.setWidth(window.outerWidth);
    canvas.setHeight(window.outerHeight);
};

canvas.on("mouse:wheel", function(opt) {
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** opt.e.deltaY;
    if (zoom > MAX_SCALE) zoom = MAX_SCALE;
    if (zoom < MIN_SCALE) zoom = MIN_SCALE;
    
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();

});

canvas.on("mouse:up", function(opt) {
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
});

canvas.on("mouse:down", function(opt) {
    if (opt.e.button === 1) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
    }
});

canvas.on("mouse:move", function(opt) {
    if (this.isDragging) {
        this.viewportTransform[4] += opt.e.clientX - this.lastPosX;
        this.viewportTransform[5] += opt.e.clientY - this.lastPosY;
        
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
        this.requestRenderAll();
    }
});



canvas.on('mouse:over', (e) => {
    if (e.target) {
        const object = e.target;
        const objectCoords = object.getBoundingRect(); // Object's bounding box

        // Update the slider's position based on the object
        slider.style.left = `${objectCoords.left + objectCoords.width + canvas._offset.left + 10}px`;
        slider.style.top = `${objectCoords.top + canvas._offset.top}px`;

        // Display the slider
        slider.style.display = 'flex';
    }
});


// Handle mouse:out event
canvas.on('mouse:out', (e) => {
    if (e.target) {
    slider.style.display = 'none';
    }
});

var infBGrid = fabric.util.createClass(fabric.Object, {
    type: 'infBGrid',
    
    initialize: function () {
        
    },
    
    render: function (ctx) {
        let zoom = canvas.getZoom();
        let offX = canvas.viewportTransform[4];
        let offY = canvas.viewportTransform[5];

        ctx.save();
        ctx.strokeStyle = "#cecece";
        ctx.lineWidth = 1;

        let gridSize = CELL_SIZE * zoom;

        const numCellsX = Math.ceil(canvas.width / gridSize);
        const numCellsY = Math.ceil(canvas.height / gridSize);

        let gridOffsetX = offX % gridSize;
        let gridOffsetY = offY % gridSize;
        ctx.beginPath();
        // draw vectical lines
        for (let i = 0; i <= numCellsX; i++) {
          let x = gridOffsetX + i * gridSize;
          ctx.globalAlpha = MAIN_GRID_OPACITY;
          ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
          ctx.lineTo((x - offX) / zoom, (canvas.height - offY) / zoom);
          }
      
        // draw horizontal lines
        for (let i = 0; i <= numCellsY; i++) {
          let y = gridOffsetY + i * gridSize;
          ctx.globalAlpha = MAIN_GRID_OPACITY;
          ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
          ctx.lineTo((canvas.width - offX) / zoom, (y - offY) / zoom);
        }
      
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
});

var bg = new infBGrid();
canvas.add(bg);
canvas.renderAll();


 // Get the select element
var shapeSelector = document.getElementById('shape-selector');

// Add an event listener to handle changes
shapeSelector.addEventListener('change', function() {
    var selectedShape = this.value; // 'this' refers to the select element, and 'value' gives the currently selected option's value
    console.log("Selected shape: " + selectedShape); // Log the selected shape

    // Now you can call any function to act on the selected shape
    // For instance, prepare to draw the selected shape on a Fabric.js canvas
    isDrawing = true;
    startDrawing(selectedShape);
});


let currentShape;
let isDrawing = false;
let shape;
let originX, originY;
let rectShape = [];
let circShape = [];
let ellipseShape = [];
let triangleShape = [];
let objectContainer = [];


function startDrawing(shapeType) {
    currentShape = shapeType;

    if (isDrawing){
        canvas.on('mouse:down', function(o) {
            isDrawing = true;
            let pointer = canvas.getPointer(o.e);
            originX = pointer.x;
            originY = pointer.y;
    
            if (shapeType === 'rectangle') {
                shape = new fabric.Rect({
                    left: originX,
                    top: originY,
                    color: '#ffa800',
                    originX: 'left',
                    originY: 'top',
                    width: 0,
                    height: 0,
                    fill: 'rgba(255,168,0, 0.8)',
                    brightness: 0.8, // Semi-transparent
                    selectable: true
                });
            } else if (shapeType === 'circle') {
                shape = new fabric.Circle({
                    left: originX,
                    top: originY,
                    originX: 'left',
                    originY: 'top',
                    radius: 1,
                    fill: 'rgba(0, 255, 0, 0.8)',
                    brightness: 0.8,
                    selectable: true// Semi-transparent
                });
            } else if (shapeType === 'ellipse') {
                shape = new fabric.Ellipse({
                    left: originX,
                    top: originY,
                    originX: 'left',
                    originY: 'top',
                    rx: 1,
                    ry: 1,
                    fill: 'rgba(0, 0, 255, 0.8)',
                    brightness: 0.8, // Semi-transparent
                    selectable: true
                });
            }
            // More shapes can be added here similarly
            canvas.add(shape);
        });
    
        canvas.on('mouse:move', function(o) {
            if (!isDrawing) return;
    
            let pointer = canvas.getPointer(o.e);
            let x = Math.min(pointer.x, originX),
                y = Math.min(pointer.y, originY),
                width = Math.abs(pointer.x - originX),
                height = Math.abs(pointer.y - originY);
    
            if (shapeType === 'rectangle') {
                shape.set({ left: x, top: y, width: width, height: height });
            } else if (shapeType === 'circle') {
                let radius = Math.max(width, height) / 2;
                shape.set({ left: originX, top: originY, radius: radius });
                shape.setCoords(); // To update circle's position properly
            } else if (shapeType === 'ellipse') {
                shape.set({ left: originX, top: originY, rx: width / 2, ry: height / 2 });
                shape.setCoords(); // To update ellipse's position properly
            }
    
            canvas.renderAll();
        });
    
        canvas.on('mouse:up', function() {
            isDrawing = false;
            points = [];
        });


            // Handle mouse:over event

    }
    
}


  
let handleEvents = true;

// Panning Function 
function startPan(event) {
    if (event.button != 2) {  // Right click check
        return;
    }
    var x0 = event.screenX,
        y0 = event.screenY;

    function continuePan(event) {
        var x = event.screenX,
            y = event.screenY;
        canvas.relativePan({ x: x - x0, y: y - y0 });
        x0 = x;
        y0 = y;
    }

    function stopPan(event) {
        $(window).off('mousemove', continuePan);
        $(window).off('mouseup', stopPan);
    }

    $(window).mousemove(continuePan);
    $(window).mouseup(stopPan);
    $(window).contextmenu(cancelMenu);
}

function cancelMenu() {
    $(window).off('contextmenu', cancelMenu);
    return false;  // Prevents context menu from appearing
}

// Attaching the mousedown event to the upper canvas to handle panning
$(canvas.upperCanvasEl).mousedown(startPan);

//canvas.on('mouse:over', function (e) {
  //  console.log('mouseover');
//});


let sliderContainer = null;
    let fadeTimeout;
    
    // Function to start the fade-out process.
    function startFadeOut() {
      if (sliderContainer) {
        sliderContainer.classList.add('fade-out');
        // Once the opacity transition ends, remove the slider from the DOM.
        sliderContainer.addEventListener('transitionend', function() {
          if (sliderContainer && sliderContainer.parentNode) {
            sliderContainer.parentNode.removeChild(sliderContainer);
            sliderContainer = null;
          }
        }, { once: true });
      }
    }
    
    // Function to create and display the slider near the mouse pointer.
    function showVerticalSlider(event) {
      // Remove any existing slider.
      if (sliderContainer) {
        sliderContainer.remove();
        sliderContainer = null;
      }
      
      // Create the slider container.
      sliderContainer = document.createElement('div');
      sliderContainer.id = 'vertical-slider';
      
      // Position the slider near the mouse pointer.
      const offsetX = 10, offsetY = 0; // Adjust these values as needed.
      sliderContainer.style.left = (event.e.clientX + offsetX) + 'px';
      sliderContainer.style.top  = (event.e.clientY + offsetY) + 'px';
      
      // Create the slider input element.
      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = 0;
      slider.max   = 2;
      slider.step  = 1;
      slider.value = 0;  // Default value (middle level)
      
      // Create the labels container.
      const labelsContainer = document.createElement('div');
      labelsContainer.className = 'labels';
      
      // Define and add the three level labels.
      const levels = ['Symbolic', 'Data', 'Embodied'];
      levels.forEach(function(text) {
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = text;
        labelsContainer.appendChild(label);
      });
      
      // Append the slider and labels to the container.
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(labelsContainer);
      
      // Add the slider container to the document.
      document.body.appendChild(sliderContainer);
      
      // Start a timer: after 3 seconds, fade out the slider unless the mouse is hovering over it.
      fadeTimeout = setTimeout(() => {
        if (!sliderContainer.matches(':hover')) {
          startFadeOut();
        }
      }, 3000);
      
      // When the mouse enters the slider area, cancel any pending fade-out.
      sliderContainer.addEventListener('mouseenter', function() {
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
          fadeTimeout = null;
        }
      });
      
      // When the mouse leaves the slider area, start the fade-out timer again.
      sliderContainer.addEventListener('mouseleave', function() {
        fadeTimeout = setTimeout(() => {
          startFadeOut();
        }, 3000);
      });
    }
    
    // Show the slider when the mouse hovers over the Fabric.js canvas.
    canvas.on('mouse:over', function(e) {
      showVerticalSlider(e);
    });
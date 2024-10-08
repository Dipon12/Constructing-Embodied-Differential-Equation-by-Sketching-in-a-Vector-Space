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

/*
 function drawGrid() {
    var zoom = canvas.getZoom();
    var gridSize = 150; // size of the larger grid
    var finerGridSize = gridSize / 3; // size of the finer grid
    var vp = canvas.viewportTransform;
    var width = canvas.getWidth() / zoom;
    var height = canvas.getHeight() / zoom;

    var xOffset = Math.abs(vp[4] / zoom);
    var yOffset = Math.abs(vp[5] / zoom);

    // Calculate where the grid should start drawing to ensure it covers left and top
    var startX = -xOffset % gridSize;
    var startY = -yOffset % gridSize;
    var totalWidth = xOffset + width;
    var totalHeight = yOffset + height;

    // Clear existing grid lines if any
    canvas.getObjects('line').forEach(function(line) {
        if (line.grid) canvas.remove(line);
    });

    // Draw main grid
    for (var i = startX; i < totalWidth; i += gridSize) {
        var vertical = new fabric.Line([i, 0, i, totalHeight], {
            stroke: '#ccc', strokeWidth: 1, selectable: false, opacity: 0.2, grid: true
        });
        canvas.add(vertical);
        canvas.sendToBack(vertical);
    }
    for (var j = startY; j < totalHeight; j += gridSize) {
        var horizontal = new fabric.Line([0, j, totalWidth, j], {
            stroke: '#ccc', strokeWidth: 1, selectable: false, opacity: 0.2, grid: true
        });
        canvas.add(horizontal);
        canvas.sendToBack(horizontal);
    }

    // Draw finer grid if zoomed in
    if (zoom > 1) {
        for (var x = startX; x < totalWidth; x += finerGridSize) {
            var fineVertical = new fabric.Line([x, 0, x, totalHeight], {
                stroke: '#ccc', strokeWidth: 0.5, selectable: false, opacity: 0.1, grid: true
            });
            canvas.add(fineVertical);
            canvas.sendToBack(fineVertical);
        }
        for (var y = startY; y < totalHeight; y += finerGridSize) {
            var fineHorizontal = new fabric.Line([0, y, totalWidth, y], {
                stroke: '#ccc', strokeWidth: 0.5, selectable: false, opacity: 0.1, grid: true
            });
            canvas.add(fineHorizontal);
            canvas.sendToBack(fineHorizontal);
        }
    }
}

  
  
  // Initial grid draw
  drawGrid();


  canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;

    // Zoom into cursor rather than center of canvas
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

    drawGrid(); // Redraw the grid based on new zoom level
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

window.addEventListener('resize', function() {
    var newWidth = window.outerWidth;
    var newHeight = window.outerHeight;
    if (canvas.getWidth() !== newWidth || canvas.getHeight() !== newHeight) {
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.calcOffset();  // Recalculate the offset of the canvas element
        drawGrid();           // Redraw grid to fit new size
    }
});
*/

/*
window.addEventListener('resize', function() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    if (canvas.getWidth() !== newWidth || canvas.getHeight() !== newHeight) {
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.calcOffset();  // Recalculate the offset of the canvas element
        drawInitialGrid();           // Redraw grid to fit new size
    }
});

*/


/* This is where I used comment last
function drawInitialGrid() {
    var gridSize = 150; // size of the larger grid
    var finerGridSize = gridSize / 3; // size of the finer grid

    // Assume users won't zoom out more than 4x the initial canvas size
    var extendedWidth = canvas.getWidth() * 10;
    var extendedHeight = canvas.getHeight() * 10;

    // Main grid lines
    for (var i = -extendedWidth; i <= extendedWidth; i += gridSize) {
        var vertical = new fabric.Line([i, -extendedHeight, i, extendedHeight], {
            stroke: '#ccc', strokeWidth: 1, selectable: false, opacity: 0.2, class: 'mainGrid'
        });
        canvas.add(vertical);
    }
    for (var j = -extendedHeight; j <= extendedHeight; j += gridSize) {
        var horizontal = new fabric.Line([-extendedWidth, j, extendedWidth, j], {
            stroke: '#ccc', strokeWidth: 1, selectable: false, opacity: 0.2, class: 'mainGrid'
        });
        canvas.add(horizontal);
    }

    // Finer grid lines if needed
    for (var x = -extendedWidth; x <= extendedWidth; x += finerGridSize) {
        var fineVertical = new fabric.Line([x, -extendedHeight, x, extendedHeight], {
            stroke: '#ccc', strokeWidth: 0.5, selectable: false, opacity: 0.1, class: 'fineGrid'
        });
        canvas.add(fineVertical);
    }
    for (var y = -extendedHeight; y <= extendedHeight; y += finerGridSize) {
        var fineHorizontal = new fabric.Line([-extendedWidth, y, extendedWidth, y], {
            stroke: '#ccc', strokeWidth: 0.5, selectable: false, opacity: 0.1, class: 'fineGrid'
        });
        canvas.add(fineHorizontal);
    }
}
*/ //tHis is where it ends
/*

canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    // Change the minimum zoom level to 0.25
    if (zoom < 0.25) zoom = 0.25;

    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

    // Update grid line thickness based on zoom
    canvas.getObjects().forEach(function(obj) {
        if (obj.class === 'mainGrid' || obj.class === 'fineGrid') {
            obj.strokeWidth = obj.class === 'mainGrid' ? 1 / zoom : 0.5 / zoom;
        }
    });

    canvas.requestRenderAll();
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

*/

// Initial setup
// drawInitialGrid(); # Commented this line as well
/*

window.addEventListener('resize', function() {
    canvas.setWidth(window.innerrWidth);
    canvas.setHeight(window.innerHeight);
    // Consider redrawing grid if necessary due to significantly increased size
});*/

  
// Event listener for window resize

/*
window.addEventListener('resize', function() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    if (canvas.getWidth() !== newWidth || canvas.getHeight() !== newHeight) {
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.calcOffset();  // Recalculate the offset of the canvas element
        drawGrid();           // Redraw grid to fit new size
    }
});

// Function to draw both the main grid and the finer grid


function drawGrid() {
    canvas.clear();  // Clear the existing grid before redrawing

    var gridSize = 150; // size of the larger grid
    var finerGridSize = gridSize / 3; // size of the finer grid

    var width = canvas.getWidth();
    var height = canvas.getHeight();
    
    // Main grid lines
    drawLines(width, height, gridSize, '#ccc', 1, 0.2, 'mainGrid');
    // Finer grid lines
    drawLines(width, height, finerGridSize, '#ccc', 0.5, 0.1, 'fineGrid');
}

// Helper function to draw grid lines
function drawLines(width, height, spacing, strokeColor, strokeWidth, opacity, className) {
    for (var i = -width * 2; i <= width * 2; i += spacing) {
        var vertical = new fabric.Line([i, -height * 2, i, height * 2], {
            stroke: strokeColor, strokeWidth: strokeWidth, selectable: false, opacity: opacity, class: className
        });
        canvas.add(vertical);
    }
    for (var j = -height * 2; j <= height * 2; j += spacing) {
        var horizontal = new fabric.Line([-width * 2, j, width * 2, j], {
            stroke: strokeColor, strokeWidth: strokeWidth, selectable: false, opacity: opacity, class: className
        });
        canvas.add(horizontal);
    }
}*/

/*comments starts here

function createGrid() {
    const grid = document.getElementById('infinite-grid');
    const gridSize = 10000; // This can be as large as needed
    for (let i = 0; i < gridSize; i += 100) { // Adjust 100 to your cell size
        for (let j = 0; j < gridSize; j += 100) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.left = `${i}px`;
            cell.style.top = `${j}px`;
            grid.appendChild(cell);
        }
    }
}

createGrid();

*/ //Comment finishes here
/*
const GRID_COLOR = "#ccc"; // Color for both main and finer grid lines
const MAIN_GRID_OPACITY = 0.2;  // Opacity for main grid lines 0.2
const FINE_GRID_OPACITY = 0.1;  // Opacity for finer grid lines 0.1
const CELL_SIZE = 150;         // Size for the main grid cells
const FINE_CELL_SIZE = CELL_SIZE / 5;  // Size for finer grid cells (5x5 grid within each main grid cell)

const MAX_SCALE = 20;  // Maximum zoom scale
const MIN_SCALE = 0.25; // Minimum zoom scale

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

    // Update grid line thickness based on zoom
    //bg.updateGrid(zoom);

    opt.e.preventDefault();
    opt.e.stopPropagation();
});


var infBGrid = fabric.util.createClass(fabric.Object, {
    type: 'infBGrid',

    initialize: function () {},

    updateGrid: function(zoom) {
        this.zoom = zoom;
        this.fire('scaling');
        canvas.requestRenderAll();
    },
    
    render: function (ctx) {
        let zoom = this.zoom || canvas.getZoom();
        let offX = canvas.viewportTransform[4];
        let offY = canvas.viewportTransform[5];
    
        ctx.save();
    
        let fineGridSize = FINE_CELL_SIZE * zoom;
        const numCellsX = Math.ceil(canvas.width / fineGridSize);
        const numCellsY = Math.ceil(canvas.height / fineGridSize);
    
        let gridOffsetX = offX % fineGridSize;
        let gridOffsetY = offY % fineGridSize;
    
        ctx.beginPath();
        // Draw vertical lines
        for (let i = 0; i <= numCellsX; i++) {
            let x = gridOffsetX + i * fineGridSize;
        
            ctx.beginPath();  // Start a new path for the current grid line
        
            if (i % 5 === 0) {  // Major grid line every 5 smaller cells
                ctx.strokeStyle = GRID_COLOR;  // e.g., 'black' or a darker shade for major lines
                ctx.lineWidth = 1 / zoom;  // Thicker line for major grid lines
                ctx.globalAlpha = MAIN_GRID_OPACITY;  // More opaque for major lines
            } else {
                ctx.strokeStyle = GRID_COLOR;  // e.g., 'gray' for finer lines
                ctx.lineWidth = 0.2 / zoom;  // Thinner line for finer grid lines
                ctx.globalAlpha = FINE_GRID_OPACITY;  // Less opaque for finer lines
            }
        
            // Draw the current vertical line
            ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
            ctx.lineTo((x - offX) / zoom, (canvas.height - offY) / zoom);
            ctx.stroke();  // Draw the current path
        
            ctx.closePath();  // Optionally close the path
        }
        
        // Draw horizontal lines

        for (let i = 0; i <= numCellsY; i++) {
            let y = gridOffsetY + i * fineGridSize;
        
            ctx.beginPath();  // Start a new path for the current grid line
        
            if (i % 5 === 0) {  // Major grid line every 5 smaller cells
                ctx.strokeStyle = GRID_COLOR;  // Same as vertical major lines
                ctx.lineWidth = 1 / zoom;  // Thicker line for major grid lines
                ctx.globalAlpha = MAIN_GRID_OPACITY;  // More opaque for major lines
            } else {
                ctx.strokeStyle = GRID_COLOR;  // Same as vertical finer lines
                ctx.lineWidth = 0.2 / zoom;  // Thinner line for finer grid lines
                ctx.globalAlpha = FINE_GRID_OPACITY;  // Less opaque for finer lines
            }
        
            // Draw the current horizontal line
            ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
            ctx.lineTo((canvas.width - offX) / zoom, (y - offY) / zoom);
            ctx.stroke();  // Draw the current path
        
            ctx.closePath();  // Optionally close the path
        }
        
      
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
        
});*/


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





// Handle zoom via mouse wheel
/*Comment starts here
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.25) zoom = 0.25;

    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

    // Update grid line thickness based on zoom
    canvas.getObjects().forEach(function(obj) {
        if (obj.class === 'mainGrid' || obj.class === 'fineGrid') {
            obj.strokeWidth = obj.class === 'mainGrid' ? 1 / zoom : 0.5 / zoom;
        }
    });

    canvas.requestRenderAll();
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

*/ //Comment finishes here

// Initial setup
//drawGrid();  // Draw the initial grid when the page loads

     
  
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




/*
var drawStopper = document.getElementById('stop-drawing');

drawStopper.addEventListener('click', function() {
    var selectedShape = this.value; // 'this' refers to the select element, and 'value' gives the currently selected option's value
    isDrawing = false;

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up"); 

    console.log("Drawing Stopped!");
    
});
*/





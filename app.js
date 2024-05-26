var canvas = new fabric.Canvas('c',{
    width: window.outerWidth,
    height: window.outerHeight,
    backgroundColor: '#181818',
    selectionColor: 'rgba(100,100,100,0.3)',
    selectionLineWidth: 2,
    viewportTransform: [1, 0, 0, 1, -window.outerWidth/2, -window.outerHeight/2],
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
    stroke: "green",
    strokeDashArray: [10,5]
 });
 
 // Adding it to the canvas
 canvas.add(polyline);

 canvas.renderAll();
  
  function drawGrid() {
    var zoom = canvas.getZoom();
    var gridSize = 150; // size of the larger grid
    var finerGridSize = gridSize / 3; // size of the finer grid
    var vp = canvas.viewportTransform;
    var width = canvas.getWidth() / zoom;
    var height = canvas.getHeight() / zoom;
  
    var xOffset = Math.abs(vp[4] / zoom);
    var yOffset = Math.abs(vp[5] / zoom);
  
    var totalWidth = xOffset + width;
    var totalHeight = yOffset + height;
  
    // Clear existing grid lines if any
    canvas.getObjects('line').forEach(function(line) {
        if (line.grid) canvas.remove(line);
    });
  
    // Draw main grid
    for (var i = -Math.ceil(xOffset / gridSize); i < (totalWidth / gridSize); i++) {
        var distance = i * gridSize;
        var horizontal = new fabric.Line([0, distance, totalWidth, distance], {
            stroke: '#ccc', strokeWidth: 1, selectable: false, opacity: 0.2, grid: true
        });
        var vertical = new fabric.Line([distance, 0, distance, totalHeight], {
            stroke: '#ccc', strokeWidth: 1, selectable: false, opacity: 0.2, grid: true
        });
        canvas.add(horizontal);
        canvas.add(vertical);
        canvas.sendToBack(horizontal);
        canvas.sendToBack(vertical);
    }
  
    // Draw finer grid if zoomed in
    if (zoom > 1) {
        for (var j = -Math.ceil(xOffset / finerGridSize); j < (totalWidth / finerGridSize); j++) {
            var fineDistance = j * finerGridSize;
            var fineHorizontal = new fabric.Line([0, fineDistance, totalWidth, fineDistance], {
                stroke: '#ccc', strokeWidth: 0.5, selectable: false, opacity: 0.1, grid: true
            });
            var fineVertical = new fabric.Line([fineDistance, 0, fineDistance, totalHeight], {
                stroke: '#ccc', strokeWidth: 0.5, selectable: false, opacity: 0.1, grid: true
            });
            canvas.add(fineHorizontal);
            canvas.add(fineVertical);
            canvas.sendToBack(fineHorizontal);
            canvas.sendToBack(fineVertical);
        }
    }
  }
  
  
  // Initial grid draw
  drawGrid();


    window.onresize = function() {
        canvas.setWidth(window.outerWidth);
        canvas.setHeight(window.outerHeight);
    };
  
  // Redraw grid on zoom and resize
  
  canvas.on('mouse:wheel', function(opt) {
        var delta = opt.e.deltaY;
        var pointer = canvas.getPointer(opt.e);
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
        canvas.setWidth(window.outerWidth);
        canvas.setHeight(window.outerHeight);
        canvas.calcOffset();  // Recalculate the offset of the canvas element
        drawGrid();           // Redraw grid to fit new size
    });

    

    

     
  
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
                    fill: 'rgba(255,168,0, 0.9)', // Semi-transparent
                    selectable: true
                });
            } else if (shapeType === 'circle') {
                shape = new fabric.Circle({
                    left: originX,
                    top: originY,
                    originX: 'left',
                    originY: 'top',
                    radius: 1,
                    fill: 'rgba(0, 255, 0, 0.5)' // Semi-transparent
                });
            } else if (shapeType === 'ellipse') {
                shape = new fabric.Ellipse({
                    left: originX,
                    top: originY,
                    originX: 'left',
                    originY: 'top',
                    rx: 1,
                    ry: 1,
                    fill: 'rgba(0, 0, 255, 0.5)' // Semi-transparent
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
            
            objectContainer.push(shape);
            /*
            if (currentShape === 'rectangle'){
                rectShape.push(shape);
                console.log("New Rectangle Added");
                console.log(shape.type);
                console.log(shape.getCenterPoint().x);
            } else if (currentShape === 'circle') {
                circShape.push(shape);
                console.log("New Circle Added");
            } else if (shapeType === 'ellipse') {
                ellipseShape.push(shape);
            }*/
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

document.getElementById('stop-drawing').addEventListener('click', shapeDrawingStopper);

function shapeDrawingStopper(){
    var selectedShape = this.value; // 'this' refers to the select element, and 'value' gives the currently selected option's value
    isDrawing = false;

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up"); 

    console.log("Drawing Stopped!");
}


let polyPoints = [];
let lasso;

function startLasso() {
    shapeDrawingStopper();
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = 'white';
    canvas.freeDrawingBrush.strokeDashArray = [15,10];

    // Add path created event listener
    function handlePathCreated(opt) {
        var path = opt.path;
        var pathData = path.path;
        for (let segment of pathData) {
            if (segment[0] === 'Q') { // Handles quadratic bezier curves
                polyPoints.push({ x: segment[1], y: segment[2] }); // Control point
                polyPoints.push({ x: segment[3], y: segment[4] }); // Endpoint
            }
        }
        removePencilStrokes();
    }

    canvas.on('path:created', handlePathCreated);

    // Ensure to remove event listener after drawing is done
    canvas.on('mouse:up', function() {
        canvas.off('path:created', handlePathCreated); // Stop recording points
        canvas.isDrawingMode = false; // Stop drawing mode
        drawPolygonFromPoints(); // Call to draw polygon from recorded points
        polyPoints = []; // Reset points array
    });

    function removePencilStrokes() {
        const objects = canvas.getObjects('path');
        for (let i = objects.length - 1; i >= 0; i--) {
            if (objects[i].type === 'path') {
                canvas.remove(objects[i]);
            }
        }
        console.log("Pencil Drawing Removed!");
    }

    function drawPolygonFromPoints() {
        console.log("Drawing Polygon!");
        if (polyPoints.length > 2) {
            const polygon = new fabric.Polygon(polyPoints, {
                fill: 'transparent',
                stroke: 'white',
                strokeWidth: 5,
                selectable: false,
                strokeDashArray: [15, 10]
            });
            canvas.add(polygon);
            canvas.sendToBack(polygon);
            canvas.renderAll();
            

            findObjectsInsidePolygon(polygon);
        }
    }

    
    function findObjectsInsidePolygon(lassoBoundary) {

        let objectsWithinPolygon = [];

        let rectCounter = 0;
        let circleCounter = 0;
        let ellipseCounter = 0;
        let triangleCounter = 0;

        for (let i = objectContainer.length - 1; i >= 0; i--) {
            
            let currentObjectCenter = objectContainer[i].getCenterPoint();

            //console.log(currentObjectCenter);
            //console.log(polyPoints.points);
            if(isPointInPolygon(currentObjectCenter, lassoBoundary.points)){
                
                if(objectContainer[i].type === 'rect'){
                    rectCounter++;
                } else if(objectContainer[i].type === 'circle'){
                    circleCounter++;
                }

                objectsWithinPolygon.push(objectContainer[i]);

                
            }
        }

        noOfObjects = objectsWithinPolygon.length;

        let dArea = getArea(objectsWithinPolygon[noOfObjects-1]) - getArea(objectsWithinPolygon[noOfObjects-2])
        let dt = getDistance(objectsWithinPolygon[noOfObjects-1].getCenterPoint(),objectsWithinPolygon[noOfObjects-2].getCenterPoint());
        let dAngle = getAngle(objectsWithinPolygon[noOfObjects-1]) - getAngle(objectsWithinPolygon[noOfObjects-2]);
        //let dColor = getColor(objectsWithinPolygon[noOfObjects-1]) - getColor(objectsWithinPolygon[noOfObjects-2]);
        //let dOpacity = getOpacity(objectsWithinPolygon[noOfObjects-1]) - getArea(objectsWithinPolygon[noOfObjects-2]);

        console.log("Area Difference (dA): ", dArea);
        console.log("Time Difference (dt): ", dt);
        console.log("Slope dArea/dt: ", dArea/dt);
        
        console.log(getAngle(objectsWithinPolygon[noOfObjects-1]));
        console.log("Angle Difference (dAngle): ", dAngle);
        console.log("Slope d(Angle)/dt: ", dAngle/dt);

        //console.log("Color Difference (dt): ", dColor);
        //console.log("Slope d(Color)/dt: ", dColor/dt);

        //console.log("Opacity Difference (dt): ", dAngle);
        //console.log("Slope d(Opacity)/dt: ", dOpacity/dt);


    function isPointInPolygon(point, polygonPoints) {
        let x = point.x, y = point.y;
        let inside = false;
    
        for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
            let xi = polygonPoints[i].x, yi = polygonPoints[i].y;
            let xj = polygonPoints[j].x, yj = polygonPoints[j].y;
    
            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = true;
        }
        return inside;
    }
}

function getArea(shapeObject){

    if(shapeObject.type === 'rect'){
        return shapeObject.height * shapeObject.width;
    } else if (shapeObject.type === 'circle') {
        return Math.PI * shapeObject.radius * shapeObject.radius;
    }
    
}

function getDistance(point1, point2) {

    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;

    return Math.sqrt(dx * dx + dy * dy);
}

function getAngle(shapeObject){
    return shapeObject.angle;
}

}

// Example to start lasso
document.getElementById('pencil').addEventListener('click', startLasso);


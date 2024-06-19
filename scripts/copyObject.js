
let currentPath = null;
let originalObject = null;
let points = [];
let line;





document.getElementById('highlighter').addEventListener('click', copyBrush);

function copyBrush(){

  
  
    console.log("Clicked Copy Brush!");
    shapeDrawingStopper();
    
    
    isDrawing = !isDrawing;
    if (!isDrawing) {
        canvas.selection = true;
        finishDrawing();
    } else {
        canvas.selection = false;
    }

    canvas.on('mouse:down', function(options) {
      if (isDrawing && !originalObject) {
          originalObject = canvas.getActiveObject();
          if (!originalObject) {
              alert("Select an object first!");
              return;
          }
          canvas.discardActiveObject();
      }
    });

    canvas.on('mouse:move', function(options) {
      if (!isDrawing || !originalObject) return;
    
      let pointer = canvas.getPointer(options.e);
      if (points.length === 0 || calcDist(points[points.length - 1], pointer) > originalObject.height * 2) { //temporary considering only height
          points.push(pointer);
          copyObjectAt(pointer);
          if (points.length > 1) {
              drawLineBetween(points[points.length - 2], points[points.length - 1]);
          }
      }
    });
    
    function calcDist(p1, p2) {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }
    
    function copyObjectAt(point) {

      let newObj = null;

      console.log("Selected shape is a " + originalObject.type);

        if (originalObject.type === "rect"){
            newObj = new fabric.Rect({
            left: point.x,
            top: point.y,
            originX: 'center',
            originY: 'center',
            fill: originalObject.fill,
            width: originalObject.width,
            height: originalObject.height,
            angle: originalObject.angle,
            scaleX: originalObject.scaleX,
            scaleY: originalObject.scaleY,
            stroke: originalObject.stroke,
            strokeWidth: originalObject.strokeWidth,
            opacity: originalObject.opacity
            });

            objectContainer.push(newObj);


        } else if (originalObject.type === 'circle') {
            newObj = new fabric.Circle({
            left: point.x,
            top: point.y,
            originX: 'center',
            originY: 'center',
            radius: originalObject.radius,
            fill: originalObject.fill,
            stroke: originalObject.stroke,
            strokeWidth: originalObject.strokeWidth,
            scaleX: originalObject.scaleX,
            scaleY: originalObject.scaleY,
            angle: originalObject.angle,
            opacity: originalObject.opacity
            });

            objectContainer.push(newObj);
        }
        canvas.add(newObj);
        canvas.renderAll();
    }
    
    
    function drawLineBetween(start, end) {
      line = new fabric.Line([start.x, start.y, end.x, end.y], {
          stroke: 'gray',
          strokeWidth: 2,
          selectable: true,
          //evented: false,
      });
      canvas.add(line);
    }
    
    function finishDrawing() {
      points = [];
      originalObject = null;
    }
    
    canvas.on('mouse:up', function(options) {
      if (isDrawing) finishDrawing();
    });


    function finishDrawing() {
      originalObject = null;  // Clean up the original object
      canvas.isDrawingMode = false;
      canvas.selection = true;
    }

};




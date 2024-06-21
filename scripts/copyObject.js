
let currentPath = null;
let originalObject = null;
let points = [];
let lineList = [];
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
      if (points.length === 0 || calcDist(points[points.length - 1], pointer) > originalObject.height * 2) { //temporarily considering only height
          //points.push(pointer);
          copyObjectAt(pointer);

          drawLine(pointer);
          /*if (points.length > 1) {
              drawLineBetween(points[points.length - 2], points[points.length - 1]);
          }*/
          
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
    
    function finishDrawing() {
      points = [];
      originalObject = null;
    }
    
    canvas.on('mouse:up', function(options) {
      if (isDrawing){
        console.log("Drawing finished!");
        finishDrawing();
      }
    });


    function finishDrawing() {
      originalObject = null;  // Clean up the original object
      canvas.isDrawingMode = false;
      canvas.selection = true;
    }

};


function drawLine(pointer){
  points.push(pointer);
  if (points.length > 1) {
    drawLineBetween(points[points.length - 2], points[points.length - 1]);
  }
}

function drawLineBetween(start, end) {
  line = new fabric.Line([start.x, start.y, end.x, end.y], {
      stroke: 'gray',
      strokeWidth: 2,
      selectable: true,
      //evented: false,
  });

  lineList.push(line);
  canvas.sendToBack(line)
  canvas.add(line);
}


document.getElementById('upload').addEventListener('click', function() {
  document.getElementById('csvFileInput').click();
});

firstLine = true;
document.getElementById('csvFileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) {
    console.log("No file found!");
    return;
  }
  console.log("CSV uploaded!");
  
  const reader = new FileReader();
  reader.onload = function(e) {
      const text = e.target.result;
      
      processData(text);
  };
  reader.readAsText(file);
});

let lastX = canvas.width / 3; // Starting x-coordinate for the first object

function processData(csvData) {
  let allTextLines = csvData.split(/\r\n|\n/);
  for (let line of allTextLines) {

      if (firstLine) {
        firstLine = false; // Skip the first iteration and reset the flag
        continue;
      }
      let data = line.split(',');
      if (data.length === 4) {
          let [distance, height, width, opacity ] = data.map(Number);
          console.log("New Rect here:");
          console.log([distance, height, width, opacity]);
          let rect = new fabric.Rect({
              left: lastX + distance, // position the new object at a distance from the last one
              top: 100 - height/2, // constant y-coordinate
              fill: 'orange',
              width: width,
              height: height,
              opacity: opacity
          });
          canvas.add(rect);
          objectContainer.push(rect);
          drawLine(rect.getCenterPoint());

          // Update lastX to be the right edge of the new object
          lastX = rect.left + rect.width;
      }
  }
  canvas.renderAll();
}
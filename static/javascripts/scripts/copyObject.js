
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
  document.getElementById('fileInput').click();
});

firstLine = true;
document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) {
    console.log("No file found!");
    return;
  }
  console.log("TSV uploaded!");
  
  const reader = new FileReader();
  reader.onload = function(e) {
      const text = e.target.result;
      
      processData(text);
  };
  reader.readAsText(file);
});

let lastX = canvas.width / 3; // Starting x-coordinate for the first object

/*
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

*/


function processData(tsvData) {
  let allTextLines = tsvData.split(/\r\n|\n/); // Split the data into lines
  let firstLine = true; // Flag to skip the first line (usually headers)
  let lastX = 0; // Initialize lastX to keep track of the x-coordinate of the last rectangle
  //let objectContainer = []; // Initialize a container to store rectangle objects

  for (let line of allTextLines) {
      if (firstLine) {
          firstLine = false; // Skip the first iteration and reset the flag
          continue;
      }
      let data = line.split('\t'); // Split the line into columns using the tab delimiter
      if (data.length === 3) {
          let coordinates = parseCoordinates(data[0]); // Parse the coordinates from the first column

          //console.log("Inside processData", coordinates);
          let fillColor = data[1]; // Fill color from the second column
          let opacity = parseFloat(data[2]); // Convert all elements to numbers
          console.log("New Object here:");
          console.log([coordinates, fillColor, opacity]);

          let poly = new fabric.Polygon(coordinates, {
                fill: fillColor,
                opacity: opacity
          });

          canvas.add(poly); // Add the rectangle to the canvas

          objectContainer.push(poly); // Store the rectangle in the container
          if (poly.getCenterPoint) { // Check if the method exists
              drawLine(poly.getCenterPoint()); // Draw a line (function needs to be defined)
          }

          // Update lastX to be the right edge of the new object
      }
  }
  canvas.renderAll(); // Render all elements on the canvas
}

function parseCoordinates(coordString) {
  // Extract coordinate pairs, assuming they are in the format (x1,y1),(x2,y2),...
  //console.log("Inside parseCoordinates", coordString);
  let coordPairs = coordString.match(/\(([^)]+)\)/g); // Match text within parentheses
  if (!coordPairs) return []; // Return an empty array if no matches

  //console.log("Inside parseCoordinates", coordPairs);

  return coordPairs.map(pair => {
      // Remove parentheses and split by comma
      const coords = pair.replace(/[()]/g, '').split(',');
      return {
          x: parseFloat(coords[0]), // Convert x to number
          y: parseFloat(coords[1])  // Convert y to number
      };
  });
}



document.getElementById('downloadJSON').addEventListener('click', function() {
  var json = canvas.toJSON(); // Serialize the canvas to JSON
  downloadJSON(json, 'canvasBackup');
});

function downloadJSON(json, filename) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
      const json = JSON.parse(e.target.result);
      canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
  };
  reader.readAsText(file);
});

function loadCanvasFromJSON(json) {
  canvas.loadFromJSON(json, function() {
      canvas.renderAll();
      // Callback function if you need to do something after the canvas is rendered
      console.log('Canvas loaded from JSON.');
  });
}



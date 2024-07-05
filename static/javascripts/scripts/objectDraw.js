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
let attributeName = "height";
//let lasso;

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
            let lassoPolygon = new fabric.Polygon(polyPoints, {
                fill: 'transparent',
                stroke: 'white',
                strokeWidth: 5,
                selectable: true,
                strokeDashArray: [15, 10]
            });
            canvas.add(lassoPolygon);
            canvas.sendToBack(lassoPolygon);
            canvas.renderAll();
            

            findObjectsInsidePolygon(lassoPolygon);
            //createTextInput(lassoPolygon);
            
           
        }
    }



    function createTextInput(polygon) {
        const bound = polygon.getBoundingRect();
        const inputDiv = document.createElement('div');
        inputDiv.style.position = 'absolute';
        inputDiv.style.left = `${bound.left + bound.width}px`;
        inputDiv.style.top = `${bound.top}px`;
      
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter label';
      
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.onclick = function() {
          attributeName = input.value;
          const text = new fabric.Text(input.value, {
            left: bound.left + 5,
            top: bound.top + 5,
            fontSize: 14,
            fill: 'black'
          });
          canvas.add(text);
          document.body.removeChild(inputDiv);  // This line removes the input field from the DOM.
        };
      
        inputDiv.appendChild(input);
        inputDiv.appendChild(submitButton);
        document.body.appendChild(inputDiv);
      }
      
      

    
    function findObjectsInsidePolygon(lassoBoundary) {

        let objectsWithinPolygon = [];
        let linesWithinPolygon = [];
        let rectCounter = 0;
        let circleCounter = 0;
        let ellipseCounter = 0;
        let triangleCounter = 0;

        for (let i = objectContainer.length - 1; i >= 0; i--) {
            
            let currentObjectCenter = objectContainer[i].getCenterPoint();
            

            //console.log("From find objects inside polygon" + objectContainer[i].getCenterPoint());
            //console.log(polyPoints.points);
            if(isPointInPolygon(currentObjectCenter, lassoBoundary.points)){
                
                objectsWithinPolygon.push(objectContainer[i]);

                /*
                if(objectContainer[i].type === 'rect'){
                    rectCounter++;
                    //console.log(i + " no. objectContainer height: "+ objectContainer[i].height);
                    //console.log(i + " no. objectContainer actual height: "+ objectContainer[i].getScaledHeight());
                    objectsWithinPolygon.push(objectContainer[i]);
                } else if(objectContainer[i].type === 'circle'){
                    circleCounter++;
                    objectsWithinPolygon.push(objectContainer[i]);
                }*/
                
            }
            
        }

        for (let i = lineList.length - 1; i >= 0; i--) {
            
            let currentLineCenter = lineList[i].getCenterPoint();

            //console.log("From find objects inside polygon" + objectContainer[i].getCenterPoint());
            //console.log(polyPoints.points);
            if(isPointInPolygon(currentLineCenter, lassoBoundary.points)){  
                linesWithinPolygon.push(lineList[i]);
            }
            
        }

        

        //createGroup(lassoBoundary, linesWithinPolygon, objectsWithinPolygon);
    

        noOfObjects = objectsWithinPolygon.length;
        console.log("No of objects within polygon " + noOfObjects);
        
        dHeightArray = [];
        dWidthArray = [];
        dAreaArray = [];
        dRadiusArray = [];
        dOpacityArray = [];
        dtArray = [];
        initialHeightValue = 0;
        initialPositionValue = 0;

        function dynamicsRecorder(attributeNames){


            let attributeData = {};

            attributeNames.forEach(attr => attributeData[attr] = []);
        
        
            for (let i = 0; i < noOfObjects; i++) {
                const currentObject = objectsWithinPolygon[i];
        
                // Calculate time difference
                if (i == 0) {
                    dtArray.push(0);
                } else {
                    dtArray.push(getDistance(objectsWithinPolygon[i - 1], currentObject) + dtArray[i - 1]);
                }
        
                // Calculate attribute-specific values for each requested attribute
                if (currentObject.type === 'rect') {

                    attributeNames.forEach(attr => {
                    
                        switch (attr) {
                            case "height":
                                attributeData[attr].push(currentObject.getScaledHeight());
                                break;
                            case "width":
                                attributeData[attr].push(currentObject.getScaledWidth());
                                break;
                            case "area":
                                attributeData[attr].push(currentObject.getScaledWidth() * currentObject.getScaledHeight());
                                break;
                            
                            // case "opacity":
                            //     attributeData[attr].push(currentObject.getOpacity());
                            //     break;
                        }
                    });
                } else if (currentObject.type === 'circle') {
                    attributeNames.forEach(attr => {
                        switch (attr) {
                            case "radius":
                                attributeData[attr].push(currentObject.radius); // or perhaps 0 or some initial value
                                break;
                            case "area":
                                //attributeData[attr].push(currentObject.getArea());
                                //break;
                            // case "opacity":
                            //     attributeData[attr].push(currentObject.getOpacity());
                            //     break;
                        }
                    });
                }
            }
        
            // Include dtArray in the return value
            attributeData["time"] = dtArray;

            console.log("Inside Dynamics Recorder");
            console.log(attributeData);
            return attributeData;
        


            /*

            for(let i=0; i<noOfObjects; i++){

                if(objectsWithinPolygon[i].type === 'rect'){
                    dHeightArray.push(objectsWithinPolygon[i].getScaledHeight());
                    dWidthArray.push(objectsWithinPolygon[i].getScaledWidth());
                    dAreaArray.push(objectsWithinPolygon[i].getScaledWidth() * objectsWithinPolygon[i].getScaledHeight());
                    //dOpacityArray.push(objectsWithinPolygon[i].getOpacity());
                }else if(objectsWithinPolygon[i].type === 'circle'){
                    dRadiusArray.push(objectsWithinPolygon[i+1].radius - objectsWithinPolygon[i].radius);
                    dAreaArray.push(objectsWithinPolygon[i].getArea());
                    //dOpacityArray.push(objectsWithinPolygon[i].getOpacity());
                }
            

                    

                    if(attributeName == "height"){
                        dHeightArray.push(objectsWithinPolygon[i].getScaledHeight());
                        return dHeightArray;
                    } else if(attributeName == "width"){
                        dWidthArray.push(objectsWithinPolygon[i].getScaledWidth());
                        return dWidthArray;
                    } else if(attributeName == "area"){
                        dAreaArray.push(objectsWithinPolygon[i].getScaledWidth() * objectsWithinPolygon[i].getScaledHeight());
                        return dAreaArray;
                    } else if(attributeName == "opacity"){
                        dOpacityArray.push(objectsWithinPolygon[i].getOpacity());
                        return dOpacityArray;
                    }

                    //dHeightArray.push(objectsWithinPolygon[i+1].getScaledHeight() - objectsWithinPolygon[i].getScaledHeight());
                    
                    //dWidthArray.push(objectsWithinPolygon[i+1].getScaledWidth() - objectsWithinPolygon[i].getScaledWidth());
                } else if(objectsWithinPolygon[i].type === 'circle'){
                    if(attributeName == "radius"){
                        dRadiusArray.push(objectsWithinPolygon[i+1].radius - objectsWithinPolygon[i].radius);
                        return dRadiusArray;
                    } else if(attributeName == "area"){
                        dAreaArray.push(objectsWithinPolygon[i].getArea());
                        return dAreaArray;
                    } else if(attributeName == "opacity"){
                        dOpacityArray.push(objectsWithinPolygon[i].getOpacity());
                        return dOpacityArray;
                    }
                    
                }
            
                
                if (i == 0){
                    dtArray.push(0)
                } else {
                    dtArray.push(getDistance(objectsWithinPolygon[i-1],objectsWithinPolygon[i]) + dtArray[i-1]);
                }


                //dtArray.push(getPolarDistance(objectsWithinPolygon[i]));
            }

            if(objectsWithinPolygon[0].type === 'rect'){
                initialHeightValue = dHeightArray[0];
                initialWidthValue  = dWidthArray[0];
                initialAreaValue = dAreaArray[0];
                initialOpacityValue = dOpacityArray[0];
            } else if(objectsWithinPolygon[0].type === 'circle'){
                initialRadiusValue  = objectsWithinPolygon[0].radius;
            }

            initialPositionValue = objectsWithinPolygon[0].getCenterPoint();

            console.log("From dynamicsRecorder");
            console.log(dtArray);
            //console.log(dtArray);

            */

        }

        
        function fitPolynomialRegression(xValues,yValues){
            let data = xValues.map((x, index) => [x, yValues[index]]);
            console.log("From Data");
            console.log(data);
            let result = regression.polynomial(data, { order: 2 });
            

            console.log(result);

            let prediction = result.predict(6);
            console.log('Predicted value of y for x = 6:', prediction);

            // Get the equation
            console.log('Equation:', result.string);
            //console.log(result);

            return result;
        }

        
        // Renew When?

        function eulerMethod(f, x0, y0, h, xEnd) {
            let x = x0;
            let y = y0;
            let steps = (xEnd - x0) / h;
        
            console.log(`Starting from x=${x}, y=${y}`);
        
            for (let i = 0; i < steps; i++) {
                y += h * f(x, y); // Update y using Euler's formula
                x += h;           // Increment x by step size h
        
                //console.log(`After step ${i + 1}: x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
            }
        
            return y;  
        }
        
        
        async function firstOrderPolynomialODE(attributeNames, dtArray, initialXValue, initialYValue, lastXValue){
            console.log("This is attributeNames");
            console.log(attributeNames);
            
            attributeData = dynamicsRecorder(attributeNames); //attributeNames is a list of the required attributes
            let dataArray = [];

            countAttributes = attributeNames.length;

            for (var i = 0; i < countAttributes; i++) {

                attribute = attributeNames[i];
                if (attribute !== 'time') {  // Assuming you want to exclude the 'time' array
                    console.log(`Processing data for attribute: ${attribute}`);
                    dataArray = attributeData[attribute];
                }
            }

            timeArray = attributeData['time'];
            console.log("Inside First Order Polynomial");
            console.log(dataArray);

            result = await sendArrays(timeArray, dataArray)
            console.log(result)
            
            /*
            regressionResult = fitPolynomialRegression(dtArray, attributeArray);
            equationCoefficients = regressionResult.equation;
            console.log(equationCoefficients);

            const x0 = initialYValue;  // Initial x value
            const y0 = initialXValue;  // Initial y value
            const h = 0.1; // Step size
            const xEnd = lastXValue; // The x value we want to approximate y(xEnd)
            
            // Call the solver
            function differentialEquation(x,y) {
                return equationCoefficients[0]*x*x + equationCoefficients[1]*x + equationCoefficients[2];
            }

            yEnd = differentialEquation(xEnd);

            //const yEnd = eulerMethod(differentialEquation, x0, y0, h, xEnd);
            console.log(`Approximate solution at x = ${xEnd}: y = ${yEnd.toFixed(2)}`);
            */

            
        }

        
        function firstOrderLinearODE(){

            //dynamicsRecorder();

            // Solves dy/dx = k

            let dArea = getArea(objectsWithinPolygon[noOfObjects-1]) - getArea(objectsWithinPolygon[noOfObjects-2]);
            let dt = getDistance(objectsWithinPolygon[noOfObjects-1],objectsWithinPolygon[noOfObjects-2]);
            let dAngle = getAngle(objectsWithinPolygon[noOfObjects-1]) - getAngle(objectsWithinPolygon[noOfObjects-2]);
            let dOpacity = getOpacity(objectsWithinPolygon[noOfObjects-1]) - getOpacity(objectsWithinPolygon[noOfObjects-2]);
            //let dColor = getColor(objectsWithinPolygon[noOfObjects-1]) - getColor(objectsWithinPolygon[noOfObjects-2]);
            //let dOpacity = getOpacity(objectsWithinPolygon[noOfObjects-1]) - getArea(objectsWithinPolygon[noOfObjects-2]);
            

            console.log("Area Difference (dA): ", dArea);
            console.log("Time Difference (dt): ", dt);
            console.log("Slope dArea/dt: ", dArea/dt);
            
            console.log(getAngle(objectsWithinPolygon[noOfObjects-1]));
            console.log("Angle Difference (dAngle): ", dAngle);
            console.log("Slope d(Angle)/dt: ", dAngle/dt);

            console.log(getOpacity(objectsWithinPolygon[noOfObjects-1]));
            console.log("Opacity Difference (dAngle): ", dOpacity);
            console.log("Slope d(Opcaity)/dt: ", dOpacity/dt);

            

        }

        
        firstOrderPolynomialODE(attributeNames = ['height'],dtArray,initialHeightValue,initialPositionValue,lastXValue=initialPositionValue+300);
        //firstOrderLinearODE();

        


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

    function getPolarDistance(objectReceived){
        let xPoint = objectReceived.getCenterPoint().x;
        let yPoint = objectReceived.getCenterPoint().y;

        return Math.sqrt(xPoint*xPoint+yPoint*yPoint);

    }

    function getDistance(object1, object2) {

        point1 = object1.getCenterPoint();
        point2 = object2.getCenterPoint();

        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    function getAngle(shapeObject){
        return shapeObject.angle;
    }

    function getOpacity(shapeObject){
        return shapeObject.opacity;
    }

}

// Example to start lasso



function updateOpacity() {
    var activeObject = canvas.getActiveObject();
    console.log(activeObject.type)
    if (activeObject) {
        var opacityValue = parseFloat(document.getElementById('opacitySlider').value);
        activeObject.set('opacity', opacityValue);
        document.getElementById('opacitySliderValue').innerText = opacityValue.toString();
        canvas.renderAll();
    }
}

function opacityModifier(){
    var sliderContainer = document.getElementById('opacitySliderContainer');
    sliderContainer.style.display = 'block';
    console.log("Opacity clicked!");
}


// Event listeners for sliders

document.getElementById('brightnessSlider').addEventListener('input', updateBrightness);
document.getElementById('brightness').addEventListener('click', brightnessModifier);

function brightnessModifier(){
    var sliderContainer = document.getElementById('brightnessSliderContainer');
    sliderContainer.style.display = 'block';
}

function updateBrightness() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        var brightnessValue = parseFloat(document.getElementById('brightnessSlider').value);
        var filter = new fabric.Image.filters.Brightness({
            brightness: brightnessValue
        });
        activeObject.filters[0] = filter; // assuming brightness filter is at index 0
        activeObject.applyFilters();
        document.getElementById('brightnessSliderValue').innerText = brightnessValue.toString();
        canvas.renderAll();
    }
}

var sliderContainer = document.getElementById('opacitySliderContainer');

sliderContainer.addEventListener('mouseenter', function() {
    sliderContainer.style.opacity = '1'; // Full opacity when hovered
});

sliderContainer.addEventListener('mouseleave', function() {
    sliderContainer.style.opacity = '0'; // Fade out when not hovered
    sliderContainer.style.display = 'none';
});


document.getElementById('pencil').addEventListener('click', startLasso);
document.getElementById('opacitySlider').addEventListener('input', updateOpacity);
document.getElementById('opacity').addEventListener('click', opacityModifier);



async function sendArrays(timeArray, attributeArray) {
    const data = { timeArray, attributeArray };

    console.log("Inside sendArrays");
    console.log(attributeArray);
    console.log("Inside sendArrays dataArray");
    console.log(data);
    const response = await fetch('http://127.0.0.1:5000/diff_eqn_generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log('Processed result:', result);  // Processed result from Python
}
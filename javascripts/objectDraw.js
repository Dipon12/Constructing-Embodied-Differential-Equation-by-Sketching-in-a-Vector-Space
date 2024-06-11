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
        
        dHeightArray = [];
        dWidthArray = [];
        dRadiusArray = [];
        dOpacityArray = [];
        dtArray = [];
        initialHeightValue = 0;
        initialPositionValue = 0;

        function dynamicsRecorder(){

            for(let i=0; i<noOfObjects-1; i++){

                if(objectsWithinPolygon[i].type === 'rect'){
                    dHeightArray.push(objectsWithinPolygon[i+1].height - objectsWithinPolygon[i].height);
                    dWidthArray.push(objectsWithinPolygon[i+1].width - objectsWithinPolygon[i].width);
                } else if(objectsWithinPolygon[i].type === 'circle'){
                    dRadiusArray.push(objectsWithinPolygon[i+1].radius - objectsWithinPolygon[i].radius);
                }
                
                dtArray.push(getDistance(objectsWithinPolygon[noOfObjects-1],objectsWithinPolygon[noOfObjects-2]));
            }

            if(objectsWithinPolygon[0].type === 'rect'){
                initialHeightValue = objectsWithinPolygon[0].height;
                initialWidthValue  = objectsWithinPolygon[0].width;
            } else if(objectsWithinPolygon[0].type === 'circle'){
                initialRadiusValue  = objectsWithinPolygon[0].radius;
            }

            initialPositionValue = objectsWithinPolygon[0].getCenterPoint();

        }

        
        function fitPolynomialRegression(xValues,yValues){
            const data = xValues.map((x, index) => [x, yValues[index]]);
            const result = regression.polynomial(data, { order: 2 });
            

            console.log(result);

            const prediction = result.predict(6);
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
        
        // Define the differential equation dy/dx = x + y
        
        
        // Initial conditions and parameters
        
        function firstOrderPolynomialODE(attributeArray, dtArray, initialXValue, initialYValue, lastXValue){

            dynamicsRecorder();
            
            regressionResult = fitPolynomialRegression(attributeArray,dtArray);
            equationCoefficients = regressionResult.equation;

            const x0 = initialYValue;  // Initial x value
            const y0 = initialXValue;  // Initial y value
            const h = 0.1; // Step size
            const xEnd = lastXValue; // The x value we want to approximate y(xEnd)
            
            // Call the solver
            function differentialEquation(x,y,) {
                return equationCoefficients[0]*x*x + equationCoefficients[1]*x + equationCoefficients[2];
            }

            const yEnd = eulerMethod(differentialEquation, x0, y0, h, xEnd);
            console.log(`Approximate solution at x = ${xEnd}: y = ${yEnd.toFixed(2)}`);

        }

        
        function firstOrderLinearODE(){

            dynamicsRecorder();

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


        firstOrderPolynomialODE(dHeightArray,dtArray,initialHeightValue,initialPositionValue,lastXValue=initialPositionValue+300);
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
document.getElementById('pencil').addEventListener('click', startLasso);

document.getElementById('opacitySlider').addEventListener('input', updateOpacity);
document.getElementById('opacity').addEventListener('click', opacityModifier);
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
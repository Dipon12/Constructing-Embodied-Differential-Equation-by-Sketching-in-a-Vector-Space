
let pendulumGroup;

document.getElementById('pendulum').addEventListener('click', function() {

  isAnimating = !isAnimating;
  if (isAnimating) {
    fabric.util.requestAnimFrame(animatePendulum);
  }

});



let pendulum, rod, isAnimating = false;
let angle = 0; // Starting angle
let amplitude = 30; // Amplitude of the swing in degrees
let angularVelocity = 0.05; // Speed of the swing
let time = 0;
let flag = 0;

let angleArray =[];
let timeArray = [];

// Function to create the pendulum and add it to the canvas
function createPendulum() {
  // Create the rod

  rod = new fabric.Line([250, 0, 250, 200], {
    stroke: 'white',
    strokeWidth: 2,
    selectable: false,
    originX: 'center',
    originY: 'top'
  });

  // Create the bob
  let bob = new fabric.Circle({
    radius: 20,
    fill: 'red',
    left: 250,
    top: 200,
    originX: 'center',
    originY: 'center',
    selectable: false
  });

  // Group the rod and bob to form the pendulum
  pendulum = new fabric.Group([rod, bob], {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'top'
  });

  


  // Add the pendulum to the canvas
  canvas.add(pendulum);
}


async function animatePendulum() {


  if (!isAnimating) return;

  // Calculate the next angle for the pendulum swing
  angle += angularVelocity;

  let nextAngle = amplitude * Math.cos(angle);

  angleArray.push(nextAngle);
  timeArray.push(time);
  time+=0.1;

  // Rotate the pendulum
  pendulum.set({ angle: nextAngle });
  canvas.renderAll();

  // Request the next animation frame
  

  if (angleArray.length > 200 && flag == 0 ){
    flag = 1;
    await sendArrays(timeArray, angleArray);
  }

  fabric.util.requestAnimFrame(animatePendulum);
    
  
}

createPendulum();


async function sendArrays(timeArray, attributeArray) {
  const data = { timeArray, attributeArray };

  console.log("Inside sendArrays");
  console.log(attributeArray);
  //console.log("Inside sendArrays dataArray");
  //console.log(data);
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


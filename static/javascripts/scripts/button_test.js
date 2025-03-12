// Function to create a button
export function createButton(clickCallback) {
    // Create a button element
    const button = document.createElement('button');
    
    // Set button text and style
    button.textContent = 'Toggle Circle';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.padding = '8px 16px';
    
    // Add event listener
    button.addEventListener('click', clickCallback);
    
    // Add the button to the body
    document.body.appendChild(button);
    
    return button;
  }
export function drawSidebar(p, sidebarWidth) {

    // Draw the sidebar background.
    p.fill(50); // Dark gray background.
    p.noStroke();
    p.rect(0, 0, sidebarWidth, p.height);
  
    // Calculate each section's height.
    let sectionHeight = p.height / 3;
    // Set stroke for the divider lines.
    p.stroke(255);
    p.strokeWeight(2);
    // The divider lines will be a short line (50% of sidebar width) centered horizontally.
    let lineLength = sidebarWidth * 0.5;
    let startX = (sidebarWidth - lineLength) / 2;
    let endX = startX + lineLength;
    // Draw divider lines between sections.
    p.line(startX, sectionHeight, endX, sectionHeight);
    p.line(startX, 2 * sectionHeight, endX, 2 * sectionHeight);
  
    // (Optional) Label the third section as "Drawing Tools".
    p.noStroke();
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text("Drawing Tools", sidebarWidth / 2, sectionHeight * 5 / 2);
  }
  
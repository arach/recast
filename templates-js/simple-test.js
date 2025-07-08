/**
 * ⚡ Simple Test
 * 
 * Minimal test template with no parameters
 */

function draw(ctx, width, height, params, time, utils) {
  // Skip background for now to isolate the issue
  // utils.background.apply(ctx, width, height, params);
  
  // Clear canvas with simple fill
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // Simple drawing
  const centerX = width / 2;
  const centerY = height / 2;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Draw a simple shape
  ctx.fillStyle = '#4a90e2';
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // Test basic text
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Simple Test', 0, 0);
  
  ctx.restore();
}

// NO PARAMETERS - completely empty
export const parameters = {};

// Template metadata
export const metadata = {
  name: "⚡ Simple Test",
  description: "Minimal test template with no parameters",
  category: "test",
  tags: ["test"],
  author: "ReFlow",
  version: "1.0.0"
};
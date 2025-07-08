/**
 * 📊 Data Platform Test
 * 
 * Simple test template to debug the data platform stack
 */

function draw(ctx, width, height, params, time, utils) {
  // Clear canvas
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // Simple test drawing
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Test isometric utilities
  try {
    const projected = utils.iso.project(0, 0, 0);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Test cube drawing
    utils.iso.drawCube(ctx, -25, -25, 0, 50, '#4a90e2', {
      lighting: true,
      stroke: true
    });
    
    // Test color adjustment
    const brightColor = utils.iso.adjustBrightness('#4a90e2', 1.3);
    
    ctx.fillStyle = brightColor;
    ctx.beginPath();
    ctx.arc(projected.x + 60, projected.y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Success indicator
    ctx.fillStyle = '#10b981';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✅ Isometric Utils Working!', width / 2, 40);
    
  } catch (error) {
    console.error('Error in data platform test:', error);
    
    // Draw error indicator
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#dc2626';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Debug Error', width / 2, height / 2);
    ctx.font = '12px sans-serif';
    ctx.fillText(error.message, width / 2, height / 2 + 20);
  }
}

// Helper functions for parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});

// Simple parameter definitions
export const parameters = {
  testParam: slider(50, 0, 100, 10, 'Test Parameter', '%')
};

// Template metadata
export const metadata = {
  name: "📊 Data Platform Test",
  description: "Simple test template to debug isometric utilities",
  category: "isometric",
  tags: ["test", "debug"],
  author: "ReFlow",
  version: "1.0.0"
};
/**
 * Simple test template
 */

function draw(ctx, width, height, params, time, utils) {
  // Clear and apply background
  utils.canvas.clear(ctx, width, height);
  utils.background.apply(ctx, width, height, params);
  
  // Draw a simple animated circle
  const x = width / 2 + Math.sin(time) * 50;
  const y = height / 2;
  const radius = 30 + Math.sin(time * 2) * 10;
  
  ctx.fillStyle = params.fillColor || '#3b82f6';
  ctx.globalAlpha = params.fillOpacity || 1;
  
  utils.canvas.fillCircle(ctx, x, y, radius);
  
  // Debug log
  if (utils.debug) {
    utils.debug.log('Simple template rendered', { x, y, radius, time });
  }
}
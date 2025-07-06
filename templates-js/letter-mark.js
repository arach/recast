/**
 * 🔤 Letter Mark
 * 
 * Clean, professional letter-based logos perfect for modern brands
 * Exact line-by-line conversion from TypeScript original
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters (defaults come from exported parameters)
  const { letter, fontWeight, style, alignment, size, letterSpacing, container, containerPadding } = p;
  
  // Calculate dimensions - exact match to TypeScript version
  const minDim = Math.min(width, height);
  const fontSize = minDim * size;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set up font - exact match to TypeScript version
  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  if (style === 'rounded') {
    fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif';
  } else if (style === 'geometric') {
    fontFamily = 'Futura, "Century Gothic", sans-serif';
  } else if (style === 'classic') {
    fontFamily = 'Georgia, "Times New Roman", serif';
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = alignment;
  ctx.textBaseline = 'middle';
  
  // Apply letter spacing - exact match to TypeScript version
  if (letterSpacing !== 0 && letter.length > 1) {
    ctx.letterSpacing = `${letterSpacing}em`;
  }
  
  // Calculate text position - exact match to TypeScript version
  let textX = centerX;
  if (alignment === 'left') textX = width * 0.1;
  else if (alignment === 'right') textX = width * 0.9;
  
  // Draw container if specified - exact match to TypeScript version
  if (container !== 'none') {
    const metrics = ctx.measureText(letter);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const padding = minDim * containerPadding;
    
    ctx.save();
    ctx.globalAlpha = p.fillOpacity;
    ctx.fillStyle = p.fillColor;
    
    if (container === 'circle') {
      const radius = Math.max(textWidth, textHeight) / 2 + padding;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = p.backgroundColor;
    } else if (container === 'square' || container === 'rounded') {
      const boxSize = Math.max(textWidth, textHeight) + padding * 2;
      const boxX = centerX - boxSize / 2;
      const boxY = centerY - boxSize / 2;
      
      ctx.beginPath();
      if (container === 'rounded') {
        const radius = boxSize * 0.1;
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
      } else {
        ctx.rect(boxX, boxY, boxSize, boxSize);
      }
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = p.backgroundColor;
    }
    ctx.restore();
  } else {
    // No container, use fill color for text
    ctx.fillStyle = p.fillColor;
  }
  
  // Draw the letter(s) - exact match to TypeScript version
  ctx.save();
  ctx.globalAlpha = p.fillOpacity;
  ctx.fillText(letter, textX, centerY);
  ctx.restore();
  
  // Optional: Add subtle depth with stroke - exact match to TypeScript version
  if (p.strokeWidth && p.strokeWidth > 0) {
    ctx.save();
    ctx.globalAlpha = p.strokeOpacity;
    ctx.strokeStyle = p.strokeColor;
    ctx.lineWidth = p.strokeWidth;
    ctx.strokeText(letter, textX, centerY);
    ctx.restore();
  }
}

// Helper functions for concise parameter definitions
const text = (def, label, placeholder, opts = {}) => ({ 
  type: "text", default: def, label, placeholder, ...opts 
});
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});

// Parameter definitions - controls and defaults
export const parameters = {
  // Typography
  letter: text("A", "Letter(s)", "Enter letter(s) for your mark"),
  fontWeight: select("600", [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi-Bold" },
    { value: "700", label: "Bold" },
    { value: "900", label: "Black" }
  ], "Font Weight"),
  style: select("modern", [
    { value: "modern", label: "Modern" },
    { value: "rounded", label: "Rounded" },
    { value: "geometric", label: "Geometric" },
    { value: "classic", label: "Classic (Serif)" }
  ], "Font Style"),
  alignment: select("center", [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" }
  ], "Text Alignment"),
  size: slider(0.7, 0.2, 1.0, 0.05, "Letter Size"),
  letterSpacing: slider(0, -0.1, 0.5, 0.01, "Letter Spacing", "em"),
  
  // Container
  container: select("none", [
    { value: "none", label: "None" },
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
    { value: "rounded", label: "Rounded Square" }
  ], "Container Style"),
  containerPadding: slider(0.2, 0.1, 0.5, 0.05, "Container Padding", null, { when: { container: ["circle", "square", "rounded"] } })
};

// Template metadata
export const metadata = {
  name: "🔤 Letter Mark",
  description: "Clean, professional letter-based logos perfect for modern brands",
  category: "typography",
  tags: ["letter", "mark", "monogram", "logo", "brand", "initial"],
  author: "ReFlow",
  version: "1.0.0"
};
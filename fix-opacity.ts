// Quick fix for opacity in templates
// Add this to any template's drawing code:

// For fill operations:
ctx.save();
ctx.globalAlpha = params.fillOpacity ?? 1;
// ... drawing code ...
ctx.restore();

// For stroke operations:
ctx.save();
ctx.globalAlpha = params.strokeOpacity ?? 1;
// ... stroke code ...
ctx.restore();

// The issue is that templates need to be updated to use these opacity values
// The parameters are being passed correctly but not applied with ctx.globalAlpha
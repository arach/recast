# Opacity Fixes Summary

## Status

### ✅ Fixed
1. **Infrastructure** - All parameters flow correctly from UI → Store → Canvas → Templates
2. **Parameter Merging** - Style parameters now take precedence over custom parameters
3. **Wordmark Template** - Created fixed version with proper opacity support (wordmark-fixed.ts)

### 🔧 Needs Manual Update
Due to file permission issues, you'll need to manually update these templates:

#### 1. Wordmark Template (`templates/wordmark.ts`)
- Copy content from `templates/wordmark-fixed.ts` to replace the original
- Or manually add `ctx.save()`, `ctx.globalAlpha = fillOpacity`, and `ctx.restore()` around all text drawing operations

#### 2. Wave Bars Template (`templates/wave-bars.ts`)
Add after line ~73:
```javascript
const fillOpacity = params.fillOpacity ?? 1;
const strokeOpacity = params.strokeOpacity ?? 1;
```

Wrap bar drawing (around line 159) with:
```javascript
ctx.save();
ctx.globalAlpha = fillOpacity;
// ... existing fill code ...
ctx.restore();
```

#### 3. Letter Mark Template (`templates/letter-mark.ts`)
Similar to wordmark - add opacity support around text drawing operations

## How Opacity Should Work

For any drawing operation:
```javascript
// For fills
ctx.save();
ctx.globalAlpha = fillOpacity;
// ... fill operations ...
ctx.restore();

// For strokes
ctx.save();
ctx.globalAlpha = strokeOpacity;
// ... stroke operations ...
ctx.restore();
```

## Testing
1. Select a template (wordmark or wave-bars)
2. Change Fill Opacity slider - text/bars should become transparent
3. Change Stroke Opacity slider - outlines should become transparent
4. Background Type and Color should now work correctly
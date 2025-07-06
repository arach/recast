# Code Editor & Template Utils Improvements

## Overview

Major improvements to the ReFlow code editor experience and template development workflow, eliminating boilerplate and providing an amazing "run without saving" developer experience.

## ✨ Code Editor Enhancements

### Run Without Saving Workflow

The code editor now provides a professional development experience similar to VS Code or CodePen:

- **🟢 Run Code Button**: Preview changes instantly without saving
- **🔵 Save Changes Button**: Permanently commit modifications (only enabled when changes exist)
- **🔄 Reset Button**: Revert to original template code
- **⌨️ Keyboard Shortcuts**: `Cmd+Enter` to run, `Cmd+S` to save

### Smart Template Loading

- **Loads Actual Template Code**: When editing a logo with the "wordmark" template, you see the real wordmark.js code
- **Template Copy Indicator**: Shows "Copy of wordmark" so users know they're editing a working copy
- **Change Tracking**: Live indicators show "Unsaved changes" vs "Up to date" with status dots
- **Error Handling**: Graceful fallbacks for missing templates

### Professional UI Design

- **Status Indicators**: Animated dots show unsaved changes
- **Smart Button States**: Save button disabled when no changes exist
- **Template Badges**: Clean indicators showing which template is being edited
- **Monaco Editor**: Enhanced with better fonts, smooth scrolling, optimized settings

## 🛠️ Template Utils Improvements

### Problem Solved

Every template had 20+ lines of repetitive parameter extraction boilerplate:

```javascript
// OLD: Boilerplate hell
function draw(ctx, width, height, params, time, utils) {
  // Apply background
  utils.background.apply(ctx, width, height, params);
  
  // Extract parameters with defaults
  const text = params.text || 'BRAND';
  const fontStyle = params.fontStyle || 'modern';
  const fontWeight = params.fontWeight || '500';
  const letterSpacing = params.letterSpacing || 0.05;
  const size = params.size || 0.5;
  const lineHeight = params.lineHeight || 1.2;
  // ... 15+ more lines
  
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Finally, your actual drawing code...
}
```

### Solution: One-Liner Setup

```javascript
// NEW: Clean and focused
function drawVisualization(ctx, width, height, params, time, utils) {
  // One-liner setup: background + all parameters extracted
  const p = utils.setupTemplate(ctx, width, height, params);
  
  // Your drawing code with clean parameter access
  const text = p.text || 'BRAND';
  const fontStyle = p.fontStyle || 'modern';
  
  // Theme colors organized
  ctx.fillStyle = p.theme.fillColor;
  ctx.strokeStyle = p.theme.strokeColor;
  
  // Your actual creative code here...
}
```

### New Utilities Added

#### `setupTemplate(ctx, width, height, params)`
One-liner that:
- Applies universal background automatically
- Extracts and flattens all parameters
- Returns organized parameter object

#### `extractTemplateParams(params)`
Extracts common parameters and organizes them:
- **Universal theme colors**: `p.theme.fillColor`, `p.theme.strokeColor`, etc.
- **Animation parameters**: `p.animation.animationSpeed`, `p.animation.animationIntensity`
- **All custom params**: Flattened from core/style/custom/content

#### `flattenParameters(params)` (existing)
Flattens nested parameter structures from:
```javascript
{
  core: { frequency: 2 },
  style: { fillColor: '#blue' },
  custom: { text: 'BRAND' }
}
```
To:
```javascript
{
  frequency: 2,
  fillColor: '#blue', 
  text: 'BRAND'
}
```

## 🏗️ Implementation Details

### Code Editor Changes
- **File**: `components/studio/CodeEditorPanel.tsx`
- **Fixed template loading**: Changed regex from `drawVisualization` to `draw` function
- **Added state management**: `hasUnsavedChanges`, `originalCode`, `isRunning`
- **Run/Save workflow**: Separate functions for temporary vs permanent changes
- **Keyboard shortcuts**: Global event listeners for Cmd+Enter and Cmd+S

### Template Utils Extensions  
- **File**: `lib/template-utils.ts`
- **Added**: `setupTemplate()`, `extractTemplateParams()`
- **Maintains**: Backward compatibility with existing templates
- **Organized**: Parameters into logical groups (theme, animation, etc.)

### Benefits

1. **Developer Experience**: 
   - Run code without fear of losing work
   - See changes instantly
   - Professional keyboard shortcuts

2. **Template Development**:
   - 20+ lines of boilerplate → 1 line setup
   - Organized parameter access
   - Focus on creative logic, not setup

3. **User Experience**:
   - Clear visual feedback on changes
   - Confidence to experiment 
   - Easy path from template to custom code

## 🚀 Usage Examples

### For Template Developers
```javascript
function drawVisualization(ctx, width, height, params, time, utils) {
  // One line replaces 20+ lines of boilerplate
  const p = utils.setupTemplate(ctx, width, height, params);
  
  // Clean parameter access
  const barCount = p.barCount || 40;
  const frequency = p.frequency || 3;
  
  // Organized theme access
  ctx.fillStyle = p.theme.fillColor;
  ctx.globalAlpha = p.theme.fillOpacity;
  
  // Your creative code here...
}
```

### For End Users
1. Select any logo in ReFlow
2. Click "Code Editor" in toolbar
3. See the actual template code (e.g., wave-bars.js)
4. Make changes and hit **"Run Code"** to preview
5. Hit **"Save Changes"** when happy with results
6. Or **"Reset"** to go back to original

## 🔄 Migration Path

- **Existing templates**: Continue working unchanged
- **New templates**: Can optionally use `setupTemplate()` for cleaner code
- **Template upgrades**: Can be gradually migrated to new pattern
- **Code editor**: Automatically handles both old and new function naming

This provides a smooth transition while dramatically improving the development experience for both template creators and end users.
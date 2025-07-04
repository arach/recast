# Testing Brand Identity Controls

## Steps to test:

1. Open browser console (Cmd+Option+J)
2. Select a logo (wordmark template works well)
3. Try changing Brand Identity controls:
   - Background Type (None/Solid/Gradient)
   - Background Color
   - Fill Type and Color
   - Stroke Type and Color

## Expected Console Logs:

When changing background type:
```
BrandIdentity: Changing backgroundType to solid
useSelectedLogo: Updating style params {backgroundType: "solid"}
LogoStore: Updating parameters for logo main {style: {backgroundType: "solid"}}
CanvasRenderer: Rendering logo with params: {templateId: "wordmark", backgroundColor: "#ffffff", backgroundType: "solid", ...}
Template Registry: Incoming params: {hasStyle: true, backgroundColor: "#ffffff", backgroundType: "solid", ...}
Template Registry: Merged params: {backgroundColor: "#ffffff", backgroundType: "solid", ...}
```

## What to look for:

1. **Parameter Flow**: Check if parameters flow from BrandIdentity → useSelectedLogo → LogoStore → CanvasRenderer → Template Registry
2. **Missing Values**: Look for undefined or missing backgroundType/backgroundColor
3. **Template Execution**: Check if the wordmark template's applyUniversalBackground function is called with correct params

## Debugging Tips:

If background isn't changing:
- Check if `backgroundType` is reaching the template as "solid" not "transparent"
- Check if `backgroundColor` has a valid hex color
- Look for any errors in the console

If fill/stroke isn't changing:
- Check if `fillColor` and `strokeColor` are being passed correctly
- Verify the template is using these parameters

## Quick Fix Test:

In browser console, try manually updating:
```javascript
// Get current logo
const store = window.__ZUSTAND_DEVTOOLS_EXTENSION__?.connection?.stores[0]?.api.getState()
console.log('Current style params:', store.logos[0].parameters.style)

// Force update background
store.updateLogoParameters(store.logos[0].id, {
  style: { backgroundType: 'solid', backgroundColor: '#ff0000' }
})
```
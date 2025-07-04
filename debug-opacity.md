# Debug Instructions for Opacity

The issue is that templates are not applying the opacity values even though they're being passed.

## Quick Test:

1. In the browser console, check if opacity values are being passed:
   - Change Fill Opacity slider in Brand Identity
   - Look for console logs showing fillOpacity value

2. The logs should show:
   ```
   LogoStore: Updating parameters for logo main {style: {fillOpacity: 0.5}}
   Template Registry: Merged params: {fillOpacity: 0.5, ...}
   ```

## The Problem:

Templates like wordmark and wave-bars are receiving the opacity values but not applying them with `ctx.globalAlpha`.

## Temporary Fix:

For now, let me update just the wave-bars template to properly handle opacity since that's commonly used:
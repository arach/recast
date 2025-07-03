# State Update Analysis - Key Findings

## Issue: Double Template Loading

When creating multiple logos (e.g., `load4Logos()`), templates are loaded twice:

### Current Flow:
1. **Zustand creates logo** with templateId (e.g., 'letter-mark')
2. **StoreInitializer detects** template change via subscription
3. **Calls onTemplateChange** → `loadThemeById('letter-mark')`
4. **React state shows wrong ID** because it hasn't synced yet (still 'main')
5. **Template loads with wrong context** - loads for 'main' instead of new logo

### Evidence from Trace:
```
// Creating logo-1751506042074-iwcd with letter-mark template
🔄 STATE UPDATE - BOTH
📍 Trigger: Zustand->React sync (selectedLogoId changed)
🆔 SelectedLogoId: main → logo-1751506042074-iwcd

// But then loadThemeById is called with old React state!
🔄 STATE UPDATE - BOTH
📍 Trigger: loadThemeById(letter-mark)
🆔 SelectedLogoId: main → main  // ❌ Wrong! Should be logo-1751506042074-iwcd
```

## Root Cause

The `StoreInitializer` component has a template watcher that triggers `loadThemeById`:

```typescript
// In StoreInitializer.tsx
useEffect(() => {
  if (!onTemplateChange) return;
  
  const unsubscribe = useLogoStore.subscribe((state) => {
    const currentLogo = state.logos.find(l => l.id === state.selectedLogoId);
    if (currentLogo && currentLogo.templateId !== previousTemplateId) {
      if (currentLogo.templateId) {
        onTemplateChange(currentLogo.templateId); // This calls loadThemeById
      }
    }
  });
}, [onTemplateChange]);
```

## Problems:
1. **Race Condition**: Template loads before React state syncs with Zustand
2. **Wrong Context**: Template applies to old selectedLogoId instead of new one
3. **Performance**: Double loading of template code
4. **State Confusion**: React and Zustand temporarily out of sync

## Solution Options:

### Option 1: Remove Template Watcher
Remove the `onTemplateChange` callback from StoreInitializer since templates are already loaded when logos are created in Zustand.

### Option 2: Defer Template Loading
Only trigger template loads after React state has fully synced with Zustand.

### Option 3: Check Selected Logo ID
In `loadThemeById`, verify that the current React selectedLogoId matches Zustand's selectedLogoId before proceeding.

## Recommendation

Remove the template watcher from StoreInitializer. Templates should be loaded explicitly when:
- User clicks a template in the UI
- Logo is initially created with a template
- NOT automatically when Zustand state changes

This will eliminate the double loading and race condition issues.
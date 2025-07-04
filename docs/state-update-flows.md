# ReFlow State Update Flows

## Overview
ReFlow uses a hybrid state management approach where:
- **React State**: Tracks the currently selected logo for UI editing
- **Zustand Store**: Manages all logos for canvas rendering and persistence

## State Update Triggers

### 1. Parameter Updates (Most Common)
**Trigger**: User adjusts controls (sliders, inputs)
**Flow**:
```
User Input → updateSelectedLogo() → React setState → Zustand updateLogo()
```
**Traced as**: `updateSelectedLogo`

### 2. Template/Theme Loading
**Trigger**: User selects a template from the gallery
**Flow**:
```
Template Click → loadThemeById() → Import template → Apply params → React setState → Zustand update
```
**Traced as**: `loadThemeById(template-name)`

### 3. Canvas Logo Selection
**Trigger**: User clicks on a logo in the canvas
**Flow**:
```
Canvas Click → Zustand selectLogo() → Store update → React sync effect → React setState
```
**Traced as**: `Canvas click -> selectLogo(id)` followed by `Zustand->React sync`

### 4. Custom Code Updates
**Trigger**: User modifies code in the editor
**Flow**:
```
Code Edit → setCustomCode() → React setState → Zustand updateLogo()
```
**Traced as**: `setCustomCode`

### 5. Brand Personality/Color/Preset Applications
**Trigger**: AI suggestions or preset selections
**Flow**:
```
Apply Button → handleApply*() → React setState → Zustand updateLogoParameters()
```
**Traced as**: Part of `updateSelectedLogo`

### 6. Canvas Position Updates
**Trigger**: Dragging the canvas viewport
**Flow**:
```
Mouse Drag → saveCanvasOffset() → localStorage + React setState
```
**Traced as**: `saveCanvasOffset`

## Key State Synchronization Points

### Zustand → React Sync
Located in `app/page.tsx` useEffect:
- Listens for `selectedLogoId` changes in Zustand
- Updates both `selectedLogoId` and `selectedLogo` in React
- Ensures React UI reflects canvas selection

### React → Zustand Updates
All parameter changes flow from React to Zustand:
- React is the source of truth for editing
- Zustand persists and shares state for rendering

## Debugging State Issues

### Enable State Tracing
1. Open Debug Toolbar (development only)
2. Go to "State Management" tab
3. Click "Toggle State Tracer"
4. Perform actions and watch console

### Common Issues & Solutions

**Issue**: Selected logo mismatch between React and Zustand
**Solution**: Click "Sync React ↔ Zustand" in debug toolbar

**Issue**: Canvas shows different selection than controls
**Solution**: Check trace for failed sync events

**Issue**: Parameter updates not reflecting
**Solution**: Verify both React and Zustand updates in trace

### State Tracer API
```javascript
// Enable tracing
stateTracer.enable()

// View all events
stateTracer.exportToTable()

// Analyze patterns
stateTracer.analyze()

// Filter by type
stateTracer.getEventsByType('selectedLogo')

// Filter by trigger
stateTracer.getEventsByTrigger('Canvas click')
```

## Architecture Decisions

1. **Why separate React and Zustand state?**
   - React state provides immediate UI responsiveness
   - Zustand enables multi-component synchronization
   - Separation allows for optimized rendering paths

2. **Why trace state updates?**
   - Complex async flows can cause desync
   - Debugging state issues requires visibility
   - Performance monitoring of update frequency

3. **Why persist canvas offset separately?**
   - Canvas position is viewport state, not logo state
   - Persists across sessions for user convenience
   - Independent of logo selection state
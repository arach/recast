# ReFlow Surfaces Overview

## 🎨 Core Surfaces

### 1. **Studio** (`/` or `/studio/[canvasId]`)
**Purpose**: The unified creative workspace - create, edit, view, and share

**Features**:
- Infinite canvas with drag & drop logos
- Real-time parameter controls (sliders, color pickers)
- Template selector dropdown
- Code editor panel (slides in from right)
- Export functionality (PNG in various sizes)
- Canvas persistence and loading
- Dark/light mode toggle

**URL Patterns**:
- `/` - New canvas or default workspace
- `/studio/[canvasId]` - Specific saved canvas
- `/studio/[canvasId]?view=readonly` - View-only mode (planned)
- `/s/[shortId]` - Short URL redirect (planned)

**Integrated Tools**:
- **Parameter Panel**: Adjust logo properties in real-time
- **Code Editor**: Monaco-powered code editing in a slide-out panel
- **Canvas Tools**: Pan, zoom, select, position logos
- **Export Menu**: Download logos in multiple sizes

**Key Actions**:
- Create/edit/position logos on infinite canvas
- Save canvas state (creates unique URL)
- Toggle code editor to customize templates
- Export designs in various formats
- Share canvas with others (planned)

---

### 2. **Editor Mode** (`/editor`) - Legacy Route
**Purpose**: Standalone template development (being phased out)

**Note**: This route still exists but functionality is being migrated to the integrated code editor panel within Studio. Use the "Code" button in Studio for a better experience.

**Features**:
- Full-screen Monaco editor
- Live preview canvas
- Parameter testing
- Template development

**Migration Plan**:
- Functionality now available in Studio's code panel
- Will redirect to Studio in future updates

---

## 🔗 Unified Flow

```
Studio (/ or /studio/[canvasId])
    ├── Design logos on infinite canvas
    ├── Save canvas → /studio/[canvasId]
    ├── Toggle code editor panel (integrated)
    ├── Export designs (multiple formats)
    └── Share canvas (planned)
         ├── View-only permission
         └── Edit permission
```

---

## ✅ Implementation Status

**Completed**:
- ✅ Unified Studio surface (no separate viewer)
- ✅ Integrated code editor as slide-out panel
- ✅ Canvas persistence with unique URLs
- ✅ `/studio/[canvasId]` routing
- ✅ Removed Canvas Viewer route entirely
- ✅ Canvas loading from saved state

**In Progress**:
- 🚧 View-only mode with permissions
- 🚧 Share dialog with permission options
- 🚧 Short URL generation (`/s/[shortId]`)
- 🚧 Canvas metadata display

**Benefits Achieved**:
- Single unified surface (like Figma)
- No context switching between viewer/editor
- Code editing integrated naturally
- Clean URL structure
- Simplified mental model

---

## 🚀 Next Steps

### Immediate Priorities:
1. **Share Functionality**:
   - Add share button to Studio header
   - Create permission dialog (view/edit)
   - Generate shareable URLs

2. **Canvas Metadata**:
   - Show canvas name in header (when loaded)
   - Add rename capability
   - Display save status

3. **View-Only Mode**:
   - Detect permission from URL params
   - Hide editing tools in view mode
   - Show "Request Edit Access" button

### Future Enhancements:
- Real-time collaboration (multiple users)
- Canvas versioning/history
- Template marketplace integration
- API access for saved canvases
- Export canvas as template package

## 🎯 Architecture Principles

1. **One Surface**: Studio is the single source of truth
2. **Progressive Disclosure**: Tools appear when needed
3. **URL-Driven State**: Canvas ID in URL enables sharing
4. **Integrated Tools**: Code editor, parameters, exports all in one place
5. **Permission-Based UI**: Interface adapts to user's access level
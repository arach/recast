#!/usr/bin/env python3

import re

# Read the file
with open('app/page.tsx', 'r') as f:
    content = f.read()

# Step 1: Replace the CodeEditorPanel conditional block
# Find the pattern and replace with just <CodeEditorPanel />
pattern1 = r'\{/\* Use new Zustand-based CodeEditor.*?\*/\}\s*\{FeatureFlags\.isZustandCanvasEnabled\(\) \? \(\s*<>\s*\{console\.log.*?\}\s*<CodeEditorPanel />\s*</>\s*\) : \(\s*<>\s*.*?<CodeEditorPanel[\s\S]*?/>\s*</>\s*\)\}'
content = re.sub(pattern1, '<CodeEditorPanel />', content)

# Step 2: Replace the CanvasArea conditional block
pattern2 = r'\{/\* Use new Zustand-based CanvasArea.*?\*/\}\s*\{FeatureFlags\.isZustandCanvasEnabled\(\) \? \(\s*<>\s*\{console\.log.*?\}\s*<CanvasArea />\s*</>\s*\) : \(\s*<>\s*\{console\.log.*?\}\s*<CanvasArea[\s\S]*?/>\s*</>\s*\)\}'
content = re.sub(pattern2, '<CanvasArea />', content)

# Step 3: Replace the ControlsPanel conditional block
pattern3 = r'\{/\* Use new Zustand-based ControlsPanel.*?\*/\}\s*\{FeatureFlags\.isZustandControlsEnabled\(\) \? \(\s*<>\s*\{console\.log.*?\}\s*<ControlsPanel />\s*</>\s*\) : \(\s*<>\s*\{console\.log.*?\}\s*<ControlsPanel[\s\S]*?/>\s*</>\s*\)\}'
content = re.sub(pattern3, '<ControlsPanel />', content)

# Step 4: Remove DebugFeatureFlags
content = re.sub(r'\s*\{/\* Debug feature flags \*/\}\s*<DebugFeatureFlags />', '', content)

# Step 5: Remove unused imports
content = re.sub(r"import \{ FeatureFlags \} from '@/lib/feature-flags'\n", '', content)
content = re.sub(r"import \{ DebugFeatureFlags \} from '@/components/DebugFeatureFlags'\n", '', content)

# Write back
with open('app/page.tsx', 'w') as f:
    f.write(content)

print("✅ Cleaned up page.tsx")
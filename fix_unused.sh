#!/bin/bash

# Fix unused generator parameters
echo "Fixing unused 'generator' parameters..."
files_with_unused_generator=(
  "presets/apex-vercel.ts"
  "presets/architectural-grid.ts"
  "presets/border-effects.ts"
  "presets/brand-network.ts"
  "presets/clean-triangle.ts"
  "presets/crystal-blocks.ts"
  "presets/crystal-lattice.ts"
  "presets/dynamic-diamond.ts"
  "presets/golden-circle.ts"
  "presets/hand-sketch.ts"
  "presets/infinity-loops.ts"
  "presets/letter-mark.ts"
  "presets/liquid-flow.ts"
  "presets/luxury-brand.ts"
  "presets/minimal-line.ts"
  "presets/minimal-shape.ts"
  "presets/neon-glow.ts"
  "presets/network-constellation.ts"
  "presets/nexus-ai-brand.ts"
  "presets/organic-bark.ts"
  "presets/premium-kinetic.ts"
  "presets/prism-google.ts"
  "presets/pulse-spotify.ts"
  "presets/quantum-field.ts"
  "presets/simple-prism.ts"
  "presets/smart-hexagon.ts"
  "presets/sophisticated-strokes.ts"
  "presets/spinning-triangles.ts"
  "presets/terra-eco-brand.ts"
  "presets/volt-electric-brand.ts"
  "presets/wave-bars.ts"
  "presets/wordmark.ts"
)

for file in "${files_with_unused_generator[@]}"; do
  echo "  Fixing $file"
  sed -i.bak 's/generator: any,/_generator: any,/g' "$file"
done

# Fix unused time parameters
echo -e "\nFixing unused 'time' parameters..."
files_with_unused_time=(
  "presets/audio-bars.ts"
  "presets/clean-triangle.ts"
  "presets/letter-mark.ts"
  "presets/minimal-shape.ts"
  "presets/wordmark.ts"
)

for file in "${files_with_unused_time[@]}"; do
  echo "  Fixing $file"
  sed -i.bak 's/time: number/_time: number/g' "$file"
done

# Remove backup files
rm presets/*.bak

echo -e "\nDone! All unused parameters have been prefixed with underscore."
#!/bin/bash

echo "Checking for unused 'generator' parameter..."
for file in presets/*.ts; do
  if [[ "$file" == *"types.ts"* ]] || [[ "$file" == *"index.ts"* ]] || [[ "$file" == *"utils.ts"* ]]; then
    continue
  fi
  
  if grep -q "generator: any," "$file"; then
    # Check if generator is used anywhere in the file (excluding the parameter declaration)
    if ! grep -q "\bgenerator[^\s:,)]" "$file"; then
      echo "  Unused 'generator' in: $file"
    fi
  fi
done

echo -e "\nChecking for unused 'time' parameter..."
for file in presets/*.ts; do
  if [[ "$file" == *"types.ts"* ]] || [[ "$file" == *"index.ts"* ]] || [[ "$file" == *"utils.ts"* ]]; then
    continue
  fi
  
  if grep -q "time: number" "$file"; then
    # Check if time is used anywhere in the file (excluding the parameter declaration)
    if ! grep -q "\btime[^\s:,)]" "$file"; then
      echo "  Unused 'time' in: $file"
    fi
  fi
done
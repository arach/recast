#!/usr/bin/env node

/**
 * Script to clean up redundant exports in template files
 * Converts templates to use a single metadata object as source of truth
 */

import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

function cleanTemplate(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already cleaned (has metadata export with id)
  if (content.includes('export const metadata = {') && content.includes('id:')) {
    console.log(`✓ Already cleaned: ${path.basename(filePath)}`);
    return;
  }
  
  // Pattern to find existing exports
  const idMatch = content.match(/export\s+const\s+id\s*=\s*['"`]([^'"`]+)['"`]/);
  const nameMatch = content.match(/export\s+const\s+name\s*=\s*['"`]([^'"`]+)['"`]/);
  const descMatch = content.match(/export\s+const\s+description\s*=\s*['"`]([^'"`]+)['"`]/);
  const defaultParamsMatch = content.match(/export\s+const\s+defaultParams\s*=\s*({[^}]+})/s);
  
  if (!idMatch) {
    console.log(`⚠️  No id found in ${path.basename(filePath)}, skipping`);
    return;
  }
  
  const id = idMatch[1];
  const name = nameMatch ? nameMatch[1] : id;
  const description = descMatch ? descMatch[1] : '';
  const defaultParams = defaultParamsMatch ? defaultParamsMatch[1] : '{}';
  
  // Check if metadata object exists
  const hasMetadata = content.includes('export const metadata = {');
  
  let newContent = content;
  
  if (hasMetadata) {
    // Update existing metadata to include id
    newContent = newContent.replace(
      /export\s+const\s+metadata\s*=\s*{([^}]+)}/s,
      (match, inner) => {
        // Check if id already exists in metadata
        if (!inner.includes('id:')) {
          return `export const metadata = {\n  id: '${id}',${inner}}`;
        }
        return match;
      }
    );
  } else {
    // Remove individual exports
    newContent = newContent
      .replace(/export\s+const\s+id\s*=\s*['"`][^'"`]+['"`];\s*\n?/g, '')
      .replace(/export\s+const\s+name\s*=\s*['"`][^'"`]+['"`];\s*\n?/g, '')
      .replace(/export\s+const\s+description\s*=\s*['"`][^'"`]+['"`];\s*\n?/g, '')
      .replace(/export\s+const\s+defaultParams\s*=\s*{[^}]+};\s*\n?/gs, '')
      .replace(/export\s*{\s*drawVisualization\s*};\s*\n?/g, '');
    
    // Add new consolidated exports at the end
    const newExports = `
export const metadata = {
  id: '${id}',
  name: "${name}",
  description: "${description}",
  defaultParams: ${defaultParams.trim()}
};

export { drawVisualization, metadata };
export const { id, name, description, defaultParams } = metadata;`;
    
    // Find where to insert (after drawVisualization function)
    const functionEndMatch = newContent.match(/^}\s*$/m);
    if (functionEndMatch) {
      const insertPos = newContent.lastIndexOf(functionEndMatch[0]) + functionEndMatch[0].length;
      newContent = newContent.slice(0, insertPos) + newExports + '\n';
    } else {
      newContent += newExports;
    }
  }
  
  // Clean up any remaining individual exports
  newContent = newContent
    .replace(/export\s+const\s+id\s*=\s*['"`][^'"`]+['"`];\s*\n?/g, '')
    .replace(/export\s+const\s+name\s*=\s*['"`][^'"`]+['"`];\s*\n?/g, '')
    .replace(/export\s+const\s+description\s*=\s*['"`][^'"`]+['"`];\s*\n?/g, '')
    .replace(/export\s+const\s+defaultParams\s*=\s*{[^}]+};\s*\n?/gs, '');
  
  // Add destructured exports if not present
  if (!newContent.includes('export const { id, name, description, defaultParams } = metadata')) {
    newContent = newContent.replace(
      /export\s*{\s*drawVisualization,\s*metadata\s*};?\s*$/m,
      'export { drawVisualization, metadata };\nexport const { id, name, description, defaultParams } = metadata;'
    );
  }
  
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Cleaned: ${path.basename(filePath)}`);
}

// Process all template files
const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.ts'));

console.log(`Found ${files.length} template files\n`);

files.forEach(file => {
  try {
    cleanTemplate(path.join(TEMPLATES_DIR, file));
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\n✨ Template cleanup complete!');
#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Converts a TypeScript template to JavaScript format
 */
async function convertTemplate(inputPath, outputPath) {
  const content = await fs.readFile(inputPath, 'utf-8');
  const templateName = path.basename(inputPath, '.ts');
  
  console.log(`Converting ${templateName}...`);
  
  // Extract key parts using regex
  const importsMatch = content.match(/import[^;]+;/g) || [];
  const parametersMatch = content.match(/const parameters = ({[\s\S]*?});/);
  const metadataMatch = content.match(/const metadata = ({[\s\S]*?});/);
  const drawFunctionMatch = content.match(/function drawVisualization\([^)]+\)\s*{([\s\S]*?)^}/m);
  
  if (!parametersMatch || !metadataMatch || !drawFunctionMatch) {
    console.error(`Failed to parse ${templateName}`);
    return false;
  }
  
  // Clean up parameters - remove TypeScript types
  let parameters = parametersMatch[1]
    .replace(/:\s*{[^}]+}/g, '') // Remove type annotations
    .replace(/default:/g, 'default:') // Keep default as is (already quoted in our fixes)
    .replace(/(\w+):\s*{/g, '$1: {'); // Clean up spacing
  
  // Clean up metadata
  let metadata = metadataMatch[1];
  
  // Clean up draw function
  let drawBody = drawFunctionMatch[1]
    .replace(/:\s*TemplateUtils/g, '')
    .replace(/:\s*CanvasRenderingContext2D/g, '')
    .replace(/:\s*number/g, '')
    .replace(/:\s*string/g, '')
    .replace(/:\s*boolean/g, '')
    .replace(/:\s*any/g, '');
  
  // Create new JavaScript template
  const jsTemplate = `// ${templateName}.js
(function() {
  'use strict';
  
  const metadata = ${metadata};
  
  const parameters = ${parameters};
  
  function draw(ctx, width, height, params, time, utils) {${drawBody}}
  
  return { metadata, parameters, draw };
})();
`;
  
  await fs.writeFile(outputPath, jsTemplate);
  console.log(`✓ Converted ${templateName}`);
  return true;
}

/**
 * Main conversion process
 */
async function main() {
  const templatesDir = path.join(__dirname, '..', 'templates');
  const outputDir = path.join(__dirname, '..', 'templates-js');
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get all TypeScript templates
  const files = await fs.readdir(templatesDir);
  const tsFiles = files.filter(f => f.endsWith('.ts'));
  
  console.log(`Found ${tsFiles.length} templates to convert\n`);
  
  // Convert each template
  let successCount = 0;
  for (const file of tsFiles) {
    const inputPath = path.join(templatesDir, file);
    const outputPath = path.join(outputDir, file.replace('.ts', '.js'));
    
    if (await convertTemplate(inputPath, outputPath)) {
      successCount++;
    }
  }
  
  console.log(`\n✅ Converted ${successCount}/${tsFiles.length} templates`);
  
  // Show next steps
  console.log('\nNext steps:');
  console.log('1. Review converted templates in templates-js/');
  console.log('2. Test a few templates manually');
  console.log('3. Move templates-js/ to templates/ when ready');
}

// Run the script
main().catch(console.error);
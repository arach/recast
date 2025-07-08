const fs = require('fs');

const templates = fs.readdirSync('./templates-js').filter(f => f.endsWith('.js'));

console.log('=== TEMPLATE PARAMETER DIAGNOSIS ===\n');

const results = {
  helperFunction: [],
  objectLiteral: [],
  rangeFormat: [],
  notExported: [],
  noParameters: [],
  errors: []
};

templates.forEach(templateFile => {
  try {
    const code = fs.readFileSync(`./templates-js/${templateFile}`, 'utf8');
    
    // Check for exported parameters
    const exportedMatch = code.match(/export const parameters = ([\s\S]*?);\s*(?=export|$)/);
    
    if (exportedMatch) {
      const paramText = exportedMatch[1];
      
      // Detect format
      const helperMatches = paramText.match(/\b(\w+):\s*\w+\(/g);
      const objectMatches = paramText.match(/(\w+):\s*{\s*default:/g);
      const rangeMatches = paramText.match(/(\w+):\s*{\s*default:.*?range:/g);
      
      if (helperMatches && helperMatches.length > 0) {
        results.helperFunction.push(templateFile);
      } else if (rangeMatches && rangeMatches.length > 0) {
        results.rangeFormat.push(templateFile);
      } else if (objectMatches && objectMatches.length > 0) {
        results.objectLiteral.push(templateFile);
      }
    } else {
      // Check for non-exported parameters
      const regularMatch = code.match(/const parameters = /);
      if (regularMatch) {
        results.notExported.push(templateFile);
      } else {
        results.noParameters.push(templateFile);
      }
    }
    
  } catch (error) {
    results.errors.push({ file: templateFile, error: error.message });
  }
});

console.log('Helper Function Format (slider, select, toggle):');
results.helperFunction.forEach(f => console.log(' ✓', f));

console.log('\nObject Literal Format ({ default, min, max }):');
results.objectLiteral.forEach(f => console.log(' ✓', f));

console.log('\nRange Format ({ default, range }):');
results.rangeFormat.forEach(f => console.log(' ✓', f));

console.log('\nNot Exported (const parameters but no export):');
results.notExported.forEach(f => console.log(' ⚠️', f));

console.log('\nNo Parameters Found:');
results.noParameters.forEach(f => console.log(' ❌', f));

console.log('\nErrors:');
results.errors.forEach(e => console.log(' 💥', e.file, '-', e.error));

console.log('\n=== SUMMARY ===');
console.log('Helper Function:', results.helperFunction.length);
console.log('Object Literal:', results.objectLiteral.length);
console.log('Range Format:', results.rangeFormat.length);
console.log('Not Exported:', results.notExported.length);
console.log('No Parameters:', results.noParameters.length);
console.log('Errors:', results.errors.length);
console.log('Total Templates:', templates.length);
const fs = require('fs');

// Read the file
const content = fs.readFileSync('./templates/audio-bars.ts', 'utf8');

// Find the start of the actual code (after the imports/setup)
const codeStart = content.indexOf('// 🎵 Audio Bars');
const exportStart = content.indexOf('export const metadata');

// Extract the actual code
const actualCode = content.substring(codeStart, exportStart).trim();

// Find where the export const code starts and ends
const codeExportStart = content.indexOf('export const code = `');
const codeExportEnd = content.lastIndexOf('`;');

// Build the new file content
const newContent = 
  content.substring(0, codeExportStart) + 
  'export const code = `' + 
  actualCode.replace(/\$/g, '\\$').replace(/`/g, '\\`') + 
  '`' + 
  content.substring(codeExportEnd);

// Write back
fs.writeFileSync('./templates/audio-bars.ts', newContent);
console.log('Updated audio-bars.ts code export');

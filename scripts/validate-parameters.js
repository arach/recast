#!/usr/bin/env node

/**
 * Validate template parameter files against the schema
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Check if ajv is installed
try {
  require.resolve('ajv');
} catch (e) {
  console.log('Installing ajv for JSON schema validation...');
  require('child_process').execSync('pnpm add -D ajv', { stdio: 'inherit' });
}

const ajv = new Ajv({ allErrors: true });

// Load the schema
const schemaPath = path.join(__dirname, '../lib/parameter-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Compile the schema
const validate = ajv.compile(schema);

// Find all parameter files
const templatesDir = path.join(__dirname, '../templates-js');
const paramFiles = fs.readdirSync(templatesDir)
  .filter(file => file.endsWith('.params.json'))
  .map(file => path.join(templatesDir, file));

// Also check universal parameters
paramFiles.push(path.join(__dirname, '../lib/universal-parameters.json'));

console.log(`🔍 Validating ${paramFiles.length} parameter files...\\n`);

let hasErrors = false;

for (const file of paramFiles) {
  const relative = path.relative(process.cwd(), file);
  
  try {
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    const valid = validate(content);
    
    if (valid) {
      console.log(`✅ ${relative}`);
    } else {
      console.log(`❌ ${relative}`);
      console.log('   Errors:', JSON.stringify(validate.errors, null, 2));
      hasErrors = true;
    }
  } catch (error) {
    console.log(`❌ ${relative}`);
    console.log(`   Error: ${error.message}`);
    hasErrors = true;
  }
}

console.log('\\n' + (hasErrors ? '❌ Validation failed' : '✅ All files valid'));
process.exit(hasErrors ? 1 : 0);
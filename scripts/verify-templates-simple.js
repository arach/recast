const fs = require('fs');
const path = require('path');

async function verifyTemplates() {
  console.log('🎨 Verifying JavaScript templates...\n');
  
  const templatesDir = path.join(__dirname, '..', 'templates-js');
  const templates = fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.js') && !file.endsWith('.params.js'));
  
  const results = [];
  
  for (const templateFile of templates) {
    const templateId = templateFile.replace('.js', '');
    console.log(`Checking ${templateId}...`);
    
    try {
      // Read the template file
      const templatePath = path.join(templatesDir, templateFile);
      const templateCode = fs.readFileSync(templatePath, 'utf8');
      
      // Check for params file
      const paramsFile = `${templateId}.params.json`;
      const paramsPath = path.join(templatesDir, paramsFile);
      const hasParams = fs.existsSync(paramsPath);
      
      // Basic validation
      const issues = [];
      
      // Check for export statements (should not have any)
      if (templateCode.includes('export ')) {
        issues.push('Contains export statements');
      }
      
      // Check for drawVisualization or draw function
      const hasDrawVisualization = templateCode.includes('function drawVisualization');
      const hasDraw = templateCode.includes('function draw');
      if (!hasDrawVisualization && !hasDraw) {
        issues.push('Missing draw function');
      }
      
      // Check for parameters object
      if (!templateCode.includes('const parameters = {')) {
        issues.push('Missing parameters object');
      }
      
      // Check for metadata object
      if (!templateCode.includes('const metadata = {')) {
        issues.push('Missing metadata object');
      }
      
      // Check params file
      if (!hasParams) {
        issues.push('Missing .params.json file');
      } else {
        try {
          const paramsData = JSON.parse(fs.readFileSync(paramsPath, 'utf8'));
          if (!paramsData.parameters) {
            issues.push('params.json missing parameters object');
          }
          if (!paramsData.metadata) {
            issues.push('params.json missing metadata object');
          }
        } catch (e) {
          issues.push(`Invalid params.json: ${e.message}`);
        }
      }
      
      // Try to parse with Function constructor (similar to how it's executed)
      try {
        new Function('ctx', 'width', 'height', 'params', 'time', 'utils', templateCode);
      } catch (e) {
        issues.push(`Syntax error: ${e.message}`);
      }
      
      results.push({
        template: templateId,
        status: issues.length === 0 ? '✅' : '❌',
        issues
      });
      
    } catch (error) {
      results.push({
        template: templateId,
        status: '❌',
        issues: [`Error: ${error.message}`]
      });
    }
  }
  
  // Print results
  console.log('\n\n📊 Template Verification Results:');
  console.log('================================\n');
  
  results.forEach(result => {
    console.log(`${result.status} ${result.template}`);
    if (result.issues.length > 0) {
      result.issues.forEach(issue => console.log(`   └─ ${issue}`));
    }
  });
  
  const successCount = results.filter(r => r.status === '✅').length;
  console.log(`\n✅ Valid templates: ${successCount}/${results.length}`);
  
  // List all templates
  console.log('\n📁 Found templates:');
  results.forEach(r => console.log(`   - ${r.template}`));
}

verifyTemplates().catch(console.error);
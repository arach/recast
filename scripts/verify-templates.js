const { chromium } = require('playwright');

async function verifyTemplates() {
  console.log('🎨 Starting template verification...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the app
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Wait for UI to load
  await page.waitForSelector('button:has-text("Wave Bars")', { timeout: 10000 });
  
  // Get all templates from the dropdown
  const templates = [
    'wave-bars',
    'audio-bars',
    'liquid-flow',
    'network-constellation',
    'pulse-spotify',
    'quantum-field',
    'wordmark',
    'letter-mark',
    'prism',
    'circles',
    'triangles',
    'golden-circle',
    'minimal-shape',
    'crystal-lattice',
    'neon-glow',
    'organic-bark',
    'sophisticated-strokes'
  ];
  
  const results = [];
  
  for (const templateId of templates) {
    console.log(`\nTesting template: ${templateId}`);
    
    try {
      // Click the template selector dropdown
      await page.click('button:has-text("Wave Bars"), button:has-text("Audio Bars"), button:has-text("Liquid Flow"), button:has-text("Network Constellation"), button:has-text("Pulse Spotify"), button:has-text("Quantum Field"), button:has-text("Wordmark"), button:has-text("Letter Mark"), button:has-text("Prism"), button:has-text("Circles"), button:has-text("Triangles"), button:has-text("Golden Circle"), button:has-text("Minimal Shape"), button:has-text("Crystal Lattice"), button:has-text("Neon Glow"), button:has-text("Organic Bark"), button:has-text("Sophisticated Strokes"), button:has-text("Custom Code")');
      
      // Wait for dropdown to open
      await page.waitForSelector('[role="menu"]', { timeout: 5000 });
      
      // Find and click the template
      const templateName = getTemplateName(templateId);
      await page.click(`[role="menuitem"]:has-text("${templateName}")`);
      
      // Wait a bit for the template to render
      await page.waitForTimeout(2000);
      
      // Check for any console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Take a screenshot
      await page.screenshot({ 
        path: `./screenshots/template-${templateId}.png`,
        fullPage: false 
      });
      
      // Check if canvas is rendering (not empty)
      const canvasEmpty = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return true;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // Check if all pixels are transparent or white
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] !== 0 && !(data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255)) {
            return false; // Found a non-white, non-transparent pixel
          }
        }
        return true;
      });
      
      results.push({
        template: templateId,
        status: canvasEmpty ? '❌ Empty' : '✅ Rendering',
        errors: errors.length > 0 ? errors : null
      });
      
    } catch (error) {
      results.push({
        template: templateId,
        status: '❌ Error',
        errors: [error.message]
      });
    }
  }
  
  // Print results
  console.log('\n\n📊 Template Verification Results:');
  console.log('================================\n');
  
  results.forEach(result => {
    console.log(`${result.status} ${result.template}`);
    if (result.errors) {
      result.errors.forEach(err => console.log(`   └─ ${err}`));
    }
  });
  
  const successCount = results.filter(r => r.status.includes('✅')).length;
  console.log(`\n✅ Successfully rendered: ${successCount}/${templates.length}`);
  
  await browser.close();
}

function getTemplateName(templateId) {
  const nameMap = {
    'wave-bars': '🌊 Wave Bars',
    'audio-bars': '🎵 Audio Bars',
    'liquid-flow': '💧 Liquid Flow',
    'network-constellation': '🌐 Network Constellation',
    'pulse-spotify': '🎧 Pulse Spotify',
    'quantum-field': '⚛️ Quantum Field',
    'wordmark': '✏️ Wordmark',
    'letter-mark': '🔤 Letter Mark',
    'prism': '💎 Prism',
    'circles': '⭕ Circles',
    'triangles': '🔺 Triangles',
    'golden-circle': '🟡 Golden Circle',
    'minimal-shape': '⬜ Minimal Shape',
    'crystal-lattice': '💠 Crystal Lattice',
    'neon-glow': '✨ Neon Glow',
    'organic-bark': '🌳 Organic Bark',
    'sophisticated-strokes': '🎨 Sophisticated Strokes'
  };
  return nameMap[templateId] || templateId;
}

// Create screenshots directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./screenshots')) {
  fs.mkdirSync('./screenshots');
}

verifyTemplates().catch(console.error);
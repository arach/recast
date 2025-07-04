const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to capture the full canvas area
  await page.setViewport({ width: 1400, height: 900 });
  
  // Navigate to the app on port 3002
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
  
  // Wait for canvas to render
  await page.waitForSelector('canvas', { timeout: 10000 });
  
  // Wait a bit more for logos to fully render
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'reflow-current-state.png',
    fullPage: false 
  });
  
  console.log('Screenshot saved as reflow-current-state.png');
  
  await browser.close();
})();

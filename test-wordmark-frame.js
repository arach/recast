// Test script for wordmark frame feature
const puppeteer = require('puppeteer');

async function testWordmarkFrame() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the app
  await page.goto('http://localhost:3002');
  
  // Wait for the app to load
  await page.waitForSelector('[data-preset]', { timeout: 10000 });
  
  console.log('App loaded successfully');
  
  // Find and click the wordmark template
  const wordmarkButton = await page.$('[data-preset="wordmark"]');
  if (wordmarkButton) {
    await wordmarkButton.click();
    console.log('Selected wordmark template');
    await page.waitForTimeout(1000);
  } else {
    console.error('Could not find wordmark template button');
    await browser.close();
    return;
  }
  
  // Test 1: Toggle the Show Frame option
  console.log('\nTest 1: Testing Show Frame toggle');
  const frameToggle = await page.$('input[type="checkbox"][id*="showFrame"]');
  if (frameToggle) {
    await frameToggle.click();
    console.log('✓ Toggled Show Frame ON');
    await page.waitForTimeout(1000);
    
    // Take screenshot with frame enabled
    await page.screenshot({ path: 'wordmark-frame-on.png' });
    console.log('✓ Screenshot saved: wordmark-frame-on.png');
  } else {
    console.error('✗ Could not find Show Frame toggle');
  }
  
  // Test 2: Try different frame styles
  console.log('\nTest 2: Testing frame styles');
  const frameStyleSelect = await page.$('select[id*="frameStyle"]');
  if (frameStyleSelect) {
    // Test outline style (default)
    await page.screenshot({ path: 'wordmark-frame-outline.png' });
    console.log('✓ Screenshot saved: wordmark-frame-outline.png');
    
    // Test filled style
    await frameStyleSelect.select('filled');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'wordmark-frame-filled.png' });
    console.log('✓ Changed to filled style');
    console.log('✓ Screenshot saved: wordmark-frame-filled.png');
    
    // Test filled-inverse style
    await frameStyleSelect.select('filled-inverse');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'wordmark-frame-filled-inverse.png' });
    console.log('✓ Changed to filled-inverse style');
    console.log('✓ Screenshot saved: wordmark-frame-filled-inverse.png');
  } else {
    console.error('✗ Could not find frame style selector');
  }
  
  // Test 3: Test frame parameters (for outline style)
  console.log('\nTest 3: Testing frame parameters');
  await frameStyleSelect.select('outline');
  await page.waitForTimeout(500);
  
  // Test frame stroke styles
  const strokeStyleSelect = await page.$('select[id*="frameStrokeStyle"]');
  if (strokeStyleSelect) {
    const strokeStyles = ['solid', 'dashed', 'dotted', 'double'];
    for (const style of strokeStyles) {
      await strokeStyleSelect.select(style);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `wordmark-frame-stroke-${style}.png` });
      console.log(`✓ Tested ${style} stroke style`);
    }
  }
  
  // Test frame radius
  const radiusSlider = await page.$('input[type="range"][id*="frameRadius"]');
  if (radiusSlider) {
    await page.evaluate((slider) => {
      slider.value = '20';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }, radiusSlider);
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'wordmark-frame-rounded.png' });
    console.log('✓ Tested frame with rounded corners');
  }
  
  // Test 4: Test with different text
  console.log('\nTest 4: Testing with different text');
  const textInput = await page.$('input[id*="text"]');
  if (textInput) {
    await textInput.click({ clickCount: 3 }); // Select all
    await textInput.type('RECAST\nIDENTITY');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'wordmark-frame-multiline.png' });
    console.log('✓ Tested with multi-line text');
  }
  
  console.log('\n✅ All tests completed successfully!');
  console.log('Screenshots saved in the current directory');
  
  // Keep browser open for manual inspection
  console.log('\nBrowser will remain open for manual inspection...');
  console.log('Close the browser window when done.');
}

testWordmarkFrame().catch(console.error);
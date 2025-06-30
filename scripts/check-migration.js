#!/usr/bin/env node

const http = require('http');

console.log('🔍 Checking Zustand migration status...\n');

http.get('http://localhost:3002/', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Check for our migration indicators
    const hasV2Controls = data.includes('Using Zustand-based Controls');
    const hasControlsPanelV2 = data.includes('ControlsPanelV2');
    const hasStoreInitializer = data.includes('StoreInitializer');
    
    // Additional checks
    const hasFeatureFlag = data.includes('✅ Yes');
    const hasBrandControls = data.includes('Brand Identity');
    
    console.log('✅ Migration Status:');
    console.log(`   - V2 Controls Active: ${hasV2Controls ? '✓' : '✗'}`);
    console.log(`   - ControlsPanelV2 Component: ${hasControlsPanelV2 ? '✓' : '✗'}`);
    console.log(`   - StoreInitializer Bridge: ${hasStoreInitializer ? '✓' : '✗'}`);
    
    if (hasV2Controls) {
      console.log('\n🎉 Zustand migration is working! The new controls are active.');
    } else {
      console.log('\n⚠️  V2 controls not detected. Check feature flags and errors.');
    }
  });
}).on('error', (err) => {
  console.error('❌ Error connecting to server:', err.message);
  console.log('Make sure the dev server is running on port 3002');
});
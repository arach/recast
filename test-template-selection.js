// Test script to verify template selection fix
// Run this in the browser console after loading multiple logos

console.log('🧪 Testing template selection fix...\n');

// Helper to get store states
const getStoreState = () => {
  const logoStore = window.useLogoStore?.getState();
  const uiStore = window.useUIStore?.getState();
  
  if (!logoStore) {
    console.error('❌ Logo store not available. Make sure you\'re on the ReFlow page.');
    return null;
  }
  
  return {
    logos: logoStore.logos,
    selectedLogoId: logoStore.selectedLogoId,
    selectedLogo: logoStore.logos.find(l => l.id === logoStore.selectedLogoId)
  };
};

// Test function
const testTemplateSelection = async () => {
  const state = getStoreState();
  if (!state) return;
  
  console.log('📊 Current state:');
  console.log(`- Total logos: ${state.logos.length}`);
  console.log(`- Selected logo: ${state.selectedLogoId}`);
  console.log(`- Selected template: ${state.selectedLogo?.templateId || 'custom'}`);
  
  console.log('\n📝 Logo templates:');
  state.logos.forEach((logo, index) => {
    console.log(`  ${index + 1}. Logo "${logo.id}": ${logo.templateId || 'custom'} (${logo.templateName || 'Custom Code'})`);
  });
  
  console.log('\n✅ Fix applied: Template selector now uses fresh state from store');
  console.log('   instead of potentially stale closure values.');
  
  console.log('\n🔧 To test:');
  console.log('1. Click on different logos');
  console.log('2. Change the template in the dropdown');
  console.log('3. Verify only the selected logo\'s template changes');
  console.log('4. Switch to another logo and verify its template is preserved');
};

// Run the test
testTemplateSelection();

// Export for manual testing
window.testTemplateSelection = testTemplateSelection;
console.log('\n💡 Run window.testTemplateSelection() anytime to check current state');
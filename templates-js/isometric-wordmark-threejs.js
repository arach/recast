/**
 * 🎯 Isometric Wordmark Three.js
 * 
 * Three.js-powered isometric wordmark with true 3D rounded corners
 * Perfect for modern brand identity with proper 3D geometry
 */

// Main draw function
function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Get Three.js from utils
  const THREE = utils.three;
  if (!THREE) {
    ctx.fillStyle = '#ff0000';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Three.js not available', width / 2, height / 2);
    return;
  }
  
  // Create unique scene ID
  const sceneId = `isometric-wordmark-${width}x${height}`;
  
  // Get or create scene with controls enabled
  const { scene, camera, renderer, controls } = utils.threeUtils.getOrCreateScene(sceneId, width, height, p.enableOrbitControls);
  
  // Update scene background
  scene.background = new THREE.Color(p.backgroundColor || '#f0f0f0');
  
  // Clear scene
  utils.threeUtils.clearScene(scene);
  
  // Set up lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);
  
  // Calculate dimensions
  const scale = Math.min(width, height) / 400;
  const prismWidth = p.platformWidth * scale / 50;
  const prismHeight = p.platformHeight * scale / 50;
  const prismDepth = p.platformDepth * scale / 50;
  const cornerRadius = p.cornerRadius * scale / 50;
  
  // Create platform group
  const platformGroup = new THREE.Group();
  
  // Animation
  const animTime = time * p.animationSpeed;
  const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity * 0.1;
  
  // Create layers
  const layerCount = Math.floor(p.layerCount);
  const layerSpacing = p.layerSpacing * scale / 50;
  
  for (let i = 0; i < layerCount; i++) {
    const layerScale = 1 - (i * p.layerTaper);
    const layerBreathing = 1 + breathingPhase * (1 - i * 0.3);
    
    // Get layer color
    const layerColor = getLayerColor(p.colorScheme, i, layerCount);
    
    // Create prism with text only on top layer
    const isTopLayer = i === layerCount - 1;
    const prism = utils.threeUtils.createRoundedPrism(
      prismWidth * layerScale * layerBreathing,
      prismHeight * layerScale * layerBreathing,
      prismDepth * layerScale * layerBreathing,
      cornerRadius * layerScale,
      isTopLayer ? p.wordmark : null,
      p,
      layerColor
    );
    
    prism.position.y = i * layerSpacing;
    prism.castShadow = true;
    prism.receiveShadow = true;
    
    platformGroup.add(prism);
  }
  
  scene.add(platformGroup);
  
  // Set up proper isometric camera position
  const distance = 10;
  const isometricAngle = Math.PI / 6; // 30 degrees
  const rotationAngle = -Math.PI / 4 + (p.perspective * Math.PI / 180); // -45 degrees base
  
  // Calculate camera position for isometric view
  const cameraX = distance * Math.sin(rotationAngle) * Math.cos(isometricAngle);
  const cameraY = distance * Math.sin(isometricAngle);
  const cameraZ = distance * Math.cos(rotationAngle) * Math.cos(isometricAngle);
  
  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(0, 0, 0);
  camera.zoom = p.zoom;
  camera.updateProjectionMatrix();
  
  // Apply platform rotation for better viewing angle
  platformGroup.rotation.y = p.rotation * Math.PI / 180;
  
  // Apply tilt
  platformGroup.rotation.x = p.tilt * Math.PI / 180;
  
  // Apply rotation animation
  if (p.autoRotate && !p.enableOrbitControls) {
    platformGroup.rotation.y += animTime * 0.2;
  }
  
  // Update controls if enabled
  if (controls) {
    controls.update();
  }
  
  // Render scene
  renderer.render(scene, camera);
  
  // Copy Three.js canvas to 2D canvas
  ctx.drawImage(renderer.domElement, 0, 0);
  
  // If orbit controls are enabled, we need to set up continuous rendering
  if (p.enableOrbitControls && controls) {
    // Store the renderer canvas for potential overlay
    if (!window._reflow_three_canvas) {
      window._reflow_three_canvas = {};
    }
    window._reflow_three_canvas[sceneId] = {
      renderer,
      scene,
      camera,
      controls,
      lastRender: Date.now()
    };
    
    // Note: For full interactivity, the template system would need to overlay the Three.js canvas
    // For now, orbit controls work but require the template to be continuously re-rendered
  }
}

/**
 * Get color for layer based on scheme
 */
function getLayerColor(scheme, layerIndex, totalLayers) {
  const schemes = {
    'monochrome': ['#2d3748', '#4a5568', '#718096'],
    'blue': ['#1e3a8a', '#2563eb', '#3b82f6'],
    'purple': ['#6b46c1', '#8b5cf6', '#a78bfa'],
    'green': ['#059669', '#10b981', '#34d399'],
    'warm': ['#dc2626', '#f59e0b', '#eab308'],
    'cool': ['#0891b2', '#06b6d4', '#22d3ee'],
    'brand': ['#1b416b', '#2563eb', '#3b82f6']
  };
  
  const colors = schemes[scheme] || schemes['blue'];
  return colors[layerIndex % colors.length];
}

// Helper functions for parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const text = (def, label, opts = {}) => ({ 
  type: "text", default: def, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});
const color = (def, label, opts = {}) => ({ 
  type: "color", default: def, label, ...opts 
});

// Parameter definitions
export const parameters = {
  // Text Content
  wordmark: text('ReFlow', 'Wordmark Text', { group: 'Text Content' }),
  textSize: slider(24, 12, 60, 2, 'Text Size', 'px', { group: 'Text Content' }),
  textColor: color('#ffffff', 'Text Color', { group: 'Text Content' }),
  textShadow: slider(2, 0, 8, 1, 'Text Shadow', 'px', { group: 'Text Content' }),
  
  // Face & Text Orientation
  wordmarkFace: select('front', [
    { value: 'front', label: 'Front Face' },
    { value: 'top', label: 'Top Face' },
    { value: 'side', label: 'Side Face' }
  ], 'Wordmark Face', { group: 'Face & Text Orientation' }),
  textOrientation: select('normal', [
    { value: 'normal', label: 'Normal' },
    { value: 'rotated-45', label: 'Rotated 45°' },
    { value: 'rotated-90', label: 'Rotated 90°' }
  ], 'Text Orientation', { group: 'Face & Text Orientation' }),
  
  // Platform Dimensions
  platformWidth: slider(160, 80, 240, 10, 'Platform Width', 'px', { group: 'Platform Dimensions' }),
  platformHeight: slider(60, 30, 120, 5, 'Platform Height', 'px', { group: 'Platform Dimensions' }),
  platformDepth: slider(30, 10, 60, 5, 'Platform Depth', 'px', { group: 'Platform Dimensions' }),
  cornerRadius: slider(10, 0, 30, 1, 'Corner Radius', 'px', { group: 'Platform Dimensions' }),
  
  // 3D Layers
  layerCount: slider(3, 1, 6, 1, 'Layer Count', '', { group: '3D Layers' }),
  layerSpacing: slider(20, 0, 40, 2, 'Layer Spacing', 'px', { group: '3D Layers' }),
  layerTaper: slider(0.15, 0, 0.3, 0.05, 'Layer Taper', '', { group: '3D Layers' }),
  
  // Visual Style
  colorScheme: select('brand', [
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'green', label: 'Green' },
    { value: 'warm', label: 'Warm' },
    { value: 'cool', label: 'Cool' },
    { value: 'brand', label: 'Brand' }
  ], 'Color Scheme', { group: 'Visual Style' }),
  backgroundColor: color('#f8f9fa', 'Background Color', { group: 'Visual Style' }),
  
  // Camera & View
  perspective: slider(0, -30, 30, 5, 'Perspective', '°', { group: 'Camera & View' }),
  rotation: slider(0, -180, 180, 5, 'Rotation', '°', { group: 'Camera & View' }),
  tilt: slider(0, -30, 30, 5, 'Tilt', '°', { group: 'Camera & View' }),
  zoom: slider(1, 0.5, 2, 0.1, 'Zoom', 'x', { group: 'Camera & View' }),
  autoRotate: toggle(false, 'Auto Rotate', { group: 'Camera & View' }),
  enableOrbitControls: toggle(false, 'Enable Orbit Controls', { group: 'Camera & View' }),
  
  // Animation
  animationSpeed: slider(1, 0, 3, 0.1, 'Animation Speed', 'x', { group: 'Animation' }),
  breathingIntensity: slider(0.5, 0, 1, 0.1, 'Breathing Intensity', '', { group: 'Animation' })
};

export const metadata = {
  id: 'isometric-wordmark-threejs',
  name: "🎯 Isometric Wordmark 3D",
  description: "Three.js-powered isometric wordmark with true 3D rounded corners",
  parameters,
  defaultParams: {
    wordmark: 'ReFlow',
    textSize: 24,
    textColor: '#ffffff',
    textShadow: 2,
    wordmarkFace: 'front',
    textOrientation: 'normal',
    platformWidth: 160,
    platformHeight: 60,
    platformDepth: 30,
    cornerRadius: 10,
    layerCount: 3,
    layerSpacing: 20,
    layerTaper: 0.15,
    colorScheme: 'brand',
    backgroundColor: '#f8f9fa',
    perspective: 0,
    rotation: 0,
    tilt: 0,
    zoom: 1,
    autoRotate: false,
    enableOrbitControls: false,
    animationSpeed: 1,
    breathingIntensity: 0.5
  }
};

export { draw, parameters as params };
/**
 * 🎯 Isometric Wordmark Interactive
 * 
 * Fully interactive Three.js-powered isometric wordmark with orbit controls
 * Drag to rotate, scroll to zoom, right-click to pan
 */

// Track active renders
let activeRenders = new Map();

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
  const sceneId = `isometric-interactive-${width}x${height}`;
  
  // If we're in interactive mode, use the canvas manager
  if (p.enableOrbitControls) {
    const managed = utils.threeCanvasManager.createOrGetCanvas(
      'isometric-interactive',
      ctx.canvas,
      width,
      height,
      true // enable controls
    );
    
    const { scene, camera, renderer, controls } = managed;
    
    // Update scene
    scene.background = new THREE.Color(p.backgroundColor || '#f0f0f0');
    
    // Clear scene
    utils.threeUtils.clearScene(scene);
    
    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create content
    const platformGroup = createPlatformGroup(p, time, utils, THREE);
    scene.add(platformGroup);
    
    // Set camera position if not already animating
    if (!activeRenders.has(sceneId)) {
      const distance = 10;
      const isometricAngle = Math.PI / 6;
      const rotationAngle = -Math.PI / 4 + (p.perspective * Math.PI / 180);
      
      const cameraX = distance * Math.sin(rotationAngle) * Math.cos(isometricAngle);
      const cameraY = distance * Math.sin(isometricAngle);
      const cameraZ = distance * Math.cos(rotationAngle) * Math.cos(isometricAngle);
      
      camera.position.set(cameraX, cameraY, cameraZ);
      camera.lookAt(0, 0, 0);
      camera.zoom = p.zoom;
      camera.updateProjectionMatrix();
      
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    }
    
    // Start animation if needed
    if (!activeRenders.has(sceneId)) {
      activeRenders.set(sceneId, true);
      
      utils.threeCanvasManager.startAnimation(sceneId, () => {
        // Update platform rotation if auto-rotate is on
        if (p.autoRotate) {
          platformGroup.rotation.y += 0.002 * p.animationSpeed;
        }
        
        // Update breathing animation
        const animTime = Date.now() * 0.001 * p.animationSpeed;
        const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity * 0.1;
        
        // Update layer scales
        platformGroup.children.forEach((child, i) => {
          const layerBreathing = 1 + breathingPhase * (1 - i * 0.3);
          child.scale.setScalar(layerBreathing);
        });
      });
    }
    
    // Copy to 2D canvas
    utils.threeCanvasManager.copyToCanvas(sceneId, ctx);
    
  } else {
    // Non-interactive mode - use standard Three.js rendering
    const { scene, camera, renderer } = utils.threeUtils.getOrCreateScene(sceneId, width, height, false);
    
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
    scene.add(directionalLight);
    
    // Create content
    const platformGroup = createPlatformGroup(p, time, utils, THREE);
    scene.add(platformGroup);
    
    // Set camera position
    const distance = 10;
    const isometricAngle = Math.PI / 6;
    const rotationAngle = -Math.PI / 4 + (p.perspective * Math.PI / 180);
    
    const cameraX = distance * Math.sin(rotationAngle) * Math.cos(isometricAngle);
    const cameraY = distance * Math.sin(isometricAngle);
    const cameraZ = distance * Math.cos(rotationAngle) * Math.cos(isometricAngle);
    
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(0, 0, 0);
    camera.zoom = p.zoom;
    camera.updateProjectionMatrix();
    
    // Apply rotation
    platformGroup.rotation.y = p.rotation * Math.PI / 180;
    platformGroup.rotation.x = p.tilt * Math.PI / 180;
    
    // Apply auto-rotation
    if (p.autoRotate) {
      const animTime = time * p.animationSpeed;
      platformGroup.rotation.y += animTime * 0.2;
    }
    
    // Render scene
    renderer.render(scene, camera);
    
    // Copy to 2D canvas
    ctx.drawImage(renderer.domElement, 0, 0);
  }
}

// Create platform group with all layers
function createPlatformGroup(p, time, utils, THREE) {
  const platformGroup = new THREE.Group();
  
  // Calculate dimensions
  const scale = 1 / 50;
  const prismWidth = p.platformWidth * scale;
  const prismHeight = p.platformHeight * scale;
  const prismDepth = p.platformDepth * scale;
  const cornerRadius = p.cornerRadius * scale;
  
  // Animation
  const animTime = time * p.animationSpeed;
  const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity * 0.1;
  
  // Create a single prism with wordmark
  const layerColor = getLayerColor(p.colorScheme, 0, 1);
  
  const prism = utils.threeUtils.createRoundedPrism(
    prismWidth,
    prismHeight,
    prismDepth,
    cornerRadius,
    p.wordmark, // Always show wordmark
    p,
    layerColor
  );
  
  prism.castShadow = true;
  prism.receiveShadow = true;
  
  platformGroup.add(prism);
  
  // Optionally add more layers if requested
  if (p.layerCount > 1) {
    const layerSpacing = p.layerSpacing * scale;
    
    for (let i = 1; i < Math.floor(p.layerCount); i++) {
      const layerScale = 1 - (i * p.layerTaper);
      const layerColor = getLayerColor(p.colorScheme, i, p.layerCount);
      
      const layer = utils.threeUtils.createRoundedPrism(
        prismWidth * layerScale,
        prismHeight * layerScale,
        prismDepth * layerScale,
        cornerRadius * layerScale,
        null, // No text on other layers
        p,
        layerColor
      );
      
      layer.position.y = -i * layerSpacing; // Stack below
      layer.castShadow = true;
      layer.receiveShadow = true;
      
      platformGroup.add(layer);
    }
  }
  
  // Base rotation
  platformGroup.rotation.y = p.rotation * Math.PI / 180;
  platformGroup.rotation.x = p.tilt * Math.PI / 180;
  
  return platformGroup;
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
  enableOrbitControls: toggle(true, '🎮 Interactive Controls', { group: 'Camera & View' }),
  
  // Animation
  animationSpeed: slider(1, 0, 3, 0.1, 'Animation Speed', 'x', { group: 'Animation' }),
  breathingIntensity: slider(0.5, 0, 1, 0.1, 'Breathing Intensity', '', { group: 'Animation' })
};

export const metadata = {
  id: 'isometric-wordmark-interactive',
  name: "🎮 Isometric Wordmark Interactive",
  description: "Fully interactive Three.js wordmark - drag to rotate, scroll to zoom",
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
    enableOrbitControls: true,
    animationSpeed: 1,
    breathingIntensity: 0.5
  }
};

export { draw, parameters as params };
/**
 * 🎯 Isometric Wordmark 3D
 * 
 * Three.js-powered isometric wordmark with proper 3D rounded corners
 * Perfect for modern brand identity with true 3D geometry
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Three.js scene management
let sceneCache = new Map();
let fontCache = null;

function getOrCreateScene(canvasId, width, height) {
  if (!sceneCache.has(canvasId)) {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 200, width / 200,
      height / 200, -height / 200,
      0.1, 1000
    );
    
    // Set up isometric camera angle
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    
    sceneCache.set(canvasId, { scene, camera, renderer });
  }
  
  const cached = sceneCache.get(canvasId);
  
  // Update size if changed
  if (cached.renderer.domElement.width !== width || cached.renderer.domElement.height !== height) {
    cached.camera.left = -width / 200;
    cached.camera.right = width / 200;
    cached.camera.top = height / 200;
    cached.camera.bottom = -height / 200;
    cached.camera.updateProjectionMatrix();
    cached.renderer.setSize(width, height);
  }
  
  return cached;
}

async function loadFont() {
  if (fontCache) return fontCache;
  
  const loader = new FontLoader();
  return new Promise((resolve) => {
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      fontCache = font;
      resolve(font);
    });
  });
}

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Create unique canvas ID
  const canvasId = `canvas-${width}x${height}`;
  
  // Get or create Three.js scene
  const { scene, camera, renderer } = getOrCreateScene(canvasId, width, height);
  
  // Clear scene
  while(scene.children.length > 0) { 
    scene.remove(scene.children[0]);
  }
  
  // Set background
  scene.background = new THREE.Color(p.backgroundColor || '#ffffff');
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Calculate dimensions
  const scale = Math.min(width, height) / 400;
  const cardWidth = p.platformWidth * scale / 100;
  const cardHeight = p.platformHeight * scale / 100;
  const cardDepth = p.platformDepth * scale / 100;
  const cornerRadius = p.cornerRadius * scale / 100;
  
  // Create platform group
  const platformGroup = new THREE.Group();
  
  // Animation
  const animTime = time * p.animationSpeed;
  const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity * 0.1;
  
  // Create layers
  const layerCount = Math.floor(p.layerCount);
  const layerSpacing = p.layerSpacing * scale / 100;
  
  for (let i = 0; i < layerCount; i++) {
    const layerScale = 1 - (i * p.layerTaper);
    const layerBreathing = 1 + breathingPhase * (1 - i * 0.3);
    
    // Create rounded box geometry
    const geometry = new RoundedBoxGeometry(
      cardWidth * layerScale * layerBreathing,
      cardHeight * layerScale * layerBreathing,
      cardDepth * layerScale * layerBreathing,
      Math.max(2, Math.floor(10 * layerScale)),
      cornerRadius * layerScale
    );
    
    // Get layer color
    const layerColor = getLayerColor(p.colorScheme, i, layerCount);
    const material = new THREE.MeshStandardMaterial({ 
      color: layerColor,
      metalness: 0.1,
      roughness: 0.7
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = i * layerSpacing;
    
    platformGroup.add(mesh);
  }
  
  // Add text if provided
  if (p.wordmark && p.wordmark.trim() && fontCache) {
    const textGeometry = new TextGeometry(p.wordmark, {
      font: fontCache,
      size: p.textSize * scale / 100,
      height: 0.01,
      curveSegments: 12,
    });
    
    textGeometry.center();
    
    const textMaterial = new THREE.MeshStandardMaterial({ 
      color: p.textColor,
      metalness: 0.2,
      roughness: 0.5
    });
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // Position text based on wordmark face
    const topLayer = (layerCount - 1) * layerSpacing;
    switch (p.wordmarkFace) {
      case 'front':
        textMesh.position.set(0, topLayer, cardDepth / 2 + 0.01);
        break;
      case 'top':
        textMesh.position.set(0, topLayer + cardHeight / 2 + 0.01, 0);
        textMesh.rotation.x = -Math.PI / 2;
        break;
      case 'side':
        textMesh.position.set(cardWidth / 2 + 0.01, topLayer, 0);
        textMesh.rotation.y = Math.PI / 2;
        break;
    }
    
    // Apply text orientation
    if (p.textOrientation === 'rotated-90') {
      textMesh.rotation.z = -Math.PI / 2;
    } else if (p.textOrientation === 'rotated-45') {
      textMesh.rotation.z = -Math.PI / 4;
    }
    
    platformGroup.add(textMesh);
  }
  
  // Apply perspective rotation
  const isoAngle = p.perspective * Math.PI / 180;
  platformGroup.rotation.y = -Math.PI / 4 + isoAngle;
  platformGroup.rotation.x = -Math.PI / 10;
  
  scene.add(platformGroup);
  
  // Render the scene
  renderer.render(scene, camera);
  
  // Copy Three.js canvas to 2D canvas
  ctx.drawImage(renderer.domElement, 0, 0);
  
  // Load font asynchronously if not loaded
  if (!fontCache) {
    loadFont().then(() => {
      // Font loaded, will render with text on next frame
    });
  }
}

/**
 * Get color for layer based on scheme
 */
function getLayerColor(scheme, layerIndex, totalLayers) {
  const schemes = {
    'monochrome': ['#2d3748', '#4a5568', '#718096'],
    'blue': ['#2b6cb0', '#3182ce', '#4299e1'],
    'purple': ['#6b46c1', '#8b5cf6', '#a78bfa'],
    'green': ['#059669', '#10b981', '#34d399'],
    'warm': ['#dc2626', '#f59e0b', '#eab308'],
    'cool': ['#0891b2', '#06b6d4', '#22d3ee']
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
  textStyle: select('bold', [
    { value: 'modern', label: 'Modern' },
    { value: 'bold', label: 'Bold' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'minimal', label: 'Minimal' }
  ], 'Text Style', { group: 'Text Content' }),
  
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
  platformWidth: slider(120, 60, 200, 10, 'Platform Width', 'px', { group: 'Platform Dimensions' }),
  platformHeight: slider(80, 40, 160, 5, 'Platform Height', 'px', { group: 'Platform Dimensions' }),
  platformDepth: slider(20, 10, 60, 5, 'Platform Depth', 'px', { group: 'Platform Dimensions' }),
  cornerRadius: slider(8, 0, 30, 1, 'Corner Radius', 'px', { group: 'Platform Dimensions' }),
  
  // 3D Layers
  layerCount: slider(3, 1, 6, 1, 'Layer Count', '', { group: '3D Layers' }),
  layerSpacing: slider(20, 0, 40, 2, 'Layer Spacing', 'px', { group: '3D Layers' }),
  layerTaper: slider(0.15, 0, 0.3, 0.05, 'Layer Taper', '', { group: '3D Layers' }),
  
  // Visual Style
  colorScheme: select('blue', [
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'green', label: 'Green' },
    { value: 'warm', label: 'Warm' },
    { value: 'cool', label: 'Cool' }
  ], 'Color Scheme', { group: 'Visual Style' }),
  backgroundColor: color('#f0f0f0', 'Background Color', { group: 'Visual Style' }),
  perspective: slider(0, -30, 30, 5, 'Perspective Adjust', '°', { group: 'Visual Style' }),
  
  // Animation
  animationSpeed: slider(1, 0, 3, 0.1, 'Animation Speed', 'x', { group: 'Animation' }),
  breathingIntensity: slider(0.5, 0, 1, 0.1, 'Breathing Intensity', '', { group: 'Animation' })
};

export const metadata = {
  id: 'isometric-wordmark-3d',
  name: "🎯 Isometric Wordmark 3D",
  description: "Three.js-powered isometric wordmark with proper 3D rounded corners",
  parameters,
  defaultParams: {
    wordmark: 'ReFlow',
    textSize: 24,
    textColor: '#ffffff',
    textStyle: 'bold',
    wordmarkFace: 'front',
    textOrientation: 'normal',
    platformWidth: 120,
    platformHeight: 80,
    platformDepth: 20,
    cornerRadius: 8,
    layerCount: 3,
    layerSpacing: 20,
    layerTaper: 0.15,
    colorScheme: 'blue',
    backgroundColor: '#f0f0f0',
    perspective: 0,
    animationSpeed: 1,
    breathingIntensity: 0.5
  }
};

export { draw, parameters as params };
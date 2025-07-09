/**
 * Three.js utilities for template system
 * Provides Three.js and related utilities to templates
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Export Three.js and utilities
export { THREE, OrbitControls };

// Scene cache for performance
const sceneCache = new Map<string, {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls?: OrbitControls;
}>();

export function getOrCreateScene(
  sceneId: string,
  width: number,
  height: number,
  enableControls = false
) {
  let sceneData = sceneCache.get(sceneId);
  
  if (!sceneData) {
    const scene = new THREE.Scene();
    
    const aspect = width / height;
    const frustumSize = 5;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect,
      frustumSize * aspect,
      frustumSize,
      -frustumSize,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    sceneData = { scene, camera, renderer };
    
    if (enableControls && typeof window !== 'undefined') {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 3;
      controls.maxDistance = 20;
      controls.maxPolarAngle = Math.PI / 2;
      sceneData.controls = controls;
    }
    
    sceneCache.set(sceneId, sceneData);
  }
  
  // Update size if needed
  if (sceneData.renderer.domElement.width !== width || 
      sceneData.renderer.domElement.height !== height) {
    const aspect = width / height;
    const frustumSize = 5;
    sceneData.renderer.setSize(width, height);
    sceneData.camera.left = -frustumSize * aspect;
    sceneData.camera.right = frustumSize * aspect;
    sceneData.camera.top = frustumSize;
    sceneData.camera.bottom = -frustumSize;
    sceneData.camera.updateProjectionMatrix();
  }
  
  return sceneData;
}

export function clearScene(scene: THREE.Scene) {
  while (scene.children.length > 0) {
    const child = scene.children[0];
    if ((child as any).geometry) (child as any).geometry.dispose();
    if ((child as any).material) {
      if (Array.isArray((child as any).material)) {
        (child as any).material.forEach((m: any) => m.dispose());
      } else {
        (child as any).material.dispose();
      }
    }
    scene.remove(child);
  }
}

export function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  // Start from bottom-left corner + radius
  shape.moveTo(x + radius, y);
  
  // Bottom edge
  shape.lineTo(x + width - radius, y);
  
  // Bottom-right corner
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  
  // Right edge
  shape.lineTo(x + width, y + height - radius);
  
  // Top-right corner
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  
  // Top edge
  shape.lineTo(x + radius, y + height);
  
  // Top-left corner
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  
  // Left edge
  shape.lineTo(x, y + radius);
  
  // Bottom-left corner
  shape.quadraticCurveTo(x, y, x + radius, y);
  
  return shape;
}

export function createTextTexture(
  text: string,
  width = 1024,
  height = 512,
  params: any
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set font properties
  const fontSize = Math.min(width, height) * 0.25;
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = params.textColor || '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add text shadow if enabled
  if (params.textShadow > 0) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = params.textShadow * 2;
    ctx.shadowOffsetX = params.textShadow;
    ctx.shadowOffsetY = params.textShadow;
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  }
  
  // Draw main text
  ctx.fillText(text, width / 2, height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createTextLabel(
  text: string,
  planeWidth: number,
  planeHeight: number,
  params: any
): THREE.Mesh {
  const texture = createTextTexture(text, 1024, 512, params);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1
  });
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createRoundedPrism(
  width: number,
  height: number,
  depth: number,
  radius: number,
  labelText: string | null,
  params: any,
  layerColor: string
): THREE.Group {
  const shape = createRoundedRectShape(width, height, radius);
  
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: depth,
    bevelEnabled: true,
    bevelThickness: radius * 0.1,
    bevelSize: radius * 0.1,
    bevelSegments: 8,
    steps: 1
  };
  
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(layerColor),
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  
  const prism = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(prism);
  
  // Add edge highlighting
  const edges = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({ 
    color: new THREE.Color(layerColor).multiplyScalar(0.6),
    linewidth: 1
  });
  const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
  group.add(edgeLines);
  
  // Add text label if provided
  if (labelText && params.wordmarkFace) {
    const labelWidth = width * 0.8;
    const labelHeight = height * 0.8;
    const label = createTextLabel(labelText, labelWidth, labelHeight, params);
    
    // Position label based on face selection
    switch (params.wordmarkFace) {
      case 'front':
        label.position.z = depth / 2 + 0.01;
        // No rotation needed for front face
        break;
      case 'top':
        label.position.y = height / 2 + 0.01;
        label.rotation.x = -Math.PI / 2;
        break;
      case 'side':
        label.position.x = width / 2 + 0.01;
        label.rotation.y = Math.PI / 2;
        break;
    }
    
    // Apply text orientation after face rotation
    if (params.textOrientation === 'rotated-90') {
      if (params.wordmarkFace === 'top') {
        label.rotation.z = Math.PI / 2;
      } else {
        label.rotation.z = -Math.PI / 2;
      }
    } else if (params.textOrientation === 'rotated-45') {
      if (params.wordmarkFace === 'top') {
        label.rotation.z = Math.PI / 4;
      } else {
        label.rotation.z = -Math.PI / 4;
      }
    }
    
    group.add(label);
  }
  
  return group;
}
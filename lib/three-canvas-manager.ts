/**
 * Three.js Canvas Manager
 * Manages persistent Three.js canvases for interactive 3D templates
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ManagedCanvas {
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  controls?: OrbitControls;
  animationId?: number;
  isActive: boolean;
  lastUpdate: number;
}

class ThreeCanvasManager {
  private canvases = new Map<string, ManagedCanvas>();
  
  createOrGetCanvas(
    templateId: string,
    targetCanvas: HTMLCanvasElement,
    width: number,
    height: number,
    enableControls = false
  ): ManagedCanvas {
    const canvasId = `${templateId}-${width}x${height}`;
    let managed = this.canvases.get(canvasId);
    
    if (!managed) {
      // Create container div that will overlay the target canvas
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.pointerEvents = enableControls ? 'auto' : 'none';
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      
      // Create Three.js canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Create scene
      const scene = new THREE.Scene();
      
      // Create camera
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
      
      // Create controls if enabled
      let controls: OrbitControls | undefined;
      if (enableControls) {
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 3;
        controls.maxDistance = 20;
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        };
        controls.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        };
      }
      
      managed = {
        container,
        canvas,
        renderer,
        scene,
        camera,
        controls,
        isActive: false,
        lastUpdate: Date.now()
      };
      
      this.canvases.set(canvasId, managed);
    }
    
    // Update size if needed
    if (managed.canvas.width !== width || managed.canvas.height !== height) {
      managed.canvas.width = width;
      managed.canvas.height = height;
      managed.renderer.setSize(width, height);
      
      const aspect = width / height;
      const frustumSize = 5;
      managed.camera.left = -frustumSize * aspect;
      managed.camera.right = frustumSize * aspect;
      managed.camera.top = frustumSize;
      managed.camera.bottom = -frustumSize;
      managed.camera.updateProjectionMatrix();
    }
    
    // Position container to overlay target canvas
    if (targetCanvas.parentElement && !managed.container.parentElement) {
      const rect = targetCanvas.getBoundingClientRect();
      managed.container.style.left = `${rect.left}px`;
      managed.container.style.top = `${rect.top}px`;
      document.body.appendChild(managed.container);
    }
    
    managed.lastUpdate = Date.now();
    return managed;
  }
  
  startAnimation(canvasId: string, animate: () => void) {
    const managed = this.canvases.get(canvasId);
    if (!managed || managed.isActive) return;
    
    managed.isActive = true;
    
    const render = () => {
      if (!managed.isActive) return;
      
      animate();
      
      if (managed.controls) {
        managed.controls.update();
      }
      
      managed.renderer.render(managed.scene, managed.camera);
      managed.animationId = requestAnimationFrame(render);
    };
    
    render();
  }
  
  stopAnimation(canvasId: string) {
    const managed = this.canvases.get(canvasId);
    if (!managed) return;
    
    managed.isActive = false;
    if (managed.animationId) {
      cancelAnimationFrame(managed.animationId);
      managed.animationId = undefined;
    }
  }
  
  copyToCanvas(canvasId: string, targetCtx: CanvasRenderingContext2D) {
    const managed = this.canvases.get(canvasId);
    if (!managed) return;
    
    targetCtx.drawImage(managed.canvas, 0, 0);
  }
  
  cleanup(canvasId: string) {
    const managed = this.canvases.get(canvasId);
    if (!managed) return;
    
    this.stopAnimation(canvasId);
    
    if (managed.container.parentElement) {
      managed.container.parentElement.removeChild(managed.container);
    }
    
    managed.renderer.dispose();
    this.canvases.delete(canvasId);
  }
  
  cleanupOld(maxAge = 60000) {
    const now = Date.now();
    const toDelete: string[] = [];
    
    this.canvases.forEach((managed, id) => {
      if (!managed.isActive && now - managed.lastUpdate > maxAge) {
        toDelete.push(id);
      }
    });
    
    toDelete.forEach(id => this.cleanup(id));
  }
}

// Global instance
export const threeCanvasManager = new ThreeCanvasManager();

// Clean up old canvases periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    threeCanvasManager.cleanupOld();
  }, 30000);
}
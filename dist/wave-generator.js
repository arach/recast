"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// core/wave-generator.ts
var wave_generator_exports = {};
__export(wave_generator_exports, {
  WaveGenerator: () => WaveGenerator
});
module.exports = __toCommonJS(wave_generator_exports);

// core/generative-engine.ts
var GeneratorBase = class {
  constructor(params, seed) {
    this.params = params;
    this.rng = seed ? this.createSeededRandom(seed) : Math.random;
  }
  // Get metadata about this generator
  getMetadata() {
    return this.metadata;
  }
  // Update parameters without recreating generator
  updateParameters(newParams) {
    this.params = { ...this.params, ...newParams };
  }
  // Get current parameters
  getParameters() {
    return { ...this.params };
  }
  // Seeded random number generator for reproducible results
  createSeededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  }
  // Utility methods for common calculations
  calculatePhase(index, total, time = 0) {
    return index / total * this.params.frequency * Math.PI * 2 + time + (this.params.phaseOffset || 0);
  }
  applyDamping(value, distance) {
    return value * Math.pow(this.params.damping, distance);
  }
  addChaos(value, intensity = 1) {
    const chaosAmount = (this.rng() - 0.5) * this.params.chaos * intensity;
    return value + chaosAmount;
  }
  scaleToCanvas(value, canvasSize) {
    return value / 100 * canvasSize;
  }
};
var GeneratorRegistry = class {
  static register(name, generatorClass) {
    this.generators.set(name, generatorClass);
  }
  static get(name) {
    return this.generators.get(name);
  }
  static getAll() {
    return Array.from(this.generators.keys());
  }
  static createGenerator(name, params, seed) {
    const GeneratorClass = this.generators.get(name);
    if (!GeneratorClass) return null;
    return new GeneratorClass(params, seed);
  }
};
GeneratorRegistry.generators = /* @__PURE__ */ new Map();

// core/wave-generator.ts
var WaveGenerator = class _WaveGenerator extends GeneratorBase {
  constructor(params, seed) {
    const generativeParams = "barCount" in params ? params : {
      frequency: params.frequency,
      amplitude: params.amplitude,
      complexity: params.complexity,
      chaos: params.chaos,
      damping: params.damping,
      layers: params.layers,
      phaseOffset: "phase" in params ? params.phase : 0
    };
    super(generativeParams, seed);
    this.metadata = {
      name: "Wave Generator",
      description: "Creates smooth mathematical wave patterns with harmonics and complexity",
      category: "mathematical",
      supportedModes: ["wave", "wavebars"],
      defaultParameters: {
        frequency: 3,
        amplitude: 50,
        complexity: 0.3,
        chaos: 0.1,
        damping: 0.9,
        layers: 2
      },
      parameterRanges: {
        frequency: { min: 0.1, max: 20, step: 0.1 },
        amplitude: { min: 0, max: 100, step: 1 },
        complexity: { min: 0, max: 1, step: 0.01 },
        chaos: { min: 0, max: 1, step: 0.01 },
        damping: { min: 0, max: 1, step: 0.01 },
        layers: { min: 1, max: 5, step: 1 }
      }
    };
  }
  // New unified generate method for GenerativeEngine compatibility
  generate(options) {
    const layers = this.generateWavePoints(options);
    const elements = [];
    layers.forEach((layer, layerIndex) => {
      if (layer.length > 1) {
        const pathData = layer.map(
          (point, i) => i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        ).join(" ");
        elements.push({
          type: "path",
          props: {
            d: pathData,
            stroke: `hsl(${200 + layerIndex * 30}, 70%, 50%)`,
            strokeWidth: Math.max(1, options.width / 200),
            fill: "none",
            opacity: 0.8 - layerIndex * 0.1
          }
        });
      }
    });
    return elements;
  }
  // Generate a single wave layer
  generateLayer(options, layerIndex, time = 0) {
    const points = [];
    const { width, height, resolution } = options;
    const { amplitude, frequency, complexity, chaos, damping, phaseOffset } = this.params;
    const isAnimating = time !== void 0 && Math.abs(time % 1) > 1e-3;
    const activeComplexity = isAnimating ? Math.min(complexity * 0.3, 0.1) : complexity;
    const maxHarmonics = isAnimating ? 2 : Math.ceil(activeComplexity * 5);
    const layerFreq = frequency * (1 + layerIndex * 0.3);
    const layerAmp = amplitude * Math.pow(damping, layerIndex);
    const layerPhase = (phaseOffset || 0) + layerIndex * Math.PI / 4;
    for (let i = 0; i < resolution; i++) {
      const x = i / resolution * width;
      const t = i / resolution;
      let y = Math.sin(t * layerFreq * Math.PI * 2 + layerPhase + time);
      for (let h = 2; h <= maxHarmonics; h++) {
        const harmonicAmp = 1 / h;
        y += harmonicAmp * Math.sin(t * layerFreq * h * Math.PI * 2 + layerPhase + time);
      }
      if (chaos > 0) {
        const activeChaos = isAnimating ? chaos * 0.5 : chaos;
        y += (this.rng() - 0.5) * activeChaos;
      }
      y = y * layerAmp;
      y = height / 2 + y;
      const intensity = Math.abs(y - height / 2) / (height / 2);
      points.push({
        x,
        y,
        intensity,
        phase: t * layerFreq * Math.PI * 2 + layerPhase
      });
    }
    return points;
  }
  // Legacy method - generates raw wave points (DEPRECATED: use generate() for new code)
  generateWavePoints(options) {
    const { layers } = this.params;
    const { time = 0 } = options;
    const allLayers = [];
    for (let i = 0; i < layers; i++) {
      const layer = this.generateLayer(options, i, time);
      allLayers.push(layer);
    }
    return allLayers;
  }
  // Generate a wave-within-wave effect
  generateNested(options) {
    const containerWave = this.generateWavePoints({
      ...options,
      resolution: Math.floor(options.resolution / 4)
    })[0];
    const nestedWaves = [];
    for (let i = 0; i < containerWave.length - 1; i++) {
      const start = containerWave[i];
      const end = containerWave[i + 1];
      const miniParams = {
        ...this.params,
        amplitude: this.params.amplitude * 0.3,
        frequency: this.params.frequency * 4
      };
      const miniGen = new _WaveGenerator(miniParams);
      const miniWave = miniGen.generateLayer({
        width: end.x - start.x,
        height: options.height,
        resolution: 20
      }, 0);
      const transformed = miniWave.map((point) => ({
        ...point,
        x: start.x + point.x,
        y: start.y + (point.y - options.height / 2) * 0.3
      }));
      nestedWaves.push(transformed);
    }
    return [containerWave, ...nestedWaves.flat()];
  }
  // Legacy parameter update method (DEPRECATED: use updateParameters() for new code)
  updateParams(params) {
    const generativeParams = {
      frequency: params.frequency,
      amplitude: params.amplitude,
      complexity: params.complexity,
      chaos: params.chaos,
      damping: params.damping,
      layers: params.layers,
      phaseOffset: "phase" in params ? params.phase : void 0
    };
    this.updateParameters(generativeParams);
  }
};
GeneratorRegistry.register("wave", WaveGenerator);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WaveGenerator
});
//# sourceMappingURL=wave-generator.js.map
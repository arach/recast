// core/wave-generator.ts
var WaveGenerator = class _WaveGenerator {
  constructor(params, seed) {
    this.params = params;
    this.rng = seed ? this.seededRandom(seed) : Math.random;
  }
  // Seeded random number generator for reproducible results
  seededRandom(seed) {
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
  // Generate a single wave layer
  generateLayer(options, layerIndex, time = 0) {
    const points = [];
    const { width, height, resolution } = options;
    const { amplitude, frequency, phase, complexity, chaos, damping } = this.params;
    const layerFreq = frequency * (1 + layerIndex * 0.3);
    const layerAmp = amplitude * Math.pow(damping, layerIndex);
    const layerPhase = phase + layerIndex * Math.PI / 4;
    for (let i = 0; i < resolution; i++) {
      const x = i / resolution * width;
      const t = i / resolution;
      let y = Math.sin(t * layerFreq * Math.PI * 2 + layerPhase + time);
      for (let h = 2; h <= Math.ceil(complexity * 5); h++) {
        const harmonicAmp = 1 / h;
        y += harmonicAmp * Math.sin(t * layerFreq * h * Math.PI * 2 + layerPhase + time);
      }
      if (chaos > 0) {
        y += (this.rng() - 0.5) * chaos;
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
  // Generate all wave layers
  generate(options) {
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
    const containerWave = this.generate({
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
  // Update parameters (for animation)
  updateParams(params) {
    this.params = { ...this.params, ...params };
  }
};
export {
  WaveGenerator
};
//# sourceMappingURL=wave-generator.mjs.map
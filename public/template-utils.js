// Template Utilities - Auto-generated, do not edit directly
// Generated from lib/template-utils/*.ts

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// lib/template-utils/canvas.ts
var canvas_exports = {};
__export(canvas_exports, {
  applyGradient: () => applyGradient,
  applyPattern: () => applyPattern,
  drawGrid: () => drawGrid,
  drawRing: () => drawRing,
  drawShape: () => drawShape,
  drawSpiral: () => drawSpiral,
  getContrastColor: () => getContrastColor
});
function drawShape(ctx, shape, x, y, size, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (rotation !== 0) {
    ctx.rotate(rotation);
  }
  switch (shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      break;
    case "square":
      ctx.beginPath();
      ctx.rect(-size / 2, -size / 2, size, size);
      break;
    case "triangle":
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      break;
    case "hexagon":
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const px = Math.cos(angle) * size / 2;
        const py = Math.sin(angle) * size / 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, 0);
      ctx.lineTo(0, size / 2);
      ctx.lineTo(-size / 2, 0);
      ctx.closePath();
      break;
    case "pentagon":
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
        const px = Math.cos(angle) * size / 2;
        const py = Math.sin(angle) * size / 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "star":
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? size / 2 : size / 4;
        const angle = i * Math.PI / 5 - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "cross":
      ctx.beginPath();
      const arm = size / 3;
      ctx.moveTo(-arm / 2, -size / 2);
      ctx.lineTo(arm / 2, -size / 2);
      ctx.lineTo(arm / 2, -arm / 2);
      ctx.lineTo(size / 2, -arm / 2);
      ctx.lineTo(size / 2, arm / 2);
      ctx.lineTo(arm / 2, arm / 2);
      ctx.lineTo(arm / 2, size / 2);
      ctx.lineTo(-arm / 2, size / 2);
      ctx.lineTo(-arm / 2, arm / 2);
      ctx.lineTo(-size / 2, arm / 2);
      ctx.lineTo(-size / 2, -arm / 2);
      ctx.lineTo(-arm / 2, -arm / 2);
      ctx.closePath();
      break;
  }
  ctx.restore();
}
function drawGrid(ctx, width, height, cellSize, strokeStyle = "#e0e0e0", lineWidth = 1) {
  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}
function drawSpiral(ctx, centerX, centerY, maxRadius, rotations = 3, pointsPerRotation = 100) {
  ctx.beginPath();
  const totalPoints = rotations * pointsPerRotation;
  for (let i = 0; i <= totalPoints; i++) {
    const angle = i / pointsPerRotation * 2 * Math.PI;
    const radius = i / totalPoints * maxRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}
function drawRing(ctx, centerX, centerY, innerRadius, outerRadius) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
}
function applyGradient(ctx, type, colors, x1, y1, x2, y2, r1 = 0, r2 = 100) {
  let gradient;
  if (type === "linear") {
    gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  } else {
    gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
  }
  const step = 1 / (colors.length - 1);
  colors.forEach((color, i) => {
    gradient.addColorStop(i * step, color);
  });
  return gradient;
}
function applyPattern(ctx, patternType, color, spacing = 10) {
  const patternCanvas = document.createElement("canvas");
  const patternCtx = patternCanvas.getContext("2d");
  if (!patternCtx) return null;
  switch (patternType) {
    case "dots":
      patternCanvas.width = spacing * 2;
      patternCanvas.height = spacing * 2;
      patternCtx.fillStyle = color;
      patternCtx.beginPath();
      patternCtx.arc(spacing, spacing, spacing / 4, 0, Math.PI * 2);
      patternCtx.fill();
      break;
    case "lines":
      patternCanvas.width = spacing;
      patternCanvas.height = spacing;
      patternCtx.strokeStyle = color;
      patternCtx.lineWidth = 1;
      patternCtx.beginPath();
      patternCtx.moveTo(0, 0);
      patternCtx.lineTo(spacing, spacing);
      patternCtx.stroke();
      break;
    case "grid":
      patternCanvas.width = spacing;
      patternCanvas.height = spacing;
      patternCtx.strokeStyle = color;
      patternCtx.lineWidth = 1;
      patternCtx.beginPath();
      patternCtx.moveTo(spacing / 2, 0);
      patternCtx.lineTo(spacing / 2, spacing);
      patternCtx.moveTo(0, spacing / 2);
      patternCtx.lineTo(spacing, spacing / 2);
      patternCtx.stroke();
      break;
    case "checkerboard":
      patternCanvas.width = spacing * 2;
      patternCanvas.height = spacing * 2;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, spacing, spacing);
      patternCtx.fillRect(spacing, spacing, spacing, spacing);
      break;
  }
  return ctx.createPattern(patternCanvas, "repeat");
}
function getContrastColor(backgroundColor) {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// lib/template-utils/color.ts
var color_exports = {};
__export(color_exports, {
  adjustBrightness: () => adjustBrightness,
  blendColors: () => blendColors,
  generateColorPalette: () => generateColorPalette,
  hexToHsl: () => hexToHsl,
  hexToRgb: () => hexToRgb,
  hslToHex: () => hslToHex,
  rgbToHex: () => rgbToHex,
  rgbToHsl: () => rgbToHsl
});
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p2, q2, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2) return q2;
      if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}
function adjustBrightness(color, factor) {
  const rgb = hexToRgb(color);
  const r = Math.min(255, Math.max(0, rgb.r + rgb.r * factor));
  const g = Math.min(255, Math.max(0, rgb.g + rgb.g * factor));
  const b = Math.min(255, Math.max(0, rgb.b + rgb.b * factor));
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}
function blendColors(color1, color2, ratio = 0.5) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  return rgbToHex(r, g, b);
}
function generateColorPalette(baseColor, count = 5, mode = "monochromatic") {
  const palette = [baseColor];
  const hsl = hexToHsl(baseColor);
  for (let i = 1; i < count; i++) {
    let newColor;
    switch (mode) {
      case "monochromatic":
        const lightness = hsl.l + (i - count / 2) * 10;
        newColor = hslToHex(hsl.h, hsl.s, Math.max(0, Math.min(100, lightness)));
        break;
      case "analogous":
        const hueShift = i * 30;
        newColor = hslToHex((hsl.h + hueShift) % 360, hsl.s, hsl.l);
        break;
      case "complementary":
        if (i === 1) {
          newColor = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
        } else {
          const sat = hsl.s + (i - 1) * 10;
          newColor = hslToHex(hsl.h, Math.min(100, sat), hsl.l);
        }
        break;
      case "triadic":
        const triadicHue = hsl.h + i * 120;
        newColor = hslToHex(triadicHue % 360, hsl.s, hsl.l);
        break;
      default:
        newColor = baseColor;
    }
    palette.push(newColor);
  }
  return palette;
}

// lib/template-utils/math.ts
var math_exports = {};
__export(math_exports, {
  clamp: () => clamp,
  degreesToRadians: () => degreesToRadians,
  distance: () => distance,
  interpolate: () => interpolate,
  lerp: () => lerp,
  map: () => map,
  mapRange: () => mapRange,
  noise: () => noise,
  polarToCartesian: () => polarToCartesian,
  radiansToDegrees: () => radiansToDegrees,
  randomInRange: () => randomInRange,
  seededRandom: () => seededRandom,
  smoothstep: () => smoothstep
});
function lerp(start, end, t) {
  return start + (end - start) * t;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
function mapRange(value, fromRange, toRange) {
  return map(value, fromRange[0], fromRange[1], toRange[0], toRange[1]);
}
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = degreesToRadians(angleInDegrees);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
function randomInRange(min, max, seed) {
  if (seed !== void 0) {
    const rng = seededRandom(seed);
    return min + rng() * (max - min);
  }
  return min + Math.random() * (max - min);
}
function seededRandom(seed) {
  let value = seed;
  return function() {
    value = value * 16807 % 2147483647;
    return (value - 1) / 2147483646;
  };
}
function noise(x, y = 0, z = 0) {
  const p = new Array(512);
  const permutation = [
    151,
    160,
    137,
    91,
    90,
    15,
    131,
    13,
    201,
    95,
    96,
    53,
    194,
    233,
    7,
    225,
    140,
    36,
    103,
    30,
    69,
    142,
    8,
    99,
    37,
    240,
    21,
    10,
    23,
    190,
    6,
    148,
    247,
    120,
    234,
    75,
    0,
    26,
    197,
    62,
    94,
    252,
    219,
    203,
    117,
    35,
    11,
    32,
    57,
    177,
    33,
    88,
    237,
    149,
    56,
    87,
    174,
    20,
    125,
    136,
    171,
    168,
    68,
    175,
    74,
    165,
    71,
    134,
    139,
    48,
    27,
    166,
    77,
    146,
    158,
    231,
    83,
    111,
    229,
    122,
    60,
    211,
    133,
    230,
    220,
    105,
    92,
    41,
    55,
    46,
    245,
    40,
    244,
    102,
    143,
    54,
    65,
    25,
    63,
    161,
    1,
    216,
    80,
    73,
    209,
    76,
    132,
    187,
    208,
    89,
    18,
    169,
    200,
    196,
    135,
    130,
    116,
    188,
    159,
    86,
    164,
    100,
    109,
    198,
    173,
    186,
    3,
    64,
    52,
    217,
    226,
    250,
    124,
    123,
    5,
    202,
    38,
    147,
    118,
    126,
    255,
    82,
    85,
    212,
    207,
    206,
    59,
    227,
    47,
    16,
    58,
    17,
    182,
    189,
    28,
    42,
    223,
    183,
    170,
    213,
    119,
    248,
    152,
    2,
    44,
    154,
    163,
    70,
    221,
    153,
    101,
    155,
    167,
    43,
    172,
    9,
    129,
    22,
    39,
    253,
    19,
    98,
    108,
    110,
    79,
    113,
    224,
    232,
    178,
    185,
    112,
    104,
    218,
    246,
    97,
    228,
    251,
    34,
    242,
    193,
    238,
    210,
    144,
    12,
    191,
    179,
    162,
    241,
    81,
    51,
    145,
    235,
    249,
    14,
    239,
    107,
    49,
    192,
    214,
    31,
    181,
    199,
    106,
    157,
    184,
    84,
    204,
    176,
    115,
    121,
    50,
    45,
    127,
    4,
    150,
    254,
    138,
    236,
    205,
    93,
    222,
    114,
    67,
    29,
    24,
    72,
    243,
    141,
    128,
    195,
    78,
    66,
    215,
    61,
    156,
    180
  ];
  for (let i = 0; i < 256; i++) {
    p[256 + i] = p[i] = permutation[i];
  }
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (hash, x2, y2, z2) => {
    const h = hash & 15;
    const u = h < 8 ? x2 : y2;
    const v = h < 4 ? y2 : h === 12 || h === 14 ? x2 : z2;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;
  return lerp(
    lerp(
      lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
      lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  );
}
function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
function interpolate(values, t, type = "linear") {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  const scaledT = t * (values.length - 1);
  const index = Math.floor(scaledT);
  const remainder = scaledT - index;
  if (index >= values.length - 1) return values[values.length - 1];
  const v1 = values[index];
  const v2 = values[index + 1];
  switch (type) {
    case "linear":
      return lerp(v1, v2, remainder);
    case "smooth":
      return lerp(v1, v2, smoothstep(0, 1, remainder));
    case "cubic":
      if (index === 0 || index >= values.length - 2) {
        return lerp(v1, v2, remainder);
      }
      const v0 = values[index - 1];
      const v3 = values[index + 2];
      const t2 = remainder * remainder;
      const t3 = t2 * remainder;
      return 0.5 * (2 * v1 + (-v0 + v2) * remainder + (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 + (-v0 + 3 * v1 - 3 * v2 + v3) * t3);
    default:
      return lerp(v1, v2, remainder);
  }
}

// lib/template-utils/animation.ts
var animation_exports = {};
__export(animation_exports, {
  bounce: () => bounce,
  createAnimationLoop: () => createAnimationLoop,
  cubicBezier: () => cubicBezier,
  easeIn: () => easeIn,
  easeInOut: () => easeInOut,
  easeOut: () => easeOut,
  elastic: () => elastic,
  linear: () => linear,
  spring: () => spring,
  stagger: () => stagger
});
function linear(t) {
  return t;
}
function easeIn(t, power = 2) {
  return Math.pow(t, power);
}
function easeOut(t, power = 2) {
  return 1 - Math.pow(1 - t, power);
}
function easeInOut(t, power = 2) {
  return t < 0.5 ? Math.pow(t * 2, power) / 2 : 1 - Math.pow((1 - t) * 2, power) / 2;
}
function elastic(t, amplitude = 1, period = 0.3) {
  if (t === 0 || t === 1) return t;
  const s = period / 4;
  return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / period) + 1;
}
function bounce(t) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    t -= 1.5 / 2.75;
    return 7.5625 * t * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    t -= 2.25 / 2.75;
    return 7.5625 * t * t + 0.9375;
  } else {
    t -= 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }
}
function spring(t, tension = 500, friction = 20) {
  const mass = 1;
  const damping = friction;
  const stiffness = tension;
  const velocity = 0;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  let progress;
  if (zeta < 1) {
    const envelope = Math.exp(-zeta * omega * t);
    progress = 1 - envelope * (Math.cos(omega * Math.sqrt(1 - zeta * zeta) * t) + zeta / Math.sqrt(1 - zeta * zeta) * Math.sin(omega * Math.sqrt(1 - zeta * zeta) * t));
  } else {
    const envelope = Math.exp(-omega * t);
    progress = 1 - envelope;
  }
  return progress;
}
function cubicBezier(x1, y1, x2, y2) {
  return function(t) {
    if (t === 0 || t === 1) return t;
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sampleCurveX = (t2) => ((ax * t2 + bx) * t2 + cx) * t2;
    const sampleCurveY = (t2) => ((ay * t2 + by) * t2 + cy) * t2;
    const sampleCurveDerivativeX = (t2) => (3 * ax * t2 + 2 * bx) * t2 + cx;
    let x = t;
    for (let i = 0; i < 8; i++) {
      const cx2 = sampleCurveX(x) - t;
      if (Math.abs(cx2) < 1e-3) break;
      const dx = sampleCurveDerivativeX(x);
      if (Math.abs(dx) < 1e-6) break;
      x = x - cx2 / dx;
    }
    return sampleCurveY(x);
  };
}
function stagger(count, delay, index) {
  return index * delay;
}
function createAnimationLoop(duration, callback, easing = linear) {
  let startTime = null;
  let animationId = null;
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    callback(easedProgress);
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    }
  };
  return {
    start: () => {
      startTime = null;
      animationId = requestAnimationFrame(animate);
    },
    stop: () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
  };
}

// lib/template-utils/patterns.ts
var patterns_exports = {};
__export(patterns_exports, {
  createWavePattern: () => createWavePattern,
  generateFractal: () => generateFractal,
  generateMandelbrot: () => generateMandelbrot,
  generateVoronoi: () => generateVoronoi,
  radialPattern: () => radialPattern
});
function createWavePattern(width, height, frequency, amplitude, phase = 0, waveType = "sine") {
  const points = [];
  for (let x = 0; x < width; x++) {
    let y;
    const normalizedX = x / width * frequency + phase;
    switch (waveType) {
      case "sine":
        y = Math.sin(normalizedX * Math.PI * 2) * amplitude;
        break;
      case "square":
        y = Math.sign(Math.sin(normalizedX * Math.PI * 2)) * amplitude;
        break;
      case "sawtooth":
        y = (normalizedX % 1 * 2 - 1) * amplitude;
        break;
      case "triangle":
        const t = normalizedX % 1;
        y = (t < 0.5 ? t * 4 - 1 : 3 - t * 4) * amplitude;
        break;
      default:
        y = Math.sin(normalizedX * Math.PI * 2) * amplitude;
    }
    points.push({ x, y: height / 2 + y });
  }
  return points;
}
function radialPattern(centerX, centerY, radius, segments, rotation = 0) {
  const points = [];
  const angleStep = Math.PI * 2 / segments;
  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep + rotation;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y, angle });
  }
  return points;
}
function generateVoronoi(width, height, numPoints, seed = 0) {
  const rng = seededRandom(seed);
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: rng() * width,
      y: rng() * height,
      color: `hsl(${rng() * 360}, 70%, 50%)`
    });
  }
  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = Infinity;
      let closestPoint = null;
      for (const point of points) {
        const dist = distance(x, y, point.x, point.y);
        if (dist < minDist) {
          minDist = dist;
          closestPoint = point;
        }
      }
      cells.push({ x, y, point: closestPoint, distance: minDist });
    }
  }
  return { points, cells };
}
function generateFractal(ctx, x, y, size, depth, maxDepth, type = "tree", angle = Math.PI / 4) {
  if (depth >= maxDepth) return;
  switch (type) {
    case "tree":
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - size);
      ctx.stroke();
      const newSize = size * 0.7;
      generateFractal(ctx, x, y - size, newSize, depth + 1, maxDepth, type, angle);
      ctx.save();
      ctx.translate(x, y - size);
      ctx.rotate(angle);
      generateFractal(ctx, 0, 0, newSize, depth + 1, maxDepth, type, angle);
      ctx.restore();
      ctx.save();
      ctx.translate(x, y - size);
      ctx.rotate(-angle);
      generateFractal(ctx, 0, 0, newSize, depth + 1, maxDepth, type, angle);
      ctx.restore();
      break;
    case "sierpinski":
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y - size * Math.sqrt(3) / 2);
        ctx.closePath();
        ctx.fill();
      } else {
        const half = size / 2;
        generateFractal(ctx, x, y, half, depth - 1, maxDepth, type);
        generateFractal(ctx, x + half, y, half, depth - 1, maxDepth, type);
        generateFractal(ctx, x + half / 2, y - half * Math.sqrt(3) / 2, half, depth - 1, maxDepth, type);
      }
      break;
    case "koch":
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.stroke();
      } else {
        const third = size / 3;
        generateFractal(ctx, x, y, third, depth - 1, maxDepth, type);
        const x1 = x + third;
        const y1 = y;
        const x2 = x + third * 1.5;
        const y2 = y - third * Math.sqrt(3) / 2;
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(-Math.PI / 3);
        generateFractal(ctx, 0, 0, third, depth - 1, maxDepth, type);
        ctx.restore();
        ctx.save();
        ctx.translate(x2, y2);
        ctx.rotate(Math.PI / 3);
        generateFractal(ctx, 0, 0, third, depth - 1, maxDepth, type);
        ctx.restore();
        generateFractal(ctx, x + 2 * third, y, third, depth - 1, maxDepth, type);
      }
      break;
  }
}
function generateMandelbrot(width, height, zoom = 1, offsetX = 0, offsetY = 0, maxIterations = 100) {
  const pixels = [];
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x0 = (px - width / 2) / (0.5 * zoom * width) + offsetX;
      const y0 = (py - height / 2) / (0.5 * zoom * height) + offsetY;
      let x = 0;
      let y = 0;
      let iteration = 0;
      while (x * x + y * y <= 4 && iteration < maxIterations) {
        const xtemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xtemp;
        iteration++;
      }
      const color = iteration === maxIterations ? 0 : iteration / maxIterations * 255;
      pixels.push({ x: px, y: py, value: color, iteration });
    }
  }
  return pixels;
}

// lib/template-utils/index.ts
var flattenParameters = (params) => {
  return {
    ...params,
    ...params?.core || {},
    ...params?.style || {},
    ...params?.custom || {},
    ...params?.content || {}
  };
};

// Import reference for compatibility layer types
const hexToHslArray = (hex) => {
  const hsl = hexToHsl(hex);
  return [hsl.h, hsl.s, hsl.l];
};

// Compatibility functions for TypeScript template interface
function adjustColor(color, lightness) {
  // Simple hex to RGB conversion - exact match to TypeScript version
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Apply the same lightness adjustment logic as original TypeScript
  const factor = lightness > 0 ? lightness : 0;
  const newR = Math.min(255, r + (255 - r) * factor);
  const newG = Math.min(255, g + (255 - g) * factor);
  const newB = Math.min(255, b + (255 - b) * factor);
  
  // Convert back to hex
  const toHex = (n) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function applyUniversalBackground(ctx, width, height, params) {
  // Apply background color
  ctx.fillStyle = params.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  // Handle background opacity if specified
  if (params.backgroundOpacity !== undefined && params.backgroundOpacity < 1) {
    ctx.globalAlpha = params.backgroundOpacity;
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }
}

// lib/template-utils/index.ts
var utils = {
  canvas: canvas_exports,
  color: color_exports,
  math: math_exports,
  animation: animation_exports,
  patterns: patterns_exports,
  flattenParameters,
  // Add compatibility functions at root level
  adjustColor: adjustColor,
  hexToHsl: hexToHslArray,
  applyUniversalBackground: applyUniversalBackground
};
var templateUtils = utils;

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = templateUtils;
} else if (typeof window !== 'undefined') {
  window.templateUtils = templateUtils;
}
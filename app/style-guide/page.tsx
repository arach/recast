'use client';

import React, { useState } from 'react';
import { Check, Copy, Download, Home, Search, ZoomIn, ZoomOut } from 'lucide-react';

export default function StyleGuidePage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);

  const copyToClipboard = async (text: string, colorName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(colorName);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const colors = {
    backgrounds: [
      { name: 'Primary Background', value: 'bg-gradient-to-br from-slate-950 via-gray-950 to-black', css: 'background: linear-gradient(135deg, #020617 0%, #030712 50%, #000000 100%)' },
      { name: 'Card Background', value: 'bg-white/[0.015]', css: 'background: rgba(255, 255, 255, 0.015)' },
      { name: 'Card Hover', value: 'bg-white/[0.025]', css: 'background: rgba(255, 255, 255, 0.025)' },
      { name: 'Terminal Background', value: 'bg-black/20', css: 'background: rgba(0, 0, 0, 0.2)' },
      { name: 'Terminal Header', value: 'bg-white/[0.005]', css: 'background: rgba(255, 255, 255, 0.005)' },
      { name: 'Debug Background', value: 'bg-black/40', css: 'background: rgba(0, 0, 0, 0.4)' },
    ],
    borders: [
      { name: 'Subtle Border', value: 'border-white/[0.04]', css: 'border-color: rgba(255, 255, 255, 0.04)' },
      { name: 'Light Border', value: 'border-white/[0.08]', css: 'border-color: rgba(255, 255, 255, 0.08)' },
      { name: 'Focus Border', value: 'border-white/20', css: 'border-color: rgba(255, 255, 255, 0.2)' },
      { name: 'Terminal Border', value: 'border-white/[0.03]', css: 'border-color: rgba(255, 255, 255, 0.03)' },
    ],
    text: [
      { name: 'Primary Text', value: 'text-white', css: 'color: #ffffff' },
      { name: 'Secondary Text', value: 'text-white/80', css: 'color: rgba(255, 255, 255, 0.8)' },
      { name: 'Muted Text', value: 'text-white/60', css: 'color: rgba(255, 255, 255, 0.6)' },
      { name: 'Subtle Text', value: 'text-white/40', css: 'color: rgba(255, 255, 255, 0.4)' },
      { name: 'Debug Text', value: 'text-white/30', css: 'color: rgba(255, 255, 255, 0.3)' },
    ],
    buttons: [
      { name: 'Primary Button', value: 'bg-blue-500/10 border-blue-400/20 text-blue-300', css: 'background: rgba(59, 130, 246, 0.1); border-color: rgba(96, 165, 250, 0.2); color: #93c5fd' },
      { name: 'Success Button', value: 'bg-green-500/10 border-green-400/20 text-green-300', css: 'background: rgba(34, 197, 94, 0.1); border-color: rgba(74, 222, 128, 0.2); color: #86efac' },
      { name: 'Success Active', value: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300', css: 'background: rgba(16, 185, 129, 0.2); border-color: rgba(52, 211, 153, 0.4); color: #6ee7b7' },
      { name: 'Selected State', value: 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/40', css: 'background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3)); border-color: rgba(96, 165, 250, 0.4)' },
      { name: 'Neutral Button', value: 'bg-white/[0.015] border-white/[0.04] text-white/80', css: 'background: rgba(255, 255, 255, 0.015); border-color: rgba(255, 255, 255, 0.04); color: rgba(255, 255, 255, 0.8)' },
    ],
    accents: [
      { name: 'Blue Focus', value: 'ring-blue-400/30', css: 'box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3)' },
      { name: 'Green Focus', value: 'ring-green-400/40', css: 'box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.4)' },
      { name: 'Loading Spinner', value: 'border-blue-400 border-t-transparent', css: 'border-color: #60a5fa; border-top-color: transparent' },
    ]
  };

  const typography = {
    headings: [
      { name: 'Page Title', classes: 'text-2xl font-bold text-white mb-2', sample: 'ReFlow Style Guide' },
      { name: 'Section Title', classes: 'text-xl font-bold text-white/80 mb-4', sample: 'Section Title' },
      { name: 'Card Title', classes: 'font-bold text-white/80 text-base mb-3', sample: 'Card Title' },
      { name: 'Subtitle', classes: 'text-white/60 font-semibold text-sm', sample: 'Subtitle text with description' },
    ],
    body: [
      { name: 'Body Text', classes: 'text-white/80 text-sm', sample: 'Standard body text for descriptions and content' },
      { name: 'Small Text', classes: 'text-white/60 text-xs', sample: 'Small text for labels and captions' },
      { name: 'Tiny Text', classes: 'text-white/40 text-[10px]', sample: 'Tiny text for debug and metadata' },
    ],
    monospace: [
      { name: 'Code Text', classes: 'font-mono text-[11px] text-white', sample: 'const value = "monospace"' },
      { name: 'Debug Text', classes: 'font-mono text-[10px] text-white/40', sample: '// debug logs' },
      { name: 'Terminal Text', classes: 'font-mono text-xs text-white/80', sample: '$ pnpm dev --port 3003' },
      { name: 'Keyboard Key', classes: 'px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono', sample: 'Ctrl+C' },
    ],
    weights: [
      { name: 'Light', classes: 'font-light', sample: 'Font weight light' },
      { name: 'Regular', classes: 'font-normal', sample: 'Font weight normal' },
      { name: 'Medium', classes: 'font-medium', sample: 'Font weight medium' },
      { name: 'Semibold', classes: 'font-semibold', sample: 'Font weight semibold' },
      { name: 'Bold', classes: 'font-bold', sample: 'Font weight bold' },
      { name: 'Extra Light', classes: 'font-extralight', sample: 'Font weight extralight' },
    ]
  };

  const components = {
    buttons: [
      {
        name: 'Primary Button',
        component: (
          <button className="px-3 py-1.5 bg-blue-500/10 border border-blue-400/20 text-blue-300 font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-400/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-400/40 transition-all duration-200">
            Primary Action
          </button>
        )
      },
      {
        name: 'Success Button',
        component: (
          <button className="px-3 py-1.5 bg-green-500/10 border border-green-400/20 text-green-300 font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm hover:bg-green-500/20 hover:ring-1 hover:ring-green-400/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-green-400/40 transition-all duration-200">
            Success Action
          </button>
        )
      },
      {
        name: 'Neutral Button',
        component: (
          <button className="px-3 py-1.5 bg-white/[0.015] border border-white/[0.04] text-white/80 font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm hover:bg-white/[0.03] hover:ring-1 hover:ring-white/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-400/30 transition-all duration-200">
            Neutral Action
          </button>
        )
      },
      {
        name: 'Success State',
        component: (
          <button className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm ring-2 ring-emerald-400/50 transition-all duration-200">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              Success!
            </span>
          </button>
        )
      },
      {
        name: 'Loading State',
        component: (
          <button className="px-3 py-1.5 bg-blue-500/10 border border-blue-400/20 text-blue-300 font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm opacity-75 cursor-not-allowed transition-all duration-200">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </span>
          </button>
        )
      },
      {
        name: 'Template Selection',
        component: (
          <button className="px-3 py-1 rounded text-xs font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-extralight border border-blue-400/40 shadow-md transform scale-[1.02]">
            Selected Template
          </button>
        )
      }
    ],
    cards: [
      {
        name: 'Primary Card',
        component: (
          <div className="p-4 bg-white/[0.015] border border-white/[0.04] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="font-bold text-white/80 text-base mb-2">Card Title</h3>
            <p className="text-white/60 font-semibold text-sm">Card description with secondary text</p>
          </div>
        )
      },
      {
        name: 'Terminal Card',
        component: (
          <div className="bg-black/20 border border-white/[0.04] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-white/[0.005] border-b border-white/[0.03] px-4 py-2">
              <h3 className="font-mono text-xs text-white/60">Terminal Header</h3>
            </div>
            <div className="p-4">
              <p className="font-mono text-xs text-white/80">$ terminal content</p>
            </div>
          </div>
        )
      }
    ],
    inputs: [
      {
        name: 'Keyboard Key',
        component: (
          <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">Ctrl+C</kbd>
        )
      }
    ],
    feedback: [
      {
        name: 'Loading Spinner',
        component: (
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        )
      },
      {
        name: 'Success Indicator',
        component: (
          <div className="inline-flex items-center gap-1 text-green-400">
            <Check className="w-3 h-3" />
            <span className="text-xs">Success!</span>
          </div>
        )
      },
      {
        name: 'Pulse Animation',
        component: (
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        )
      }
    ]
  };

  const ColorSwatch = ({ color }: { color: any }) => (
    <div 
      className="group cursor-pointer"
      onClick={() => copyToClipboard(color.css, color.name)}
    >
      <div className={`w-full h-16 rounded-lg mb-2 ${color.value} border border-white/10 hover:border-white/20 transition-all duration-200 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {copiedColor === color.name && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Copied!
            </div>
          </div>
        )}
      </div>
      <div className="text-white/80 text-xs font-medium mb-1">{color.name}</div>
      <div className="text-white/40 text-[10px] font-mono">{color.value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">ReFlow Style Guide</h1>
          <p className="text-white/60 font-semibold text-sm">
            Complete design system and component library for the ReFlow application
          </p>
        </div>

        {/* Colors Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white/80 mb-6">Color Palette</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(colors).map(([category, colorList]) => (
              <div key={category} className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-white/80 text-base mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {colorList.map((color, index) => (
                    <ColorSwatch key={index} color={color} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white/80 mb-6">Typography</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(typography).map(([category, typeList]) => (
              <div key={category} className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-white/80 text-base mb-4 capitalize">{category}</h3>
                <div className="space-y-4">
                  {typeList.map((type, index) => (
                    <div key={index} className="border-b border-white/[0.04] pb-3 last:border-b-0">
                      <div className="text-white/40 text-xs font-mono mb-2">{type.name}</div>
                      <div className={type.classes}>{type.sample}</div>
                      <div className="text-white/30 text-[10px] font-mono mt-1">{type.classes}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Components Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white/80 mb-6">Components</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(components).map(([category, componentList]) => (
              <div key={category} className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-white/80 text-base mb-4 capitalize">{category}</h3>
                <div className="space-y-4">
                  {componentList.map((comp, index) => (
                    <div key={index} className="border-b border-white/[0.04] pb-3 last:border-b-0">
                      <div className="text-white/40 text-xs font-mono mb-2">{comp.name}</div>
                      <div className="mb-3">{comp.component}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction States */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white/80 mb-6">Interaction States</h2>
          
          <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div>
                <h3 className="font-bold text-white/80 text-sm mb-3">Hover Effects</h3>
                <div className="space-y-2 text-white/60 text-xs">
                  <div><code className="text-white/80">hover:scale-[1.02]</code> - Subtle scale up</div>
                  <div><code className="text-white/80">hover:shadow-xl</code> - Enhanced shadow</div>
                  <div><code className="text-white/80">hover:bg-white/[0.03]</code> - Background lighten</div>
                  <div><code className="text-white/80">hover:ring-1</code> - Ring appearance</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-white/80 text-sm mb-3">Active States</h3>
                <div className="space-y-2 text-white/60 text-xs">
                  <div><code className="text-white/80">active:scale-[0.98]</code> - Press feedback</div>
                  <div><code className="text-white/80">ring-2 ring-blue-400/50</code> - Success ring</div>
                  <div><code className="text-white/80">transform scale-[1.02]</code> - Selected state</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-white/80 text-sm mb-3">Animations</h3>
                <div className="space-y-2 text-white/60 text-xs">
                  <div><code className="text-white/80">transition-all duration-200</code> - Fast transitions</div>
                  <div><code className="text-white/80">animate-spin</code> - Loading spinners</div>
                  <div><code className="text-white/80">animate-pulse</code> - Attention states</div>
                  <div><code className="text-white/80">animate-in fade-in</code> - Entrance animations</div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Design Principles */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white/80 mb-6">Design Principles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-white/80 text-base mb-4">Visual Hierarchy</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• Primary actions use blue accent colors</li>
                <li>• Success states use green/emerald variants</li>
                <li>• Text opacity creates natural hierarchy (100% → 80% → 60% → 40%)</li>
                <li>• Subtle shadows and borders define depth</li>
              </ul>
            </div>
            
            <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-white/80 text-base mb-4">Interaction Design</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• Micro-interactions provide immediate feedback</li>
                <li>• Hover states include scale and shadow changes</li>
                <li>• Active states use subtle scale-down for press feedback</li>
                <li>• Success states include checkmarks and color changes</li>
              </ul>
            </div>
            
            <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-white/80 text-base mb-4">Spacing & Layout</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• Consistent 8px grid system</li>
                <li>• Generous padding for touch targets</li>
                <li>• Rounded corners (4px, 8px, 12px) for modern feel</li>
                <li>• Backdrop blur for glass-morphism effects</li>
              </ul>
            </div>
            
            <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-white/80 text-base mb-4">Accessibility</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• Focus rings for keyboard navigation</li>
                <li>• High contrast text (minimum 60% opacity)</li>
                <li>• Generous click targets (minimum 44px)</li>
                <li>• Semantic HTML structure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.04]">
          <div className="text-center text-white/40 text-xs">
            <p>ReFlow Design System • Built with Tailwind CSS • Click any color to copy CSS</p>
          </div>
        </div>

      </div>
    </div>
  );
}
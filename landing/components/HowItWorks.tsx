'use client'

import { motion } from 'framer-motion'
import { FileCode2, Sliders, Download, Repeat } from 'lucide-react'

const steps = [
  {
    icon: FileCode2,
    title: 'Choose Your Base',
    description: 'Start with a template or create from scratch. Each template is a mathematical foundation for infinite variations.',
    code: `const parameters = {
  frequency: { default: 3, range: [0.1, 20, 0.1] },
  amplitude: { default: 50, range: [0, 100, 1] },
  colorMode: { default: 'spectrum', options: ['spectrum', 'theme'] }
}`
  },
  {
    icon: Sliders,
    title: 'Fine-Tune Parameters',
    description: 'Adjust every aspect with real-time preview. Colors, animations, shapes - everything is customizable.',
    code: `// Universal styling automatically applied
utils.applyUniversalBackground(ctx, width, height, params);
const fillColor = params.fillColor || '#3b82f6';
const strokeColor = params.strokeColor || '#1e40af';`
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Generate production-ready assets in any format. SVG for web, PNG for print, GIF for social.',
    code: `// Export configurations
export: {
  formats: ['svg', 'png', 'gif', 'mp4'],
  sizes: ['1x', '2x', '3x', 'custom'],
  variations: ['light', 'dark', 'animated']
}`
  },
  {
    icon: Repeat,
    title: 'Stay Dynamic',
    description: 'Your brand evolves with context. Same identity, infinite expressions.',
    code: `// Reproducible with seeds
const logo = generateLogo({
  template: 'wave-bars',
  seed: 'my-brand-2024',
  context: 'social-media'
})`
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How ReFlow Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From concept to production in minutes, not weeks. Here's how we transform your brand into living code.
          </p>
        </motion.div>
        
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-reflow-blue to-reflow-purple mb-4">
                  <step.icon size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {step.description}
                </p>
                <div className="inline-flex items-center text-reflow-blue font-medium">
                  Step {index + 1} of {steps.length}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="text-gray-300">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
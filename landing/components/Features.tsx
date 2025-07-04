'use client'

import { motion } from 'framer-motion'
import { 
  Zap, 
  Layers, 
  Palette, 
  Code2, 
  Sparkles, 
  Settings,
  Globe,
  Shield,
  Cpu
} from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Identity as Code',
    description: 'Define your brand programmatically. No more static files - your identity lives and breathes.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Layers,
    title: 'Layer Composition',
    description: 'Build complex designs through multiple wave layers, each with unique properties and animations.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Palette,
    title: 'Universal Styling',
    description: 'Consistent fill, stroke, and background controls across all templates. Change once, update everywhere.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: '60fps Animation',
    description: 'Smooth, performant animations powered by our hybrid Canvas/SVG rendering architecture.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Sparkles,
    title: '32+ Templates',
    description: 'From geometric patterns to organic flows, start with battle-tested templates or create your own.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Settings,
    title: 'Fine Control',
    description: 'Adjust every parameter with precision. Real-time preview shows changes instantly.',
    gradient: 'from-pink-500 to-rose-500'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Beyond Static Design
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ReCast reimagines brand identity for the digital age. Every aspect is dynamic, responsive, and alive.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                <feature.icon size={24} className="text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-recast-blue to-recast-purple rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Globe size={40} className="mb-4" />
              <h4 className="text-2xl font-bold mb-2">Export Anywhere</h4>
              <p className="opacity-90">SVG, PNG, GIF, MP4 - your brand ready for any platform</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield size={40} className="mb-4" />
              <h4 className="text-2xl font-bold mb-2">Brand Consistency</h4>
              <p className="opacity-90">Seeded randomness ensures reproducible designs</p>
            </div>
            <div className="flex flex-col items-center">
              <Cpu size={40} className="mb-4" />
              <h4 className="text-2xl font-bold mb-2">API Ready</h4>
              <p className="opacity-90">Integrate dynamic branding into your applications</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
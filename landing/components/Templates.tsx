'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'organic', name: 'Organic' },
  { id: 'tech', name: 'Tech & Network' },
  { id: 'brand', name: 'Brand Systems' },
  { id: 'effects', name: 'Effects' },
]

const templates = [
  {
    id: 'wave-bars',
    name: '🌊 Wave Bars',
    category: 'effects',
    description: 'Dynamic audio visualizer with spectrum colors',
    gradient: 'from-blue-400 via-purple-500 to-pink-500'
  },
  {
    id: 'crystal-lattice',
    name: '💎 Crystal Lattice',
    category: 'geometric',
    description: 'Geometric crystal structures with light refraction',
    gradient: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'neon-glow',
    name: '💫 Neon Glow',
    category: 'effects',
    description: 'Cyberpunk-inspired glowing neon effects',
    gradient: 'from-pink-500 to-purple-600'
  },
  {
    id: 'organic-bark',
    name: '🌿 Organic Bark',
    category: 'organic',
    description: 'Natural, flowing organic textures',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'network-constellation',
    name: '🌐 Network Constellation',
    category: 'tech',
    description: 'Connected network visualization',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'golden-circle',
    name: '⭕ Golden Circle',
    category: 'geometric',
    description: 'Perfect circles with golden ratio proportions',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'liquid-flow',
    name: '💧 Liquid Flow',
    category: 'organic',
    description: 'Fluid motion and organic movement',
    gradient: 'from-blue-400 to-teal-500'
  },
  {
    id: 'apex-vercel',
    name: '▲ Apex',
    category: 'brand',
    description: 'Modern triangular brand system',
    gradient: 'from-gray-900 to-gray-700'
  },
]

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  return (
    <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Start with a Template
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Choose from 32+ professionally designed templates, each with endless customization possibilities.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === cat.id
                    ? 'bg-reflow-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-square mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-80`} />
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {template.name.split(' ')[0]}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <h3 className="font-semibold mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            View All Templates
          </button>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import AnimatedLogo from './AnimatedLogo'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-reflow-blue/10 text-reflow-blue text-sm mb-6">
              <Sparkles size={16} className="mr-2" />
              Introducing the future of brand identity
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Your Brand,{' '}
              <span className="gradient-text">Living Code</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Transform static logos into dynamic identities. ReFlow generates adaptive brand systems that respond to context while maintaining consistency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-reflow-blue text-white rounded-lg hover:bg-blue-600 transition group">
                Start Creating
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-reflow-blue transition">
                View Templates
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold gradient-text">32+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Variations</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">60fps</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Animation</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <AnimatedLogo />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-reflow-blue/20 via-reflow-purple/20 to-reflow-pink/20 blur-3xl animate-pulse-slow" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
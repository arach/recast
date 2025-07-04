'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-recast-dark/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold gradient-text">ReCast</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-recast-blue transition">Features</a>
            <a href="#templates" className="text-gray-700 dark:text-gray-300 hover:text-recast-blue transition">Templates</a>
            <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-recast-blue transition">How it Works</a>
            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-recast-blue transition">Pricing</a>
            <button className="bg-recast-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-recast-dark border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#features" className="block px-3 py-2 text-gray-700 dark:text-gray-300">Features</a>
            <a href="#templates" className="block px-3 py-2 text-gray-700 dark:text-gray-300">Templates</a>
            <a href="#how-it-works" className="block px-3 py-2 text-gray-700 dark:text-gray-300">How it Works</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-700 dark:text-gray-300">Pricing</a>
            <button className="w-full text-left bg-recast-blue text-white px-3 py-2 rounded-lg">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
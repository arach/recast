'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Living Brands,<br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Not Static Logos
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Transform your brand identity into dynamic, programmatic art that adapts and evolves while maintaining perfect consistency.
            </p>
            
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 max-w-5xl mx-auto">
              <img 
                src="/images/reflow-wave-bars-hero.png" 
                alt="ReFlow Dynamic Wave Visualization"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Start Creating
              </Link>
              <Link 
                href="#features"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Features That Transform</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🌊"
              title="Wave-Based Generation"
              description="Mathematical wave functions create unique, flowing designs that capture your brand's essence."
            />
            <FeatureCard
              icon="🔑"
              title="Seed-Based Identity"
              description="Your brand's unique seed ensures perfect reproducibility across all touchpoints."
            />
            <FeatureCard
              icon="🎨"
              title="Real-Time Customization"
              description="Fine-tune frequency, amplitude, complexity, and more with instant visual feedback."
            />
            <FeatureCard
              icon="💻"
              title="Live Code Editor"
              description="View and customize the generation code in real-time. Your brand as code."
            />
            <FeatureCard
              icon="📦"
              title="Multiple Export Formats"
              description="Download as PNG, SVG (coming soon), or embed directly in your applications."
            />
            <FeatureCard
              icon="🔗"
              title="Shareable Links"
              description="Share your exact logo configuration with a URL. Perfect for team collaboration."
            />
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Template Gallery</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TemplateCard
              emoji="🌊"
              name="Wave Bars"
              description="Dynamic wave patterns with customizable bar styles"
              featured
            />
            <TemplateCard
              emoji="🌐"
              name="Network Constellation"
              description="Connected nodes with dynamic particles"
            />
            <TemplateCard
              emoji="💧"
              name="Liquid Flow"
              description="Fluid dynamics simulation with color gradients"
            />
            <TemplateCard
              emoji="⚛️"
              name="Quantum Field"
              description="Quantum mechanics visualization"
            />
            <TemplateCard
              emoji="✨"
              name="Neon Glow"
              description="Glowing neon effects with electric pulses"
            />
            <TemplateCard
              emoji="💎"
              name="Prism"
              description="3D isometric geometric shapes"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <Step number="1" title="Choose Your Template">
                Select from our growing library of mathematical visualizations
              </Step>
              <Step number="2" title="Set Your Seed">
                Your unique identifier that makes the design yours
              </Step>
              <Step number="3" title="Customize Parameters">
                Fine-tune every aspect of your visual identity
              </Step>
              <Step number="4" title="Generate & Export">
                Download in multiple formats for every use case
              </Step>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Brand?
          </h2>
          <p className="text-xl text-purple-100 mb-12">
            Join the revolution in dynamic brand identity
          </p>
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Start Creating Now
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TemplateCard({ emoji, name, description, featured = false }: { 
  emoji: string; 
  name: string; 
  description: string;
  featured?: boolean;
}) {
  return (
    <div className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
      featured 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {featured && (
        <span className="inline-block mt-3 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
          Featured
        </span>
      )}
    </div>
  )
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
      </div>
    </div>
  )
}
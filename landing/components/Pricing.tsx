'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for exploring dynamic branding',
    features: [
      { text: '5 Active Projects', included: true },
      { text: 'All 32+ Templates', included: true },
      { text: 'PNG & SVG Export', included: true },
      { text: 'Basic Parameters', included: true },
      { text: 'Community Support', included: true },
      { text: 'Animation Export', included: false },
      { text: 'API Access', included: false },
      { text: 'Custom Templates', included: false },
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'For designers and creative teams',
    features: [
      { text: 'Unlimited Projects', included: true },
      { text: 'All 32+ Templates', included: true },
      { text: 'All Export Formats', included: true },
      { text: 'Advanced Parameters', included: true },
      { text: 'Priority Support', included: true },
      { text: 'GIF & MP4 Export', included: true },
      { text: 'Batch Export', included: true },
      { text: 'Custom Templates', included: false },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with unique needs',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Custom Templates', included: true },
      { text: 'API Integration', included: true },
      { text: 'White Label Option', included: true },
      { text: 'Dedicated Support', included: true },
      { text: 'On-Premise Deploy', included: true },
      { text: 'SLA Guarantee', included: true },
      { text: 'Training Sessions', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl ${
                plan.popular 
                  ? 'bg-gradient-to-b from-recast-blue/10 to-recast-purple/10 p-[2px]' 
                  : 'bg-gray-200 dark:bg-gray-800 p-[1px]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-recast-blue to-recast-purple text-white text-sm rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={20} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <X size={20} className="text-gray-300 dark:text-gray-700 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-400 dark:text-gray-600'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-lg font-medium transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-recast-blue to-recast-purple text-white hover:shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            All plans include automatic updates and new templates as they're released.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
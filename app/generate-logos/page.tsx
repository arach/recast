'use client'

import { useEffect, useRef } from 'react'
import { WaveGenerator } from '@/core/wave-generator'

const logoConfig = {
  mode: 'wavebars',
  params: {
    seed: 'recast-identity',
    frequency: 5,
    amplitude: 80,
    complexity: 0.6,
    chaos: 0.15,
    damping: 0.85,
    layers: 1,
    barCount: 80,
    barSpacing: 2,
  }
}

const sizes = [
  { size: 1024, name: 'logo-1024.png' },
  { size: 512, name: 'logo-512.png' },
  { size: 256, name: 'logo-256.png' },
  { size: 128, name: 'logo-128.png' },
  { size: 64, name: 'logo-64.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 16, name: 'favicon-16.png' },
]

export default function GenerateLogos() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateWaveBars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const params = logoConfig.params
    const generator = new WaveGenerator({
      amplitude: params.amplitude,
      frequency: params.frequency,
      phase: 0,
      complexity: params.complexity,
      chaos: params.chaos,
      damping: params.damping,
      layers: params.layers
    }, params.seed)

    // Generate the wave center line
    const waveOptions = {
      width,
      height,
      resolution: params.barCount,
      time: 0,
      seed: params.seed
    }

    const waveData = generator.generate(waveOptions)[0]

    // Generate bar heights variation
    const barGen = new WaveGenerator({
      amplitude: 40,
      frequency: params.frequency * 3,
      phase: 0,
      complexity: params.complexity * 1.5,
      chaos: params.chaos,
      damping: 1,
      layers: 1
    }, params.seed + '-bars')
    
    const barHeights = barGen.generate({
      ...waveOptions,
      time: 0
    })[0]

    const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount

    // Draw each bar
    for (let i = 0; i < params.barCount; i++) {
      const x = i * (barWidth + params.barSpacing)
      const waveCenterY = waveData[i].y
      const barHeight = Math.abs(barHeights[i].y - height / 2) + 20
      
      // Rainbow gradient
      const hue = (i / params.barCount) * 360
      const gradient = ctx.createLinearGradient(x, waveCenterY - barHeight/2, x, waveCenterY + barHeight/2)
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`)
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`)
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`)
      
      ctx.fillStyle = gradient
      
      // Draw rounded rectangles centered on wave
      const radius = barWidth / 3
      ctx.beginPath()
      ctx.roundRect(x, waveCenterY - barHeight/2, barWidth, barHeight, radius)
      ctx.fill()
      
      // Add dots
      if (barHeight > 25) {
        ctx.beginPath()
        ctx.arc(x + barWidth/2, waveCenterY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2)
        ctx.arc(x + barWidth/2, waveCenterY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const generateLogo = async (size: number, name: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    // Add subtle gradient background
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    )
    gradient.addColorStop(0, 'rgba(250, 250, 250, 1)')
    gradient.addColorStop(1, 'rgba(245, 245, 245, 1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    // Generate the wave bars
    generateWaveBars(ctx, size, size)

    // Convert to blob and download
    return new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve()
          return
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = name
        a.click()
        URL.revokeObjectURL(url)
        setTimeout(resolve, 100) // Small delay between downloads
      })
    })
  }

  const generateAllLogos = async () => {
    for (const { size, name } of sizes) {
      await generateLogo(size, name)
    }
    alert('All logos generated and downloaded!')
  }

  useEffect(() => {
    // Preview the main logo
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 600, 600)

    const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 300)
    gradient.addColorStop(0, 'rgba(250, 250, 250, 1)')
    gradient.addColorStop(1, 'rgba(245, 245, 245, 1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 600, 600)

    generateWaveBars(ctx, 600, 600)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Generate ReCast Logos</h1>
        <p className="text-gray-600 mb-8">
          This page generates the official ReCast logo at various sizes. Click the button below to download all sizes.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="border border-gray-200 rounded-lg mx-auto"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={generateAllLogos}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Download All Logo Sizes
          </button>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">Sizes included:</h3>
          <ul className="list-disc list-inside text-gray-600">
            {sizes.map(({ size, name }) => (
              <li key={name}>{name} - {size}x{size}px</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { WaveGenerator, WaveParameters, GenerationOptions } from '@/core/wave-generator'
import { visualizationTemplates } from './visualization-templates'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
  Download,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Palette,
  Save,
  GripVertical,
  Package,
  Settings,
  FolderOpen,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { SaveDialog } from '@/components/save-dialog'
import { SavedItemsDialog } from '@/components/saved-items-dialog'
import { SavedShape, SavedPreset } from '@/lib/storage'

interface Preset {
  name: string
  mode: 'wave' | 'bars' | 'wavebars'
  params: {
    seed: string
    frequency: number
    amplitude: number
    complexity: number
    chaos: number
    damping: number
    layers: number
    barCount?: number
    barSpacing?: number
  }
}

const colorPalette = ['#0070f3', '#7c3aed', '#dc2626', '#059669', '#d97706', '#be185d', '#4338ca', '#0891b2']

const presets: Preset[] = [
  {
    name: '🎯 ReCast Logo',
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
    },
  },
  {
    name: 'Gentle Wave',
    mode: 'wave',
    params: {
      seed: 'gentle-wave',
      frequency: 3,
      amplitude: 40,
      complexity: 0.3,
      chaos: 0.05,
      damping: 0.9,
      layers: 2,
    },
  },
  {
    name: 'Audio Spectrum',
    mode: 'bars',
    params: {
      seed: 'audio-spec',
      frequency: 2,
      amplitude: 60,
      complexity: 0.7,
      chaos: 0.2,
      damping: 0.8,
      layers: 1,
      barCount: 80,
      barSpacing: 2,
    },
  },
  {
    name: 'Wave Flow',
    mode: 'wavebars',
    params: {
      seed: 'wave-flow',
      frequency: 4,
      amplitude: 50,
      complexity: 0.5,
      chaos: 0.1,
      damping: 0.85,
      layers: 1,
      barCount: 60,
      barSpacing: 3,
    },
  },
]

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [seed, setSeed] = useState('recast-logo')
  const [frequency, setFrequency] = useState(4)
  const [amplitude, setAmplitude] = useState(50)
  const [complexity, setComplexity] = useState(0.5)
  const [chaos, setChaos] = useState(0.1)
  const [damping, setDamping] = useState(0.8)
  const [layers, setLayers] = useState(3)
  const [visualMode, setVisualMode] = useState<'wave' | 'bars' | 'wavebars' | 'custom'>('wave')
  const [barCount, setBarCount] = useState(60)
  const [barSpacing, setBarSpacing] = useState(2)
  const [animating, setAnimating] = useState(false)
  const [customCode, setCustomCode] = useState(visualizationTemplates.custom)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [color, setColor] = useState('#0070f3')
  const [controlsHeight, setControlsHeight] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'shape' | 'preset'>('preset')
  const [savedItemsOpen, setSavedItemsOpen] = useState(false)
  const [currentShapeId, setCurrentShapeId] = useState<string | undefined>()
  const [currentShapeName, setCurrentShapeName] = useState('Custom Shape')
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  const generateLogo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // If this is the ReCast logo preset, add a subtle background
    if (seed === 'recast-identity') {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      )
      gradient.addColorStop(0, 'rgba(250, 250, 250, 1)')
      gradient.addColorStop(1, 'rgba(245, 245, 245, 1)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Apply zoom
    ctx.save()
    ctx.scale(zoom, zoom)
    ctx.translate((canvas.width * (1 - zoom)) / (2 * zoom), (canvas.height * (1 - zoom)) / (2 * zoom))

    if (visualMode === 'custom' && customCode && customCode.trim()) {
      executeCustomCode(ctx, canvas.width, canvas.height)
    } else if (visualMode === 'bars') {
      generateAudioBars(ctx, canvas.width, canvas.height)
    } else if (visualMode === 'wavebars') {
      generateWaveBars(ctx, canvas.width, canvas.height)
    } else {
      generateWaveLines(ctx, canvas.width, canvas.height)
    }

    ctx.restore()
  }, [visualMode, seed, frequency, amplitude, complexity, chaos, damping, layers, barCount, barSpacing, zoom, color, customCode])

  const generateWaveLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const params: WaveParameters = {
      amplitude,
      frequency,
      phase: 0,
      complexity,
      chaos,
      damping,
      layers
    }

    const options: GenerationOptions = {
      width,
      height,
      resolution: 200,
      time: timeRef.current,
      seed
    }

    const generator = new WaveGenerator(params, seed)
    const waveLayers = generator.generate(options)

    waveLayers.forEach((layer, layerIndex) => {
      ctx.beginPath()
      const hue = color.match(/hsl\((\d+)/)? Number.parseInt(color.match(/hsl\((\d+)/)?.[1] || '200') : 200
      ctx.strokeStyle = `hsla(${hue + layerIndex * 30}, 70%, 50%, ${0.8 - layerIndex * 0.2})`
      ctx.lineWidth = 3 - layerIndex * 0.5
      
      layer.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      
      ctx.stroke()
    })
  }

  const generateAudioBars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const params: WaveParameters = {
      amplitude: amplitude * 1.5,
      frequency,
      phase: 0,
      complexity,
      chaos: chaos * 0.3,
      damping: 0.9,
      layers: 1
    }

    const options: GenerationOptions = {
      width,
      height,
      resolution: barCount,
      time: timeRef.current,
      seed
    }

    const generator = new WaveGenerator(params, seed)
    const waveData = generator.generate(options)[0]

    const barWidth = (width - barSpacing * (barCount - 1)) / barCount
    const centerY = height / 2

    waveData.forEach((point, i) => {
      const barHeight = Math.abs(point.y - centerY) * 2
      const x = i * (barWidth + barSpacing)
      
      const hue = (i / barCount) * 360
      
      const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2)
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`)
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`)
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`)
      
      ctx.fillStyle = gradient
      
      const radius = barWidth / 3
      ctx.beginPath()
      ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius)
      ctx.fill()
      
      if (barHeight > 20) {
        ctx.beginPath()
        ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2)
        ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  const generateWaveBars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const waveParams: WaveParameters = {
      amplitude: amplitude * 0.8,
      frequency,
      phase: 0,
      complexity,
      chaos: 0,
      damping: 0.9,
      layers: 1
    }

    const waveOptions: GenerationOptions = {
      width,
      height,
      resolution: barCount,
      time: timeRef.current,
      seed
    }

    const generator = new WaveGenerator(waveParams, seed)
    const waveData = generator.generate(waveOptions)[0]

    const barParams: WaveParameters = {
      amplitude: 40,
      frequency: frequency * 3,
      phase: 0,
      complexity: complexity * 1.5,
      chaos: chaos,
      damping: 1,
      layers: 1
    }

    const barOptions: GenerationOptions = {
      width,
      height,
      resolution: barCount,
      time: timeRef.current * 2,
      seed: seed + '-bars'
    }

    const barGenerator = new WaveGenerator(barParams, seed + '-bars')
    const barHeights = barGenerator.generate(barOptions)[0]

    const barWidth = (width - barSpacing * (barCount - 1)) / barCount

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + barSpacing)
      const waveCenterY = waveData[i].y
      const barHeight = Math.abs(barHeights[i].y - height / 2) + 20
      
      const hue = (i / barCount) * 360
      
      const gradient = ctx.createLinearGradient(x, waveCenterY - barHeight/2, x, waveCenterY + barHeight/2)
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`)
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`)
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`)
      
      ctx.fillStyle = gradient
      
      const radius = barWidth / 3
      ctx.beginPath()
      ctx.roundRect(x, waveCenterY - barHeight/2, barWidth, barHeight, radius)
      ctx.fill()
      
      if (barHeight > 25) {
        ctx.beginPath()
        ctx.arc(x + barWidth/2, waveCenterY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2)
        ctx.arc(x + barWidth/2, waveCenterY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    waveData.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])
  }

  const executeCustomCode = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      setCodeError(null)

      const params: WaveParameters = {
        amplitude,
        frequency,
        phase: 0,
        complexity,
        chaos,
        damping,
        layers
      }

      const generator = new WaveGenerator(params, seed)

      // Create a safe execution environment with all variables defined
      const safeCode = `
        // Define all variables in scope to prevent reference errors
        const seed = params.seed;
        const barCount = params.barCount;
        const barSpacing = params.barSpacing;
        
        ${customCode}
        
        drawVisualization(ctx, width, height, params, generator, time);
      `

      const executeFunction = new Function(
        'ctx', 'width', 'height', 'params', 'generator', 'time', 'WaveGenerator',
        safeCode
      )

      executeFunction(ctx, width, height, 
        { ...params, seed, barCount, barSpacing }, 
        generator, 
        timeRef.current,
        WaveGenerator
      )
    } catch (error) {
      setCodeError(error instanceof Error ? error.message : 'Unknown error')
      console.error('Custom code execution error:', error)
    }
  }

  const getCodeForMode = () => {
    switch (visualMode) {
      case 'wave':
        return visualizationTemplates.wave
      case 'bars':
        return visualizationTemplates.bars
      case 'wavebars':
        return visualizationTemplates.wavebars
      case 'custom':
        return customCode
      default:
        return visualizationTemplates.wave
    }
  }

  const handleCloneToCustom = () => {
    const currentCode = getCodeForMode()
    setCustomCode(currentCode)
    setVisualMode('custom')
    setCurrentShapeId(undefined)
    setCurrentShapeName(getShapeNameForMode() + ' (Clone)')
  }

  const getShapeNameForMode = () => {
    switch (visualMode) {
      case 'wave':
        return 'Wave Lines'
      case 'bars':
        return 'Audio Bars'
      case 'wavebars':
        return 'Wave Bars'
      case 'custom':
        return currentShapeName
      default:
        return 'Custom Shape'
    }
  }

  const toggleAnimation = () => {
    if (animating) {
      setAnimating(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      setAnimating(true)
      const animate = () => {
        timeRef.current += 0.05
        generateLogo()
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    }
  }

  const randomizeParams = () => {
    setSeed(Math.random().toString(36).substring(7))
    setFrequency(Math.floor(Math.random() * 8) + 1)
    setAmplitude(Math.floor(Math.random() * 80) + 20)
    setComplexity(Math.random())
    setChaos(Math.random() * 0.3)
    setDamping(0.5 + Math.random() * 0.5)
    setLayers(Math.floor(Math.random() * 5) + 1)
    setColor(colorPalette[Math.floor(Math.random() * colorPalette.length)])
  }

  const loadPreset = (preset: Preset) => {
    setVisualMode(preset.mode)
    setSeed(preset.params.seed)
    setFrequency(preset.params.frequency)
    setAmplitude(preset.params.amplitude)
    setComplexity(preset.params.complexity)
    setChaos(preset.params.chaos)
    setDamping(preset.params.damping)
    setLayers(preset.params.layers)
    if (preset.params.barCount) setBarCount(preset.params.barCount)
    if (preset.params.barSpacing) setBarSpacing(preset.params.barSpacing)
  }

  const exportAsPNG = async (size?: number, filename?: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    return new Promise<void>((resolve) => {
      if (size && size !== canvas.width) {
        // Create a temporary canvas at the requested size
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = size
        tempCanvas.height = size
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx) {
          resolve()
          return
        }

        // Save current canvas content
        const imageData = canvas.toDataURL()
        const img = document.createElement('img')
        img.onload = () => {
          tempCtx.drawImage(img, 0, 0, size, size)
          tempCanvas.toBlob((blob) => {
            if (!blob) {
              resolve()
              return
            }
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename || `recast-logo-${seed}-${size}x${size}.png`
            a.click()
            URL.revokeObjectURL(url)
            setTimeout(resolve, 100) // Small delay between downloads
          })
        }
        img.src = imageData
      } else {
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve()
            return
          }
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename || `recast-logo-${seed}.png`
          a.click()
          URL.revokeObjectURL(url)
          setTimeout(resolve, 100)
        })
      }
    })
  }

  const exportAllSizes = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Use the seed as the base name, capitalize first letter if it's the ReCast logo
    const baseName = seed === 'recast-identity' ? 'ReCast' : seed
    
    const exports = [
      { size: 1024, name: `${baseName}-1024.png` },
      { size: 512, name: `${baseName}-512.png` },
      { size: 256, name: `${baseName}-256.png` },
      { size: 128, name: `${baseName}-128.png` },
      { size: 64, name: `${baseName}-64.png` },
      { size: 32, name: `${baseName}-32.png` },
      { size: 16, name: `${baseName}-16.png` },
    ]

    const zip = new JSZip()
    const folder = zip.folder(`${baseName}-logos`)
    if (!folder) return

    // Save current canvas as original
    const originalImageData = canvas.toDataURL()

    for (const { size, name } of exports) {
      // Create a temporary canvas at the requested size
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = size
      tempCanvas.height = size
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) continue

      // Draw the logo at the new size
      const img = document.createElement('img')
      await new Promise<void>((resolve) => {
        img.onload = () => {
          tempCtx.drawImage(img, 0, 0, size, size)
          tempCanvas.toBlob((blob) => {
            if (blob) {
              folder.file(name, blob)
            }
            resolve()
          })
        }
        img.src = originalImageData
      })
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `${baseName}-logos.zip`)
  }

  const exportAsSVG = () => {
    if (visualMode === 'custom') {
      alert('Custom visualizations can only be exported as PNG')
      exportAsPNG()
      return
    }

    // Simplified SVG export for wave mode only
    alert('SVG export coming soon!')
  }

  const shareLink = () => {
    const params = new URLSearchParams({
      seed,
      mode: visualMode,
      frequency: frequency.toString(),
      amplitude: amplitude.toString(),
      complexity: complexity.toString(),
      chaos: chaos.toString(),
      damping: damping.toString(),
      layers: layers.toString(),
      barCount: barCount.toString(),
      barSpacing: barSpacing.toString(),
    })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    navigator.clipboard.writeText(url)
  }

  const handleLoadShape = (shape: SavedShape) => {
    // Check if this is a built-in shape
    if (shape.id.startsWith('builtin-')) {
      const mode = shape.id.replace('builtin-', '') as 'wave' | 'bars' | 'wavebars'
      setVisualMode(mode)
      setCurrentShapeId(undefined)
      setCurrentShapeName(shape.name)
    } else {
      setCustomCode(shape.code)
      setVisualMode('custom')
      setCurrentShapeId(shape.id)
      setCurrentShapeName(shape.name)
    }
  }

  const handleLoadPreset = (preset: SavedPreset) => {
    setVisualMode(preset.mode)
    setSeed(preset.params.seed)
    setFrequency(preset.params.frequency)
    setAmplitude(preset.params.amplitude)
    setComplexity(preset.params.complexity)
    setChaos(preset.params.chaos)
    setDamping(preset.params.damping)
    setLayers(preset.params.layers)
    if (preset.params.barCount) setBarCount(preset.params.barCount)
    if (preset.params.barSpacing) setBarSpacing(preset.params.barSpacing)
    if (preset.params.color) setColor(preset.params.color)
    if (preset.shapeId) setCurrentShapeId(preset.shapeId)
  }

  const openSaveDialog = (mode: 'shape' | 'preset') => {
    setSaveMode(mode)
    setSaveDialogOpen(true)
  }

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(isDark)
    }
    
    checkTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => mediaQuery.removeEventListener('change', checkTheme)
  }, [])

  useEffect(() => {
    generateLogo()
  }, [generateLogo])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (animating) {
      interval = setInterval(() => {
        timeRef.current += 0.05
        generateLogo()
      }, 50)
    }
    return () => clearInterval(interval)
  }, [animating, generateLogo])

  // Handle resize dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      // Get the header height dynamically
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 0
      const newHeight = window.innerHeight - e.clientY - headerHeight
      setControlsHeight(Math.min(Math.max(200, newHeight), 600))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">ReCast</h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  Programmatic logo generation through mathematical waves
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSavedItemsOpen(true)}
              className="h-9"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Library
            </Button>

            <div className="h-6 w-px bg-gray-200" />

            <Button
              variant="outline"
              size="sm"
              onClick={randomizeParams}
              className="h-9"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Randomize
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openSaveDialog('preset')}
              className="h-9"
            >
              <Settings className="w-4 h-4 mr-2" />
              Save Preset
            </Button>

            {visualMode === 'custom' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openSaveDialog('shape')}
                className="h-9"
              >
                <Package className="w-4 h-4 mr-2" />
                Save Shape
              </Button>
            )}

            <div className="h-6 w-px bg-gray-200" />

            <Button
              variant="outline"
              size="sm"
              onClick={shareLink}
              className="h-9"
            >
              <Copy className="w-4 h-4 mr-2" />
              Share
            </Button>

            <div className="flex space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="h-9"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PNG
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportAllSizes} className="font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Sizes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => exportAsPNG()}>
                    Original (600×600)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsPNG(1024)}>
                    Large (1024×1024)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsPNG(512)}>
                    Medium (512×512)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsPNG(256)}>
                    Small (256×256)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsPNG(128)}>
                    Icon (128×128)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsPNG(64)}>
                    Favicon (64×64)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="sm"
                variant="outline"
                onClick={exportAsSVG}
                className="h-9"
              >
                SVG
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className={cn(
          "border-r border-gray-200 bg-gray-50/30 transition-all duration-300 flex flex-col overflow-hidden",
          codeEditorCollapsed ? "w-12" : "w-2/5"
        )}>
          {codeEditorCollapsed ? (
            <div className="p-3 border-b border-gray-200 bg-white">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCodeEditorCollapsed(false)}
                className="w-full h-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {visualMode === 'custom' ? (
                        <input
                          type="text"
                          value={currentShapeName}
                          onChange={(e) => setCurrentShapeName(e.target.value)}
                          className="text-sm font-medium text-gray-900 bg-transparent border-b border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                          placeholder="Shape name..."
                        />
                      ) : (
                        <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                          {getShapeNameForMode()}
                          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            Built-in
                          </span>
                        </h3>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {visualMode === 'custom' ? 
                        currentShapeId ? 'Editing saved shape' : 'Edit your custom visualization' : 
                        'View-only mode'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {visualMode !== 'custom' && (
                      <Button
                        size="sm"
                        onClick={handleCloneToCustom}
                        variant="outline"
                        className="h-8 text-xs"
                      >
                        Clone & Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCodeEditorCollapsed(true)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {codeError && (
                  <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    Error: {codeError}
                  </div>
                )}
                <CodeMirror
                  value={getCodeForMode()}
                  height="100%"
                  theme={isDarkMode ? oneDark : undefined}
                  extensions={[javascript()]}
                  onChange={(value) => {
                    if (visualMode === 'custom') {
                      setCustomCode(value)
                    }
                  }}
                  editable={visualMode === 'custom'}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className={cn(
          "flex flex-col bg-white transition-all duration-300 overflow-hidden",
          codeEditorCollapsed ? "w-[calc(100%-48px)]" : "w-3/5"
        )}>
          {/* Canvas Area */}
          <div className="flex-1 p-8 bg-gradient-to-br from-gray-50/50 to-blue-50/30">
            <div className="h-full flex items-center justify-center">
              <Card className="relative bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className="border border-gray-200 rounded-lg"
                    style={{
                      background: `
                        radial-gradient(circle, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundColor: '#ffffff'
                    }}
                  />

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg border p-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="h-7 w-7 p-0"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <span className="text-xs text-gray-500 w-10 text-center font-mono">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                      className="h-7 w-7 p-0"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setZoom(1)}
                      className="h-7 w-7 p-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Play/Pause Button */}
                  <Button
                    onClick={toggleAnimation}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg"
                    size="sm"
                  >
                    {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="relative flex-shrink-0" style={{ height: `${controlsHeight}px` }}>
            {/* Resize Handle */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-gray-200 transition-colors flex items-center justify-center z-10",
                isDragging && "bg-gray-200"
              )}
              onMouseDown={handleMouseDown}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            
            <div className="h-full border-t overflow-y-auto">
              <div className="p-6 space-y-4">
              {/* Presets */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Built-in Examples
                    <span className="text-xs font-normal text-gray-500">
                      Click to try, save to customize
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadPreset(preset)}
                          className="h-8 text-xs"
                        >
                          {preset.name}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            loadPreset(preset)
                            openSaveDialog('preset')
                          }}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                          title="Save to library"
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Main Controls */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Core Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-medium">Visualization Mode</label>
                      <select
                        value={visualMode}
                        onChange={(e) => setVisualMode(e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded-lg text-sm"
                      >
                        <option value="wave">Wave Lines</option>
                        <option value="bars">Audio Bars</option>
                        <option value="wavebars">Wave Bars</option>
                        <option value="custom">Custom Code</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium">
                        Seed (Your Signature)
                      </label>
                      <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Frequency: {frequency}</label>
                      <Slider
                        value={[frequency]}
                        onValueChange={([v]) => setFrequency(v)}
                        max={20}
                        min={1}
                        step={1}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Amplitude: {amplitude}</label>
                      <Slider
                        value={[amplitude]}
                        onValueChange={([v]) => setAmplitude(v)}
                        max={200}
                        min={10}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Wave Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-medium">Complexity: {complexity.toFixed(2)}</label>
                      <Slider
                        value={[complexity]}
                        onValueChange={([v]) => setComplexity(v)}
                        max={1}
                        min={0}
                        step={0.05}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Chaos: {chaos.toFixed(2)}</label>
                      <Slider
                        value={[chaos]}
                        onValueChange={([v]) => setChaos(v)}
                        max={1}
                        min={0}
                        step={0.05}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Damping: {damping.toFixed(2)}</label>
                      <Slider
                        value={[damping]}
                        onValueChange={([v]) => setDamping(v)}
                        max={1}
                        min={0}
                        step={0.05}
                        className="mt-1"
                      />
                    </div>

                    {visualMode === 'wave' && (
                      <div>
                        <label className="text-xs font-medium">Layers: {layers}</label>
                        <Slider
                          value={[layers]}
                          onValueChange={([v]) => setLayers(v)}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Bar Controls */}
              {(visualMode === 'bars' || visualMode === 'wavebars') && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Bar Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium">Bar Count: {barCount}</label>
                        <Slider
                          value={[barCount]}
                          onValueChange={([v]) => setBarCount(v)}
                          max={100}
                          min={20}
                          step={5}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Spacing: {barSpacing}px</label>
                        <Slider
                          value={[barSpacing]}
                          onValueChange={([v]) => setBarSpacing(v)}
                          max={5}
                          min={0}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        mode={saveMode}
        visualMode={visualMode}
        customCode={customCode}
        currentShapeName={currentShapeName}
        params={{
          seed,
          frequency,
          amplitude,
          complexity,
          chaos,
          damping,
          layers,
          barCount,
          barSpacing,
          color,
        }}
        currentShapeId={currentShapeId}
        onSaved={() => {
          // Optionally show a success message
        }}
      />

      {/* Saved Items Dialog */}
      <SavedItemsDialog
        open={savedItemsOpen}
        onOpenChange={setSavedItemsOpen}
        onLoadShape={handleLoadShape}
        onLoadPreset={handleLoadPreset}
      />
    </div>
  )
}
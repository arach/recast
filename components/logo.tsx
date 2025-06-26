'use client'

import { useEffect, useRef } from 'react'

export function AnimatedLogo({ size = 48 }: { size?: number }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Generate initial wave bars
    const barCount = 20
    const bars = svgRef.current.querySelectorAll('.wave-bar')
    
    bars.forEach((bar, i) => {
      const hue = (i / barCount) * 360
      bar.setAttribute('fill', `hsl(${hue}, 70%, 50%)`)
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="rounded-lg overflow-hidden transition-transform hover:scale-110"
      style={{
        background: 'radial-gradient(circle at center, #fafafa, #f5f5f5)'
      }}
    >
      <style>
        {`
          @keyframes wave {
            0%, 100% { 
              transform: scaleY(0.6) translateY(0); 
            }
            50% { 
              transform: scaleY(1.3) translateY(-2px); 
            }
          }
          
          @keyframes glow {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          
          svg:hover .wave-bar {
            animation: wave 1.2s ease-in-out infinite, glow 1.2s ease-in-out infinite;
            transform-origin: center bottom;
          }
          
          .wave-bar {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.8;
          }
          
          svg:hover .wave-bar {
            filter: brightness(1.2) saturate(1.2);
          }
          
          svg:hover .wave-bar:nth-child(1) { animation-delay: 0s; }
          svg:hover .wave-bar:nth-child(2) { animation-delay: 0.05s; }
          svg:hover .wave-bar:nth-child(3) { animation-delay: 0.1s; }
          svg:hover .wave-bar:nth-child(4) { animation-delay: 0.15s; }
          svg:hover .wave-bar:nth-child(5) { animation-delay: 0.2s; }
          svg:hover .wave-bar:nth-child(6) { animation-delay: 0.25s; }
          svg:hover .wave-bar:nth-child(7) { animation-delay: 0.3s; }
          svg:hover .wave-bar:nth-child(8) { animation-delay: 0.35s; }
          svg:hover .wave-bar:nth-child(9) { animation-delay: 0.4s; }
          svg:hover .wave-bar:nth-child(10) { animation-delay: 0.45s; }
          svg:hover .wave-bar:nth-child(11) { animation-delay: 0.5s; }
          svg:hover .wave-bar:nth-child(12) { animation-delay: 0.55s; }
          svg:hover .wave-bar:nth-child(13) { animation-delay: 0.6s; }
          svg:hover .wave-bar:nth-child(14) { animation-delay: 0.65s; }
          svg:hover .wave-bar:nth-child(15) { animation-delay: 0.7s; }
          svg:hover .wave-bar:nth-child(16) { animation-delay: 0.75s; }
          svg:hover .wave-bar:nth-child(17) { animation-delay: 0.8s; }
          svg:hover .wave-bar:nth-child(18) { animation-delay: 0.85s; }
          svg:hover .wave-bar:nth-child(19) { animation-delay: 0.9s; }
          svg:hover .wave-bar:nth-child(20) { animation-delay: 0.95s; }
        `}
      </style>
      
      {/* Generate wave bars */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (i / 20) * 100 + 2.5
        const baseHeight = 30 + Math.sin(i * 0.5) * 20
        const y = 50 - baseHeight / 2
        const barWidth = 4
        
        return (
          <rect
            key={i}
            className="wave-bar"
            x={x}
            y={y}
            width={barWidth}
            height={baseHeight}
            rx={2}
          />
        )
      })}
    </svg>
  )
}
import { useRef, useEffect, useState, useCallback } from 'react'
import { useUIStore } from '@/lib/stores/uiStore'

export function useCanvasAnimation() {
  const { animating, toggleAnimation } = useUIStore()
  const animationRef = useRef<number>()
  const timeRef = useRef(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Reset time
  const resetTime = useCallback(() => {
    timeRef.current = 0
    setCurrentTime(0)
  }, [])
  
  // Set specific time
  const setTime = useCallback((time: number) => {
    timeRef.current = Math.max(0, time)
    setCurrentTime(timeRef.current)
  }, [])
  
  // Animation loop
  useEffect(() => {
    if (animating) {
      const animate = () => {
        timeRef.current = Math.max(0, timeRef.current + 0.05)
        setCurrentTime(timeRef.current)
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animating])
  
  return {
    animating,
    currentTime,
    toggleAnimation,
    resetTime,
    setTime
  }
}
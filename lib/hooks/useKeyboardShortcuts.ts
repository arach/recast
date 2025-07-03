import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlOrCmd?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
  description?: string
}

const defaultShortcuts: KeyboardShortcut[] = [
  {
    key: 'Enter',
    ctrlOrCmd: true,
    handler: () => {},
    description: 'Run code'
  }
]

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[] = defaultShortcuts,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const ctrlOrCmdPressed = e.ctrlKey || e.metaKey
        const matchesCtrlOrCmd = shortcut.ctrlOrCmd ? ctrlOrCmdPressed : !ctrlOrCmdPressed
        const matchesShift = shortcut.shift ? e.shiftKey : true
        const matchesAlt = shortcut.alt ? e.altKey : true
        const matchesKey = e.key === shortcut.key
        
        if (matchesKey && matchesCtrlOrCmd && matchesShift && matchesAlt) {
          e.preventDefault()
          shortcut.handler()
        }
      })
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}

// Export for use in components
export function useRunCodeShortcut(onRunCode: () => void, enabled: boolean = true) {
  useKeyboardShortcuts([
    {
      key: 'Enter',
      ctrlOrCmd: true,
      handler: onRunCode,
      description: 'Run code'
    }
  ], enabled)
}
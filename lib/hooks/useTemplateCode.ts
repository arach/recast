import { useState, useEffect } from 'react'

// Simple in-memory cache for template codes
const templateCache = new Map<string, string>()
const loadingCache = new Map<string, Promise<string>>()

export function useTemplateCode(templateId: string | undefined) {
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!templateId) {
      setCode('')
      return
    }

    // Check cache first - DON'T LOG during animation to reduce noise
    if (templateCache.has(templateId)) {
      // console.log(`📦 Cache hit for template: ${templateId}`)
      setCode(templateCache.get(templateId)!)
      return
    }

    // Check if already loading
    if (loadingCache.has(templateId)) {
      // Don't set loading state here - it causes infinite loops!
      loadingCache.get(templateId)!
        .then((codeText) => {
          setCode(codeText)
          // Don't set loading false here either - let the original promise handle it
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to fetch template')
          // Don't set loading false here either - let the original promise handle it
        })
      return
    }

    const fetchCode = async (): Promise<string> => {
      const response = await fetch(`/api/template-source/${templateId}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch template '${templateId}': ${response.statusText}`)
      }
      
      const codeText = await response.text()
      return codeText || ''
    }

    const loadTemplate = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Create loading promise and cache it
        const loadingPromise = fetchCode()
        loadingCache.set(templateId, loadingPromise)
        
        const codeText = await loadingPromise
        
        // Cache the result
        templateCache.set(templateId, codeText)
        loadingCache.delete(templateId)
        
        setCode(codeText)
      } catch (err) {
        console.error('Error fetching template code:', err)
        loadingCache.delete(templateId)
        setError(err instanceof Error ? err.message : 'Failed to fetch template')
        setCode('')
      } finally {
        setLoading(false)
      }
    }

    loadTemplate()
  }, [templateId])

  return { code, loading, error }
}
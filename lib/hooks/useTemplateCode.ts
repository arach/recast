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

    // Check cache first
    if (templateCache.has(templateId)) {
      console.log(`📦 Cache hit for template: ${templateId}`)
      setCode(templateCache.get(templateId)!)
      return
    }

    // Check if already loading
    if (loadingCache.has(templateId)) {
      console.log(`⏳ Already loading template: ${templateId}`)
      setLoading(true)
      loadingCache.get(templateId)!
        .then((codeText) => {
          setCode(codeText)
          setLoading(false)
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to fetch template')
          setLoading(false)
        })
      return
    }

    const fetchCode = async (): Promise<string> => {
      console.log(`🌐 Fetching template: ${templateId}`)
      const response = await fetch(`/api/template-source/${templateId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`)
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
        console.log(`✅ Cached template: ${templateId} (${codeText.length} chars)`)
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
import { useState, useEffect } from 'react'

export function useTemplateCode(templateId: string | undefined) {
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!templateId) {
      setCode('')
      return
    }

    const fetchCode = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/template-source/${templateId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.statusText}`)
        }
        
        const codeText = await response.text()
        setCode(codeText || '')
      } catch (err) {
        console.error('Error fetching template code:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch template')
        setCode('')
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [templateId])

  return { code, loading, error }
}
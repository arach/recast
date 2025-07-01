import { useState, useEffect, useCallback } from 'react';
import type { Template } from '@/templates/types';
import { loadTemplate, type ShapeName as TemplateName } from '@/lib/theme-loader';

interface UseTemplateReturn {
  template: Template | null;
  loading: boolean;
  error: Error | null;
  loadTemplateByName: (name: TemplateName) => Promise<void>;
}

export function useTemplate(initialTemplateName?: TemplateName): UseTemplateReturn {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadTemplateByName = useCallback(async (name: TemplateName) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedTemplate = await loadTemplate(name);
      setTemplate(loadedTemplate);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load template'));
      setTemplate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial template if provided
  useEffect(() => {
    if (initialTemplateName) {
      loadTemplateByName(initialTemplateName);
    }
  }, [initialTemplateName, loadTemplateByName]);

  return {
    template,
    loading,
    error,
    loadTemplateByName,
  };
}

// Hook to get all template metadata for UI display
export function useTemplateList() {
  const [templates, setTemplates] = useState<Array<{
    id: string;
    name: string;
    description: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplateList() {
      try {
        const { getAllTemplateMetadata } = await import('@/lib/theme-loader');
        const metadata = await getAllTemplateMetadata();
        setTemplates(metadata);
      } catch (error) {
        console.error('Failed to load template list:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTemplateList();
  }, []);

  return { templates, loading };
}
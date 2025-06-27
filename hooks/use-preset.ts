import { useState, useEffect, useCallback } from 'react';
import type { Preset } from '@/presets/types';
import { loadPreset, type PresetName } from '@/lib/preset-loader';

interface UsePresetReturn {
  preset: Preset | null;
  loading: boolean;
  error: Error | null;
  loadPresetByName: (name: PresetName) => Promise<void>;
}

export function usePreset(initialPresetName?: PresetName): UsePresetReturn {
  const [preset, setPreset] = useState<Preset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPresetByName = useCallback(async (name: PresetName) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedPreset = await loadPreset(name);
      setPreset(loadedPreset);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load preset'));
      setPreset(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial preset if provided
  useEffect(() => {
    if (initialPresetName) {
      loadPresetByName(initialPresetName);
    }
  }, [initialPresetName, loadPresetByName]);

  return {
    preset,
    loading,
    error,
    loadPresetByName,
  };
}

// Hook to get all preset metadata for UI display
export function usePresetList() {
  const [presets, setPresets] = useState<Array<{
    id: string;
    name: string;
    description: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPresetList() {
      try {
        const { getAllPresetMetadata } = await import('@/lib/preset-loader');
        const metadata = await getAllPresetMetadata();
        setPresets(metadata);
      } catch (error) {
        console.error('Failed to load preset list:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPresetList();
  }, []);

  return { presets, loading };
}
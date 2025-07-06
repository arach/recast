import React, { useState } from 'react';
import { Save, Link2 } from 'lucide-react';
import { useLogoStore } from '@/lib/stores/logoStore';
import { createCanvas, addLogoToCanvas } from '@/lib/api/canvas-api';
import { useRouter } from 'next/navigation';

export function SaveCanvasButton() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { logos } = useLogoStore();
  
  const handleSaveCanvas = async () => {
    if (logos.length === 0) {
      alert('No logos to save!');
      return;
    }
    
    setSaving(true);
    
    try {
      // Create a new canvas
      const canvas = await createCanvas({
        name: `Canvas ${new Date().toLocaleDateString()}`,
        description: `${logos.length} logo${logos.length > 1 ? 's' : ''}`,
        layout: 'grid',
      });
      
      // Add each logo to the canvas
      for (const logo of logos) {
        await addLogoToCanvas(canvas.id, {
          templateId: logo.templateId,
          parameters: {
            ...logo.parameters.core,
            ...logo.parameters.style,
            ...logo.parameters.custom,
          },
          position: logo.position,
          metadata: {
            name: logo.name,
          },
        });
      }
      
      // Navigate to the studio with the canvas ID
      router.push(`/studio/${canvas.id}`);
    } catch (error) {
      console.error('Failed to save canvas:', error);
      alert('Failed to save canvas');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <button
      onClick={handleSaveCanvas}
      disabled={saving || logos.length === 0}
      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Save current logos to a canvas"
    >
      {saving ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          <span>Save Canvas</span>
        </>
      )}
    </button>
  );
}
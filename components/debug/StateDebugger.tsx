'use client';

import { useLogoStore } from '@/lib/stores/logoStore';

interface StateDebuggerProps {
  reactLogos: any[];
  selectedLogoId: string;
}

export function StateDebugger({ reactLogos, selectedLogoId }: StateDebuggerProps) {
  const zustandLogos = useLogoStore(state => state.logos);
  const zustandSelectedId = useLogoStore(state => state.selectedLogoId);
  
  const reactLogo = reactLogos.find(l => l.id === selectedLogoId);
  const zustandLogo = zustandLogos.find(l => l.id === zustandSelectedId);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🔍 State Debugger</h3>
      
      <div className="mb-3">
        <h4 className="text-green-400 mb-1">React State:</h4>
        <div className="pl-2">
          <div>ID: {reactLogo?.id}</div>
          <div>Template ID: {reactLogo?.templateId || 'undefined'}</div>
          <div>Template Name: {reactLogo?.templateName || 'undefined'}</div>
          <div>Code Length: {reactLogo?.code?.length || 0}</div>
          <div>Code Preview: {reactLogo?.code?.substring(0, 50)}...</div>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="text-blue-400 mb-1">Zustand Store:</h4>
        <div className="pl-2">
          <div>ID: {zustandLogo?.id}</div>
          <div>Template ID: {zustandLogo?.templateId || 'undefined'}</div>
          <div>Template Name: {zustandLogo?.templateName || 'undefined'}</div>
          <div>Code Length: {zustandLogo?.code?.length || 0}</div>
          <div>Code Preview: {zustandLogo?.code?.substring(0, 50)}...</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className={reactLogo?.templateId === zustandLogo?.templateId ? 'text-green-400' : 'text-red-400'}>
          Templates Match: {reactLogo?.templateId === zustandLogo?.templateId ? '✓' : '✗'}
        </div>
        <div className={reactLogo?.code === zustandLogo?.code ? 'text-green-400' : 'text-red-400'}>
          Code Match: {reactLogo?.code === zustandLogo?.code ? '✓' : '✗'}
        </div>
      </div>
    </div>
  );
}
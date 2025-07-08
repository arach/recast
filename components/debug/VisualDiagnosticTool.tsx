'use client';

import React, { useState, useEffect } from 'react';
import { useLogoStore } from '@/lib/stores/logoStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { useCanvasStore } from '@/lib/stores/canvasStore';
import { 
  Download, 
  Copy, 
  Check, 
  FileImage, 
  Package, 
  Image,
  X,
  Settings,
  Eye,
  Code
} from 'lucide-react';
import {
  generateDiagnosticReport,
  captureLogoImage,
  downloadDiagnosticFiles,
  copyDiagnosticToClipboard,
  formatDiagnosticForClipboard
} from '@/lib/debug/diagnostic-sharing';

interface VisualDiagnosticToolProps {
  onClose?: () => void;
}

export function VisualDiagnosticTool({ onClose }: VisualDiagnosticToolProps) {
  const { logos, selectedLogoId } = useLogoStore();
  const { zoom } = useUIStore();
  const { offset } = useCanvasStore();
  
  const selectedLogo = logos.find(l => l.id === selectedLogoId);
  
  // State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');
  const [imageQuality, setImageQuality] = useState(0.9);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastReport, setLastReport] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Auto-capture when logo changes
  useEffect(() => {
    if (selectedLogo) {
      handleCaptureImage();
    }
  }, [selectedLogo?.id, selectedLogo?.parameters]);
  
  const handleCaptureImage = async () => {
    if (!selectedLogo) return;
    
    setIsCapturing(true);
    try {
      const imageData = await captureLogoImage(selectedLogo, imageQuality, imageFormat, true);
      if (imageData) {
        setCapturedImage(imageData.dataUrl);
        setThumbnailImage(imageData.thumbnail || imageData.dataUrl);
      }
    } catch (error) {
      console.error('Failed to capture image:', error);
    } finally {
      setIsCapturing(false);
    }
  };
  
  const handleGenerateReport = async () => {
    if (!selectedLogo) return;
    
    setIsCapturing(true);
    try {
      const report = await generateDiagnosticReport(
        selectedLogo,
        selectedLogoId,
        offset,
        zoom,
        useLogoStore.getState(),
        useUIStore.getState(),
        true,
        imageFormat,
        imageQuality
      );
      setLastReport(report);
      return report;
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsCapturing(false);
    }
  };
  
  const handleCopyReport = async () => {
    const report = lastReport || await handleGenerateReport();
    if (!report) return;
    
    const formatted = formatDiagnosticForClipboard(report);
    const success = await copyDiagnosticToClipboard(formatted);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  const handleDownloadFiles = async () => {
    const report = lastReport || await handleGenerateReport();
    if (!report) return;
    
    await downloadDiagnosticFiles(report, true);
  };
  
  if (!selectedLogo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Logo Selected</h2>
            <p className="text-gray-400">Please select a logo to generate a visual diagnostic report.</p>
            {onClose && (
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileImage className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Visual Diagnostic Tool</h1>
              <p className="text-sm text-gray-400">Complete logo analysis with image capture</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Image and Controls */}
          <div className="space-y-6">
            
            {/* Logo Image Display */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-400" />
                  Logo Image
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCaptureImage}
                    disabled={isCapturing}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 
                               rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    {isCapturing ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Capturing...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Recapture</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="aspect-square bg-white rounded-lg p-4 flex items-center justify-center">
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No image captured</p>
                  </div>
                )}
              </div>
              
              {capturedImage && (
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <div>Format: {imageFormat.toUpperCase()}</div>
                  <div>Quality: {Math.round(imageQuality * 100)}%</div>
                  <div>Size: 600×600 pixels</div>
                </div>
              )}
            </div>
            
            {/* Image Settings */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                Image Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image Format
                  </label>
                  <select
                    value={imageFormat}
                    onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpeg')}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="png">PNG (Lossless, larger file)</option>
                    <option value="jpeg">JPEG (Compressed, smaller file)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quality: {Math.round(imageQuality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lower quality</span>
                    <span>Higher quality</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Export Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Export Options</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleCopyReport}
                  disabled={isCapturing}
                  className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800
                             rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Complete Report</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDownloadFiles}
                  disabled={isCapturing}
                  className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800
                             rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Download Files (JSON + Image)</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Configuration Details */}
          <div className="space-y-6">
            
            {/* Logo Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-green-400" />
                Logo Configuration
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <div className="font-mono text-blue-300">{selectedLogo.id}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Template:</span>
                    <div className="font-medium">{selectedLogo.templateName || 'Custom'}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Position:</span>
                    <div className="font-mono">
                      ({selectedLogo.position?.x || 0}, {selectedLogo.position?.y || 0})
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Canvas Zoom:</span>
                    <div className="font-mono">{(zoom * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Parameters */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Parameters</h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedLogo.parameters && Object.keys(selectedLogo.parameters).length > 0 ? (
                  Object.entries(selectedLogo.parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-700 last:border-b-0">
                      <span className="text-gray-400 text-sm">{key}:</span>
                      <span className="text-white text-sm font-mono">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No parameters configured
                  </div>
                )}
              </div>
            </div>
            
            {/* System Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">System Information</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment:</span>
                  <span className="font-mono">{process.env.NODE_ENV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Browser:</span>
                  <span className="font-mono text-xs">
                    {typeof window !== 'undefined' ? window.navigator.userAgent.split(' ')[0] : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Timestamp:</span>
                  <span className="font-mono text-xs">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Canvas Offset:</span>
                  <span className="font-mono">({offset.x.toFixed(0)}, {offset.y.toFixed(0)})</span>
                </div>
              </div>
            </div>
            
            {/* Usage Instructions */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">How to Use</h3>
              <div className="space-y-2 text-sm text-blue-100">
                <p>1. The logo image is automatically captured when you select a logo</p>
                <p>2. Adjust image format and quality as needed</p>
                <p>3. Use "Copy Complete Report" to get JSON with embedded image</p>
                <p>4. Use "Download Files" to get separate JSON and image files</p>
                <p>5. Share the diagnostic data with developers for debugging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
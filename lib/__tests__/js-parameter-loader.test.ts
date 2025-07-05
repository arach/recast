import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadJSTemplateParameters } from '../js-parameter-loader';
import { loadJSTemplate } from '../js-template-registry';

// Mock the js-template-registry
vi.mock('../js-template-registry');

describe('loadJSTemplateParameters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load template-specific parameters and filter out universal ones', async () => {
    const mockTemplate = {
      metadata: {
        id: 'wave-bars',
        name: '🌊 Wave Bars',
        description: 'Audio bars that follow wave patterns'
      },
      parameters: {
        // Template-specific parameters
        barCount: {
          type: 'slider',
          default: 40,
          min: 20,
          max: 100,
          step: 5,
          label: 'Number of Bars'
        },
        colorMode: {
          type: 'select',
          default: 'spectrum',
          options: [
            { value: 'spectrum', label: '🌈 Rainbow Spectrum' },
            { value: 'theme', label: '🎨 Theme Colors' }
          ],
          label: 'Color Mode'
        },
        // Universal parameters that should be filtered out
        backgroundColor: {
          type: 'color',
          default: '#ffffff',
          label: 'Background Color'
        },
        fillColor: {
          type: 'color',
          default: '#3b82f6',
          label: 'Fill Color'
        }
      },
      drawVisualization: vi.fn()
    };

    (loadJSTemplate as any).mockResolvedValueOnce(mockTemplate);

    const result = await loadJSTemplateParameters('wave-bars');
    
    expect(loadJSTemplate).toHaveBeenCalledWith('wave-bars');
    expect(result).toEqual({
      barCount: {
        type: 'slider',
        default: 40,
        min: 20,
        max: 100,
        step: 5,
        label: 'Number of Bars'
      },
      colorMode: {
        type: 'select',
        default: 'spectrum',
        options: [
          { value: 'spectrum', label: '🌈 Rainbow Spectrum' },
          { value: 'theme', label: '🎨 Theme Colors' }
        ],
        label: 'Color Mode'
      }
    });
  });

  it('should return null when template is not found', async () => {
    (loadJSTemplate as any).mockResolvedValueOnce(null);

    const result = await loadJSTemplateParameters('non-existent');
    
    expect(result).toBeNull();
  });

  it('should handle template loading errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (loadJSTemplate as any).mockRejectedValueOnce(new Error('Template loading error'));

    const result = await loadJSTemplateParameters('error-template');
    
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Error loading JS template parameters:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should return null when template has no parameters', async () => {
    const mockTemplate = {
      metadata: {
        id: 'test',
        name: 'Test Template'
      },
      // No parameters field
      drawVisualization: vi.fn()
    };

    (loadJSTemplate as any).mockResolvedValueOnce(mockTemplate);

    const result = await loadJSTemplateParameters('test');
    
    expect(result).toBeNull();
  });

  it('should filter out all universal parameters', async () => {
    const mockTemplate = {
      metadata: { id: 'test', name: 'Test' },
      parameters: {
        // Only universal parameters
        backgroundType: { type: 'select', default: 'solid' },
        backgroundColor: { type: 'color', default: '#ffffff' },
        backgroundOpacity: { type: 'slider', default: 1 },
        backgroundGradientStart: { type: 'color', default: '#ffffff' },
        backgroundGradientEnd: { type: 'color', default: '#000000' },
        backgroundGradientDirection: { type: 'slider', default: 0 },
        fillType: { type: 'select', default: 'solid' },
        fillColor: { type: 'color', default: '#3b82f6' },
        fillOpacity: { type: 'slider', default: 1 },
        fillGradientStart: { type: 'color', default: '#3b82f6' },
        fillGradientEnd: { type: 'color', default: '#1e40af' },
        fillGradientDirection: { type: 'slider', default: 0 },
        strokeType: { type: 'select', default: 'solid' },
        strokeColor: { type: 'color', default: '#1e40af' },
        strokeWidth: { type: 'slider', default: 2 },
        strokeOpacity: { type: 'slider', default: 1 },
        strokeDashSize: { type: 'slider', default: 5 },
        strokeGapSize: { type: 'slider', default: 5 }
      },
      drawVisualization: vi.fn()
    };

    (loadJSTemplate as any).mockResolvedValueOnce(mockTemplate);

    const result = await loadJSTemplateParameters('test');
    
    expect(result).toEqual({});
  });
});
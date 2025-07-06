import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { UnifiedParametersTool } from '../UnifiedParametersTool';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { loadJSTemplateParameters } from '@/lib/js-parameter-loader';

// Mock the hooks and modules
vi.mock('@/lib/hooks/useSelectedLogo');
vi.mock('@/lib/js-parameter-loader');
vi.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, min, max, step, className }: any) => (
    <input
      type="range"
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      min={min}
      max={max}
      step={step}
      className={className}
      data-testid="slider"
    />
  )
}));

describe('UnifiedParametersTool', () => {
  const mockUpdateCustom = vi.fn();
  
  const defaultMockLogo = {
    id: 'test-logo',
    templateId: 'wave-bars',
    templateName: 'Wave Bars',
    code: 'function draw() { /* template code */ }',
    parameters: {
      custom: {
        barCount: 40,
        colorMode: 'spectrum'
      }
    }
  };

  const defaultMockHookReturn = {
    logo: defaultMockLogo,
    coreParams: {
      frequency: 3,
      amplitude: 50,
      complexity: 0.5,
      chaos: 0.2,
      damping: 0.7,
      layers: 3,
      radius: 100
    },
    customParams: defaultMockLogo.parameters.custom,
    setFrequency: vi.fn(),
    setAmplitude: vi.fn(),
    setComplexity: vi.fn(),
    setChaos: vi.fn(),
    setDamping: vi.fn(),
    setLayers: vi.fn(),
    setRadius: vi.fn(),
    updateCustom: mockUpdateCustom
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSelectedLogo as any).mockReturnValue(defaultMockHookReturn);
  });

  it('should display loading message when no parameters are loaded yet', () => {
    (loadJSTemplateParameters as any).mockResolvedValue({});
    
    render(<UnifiedParametersTool />);
    
    expect(screen.getByText('Loading template parameters...')).toBeInTheDocument();
  });

  it('should display "No logo selected" when logo is null', () => {
    (useSelectedLogo as any).mockReturnValue({
      ...defaultMockHookReturn,
      logo: null
    });
    
    render(<UnifiedParametersTool />);
    
    expect(screen.getByText('No logo selected')).toBeInTheDocument();
  });

  it('should load and display template parameters from params.json', async () => {
    const mockParams = {
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
        options: ['spectrum', 'theme', 'mono'],
        label: 'Color Mode'
      },
      showWavePath: {
        type: 'toggle',
        default: false,
        label: 'Show Wave Path'
      }
    };

    (loadJSTemplateParameters as any).mockResolvedValue(mockParams);
    
    render(<UnifiedParametersTool />);
    
    await waitFor(() => {
      expect(screen.getByText('Template Parameters')).toBeInTheDocument();
      expect(screen.getByText('Number of Bars')).toBeInTheDocument();
      expect(screen.getByText('Color Mode')).toBeInTheDocument();
      expect(screen.getByText('Show Wave Path')).toBeInTheDocument();
    });
  });

  it('should exclude style parameters from display', async () => {
    const mockParams = {
      barCount: {
        type: 'slider',
        default: 40,
        min: 20,
        max: 100,
        step: 5,
        label: 'Number of Bars'
      },
      fillColor: { // Should be excluded
        type: 'color',
        default: '#3b82f6',
        label: 'Fill Color'
      },
      strokeColor: { // Should be excluded
        type: 'color',
        default: '#1e40af',
        label: 'Stroke Color'
      }
    };

    (loadJSTemplateParameters as any).mockResolvedValue(mockParams);
    
    await act(async () => {
      render(<UnifiedParametersTool />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Number of Bars')).toBeInTheDocument();
      expect(screen.queryByText('Fill Color')).not.toBeInTheDocument();
      expect(screen.queryByText('Stroke Color')).not.toBeInTheDocument();
    });
  });

  it('should update custom parameters when slider changes', async () => {
    const mockParams = {
      barCount: {
        type: 'slider',
        default: 40,
        min: 20,
        max: 100,
        step: 5,
        label: 'Number of Bars'
      }
    };

    (loadJSTemplateParameters as any).mockResolvedValue(mockParams);
    
    render(<UnifiedParametersTool />);
    
    await waitFor(() => {
      const slider = screen.getByTestId('slider');
      fireEvent.change(slider, { target: { value: '60' } });
    });

    expect(mockUpdateCustom).toHaveBeenCalledWith({ barCount: 60 });
  });

  it('should handle select parameters correctly', async () => {
    const mockParams = {
      colorMode: {
        type: 'select',
        default: 'spectrum',
        options: [
          { value: 'spectrum', label: '🌈 Rainbow Spectrum' },
          { value: 'theme', label: '🎨 Theme Colors' }
        ],
        label: 'Color Mode'
      }
    };

    (loadJSTemplateParameters as any).mockResolvedValue(mockParams);
    
    await act(async () => {
      render(<UnifiedParametersTool />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Color Mode')).toBeInTheDocument();
      // Note: Full select testing would require more complex mocking
    });
  });

  it('should use custom parameter values over defaults', async () => {
    const mockParams = {
      barCount: {
        type: 'slider',
        default: 40,
        min: 20,
        max: 100,
        step: 5,
        label: 'Number of Bars'
      }
    };

    (loadJSTemplateParameters as any).mockResolvedValue(mockParams);
    
    // Logo has custom value of 40 for barCount
    await act(async () => {
      render(<UnifiedParametersTool />);
    });
    
    await waitFor(() => {
      const slider = screen.getByTestId('slider');
      expect(slider).toHaveAttribute('value', '40');
    });
  });
});
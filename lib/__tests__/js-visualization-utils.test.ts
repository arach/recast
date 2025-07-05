import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateJSVisualization } from '../js-visualization-utils';
import { loadTemplate, templateRegistry } from '../template-registry';
import { utils } from '@reflow/template-utils';

// Mock dependencies
vi.mock('../template-registry');
vi.mock('@reflow/template-utils');

describe('generateJSVisualization', () => {
  const mockCtx = {
    fillStyle: '',
    fillRect: vi.fn(),
    font: '',
    textAlign: '',
    textBaseline: '',
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  } as any;

  const mockTemplate = {
    drawVisualization: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (templateRegistry.setUtils as any) = vi.fn();
    (loadTemplate as any).mockResolvedValue(mockTemplate);
  });

  it('should initialize utils before loading template', async () => {
    await generateJSVisualization(
      mockCtx,
      'wave-bars',
      { core: { frequency: 3 } },
      0,
      800,
      600
    );

    expect(templateRegistry.setUtils).toHaveBeenCalledWith(utils);
  });

  it('should flatten parameters with correct priority order', async () => {
    const parameters = {
      core: { frequency: 5, amplitude: 100 },
      custom: { frequency: 3, barCount: 40 },
      style: { fillColor: '#3b82f6' },
      content: { text: 'Hello' }
    };

    await generateJSVisualization(
      mockCtx,
      'wave-bars',
      parameters,
      0,
      800,
      600
    );

    // Core parameters should override custom parameters
    expect(mockTemplate.drawVisualization).toHaveBeenCalledWith(
      mockCtx,
      800,
      600,
      expect.objectContaining({
        frequency: 5, // Core value wins
        amplitude: 100, // Core value
        barCount: 40, // Custom value
        fillColor: '#3b82f6', // Style value
        text: 'Hello' // Content value
      }),
      0
    );
  });

  it('should handle missing parameter groups gracefully', async () => {
    const parameters = {
      core: { frequency: 5 },
      // No custom, style, or content
    };

    await generateJSVisualization(
      mockCtx,
      'wave-bars',
      parameters,
      0,
      800,
      600
    );

    expect(mockTemplate.drawVisualization).toHaveBeenCalledWith(
      mockCtx,
      800,
      600,
      expect.objectContaining({
        frequency: 5
      }),
      0
    );
  });

  it('should handle legacy customParameters field', async () => {
    const parameters = {
      core: { frequency: 5 },
      customParameters: { barCount: 50, frequency: 3 }
    };

    await generateJSVisualization(
      mockCtx,
      'wave-bars',
      parameters,
      0,
      800,
      600
    );

    // Core should still override legacy customParameters
    expect(mockTemplate.drawVisualization).toHaveBeenCalledWith(
      mockCtx,
      800,
      600,
      expect.objectContaining({
        frequency: 5, // Core wins
        barCount: 50 // From customParameters
      }),
      0
    );
  });

  it('should display error when template is not found', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (loadTemplate as any).mockResolvedValue(null);

    await generateJSVisualization(
      mockCtx,
      'non-existent',
      {},
      0,
      800,
      600
    );

    expect(mockCtx.fillStyle).toBe('#dc2626');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'Template Error',
      400,
      300
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle template execution errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockTemplate.drawVisualization.mockImplementation(() => {
      throw new Error('Template error');
    });

    await generateJSVisualization(
      mockCtx,
      'wave-bars',
      {},
      0,
      800,
      600
    );

    expect(mockCtx.fillStyle).toBe('#dc2626');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'Template error',
      400,
      320
    );
    
    consoleSpy.mockRestore();
  });

  it('should pass correct time parameter for animations', async () => {
    // Reset the mock to not throw errors
    mockTemplate.drawVisualization.mockImplementation(() => {});
    
    const currentTime = 1234.5;

    await generateJSVisualization(
      mockCtx,
      'wave-bars',
      {},
      currentTime,
      800,
      600
    );

    expect(mockTemplate.drawVisualization).toHaveBeenCalledWith(
      mockCtx,
      800,
      600,
      expect.any(Object),
      currentTime
    );
  });
});
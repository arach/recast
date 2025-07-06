import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeEditorTool } from '../CodeEditorTool';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';

// Mock the hooks
vi.mock('@/lib/hooks/useSelectedLogo');

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  )
}));

describe('CodeEditorTool', () => {
  const mockUpdateSelectedLogoCode = vi.fn();
  
  const defaultMockLogo = {
    id: 'test-logo',
    templateId: 'wave-bars',
    templateName: 'Wave Bars',
    code: 'function draw(ctx, width, height, params, time, utils) {\n  // Draw something\n}',
    parameters: {}
  };

  const defaultMockHookReturn = {
    logo: defaultMockLogo,
    updateSelectedLogoCode: mockUpdateSelectedLogoCode
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSelectedLogo as any).mockReturnValue(defaultMockHookReturn);
  });

  it('should display "No logo selected" when logo is null', () => {
    (useSelectedLogo as any).mockReturnValue({
      ...defaultMockHookReturn,
      logo: null
    });
    
    render(<CodeEditorTool />);
    
    expect(screen.getByText('No logo selected')).toBeInTheDocument();
  });

  it('should display the template code in the editor', () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(defaultMockLogo.code);
  });

  it('should show modified indicator when code changes', async () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    const newCode = 'function draw() { /* modified */ }';
    
    fireEvent.change(textarea, { target: { value: newCode } });
    
    await waitFor(() => {
      expect(screen.getByText('• Modified')).toBeInTheDocument();
    });
  });

  it('should enable Save button only when code is modified', () => {
    render(<CodeEditorTool />);
    
    const saveButton = screen.getByText('Save').closest('button');
    expect(saveButton).toBeDisabled();
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'modified code' } });
    
    expect(saveButton).not.toBeDisabled();
  });

  it('should save code when Save button is clicked', async () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    const newCode = 'function draw() { /* new code */ }';
    
    fireEvent.change(textarea, { target: { value: newCode } });
    
    const saveButton = screen.getByText('Save').closest('button');
    fireEvent.click(saveButton!);
    
    expect(mockUpdateSelectedLogoCode).toHaveBeenCalledWith(newCode);
  });

  it('should save code when Run button is clicked', async () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    const newCode = 'function draw() { /* new code */ }';
    
    fireEvent.change(textarea, { target: { value: newCode } });
    
    const runButton = screen.getByText('Run').closest('button');
    fireEvent.click(runButton!);
    
    expect(mockUpdateSelectedLogoCode).toHaveBeenCalledWith(newCode);
  });

  it('should show error message for invalid code', async () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    const invalidCode = 'function draw() { invalid';
    
    fireEvent.change(textarea, { target: { value: invalidCode } });
    
    const saveButton = screen.getByText('Save').closest('button');
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Unexpected token/)).toBeInTheDocument();
    });
    
    expect(mockUpdateSelectedLogoCode).not.toHaveBeenCalled();
  });

  it('should clear error when valid code is entered after error', async () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    
    // First, cause an error
    const invalidCode = 'function draw() { invalid';
    fireEvent.change(textarea, { target: { value: invalidCode } });
    fireEvent.click(screen.getByText('Save').closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByText(/Unexpected token/)).toBeInTheDocument();
    });
    
    // Then fix the code
    const validCode = 'function draw() { /* valid */ }';
    fireEvent.change(textarea, { target: { value: validCode } });
    
    // Error should be cleared immediately on typing
    expect(screen.queryByText(/Unexpected token/)).not.toBeInTheDocument();
  });

  it('should reset dirty state after successful save', async () => {
    render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    const newCode = 'function draw() { /* new code */ }';
    
    fireEvent.change(textarea, { target: { value: newCode } });
    expect(screen.getByText('• Modified')).toBeInTheDocument();
    
    const saveButton = screen.getByText('Save').closest('button');
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(screen.queryByText('• Modified')).not.toBeInTheDocument();
    });
  });

  it('should update code when logo changes', () => {
    const { rerender } = render(<CodeEditorTool />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(defaultMockLogo.code);
    
    // Update the mock to return a different logo
    const newLogo = {
      ...defaultMockLogo,
      id: 'different-logo',
      code: 'function draw() { /* different template */ }'
    };
    
    (useSelectedLogo as any).mockReturnValue({
      ...defaultMockHookReturn,
      logo: newLogo
    });
    
    rerender(<CodeEditorTool />);
    
    expect(textarea).toHaveValue(newLogo.code);
  });
});
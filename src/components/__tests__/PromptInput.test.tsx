import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptInput } from '../PromptInput';

describe('PromptInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(<PromptInput value="" onChange={mockOnChange} />);
    
    expect(screen.getByLabelText('Prompt')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe what you want to generate...')).toBeInTheDocument();
    expect(screen.getByText('Be specific about the style, mood, and details you want in the generated image.')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Enter your custom prompt here';
    render(<PromptInput value="" onChange={mockOnChange} placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('displays the current value', () => {
    const value = 'A beautiful sunset over mountains';
    render(<PromptInput value={value} onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    render(<PromptInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByLabelText('Prompt');
    await user.type(textarea, 'Hello world');
    
    expect(mockOnChange).toHaveBeenCalledWith('Hello world');
  });

  it('has proper accessibility attributes', () => {
    render(<PromptInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByLabelText('Prompt');
    expect(textarea).toHaveAttribute('id', 'prompt-input');
    expect(textarea).toHaveAttribute('aria-describedby', 'prompt-help');
    
    const helpText = screen.getByText('Be specific about the style, mood, and details you want in the generated image.');
    expect(helpText).toHaveAttribute('id', 'prompt-help');
  });
});

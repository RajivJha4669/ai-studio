import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StyleSelector } from '../StyleSelector';

describe('StyleSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all style options', () => {
    render(<StyleSelector value="Editorial" onChange={mockOnChange} />);
    
    expect(screen.getByLabelText('Style')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Editorial')).toBeInTheDocument();
    
    // Check that all style options are present
    const select = screen.getByLabelText('Style');
    expect(select).toContainHTML('<option value="Editorial">Editorial</option>');
    expect(select).toContainHTML('<option value="Streetwear">Streetwear</option>');
    expect(select).toContainHTML('<option value="Vintage">Vintage</option>');
    expect(select).toContainHTML('<option value="Minimalist">Minimalist</option>');
    expect(select).toContainHTML('<option value="Artistic">Artistic</option>');
  });

  it('displays the current value', () => {
    render(<StyleSelector value="Vintage" onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('Vintage')).toBeInTheDocument();
  });

  it('calls onChange when user selects different option', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="Editorial" onChange={mockOnChange} />);
    
    const select = screen.getByLabelText('Style');
    await user.selectOptions(select, 'Streetwear');
    
    expect(mockOnChange).toHaveBeenCalledWith('Streetwear');
  });

  it('has proper accessibility attributes', () => {
    render(<StyleSelector value="Editorial" onChange={mockOnChange} />);
    
    const select = screen.getByLabelText('Style');
    expect(select).toHaveAttribute('id', 'style-selector');
    expect(select).toHaveAttribute('aria-describedby', 'style-help');
    
    const helpText = screen.getByText('Choose a style that matches your vision for the generated image.');
    expect(helpText).toHaveAttribute('id', 'style-help');
  });
});

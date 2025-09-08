import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerateButton } from '../GenerateButton';

describe('GenerateButton', () => {
  const mockOnGenerate = jest.fn();
  const mockOnAbort = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders generate button when not generating', () => {
    render(
      <GenerateButton
        isGenerating={false}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={null}
        retryCount={0}
      />
    );
    
    expect(screen.getByText('✨ Generate Magic')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('renders abort button when generating', () => {
    render(
      <GenerateButton
        isGenerating={true}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={null}
        retryCount={0}
      />
    );
    
    expect(screen.getByText('Abort Generation')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('is disabled when cannot generate', () => {
    render(
      <GenerateButton
        isGenerating={false}
        canGenerate={false}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={null}
        retryCount={0}
      />
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onGenerate when generate button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GenerateButton
        isGenerating={false}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={null}
        retryCount={0}
      />
    );
    
    await user.click(screen.getByText('✨ Generate Magic'));
    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  it('calls onAbort when abort button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GenerateButton
        isGenerating={true}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={null}
        retryCount={0}
      />
    );
    
    await user.click(screen.getByText('Abort Generation'));
    expect(mockOnAbort).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error occurs', () => {
    const errorMessage = 'Model overloaded';
    render(
      <GenerateButton
        isGenerating={false}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={errorMessage}
        retryCount={1}
      />
    );
    
    expect(screen.getByText('Generation Failed')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(/Retry attempt 2 of 3 will happen automatically/)).toBeInTheDocument();
  });

  it('shows max retries reached message', () => {
    const errorMessage = 'Model overloaded';
    render(
      <GenerateButton
        isGenerating={false}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={errorMessage}
        retryCount={3}
      />
    );
    
    expect(screen.getByText(/Maximum retry attempts reached. Please try again manually/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const errorMessage = 'Model overloaded';
    render(
      <GenerateButton
        isGenerating={false}
        canGenerate={true}
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        error={errorMessage}
        retryCount={1}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'generate-error');
    
    const errorDiv = screen.getByText('Generation Failed').closest('div')?.parentElement;
    expect(errorDiv).toHaveAttribute('id', 'generate-error');
    expect(errorDiv).toHaveAttribute('role', 'alert');
  });
});

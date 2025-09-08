import { GenerationHistoryItem } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerationHistory } from '../GenerationHistory';

describe('GenerationHistory', () => {
  const mockOnRestore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when no history', () => {
    render(<GenerationHistory history={[]} onRestore={mockOnRestore} />);
    
    expect(screen.getByText('Generation History')).toBeInTheDocument();
    expect(screen.getByText('Your recent generations will appear here')).toBeInTheDocument();
  });

  it('displays history items', () => {
    const history: GenerationHistoryItem[] = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        prompt: 'A beautiful sunset',
        style: 'Editorial',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        imageUrl: 'https://example.com/image2.jpg',
        prompt: 'A mountain landscape',
        style: 'Vintage',
        createdAt: '2024-01-02T00:00:00Z',
      },
    ];

    render(<GenerationHistory history={history} onRestore={mockOnRestore} />);
    
    expect(screen.getByText('Generation History')).toBeInTheDocument();
    expect(screen.getByText('A beautiful sunset')).toBeInTheDocument();
    expect(screen.getByText('A mountain landscape')).toBeInTheDocument();
    expect(screen.getByText('Editorial')).toBeInTheDocument();
    expect(screen.getByText('Vintage')).toBeInTheDocument();
  });

  it('calls onRestore when history item is clicked', async () => {
    const user = userEvent.setup();
    const history: GenerationHistoryItem[] = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        prompt: 'A beautiful sunset',
        style: 'Editorial',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    render(<GenerationHistory history={history} onRestore={mockOnRestore} />);
    
    await user.click(screen.getByText('A beautiful sunset'));
    
    expect(mockOnRestore).toHaveBeenCalledWith(history[0]);
  });

  it('displays formatted dates', () => {
    const history: GenerationHistoryItem[] = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        prompt: 'A beautiful sunset',
        style: 'Editorial',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    render(<GenerationHistory history={history} onRestore={mockOnRestore} />);
    
    // The exact format depends on the user's locale, but it should be a date
    expect(screen.getByText(/1\/1\/2024|2024-01-01/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const history: GenerationHistoryItem[] = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        prompt: 'A beautiful sunset',
        style: 'Editorial',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    render(<GenerationHistory history={history} onRestore={mockOnRestore} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Restore generation from'));
  });
});

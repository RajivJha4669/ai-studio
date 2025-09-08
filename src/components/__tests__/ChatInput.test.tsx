import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../ChatInput';

// Mock the ImageCropper component
jest.mock('../ImageCropper', () => ({
  ImageCropper: ({ onCrop, onCancel }: any) => (
    <div data-testid="image-cropper">
      <button onClick={() => onCrop('data:image/jpeg;base64,cropped')}>Crop</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

// Mock the image utilities
jest.mock('@/utils/imageUtils', () => ({
  STYLE_OPTIONS: ['Editorial', 'Streetwear', 'Vintage', 'Minimalist', 'Artistic'],
}));

describe('ChatInput', () => {
  const mockOnSend = jest.fn();
  const mockOnLivePreview = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    expect(screen.getByPlaceholderText('Describe what you want to generate...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Enter your message here';
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
        placeholder={customPlaceholder}
      />
    );
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('renders style selector with all options', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    expect(screen.getByText('Style:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Editorial')).toBeInTheDocument();
  });

  it('calls onSend when message is sent', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    await user.type(textarea, 'Test message');
    
    const sendButton = screen.getByTitle('Send message');
    await user.click(sendButton);
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message', undefined, 'Editorial');
  });

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    await user.type(textarea, 'Test message');
    await user.keyboard('{Enter}');
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message', undefined, 'Editorial');
  });

  it('does not send message on Shift+Enter', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    await user.type(textarea, 'Test message');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('handles file upload', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const fileInput = screen.getByRole('button', { name: /upload image/i });
    await user.click(fileInput);
    
    const input = screen.getByDisplayValue('');
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
  });

  it('handles paste image', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    
    // Mock clipboard data
    const clipboardData = {
      items: [{
        type: 'image/jpeg',
        getAsFile: () => file
      }]
    };
    
    fireEvent.paste(textarea, { clipboardData });
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
  });

  it('shows image preview when image is attached', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const fileInput = screen.getByRole('button', { name: /upload image/i });
    await user.click(fileInput);
    
    const input = screen.getByDisplayValue('');
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Crop'));
    
    await waitFor(() => {
      expect(screen.getByText('Image attached')).toBeInTheDocument();
    });
  });

  it('removes image when remove button is clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const fileInput = screen.getByRole('button', { name: /upload image/i });
    await user.click(fileInput);
    
    const input = screen.getByDisplayValue('');
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Crop'));
    
    await waitFor(() => {
      expect(screen.getByText('Image attached')).toBeInTheDocument();
    });
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    
    expect(screen.queryByText('Image attached')).not.toBeInTheDocument();
  });

  it('calls onLivePreview when inputs change', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        onSend={mockOnSend}
        onLivePreview={mockOnLivePreview}
        isGenerating={false}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    await user.type(textarea, 'Test');
    
    expect(mockOnLivePreview).toHaveBeenCalledWith('', 'Test', 'Editorial');
  });

  it('disables inputs when generating', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={true}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    const styleSelect = screen.getByDisplayValue('Editorial');
    const fileButton = screen.getByRole('button', { name: /upload image/i });
    
    expect(textarea).toBeDisabled();
    expect(styleSelect).toBeDisabled();
    expect(fileButton).toBeDisabled();
  });

  it('shows help text', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    expect(screen.getByText(/Press Enter to send, Shift\+Enter for new line/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        isGenerating={false}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Describe what you want to generate...');
    expect(textarea).toBeInTheDocument();
    
    const fileButton = screen.getByRole('button', { name: /upload image/i });
    expect(fileButton).toHaveAttribute('title', 'Upload image');
    
    const sendButton = screen.getByTitle('Send message');
    expect(sendButton).toBeInTheDocument();
  });
});

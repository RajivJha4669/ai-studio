import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from '../ImageUpload';

// Mock the image utilities
jest.mock('@/utils/imageUtils', () => ({
  validateImageFile: jest.fn(),
  createImagePreview: jest.fn(),
}));

// Mock the ImageCropper component
jest.mock('../ImageCropper', () => ({
  ImageCropper: ({ onCrop, onCancel }: any) => (
    <div data-testid="image-cropper">
      <button onClick={() => onCrop('data:image/jpeg;base64,cropped')}>Crop</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

import { createImagePreview, validateImageFile } from '@/utils/imageUtils';

const mockValidateImageFile = validateImageFile as jest.MockedFunction<typeof validateImageFile>;
const mockCreateImagePreview = createImagePreview as jest.MockedFunction<typeof createImagePreview>;

describe('ImageUpload', () => {
  const mockOnImageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area when no image is selected', () => {
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('or drag and drop')).toBeInTheDocument();
  });

  it('shows validation error for invalid file', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    mockValidateImageFile.mockReturnValue('Please select an image file');
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    expect(screen.getByText('Please select an image file')).toBeInTheDocument();
    expect(mockOnImageChange).not.toHaveBeenCalled();
  });

  it('opens cropper for valid image file', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
  });

  it('calls onImageChange when crop is completed', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Crop'));
    
    expect(mockOnImageChange).toHaveBeenCalledWith('data:image/jpeg;base64,cropped', file);
  });

  it('cancels cropping when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Cancel'));
    
    expect(screen.queryByTestId('image-cropper')).not.toBeInTheDocument();
    expect(mockOnImageChange).not.toHaveBeenCalled();
  });

  it('handles drag and drop', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const dropZone = screen.getByText('Click to upload').closest('div')!;
    
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('image-cropper')).toBeInTheDocument();
    });
  });
});

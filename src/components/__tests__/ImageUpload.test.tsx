import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from '../ImageUpload';

// Mock the image utilities
jest.mock('@/utils/imageUtils', () => ({
  validateImageFile: jest.fn(),
  createImagePreview: jest.fn(),
  downscaleImage: jest.fn(),
}));

import { createImagePreview, downscaleImage, validateImageFile } from '@/utils/imageUtils';

const mockValidateImageFile = validateImageFile as jest.MockedFunction<typeof validateImageFile>;
const mockCreateImagePreview = createImagePreview as jest.MockedFunction<typeof createImagePreview>;
const mockDownscaleImage = downscaleImage as jest.MockedFunction<typeof downscaleImage>;

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

  it('processes valid image file successfully', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    const processedUrl = 'data:image/jpeg;base64,processed';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    mockDownscaleImage.mockResolvedValue(processedUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(mockOnImageChange).toHaveBeenCalledWith(processedUrl, file);
    });
    
    expect(screen.getByAltText('Upload preview')).toBeInTheDocument();
  });

  it('shows remove button when image is uploaded', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    const processedUrl = 'data:image/jpeg;base64,processed';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    mockDownscaleImage.mockResolvedValue(processedUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('Remove image')).toBeInTheDocument();
    });
  });

  it('removes image when remove button is clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    const processedUrl = 'data:image/jpeg;base64,processed';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    mockDownscaleImage.mockResolvedValue(processedUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const input = screen.getByLabelText(/upload image/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('Remove image')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Remove image'));
    
    expect(mockOnImageChange).toHaveBeenCalledWith('', null);
    expect(screen.queryByAltText('Upload preview')).not.toBeInTheDocument();
  });

  it('handles drag and drop', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = 'data:image/jpeg;base64,test';
    const processedUrl = 'data:image/jpeg;base64,processed';
    
    mockValidateImageFile.mockReturnValue(null);
    mockCreateImagePreview.mockResolvedValue(previewUrl);
    mockDownscaleImage.mockResolvedValue(processedUrl);
    
    render(<ImageUpload onImageChange={mockOnImageChange} />);
    
    const dropZone = screen.getByText('Click to upload').closest('div')!;
    
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    await waitFor(() => {
      expect(mockOnImageChange).toHaveBeenCalledWith(processedUrl, file);
    });
  });
});

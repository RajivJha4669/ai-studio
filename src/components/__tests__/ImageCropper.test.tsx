import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ImageCropper } from '../ImageCropper';

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('ImageCropper', () => {
  const mockOnCrop = jest.fn();
  const mockOnCancel = jest.fn();
  const mockImageUrl = 'data:image/jpeg;base64,test';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders crop modal with title and close button', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('Crop Image')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  it('calls onCancel when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    const closeButton = screen.getAllByRole('button')[0];
    await user.click(closeButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('shows crop and use button', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('Crop & Use')).toBeInTheDocument();
  });

  it('shows help text with max dimension', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
        maxDimension={1920}
      />
    );
    
    expect(screen.getByText(/Auto-resizes to 1920px max/)).toBeInTheDocument();
  });

  it('uses custom max dimension', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
        maxDimension={1024}
      />
    );
    
    expect(screen.getByText(/Auto-resizes to 1024px max/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    const closeButton = screen.getAllByRole('button')[0];
    expect(closeButton).toBeInTheDocument();
    
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    
    const cropButton = screen.getByText('Crop & Use');
    expect(cropButton).toBeInTheDocument();
  });

  it('renders with dark backdrop', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    const backdrop = screen.getByText('Crop Image').closest('div')?.parentElement?.parentElement;
    expect(backdrop).toHaveClass('bg-black/80');
  });

  it('renders modal with proper styling', () => {
    render(
      <ImageCropper
        imageUrl={mockImageUrl}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );
    
    const modal = screen.getByText('Crop Image').closest('div')?.parentElement;
    expect(modal).toHaveClass('bg-card', 'border', 'border-border', 'rounded-2xl');
  });
});

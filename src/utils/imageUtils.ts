import { StyleOption } from '@/types';

export const STYLE_OPTIONS: StyleOption[] = [
  'Editorial',
  'Streetwear', 
  'Vintage',
  'Minimalist',
  'Artistic'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_DIMENSION = 1920;

export const validateImageFile = (file: File): string | null => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file';
  }

  // Check if it's PNG or JPG
  if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    return 'Only PNG and JPG files are supported';
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 10MB';
  }

  return null;
};

export const downscaleImage = (
  file: File,
  maxDimension: number = MAX_IMAGE_DIMENSION
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions if image is too large
      if (width > maxDimension || height > maxDimension) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxDimension;
          height = width / aspectRatio;
        } else {
          height = maxDimension;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL with compression
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

import { StyleOption } from '@/types';

export type { StyleOption };
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

// Image downscaling is now handled by the ImageCropper component

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

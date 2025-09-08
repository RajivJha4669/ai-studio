'use client';

import { ImageUploadState } from '@/types';
import { createImagePreview, downscaleImage, validateImageFile } from '@/utils/imageUtils';
import React, { useCallback, useState } from 'react';

interface ImageUploadProps {
  onImageChange: (dataUrl: string, file: File) => void;
  currentImage?: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = React.memo(({
  onImageChange,
  currentImage,
}) => {
  const [state, setState] = useState<ImageUploadState>({
    file: null,
    preview: currentImage || null,
    error: null,
  });

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        setState(prev => ({ ...prev, error: validationError }));
        return;
      }

      setState(prev => ({ ...prev, error: null, file }));

      try {
        // Create preview
        const preview = await createImagePreview(file);
        
        // Downscale if needed
        const processedImage = await downscaleImage(file);
        
        setState(prev => ({ ...prev, preview }));
        onImageChange(processedImage, file);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to process image',
        }));
      }
    },
    [onImageChange]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const file = event.dataTransfer.files[0];
      if (!file) return;

      // Create a synthetic event to reuse the existing handler
      const syntheticEvent = {
        target: { files: [file] },
      } as React.ChangeEvent<HTMLInputElement>;

      await handleFileChange(syntheticEvent);
    },
    [handleFileChange]
  );

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Upload Image
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          state.error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="hidden"
          aria-describedby={state.error ? 'upload-error' : undefined}
        />
        
        {state.preview ? (
          <div className="space-y-4">
            <img
              src={state.preview}
              alt="Upload preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
            />
            <button
              type="button"
              onClick={() => {
                setState({ file: null, preview: null, error: null });
                onImageChange('', null as any);
              }}
              className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:underline"
            >
              Remove image
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Click to upload
              </label>
              <span className="pl-1">or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 10MB (will be downscaled to max 1920px)
            </p>
          </div>
        )}
      </div>

      {state.error && (
        <p
          id="upload-error"
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {state.error}
        </p>
      )}
    </div>
  );
});

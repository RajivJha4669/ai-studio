'use client';

import { ImageUploadState } from '@/types';
import { createImagePreview, validateImageFile } from '@/utils/imageUtils';
import React, { useCallback, useState } from 'react';
import { ImageCropper } from './ImageCropper';

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
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string>('');

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
        // Create preview for cropper
        const preview = await createImagePreview(file);
        setCropperImage(preview);
        setShowCropper(true);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to process image',
        }));
      }
    },
    []
  );

  const handleCropComplete = useCallback((croppedDataUrl: string) => {
    setState(prev => ({ ...prev, preview: croppedDataUrl }));
    onImageChange(croppedDataUrl, state.file!);
    setShowCropper(false);
  }, [onImageChange, state.file]);

  const handleCropCancel = useCallback(() => {
    setShowCropper(false);
    setState(prev => ({ ...prev, file: null }));
  }, []);

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

  const handleRemoveImage = useCallback(() => {
    setState({ file: null, preview: null, error: null });
    onImageChange('', null as any);
  }, [onImageChange]);

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        className="block text-sm font-semibold text-foreground mb-3"
      >
        📸 Upload Image
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 group ${
          state.error
            ? 'border-destructive bg-destructive/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/20'
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
            <div className="relative group">
              <img
                src={state.preview}
                alt="Upload preview"
                className="max-w-full max-h-64 mx-auto rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300" />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-destructive/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove Image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-primary"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer font-semibold text-primary hover:text-primary/80 focus:outline-none focus:underline transition-colors duration-200"
                >
                  Click to upload
                </label>
                <span className="pl-1">or drag and drop</span>
              </div>
              <p className="text-xs text-muted-foreground/70">
                PNG, JPG up to 10MB • Auto-resized to 1920px max
              </p>
            </div>
          </div>
        )}
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {state.error && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p
            id="upload-error"
            className="text-sm text-destructive flex items-center"
            role="alert"
          >
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {state.error}
          </p>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && (
        <ImageCropper
          imageUrl={cropperImage}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
          maxDimension={1920}
        />
      )}
    </div>
  );
});

'use client';

import { STYLE_OPTIONS, StyleOption } from '@/utils/imageUtils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageCropper } from './ImageCropper';

interface ChatInputProps {
  onSend: (message: string, imageDataUrl?: string, style?: StyleOption) => void;
  onLivePreview?: (imageUrl: string, prompt: string, style: string) => void;
  isGenerating: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onLivePreview,
  isGenerating,
  placeholder = "Describe what you want to generate...",
}) => {
  const [message, setMessage] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(STYLE_OPTIONS[0]);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (!message.trim() && !imageDataUrl) return;
    
    onSend(message.trim(), imageDataUrl || undefined, selectedStyle);
    setMessage('');
    setImageDataUrl('');
  }, [message, imageDataUrl, selectedStyle, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Only PNG and JPG files are supported');
      return;
    }

    // Always open cropper for images (no size limit check here)
    // The cropper will handle resizing to 1920px max dimension
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setCropperImage(result);
        setShowCropper(true);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
        }
        return;
      }
    }
  }, [handleFileSelect]);

  const handleCropComplete = useCallback((croppedDataUrl: string) => {
    setImageDataUrl(croppedDataUrl);
    setShowCropper(false);
  }, []);

  // Update live preview when inputs change
  useEffect(() => {
    if (onLivePreview) {
      onLivePreview(imageDataUrl, message, selectedStyle);
    }
  }, [imageDataUrl, message, selectedStyle, onLivePreview]);

  const handleCropCancel = useCallback(() => {
    setShowCropper(false);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageDataUrl('');
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const getStyleEmoji = (style: StyleOption) => {
    const emojiMap: Record<StyleOption, string> = {
      'Editorial': '📰',
      'Streetwear': '👟',
      'Vintage': '📻',
      'Minimalist': '⚪',
      'Artistic': '🎨',
    };
    return emojiMap[style] || '🎨';
  };

  return (
    <div className="w-full space-y-3">
      {/* Style Selector */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-foreground">Style:</span>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value as StyleOption)}
          className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
          disabled={isGenerating}
        >
          {STYLE_OPTIONS.map((style) => (
            <option key={style} value={style}>
              {getStyleEmoji(style)} {style}
            </option>
          ))}
        </select>
      </div>

      {/* Image Preview */}
      {imageDataUrl && (
        <div className="p-3 bg-muted/30 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={imageDataUrl}
                alt="Upload preview"
                className="w-12 h-12 object-cover rounded-lg border border-border"
              />
              <div>
                <p className="text-sm font-medium text-foreground">Image attached</p>
                <p className="text-xs text-muted-foreground">Ready to generate</p>
              </div>
            </div>
            <button
              onClick={handleRemoveImage}
              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <div className="flex items-end space-x-2 p-3 border border-border rounded-xl bg-card focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="w-full resize-none border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground/60 min-h-[24px] max-h-32"
              rows={1}
              disabled={isGenerating}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* File Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Upload image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={(!message.trim() && !imageDataUrl) || isGenerating}
              className={`relative p-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                (!message.trim() && !imageDataUrl) || isGenerating
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 shadow-lg hover:shadow-xl cursor-pointer'
              }`}
              title="Send message"
            >
              {isGenerating ? (
                <div className="w-5 h-5">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5l7 7-7 7M5 12h14" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Help Text */}
      <div className="mt-2 text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line. Paste images directly or click the image icon to upload.
      </div>

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
};

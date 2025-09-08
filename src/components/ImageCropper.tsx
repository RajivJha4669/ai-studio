'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedDataUrl: string) => void;
  onCancel: () => void;
  maxDimension?: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCrop,
  onCancel,
  maxDimension = 1920,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 100, y: 75, width: 200, height: 150 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 400, height: 300, offsetX: 0, offsetY: 0 });
  const [mounted, setMounted] = useState(false);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset when image URL changes
  useEffect(() => {
    setImageLoaded(false);
    // Center the crop area in the 400x300 canvas
    setCropArea({ x: 100, y: 75, width: 200, height: 150 });
    
    // Fallback timeout - force show after 3 seconds
    const timeout = setTimeout(() => {
      console.log('Forcing image load after timeout');
      setImageLoaded(true);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [imageUrl]);

  const drawCropOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img || !imageLoaded) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;
    
    // Calculate image scaling to fit canvas while maintaining aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = 400 / 300;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspect > canvasAspect) {
      // Image is wider - fit to canvas width
      drawWidth = 400;
      drawHeight = 400 / imgAspect;
      offsetX = 0;
      offsetY = (300 - drawHeight) / 2;
    } else {
      // Image is taller - fit to canvas height
      drawHeight = 300;
      drawWidth = 300 * imgAspect;
      offsetX = (400 - drawWidth) / 2;
      offsetY = 0;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, 400, 300);
    
    // Draw the image with proper scaling
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // Draw dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, 400, 300);
    
    // Clear crop area to show original image
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    // Redraw image in crop area only
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.clip();
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
    
    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    const handles = [
      [cropArea.x - handleSize/2, cropArea.y - handleSize/2],
      [cropArea.x + cropArea.width - handleSize/2, cropArea.y - handleSize/2],
      [cropArea.x - handleSize/2, cropArea.y + cropArea.height - handleSize/2],
      [cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2]
    ];
    
    handles.forEach(([x, y]) => {
      ctx.fillRect(x, y, handleSize, handleSize);
    });
    
    // Store the image dimensions for cropping
    setImageDimensions({ 
      width: drawWidth, 
      height: drawHeight, 
      offsetX, 
      offsetY 
    });
  }, [cropArea, imageLoaded]);

  const handleImageLoad = useCallback(() => {
    console.log('Image loaded successfully');
    setImageLoaded(true);
    
    // Center the crop area based on the actual image dimensions
    const img = imageRef.current;
    if (img) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = 400 / 300;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgAspect > canvasAspect) {
        // Image is wider - fit to canvas width
        drawWidth = 400;
        drawHeight = 400 / imgAspect;
        offsetX = 0;
        offsetY = (300 - drawHeight) / 2;
      } else {
        // Image is taller - fit to canvas height
        drawHeight = 300;
        drawWidth = 300 * imgAspect;
        offsetX = (400 - drawWidth) / 2;
        offsetY = 0;
      }
      
      // Center crop area within the visible image area
      const cropWidth = Math.min(200, drawWidth * 0.8);
      const cropHeight = Math.min(150, drawHeight * 0.8);
      const cropX = offsetX + (drawWidth - cropWidth) / 2;
      const cropY = offsetY + (drawHeight - cropHeight) / 2;
      
      setCropArea({
        x: Math.max(0, Math.min(cropX, 400 - cropWidth)),
        y: Math.max(0, Math.min(cropY, 300 - cropHeight)),
        width: cropWidth,
        height: cropHeight
      });
    }
  }, []);

  const handleImageError = useCallback(() => {
    console.error('Failed to load image:', imageUrl);
    setImageLoaded(true); // Show canvas anyway
  }, [imageUrl]);

  // Force load check after component mounts
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      console.log('Image already loaded');
      setImageLoaded(true);
    }
  }, [imageUrl]);

  // Redraw when crop area changes
  useEffect(() => {
    if (imageLoaded) {
      drawCropOverlay();
    }
  }, [cropArea, imageLoaded, drawCropOverlay]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageLoaded) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
  }, [imageLoaded]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imageLoaded) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    setCropArea(prev => ({
      x: Math.max(0, Math.min(prev.x + deltaX, 400 - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, 300 - prev.height)),
      width: prev.width,
      height: prev.height,
    }));
    
    setDragStart({ x, y });
  }, [isDragging, dragStart, imageLoaded]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCrop = useCallback(() => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const cropCanvas = document.createElement('canvas');
    const ctx = cropCanvas.getContext('2d');
    
    if (!ctx) return;
    
    // Calculate scale factors from display to actual image
    const scaleX = img.naturalWidth / imageDimensions.width;
    const scaleY = img.naturalHeight / imageDimensions.height;
    
    // Adjust crop coordinates relative to the actual image position
    const adjustedCropX = (cropArea.x - imageDimensions.offsetX) * scaleX;
    const adjustedCropY = (cropArea.y - imageDimensions.offsetY) * scaleY;
    const adjustedCropWidth = cropArea.width * scaleX;
    const adjustedCropHeight = cropArea.height * scaleY;
    
    // Ensure crop area is within image bounds
    const actualCropX = Math.max(0, Math.min(adjustedCropX, img.naturalWidth));
    const actualCropY = Math.max(0, Math.min(adjustedCropY, img.naturalHeight));
    const actualCropWidth = Math.min(adjustedCropWidth, img.naturalWidth - actualCropX);
    const actualCropHeight = Math.min(adjustedCropHeight, img.naturalHeight - actualCropY);
    
    // Set output size (resize if needed)
    let outputWidth = actualCropWidth;
    let outputHeight = actualCropHeight;
    
    if (outputWidth > maxDimension || outputHeight > maxDimension) {
      const aspectRatio = outputWidth / outputHeight;
      if (outputWidth > outputHeight) {
        outputWidth = maxDimension;
        outputHeight = outputWidth / aspectRatio;
      } else {
        outputHeight = maxDimension;
        outputWidth = outputHeight * aspectRatio;
      }
    }
    
    cropCanvas.width = outputWidth;
    cropCanvas.height = outputHeight;
    
    // Draw cropped image
    ctx.drawImage(
      img,
      actualCropX,
      actualCropY,
      actualCropWidth,
      actualCropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );
    
    const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.9);
    onCrop(dataUrl);
  }, [cropArea, imageDimensions, maxDimension, onCrop]);

  useEffect(() => {
    drawCropOverlay();
  }, [drawCropOverlay]);

  if (!mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
      style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Crop Image</h3>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-block border border-border rounded-lg overflow-hidden bg-gray-100">
              {imageLoaded ? (
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="cursor-move block"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              ) : (
                <div className="w-[400px] h-[300px] flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500">Loading image...</div>
                </div>
              )}
            </div>
            <img
              key={imageUrl}
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="hidden"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Drag the blue area to reposition. Auto-resizes to {maxDimension}px max.
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
            >
              Crop & Use
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

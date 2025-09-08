'use client';

import { StyleOption } from '@/types';
import React from 'react';

interface LiveSummaryProps {
  imageUrl: string | null;
  prompt: string;
  style: StyleOption;
}

export const LiveSummary: React.FC<LiveSummaryProps> = ({
  imageUrl,
  prompt,
  style,
}) => {
  const hasContent = imageUrl || prompt.trim() || style;

  if (!hasContent) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Live Summary</h3>
        <p className="text-sm text-gray-500 italic">
          Upload an image and add a prompt to see your generation summary
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Live Summary</h3>
      
      <div className="space-y-3">
        {imageUrl && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Image</h4>
            <img
              src={imageUrl}
              alt="Upload preview"
              className="w-20 h-20 object-cover rounded border"
            />
          </div>
        )}
        
        {prompt.trim() && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Prompt</h4>
            <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded border">
              {prompt}
            </p>
          </div>
        )}
        
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-1">Style</h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {style}
          </span>
        </div>
      </div>
    </div>
  );
};

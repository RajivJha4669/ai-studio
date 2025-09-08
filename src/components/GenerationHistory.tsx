'use client';

import { GenerationHistoryItem } from '@/types';
import React from 'react';

interface GenerationHistoryProps {
  history: GenerationHistoryItem[];
  onRestore: (item: GenerationHistoryItem) => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  onRestore,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Generation History</h3>
        <p className="text-sm text-gray-500 italic">
          Your recent generations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Generation History</h3>
      
      <div className="space-y-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onRestore(item)}
            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label={`Restore generation from ${new Date(item.createdAt).toLocaleString()}`}
          >
            <div className="flex items-start space-x-3">
              <img
                src={item.imageUrl}
                alt="Generated image"
                className="w-12 h-12 object-cover rounded border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {item.style}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-800 truncate">
                  {item.prompt}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

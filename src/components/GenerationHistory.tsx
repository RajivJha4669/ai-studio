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
      <div className="bg-muted/30 border border-border rounded-xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-2">No History Yet</h3>
        <p className="text-sm text-muted-foreground">
          Your recent generations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-2 h-6 bg-gradient-to-b from-accent to-primary rounded-full mr-3"></div>
          <h3 className="text-sm font-semibold text-foreground">Recent Generations</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {history.length} items
        </span>
      </div>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onRestore(item)}
            className="w-full text-left p-4 border border-border rounded-xl hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring group"
            aria-label={`Restore generation from ${new Date(item.createdAt).toLocaleString()}`}
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt="Generated image"
                  className="w-14 h-14 object-cover rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5"></span>
                    {item.style}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Click to restore
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

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
      <div className="bg-muted/30 border border-border rounded-xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Ready to Create</h3>
        <p className="text-sm text-muted-foreground">
          Upload an image and add a prompt to see your generation preview
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
        <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
      </div>
      
      <div className="space-y-4">
        {imageUrl && (
          <div className="group">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Image</h4>
            <div className="relative">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="w-24 h-24 object-cover rounded-xl border border-border shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        )}
        
        {prompt.trim() && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Prompt</h4>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-sm text-foreground leading-relaxed">
                {prompt}
              </p>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Style</h4>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            {style}
          </span>
        </div>
      </div>
    </div>
  );
};

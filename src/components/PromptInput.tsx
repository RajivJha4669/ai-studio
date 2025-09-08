'use client';

import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Describe what you want to generate...',
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor="prompt-input"
        className="block text-sm font-semibold text-foreground mb-3"
      >
        ✨ Creative Prompt
      </label>
      <div className="relative">
        <textarea
          id="prompt-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 bg-card border border-input rounded-xl shadow-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none transition-all duration-200 text-foreground"
          aria-describedby="prompt-help"
        />
        <div className="absolute top-3 right-3 text-muted-foreground/40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </div>
      <div className="mt-3 flex items-start space-x-2">
        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mt-0.5">
          <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p id="prompt-help" className="text-sm text-muted-foreground leading-relaxed">
          Be specific about the style, mood, colors, and details you want. The more descriptive, the better the results!
        </p>
      </div>
    </div>
  );
});

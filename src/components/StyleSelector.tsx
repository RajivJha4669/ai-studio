'use client';

import { STYLE_OPTIONS, StyleOption } from '@/utils/imageUtils';
import React from 'react';

interface StyleSelectorProps {
  value: StyleOption;
  onChange: (value: StyleOption) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
}) => {
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
    <div className="w-full">
      <label
        htmlFor="style-selector"
        className="block text-sm font-semibold text-foreground mb-3"
      >
        🎨 Art Style
      </label>
      <div className="relative">
        <select
          id="style-selector"
          value={value}
          onChange={(e) => onChange(e.target.value as StyleOption)}
          className="w-full px-4 py-3 bg-card border border-input rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground appearance-none cursor-pointer"
          aria-describedby="style-help"
        >
          {STYLE_OPTIONS.map((style) => (
            <option key={style} value={style}>
              {getStyleEmoji(style)} {style}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div className="mt-3 flex items-start space-x-2">
        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center mt-0.5">
          <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
        <p id="style-help" className="text-sm text-muted-foreground leading-relaxed">
          Choose a style that matches your vision. Each style applies different artistic techniques and aesthetics.
        </p>
      </div>
    </div>
  );
};

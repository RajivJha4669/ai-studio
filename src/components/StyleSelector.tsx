'use client';

import React from 'react';
import { STYLE_OPTIONS, StyleOption } from '@/utils/imageUtils';

interface StyleSelectorProps {
  value: StyleOption;
  onChange: (value: StyleOption) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor="style-selector"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Style
      </label>
      <select
        id="style-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as StyleOption)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-describedby="style-help"
      >
        {STYLE_OPTIONS.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
      <p id="style-help" className="mt-1 text-sm text-gray-500">
        Choose a style that matches your vision for the generated image.
      </p>
    </div>
  );
};

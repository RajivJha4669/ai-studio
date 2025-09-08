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
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Prompt
      </label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        aria-describedby="prompt-help"
      />
      <p id="prompt-help" className="mt-1 text-sm text-gray-500">
        Be specific about the style, mood, and details you want in the generated image.
      </p>
    </div>
  );
});

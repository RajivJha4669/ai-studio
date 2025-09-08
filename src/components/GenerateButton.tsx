'use client';

import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface GenerateButtonProps {
  isGenerating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  onAbort: () => void;
  error: string | null;
  retryCount: number;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  canGenerate,
  onGenerate,
  onAbort,
  error,
  retryCount,
}) => {
  const maxRetries = 3;
  const canRetry = error && retryCount < maxRetries;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={isGenerating ? onAbort : onGenerate}
        disabled={!isGenerating && !canGenerate}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isGenerating
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            : canGenerate
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        aria-describedby={error ? 'generate-error' : undefined}
      >
        {isGenerating ? (
          <>
            <LoadingSpinner className="-ml-1 mr-3 text-white" />
            Abort Generation
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate
          </>
        )}
      </button>

      {error && (
        <div
          id="generate-error"
          className="bg-red-50 border border-red-200 rounded-md p-3"
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                {canRetry && (
                  <p className="mt-1">
                    Retry attempt {retryCount + 1} of {maxRetries} will happen automatically.
                  </p>
                )}
                {!canRetry && retryCount >= maxRetries && (
                  <p className="mt-1 font-medium">
                    Maximum retry attempts reached. Please try again manually.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

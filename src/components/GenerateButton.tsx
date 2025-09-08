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
    <div className="space-y-4">
      <button
        type="button"
        onClick={isGenerating ? onAbort : onGenerate}
        disabled={!isGenerating && !canGenerate}
        className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden group ${
          isGenerating
            ? 'bg-destructive hover:bg-destructive/90 focus:ring-destructive/50 text-destructive-foreground'
            : canGenerate
            ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:ring-primary/50 text-primary-foreground pulse-glow'
            : 'bg-muted cursor-not-allowed text-muted-foreground'
        }`}
        aria-describedby={error ? 'generate-error' : undefined}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center">
          {isGenerating ? (
            <>
              <LoadingSpinner className="mr-3 text-current" />
              <span>Abort Generation</span>
            </>
          ) : (
            <>
              <div className="mr-3 p-1 bg-white/20 rounded-lg">
                <svg
                  className="w-5 h-5"
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
              </div>
              <span>✨ Generate Magic</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div
          id="generate-error"
          className="bg-destructive/10 border border-destructive/20 rounded-xl p-4"
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-destructive">Generation Failed</h3>
              <div className="mt-2 text-sm text-destructive/80">
                <p>{error}</p>
                {canRetry && (
                  <p className="mt-2 p-2 bg-destructive/5 rounded-lg border border-destructive/10">
                    🔄 Retry attempt {retryCount + 1} of {maxRetries} will happen automatically.
                  </p>
                )}
                {!canRetry && retryCount >= maxRetries && (
                  <p className="mt-2 p-2 bg-destructive/5 rounded-lg border border-destructive/10 font-medium">
                    ⚠️ Maximum retry attempts reached. Please try again manually.
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

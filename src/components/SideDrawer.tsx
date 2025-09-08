'use client';

import { GenerationHistoryItem } from '@/types';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onRestore: (item: GenerationHistoryItem) => void;
  onClearHistory: () => void;
  currentGeneration?: {
    imageUrl: string;
    prompt: string;
    style: string;
  } | null;
  isLivePreview?: boolean;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRestore,
  onClearHistory,
  currentGeneration,
  isLivePreview = false,
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">AI Studio</h2>
            <div className="flex items-center space-x-2">
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  title="Clear all history"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {/* Theme Toggle */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>

             {/* Current Generation Preview */}
             {currentGeneration && (
               <div className="p-4 border-b border-border">
                 <h3 className="text-sm font-semibold text-foreground mb-3">
                   {isLivePreview ? 'Live Preview' : 'Current Generation'}
                 </h3>
                <div className="space-y-3">
                  {currentGeneration.imageUrl && (
                    <div>
                      <img
                        src={currentGeneration.imageUrl}
                        alt="Current image"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}
                  {currentGeneration.prompt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Prompt</p>
                      <p className="text-sm text-foreground bg-muted/50 p-2 rounded-lg">
                        {currentGeneration.prompt}
                      </p>
                    </div>
                  )}
                  {currentGeneration.style && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Style</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {currentGeneration.style}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Generation History</h3>
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">No generations yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 3).map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => onRestore(item)}
                      className="w-full text-left p-3 border border-border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.imageUrl}
                          alt="Generated image"
                          className="w-12 h-12 object-cover rounded-lg border border-border group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                            {item.prompt}
                          </p>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {item.style}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Powered by AI Studio
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

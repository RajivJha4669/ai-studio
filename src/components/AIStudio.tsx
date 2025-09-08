'use client';

import {
    GenerationError,
    GenerationHistoryItem,
    GenerationRequest,
    GenerationResponse,
    GenerationState,
    StyleOption,
} from '@/types';
import { STYLE_OPTIONS } from '@/utils/imageUtils';
import React, { useCallback, useEffect, useState } from 'react';
import { GenerateButton } from './GenerateButton';
import { GenerationHistory } from './GenerationHistory';
import { ImageUpload } from './ImageUpload';
import { LiveSummary } from './LiveSummary';
import { PromptInput } from './PromptInput';
import { StyleSelector } from './StyleSelector';
import { ThemeToggle } from './ThemeToggle';

const HISTORY_STORAGE_KEY = 'ai-studio-history';
const MAX_HISTORY_ITEMS = 5;

export const AIStudio: React.FC = () => {
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<StyleOption>(STYLE_OPTIONS[0]);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    retryCount: 0,
    abortController: null,
  });

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history to localStorage:', error);
    }
  }, [history]);

  const handleImageChange = useCallback((dataUrl: string, file: File | null) => {
    setImageDataUrl(dataUrl);
  }, []);

  const addToHistory = useCallback((item: GenerationHistoryItem) => {
    setHistory(prev => {
      const newHistory = [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  }, []);

  const restoreFromHistory = useCallback((item: GenerationHistoryItem) => {
    setImageDataUrl(item.imageUrl);
    setPrompt(item.prompt);
    setStyle(item.style as StyleOption);
  }, []);

  const generateWithRetry = useCallback(
    async (request: GenerationRequest, attempt: number = 1): Promise<void> => {
      const maxRetries = 3;
      const abortController = new AbortController();

      setGenerationState(prev => ({
        ...prev,
        isGenerating: true,
        error: null,
        retryCount: attempt - 1,
        abortController,
      }));

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData: GenerationError = await response.json();
          throw new Error(errorData.message);
        }

        const result: GenerationResponse = await response.json();
        
        // Add to history
        addToHistory({
          id: result.id,
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          style: result.style,
          createdAt: result.createdAt,
        });

        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          error: null,
          retryCount: 0,
          abortController: null,
        }));
      } catch (error) {
        if (abortController.signal.aborted) {
          setGenerationState(prev => ({
            ...prev,
            isGenerating: false,
            error: null,
            retryCount: 0,
            abortController: null,
          }));
          return;
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (attempt < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          setTimeout(() => {
            generateWithRetry(request, attempt + 1);
          }, delay);
        } else {
          setGenerationState(prev => ({
            ...prev,
            isGenerating: false,
            error: errorMessage,
            retryCount: attempt,
            abortController: null,
          }));
        }
      }
    },
    [addToHistory]
  );

  const handleGenerate = useCallback(() => {
    if (!imageDataUrl || !prompt.trim()) {
      return;
    }

    const request: GenerationRequest = {
      imageDataUrl,
      prompt: prompt.trim(),
      style,
    };

    generateWithRetry(request);
  }, [imageDataUrl, prompt, style, generateWithRetry]);

  const handleAbort = useCallback(() => {
    if (generationState.abortController) {
      generationState.abortController.abort();
    }
  }, [generationState.abortController]);

  const canGenerate = imageDataUrl && prompt.trim() && !generationState.isGenerating;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 animated-bg opacity-5 pointer-events-none" />
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl float pointer-events-none" />
      <div className="fixed top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl float pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-20 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl float pointer-events-none" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
              AI Studio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your images with AI-powered creativity. Upload, describe, and generate amazing content with cutting-edge technology.
            </p>
          </div>
          
          {/* Theme Toggle */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Inputs */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
                Creative Inputs
              </h2>
              
              <div className="space-y-6">
                <ImageUpload
                  onImageChange={handleImageChange}
                  currentImage={imageDataUrl}
                />
                
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                />
                
                <StyleSelector
                  value={style}
                  onChange={setStyle}
                />
                
                <GenerateButton
                  isGenerating={generationState.isGenerating}
                  canGenerate={!!canGenerate}
                  onGenerate={handleGenerate}
                  onAbort={handleAbort}
                  error={generationState.error}
                  retryCount={generationState.retryCount}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary and History */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-secondary to-accent rounded-full mr-3"></span>
                Live Preview
              </h2>
              
              <LiveSummary
                imageUrl={imageDataUrl}
                prompt={prompt}
                style={style}
              />
            </div>
            
            <div className="glass rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-accent to-primary rounded-full mr-3"></span>
                Generation History
              </h2>
              
              <GenerationHistory
                history={history}
                onRestore={restoreFromHistory}
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Powered by advanced AI technology • Built with Next.js & React
          </p>
        </div>
      </div>
    </div>
  );
};

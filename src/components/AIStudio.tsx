'use client';

import {
    GenerationError,
    GenerationHistoryItem,
    GenerationRequest,
    GenerationResponse,
    GenerationState,
    StyleOption,
} from '@/types';
import { DEFAULT_RETRY_CONFIG, RetryableError, withRetry } from '@/utils/errorUtils';
import { STYLE_OPTIONS } from '@/utils/imageUtils';
import React, { useCallback, useEffect, useState } from 'react';
import { GenerateButton } from './GenerateButton';
import { GenerationHistory } from './GenerationHistory';
import { ImageUpload } from './ImageUpload';
import { LiveSummary } from './LiveSummary';
import { PromptInput } from './PromptInput';
import { StyleSelector } from './StyleSelector';

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
    async (request: GenerationRequest): Promise<void> => {
      const abortController = new AbortController();

      setGenerationState(prev => ({
        ...prev,
        isGenerating: true,
        error: null,
        retryCount: 0,
        abortController,
      }));

      try {
        const result = await withRetry(
          async () => {
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
              throw new RetryableError(errorData.message);
            }

            return response.json() as Promise<GenerationResponse>;
          },
          DEFAULT_RETRY_CONFIG,
          (attempt, error) => {
            setGenerationState(prev => ({
              ...prev,
              retryCount: attempt,
              error: error.message,
            }));
          }
        );
        
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
        
        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          error: errorMessage,
          retryCount: DEFAULT_RETRY_CONFIG.maxRetries,
          abortController: null,
        }));
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Studio</h1>
        <p className="text-gray-600">
          Upload an image, add a prompt, and generate amazing AI-powered content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
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

        {/* Right Column - Summary and History */}
        <div className="space-y-6">
          <LiveSummary
            imageUrl={imageDataUrl}
            prompt={prompt}
            style={style}
          />
          
          <GenerationHistory
            history={history}
            onRestore={restoreFromHistory}
          />
        </div>
      </div>
    </div>
  );
};

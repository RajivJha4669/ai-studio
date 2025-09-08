'use client';

import {
    GenerationError,
    GenerationHistoryItem,
    GenerationRequest,
    GenerationResponse,
    GenerationState,
} from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { ConfirmationDialog } from './ConfirmationDialog';
import { SideDrawer } from './SideDrawer';
import { TypingLoader } from './TypingLoader';

const HISTORY_STORAGE_KEY = 'ai-studio-history';
const MESSAGES_STORAGE_KEY = 'ai-studio-messages';
const MAX_HISTORY_ITEMS = 10;

export const ChatInterface: React.FC = () => {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    retryCount: 0,
    abortController: null,
  });
  const [currentGeneration, setCurrentGeneration] = useState<{
    imageUrl: string;
    prompt: string;
    style: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [livePreview, setLivePreview] = useState<{
    imageUrl: string;
    prompt: string;
    style: string;
  } | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    imageUrl?: string;
    style?: string;
    timestamp: Date;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load history and messages from localStorage on mount
  useEffect(() => {
    try {
      console.log('Loading data from localStorage...');
      
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      console.log('Stored history:', storedHistory);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        console.log('Parsed history:', parsedHistory);
        setHistory(parsedHistory);
      }
      
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      console.log('Stored messages:', storedMessages);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        console.log('Parsed messages:', parsedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      }
      
      // Mark initial load as complete
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      setIsInitialLoad(false);
    }
  }, []);

  // Save history to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      try {
        console.log('Saving history to localStorage:', history);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
    }
  }, [history, isInitialLoad]);

  // Save messages to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      try {
        console.log('Saving messages to localStorage:', messages);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages to localStorage:', error);
      }
    }
  }, [messages, isInitialLoad]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addToHistory = useCallback((item: GenerationHistoryItem) => {
    setHistory(prev => {
      const newHistory = [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  }, []);

  const restoreFromHistory = useCallback((item: GenerationHistoryItem) => {
    setCurrentGeneration({
      imageUrl: item.imageUrl,
      prompt: item.prompt,
      style: item.style,
    });
    setSidebarOpen(false);
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
        
        // Add AI message to chat
        const aiMessage = {
          id: result.id,
          type: 'ai' as const,
          content: result.prompt,
          imageUrl: result.imageUrl,
          style: result.style,
          timestamp: new Date(result.createdAt),
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Add to history
        addToHistory({
          id: result.id,
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          style: result.style,
          createdAt: result.createdAt,
        });

        // Update current generation
        setCurrentGeneration({
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          style: result.style,
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

  const handleSend = useCallback((message: string, imageDataUrl?: string, style?: string) => {
    if (!message.trim() && !imageDataUrl) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: message.trim(),
      imageUrl: imageDataUrl,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setHasGenerated(true);
    setSidebarOpen(true); // Auto-open sidebar after generation

    const request: GenerationRequest = {
      imageDataUrl: imageDataUrl || '',
      prompt: message.trim(),
      style: style || 'Artistic',
    };

    // Clear live preview when sending
    setLivePreview(null);
    generateWithRetry(request);
  }, [generateWithRetry]);

  const handleLivePreview = useCallback((imageUrl: string, prompt: string, style: string) => {
    if (imageUrl || prompt.trim()) {
      setLivePreview({
        imageUrl,
        prompt: prompt.trim(),
        style,
      });
    } else {
      setLivePreview(null);
    }
  }, []);

  const handleAbort = useCallback(() => {
    if (generationState.abortController) {
      generationState.abortController.abort();
    }
  }, [generationState.abortController]);

  const handleClearHistory = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const confirmClearHistory = useCallback(() => {
    setHistory([]);
    setMessages([]);
    setCurrentGeneration(null);
    setHasGenerated(false);
    setSidebarOpen(false);
    // Clear from localStorage
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear data from localStorage:', error);
    }
  }, []);

  const showCenteredLayout = !hasGenerated && history.length === 0 && messages.length === 0 && !currentGeneration && !generationState.isGenerating;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Menu Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Chat Content */}
        {showCenteredLayout ? (
          <div className="flex-1 flex flex-col justify-center items-center p-8">
            <div className="text-center max-w-2xl w-full">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Welcome to AI Studio
              </h2>
              <p className="text-muted-foreground mb-8">
                Describe what you want to generate, upload an image, or both. Our AI will create amazing content for you.
              </p>
              
              {/* Centered Chat Input */}
              <div className="max-w-2xl mx-auto">
                <ChatInput
                  onSend={handleSend}
                  onLivePreview={handleLivePreview}
                  isGenerating={generationState.isGenerating}
                  placeholder="Describe what you want to generate..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 pb-0 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
                    <p className="text-muted-foreground">Send a message to begin generating amazing content</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    type={message.type}
                    content={message.content}
                    imageUrl={message.imageUrl}
                    style={message.style}
                    timestamp={message.timestamp}
                  />
                ))
              )}
              
              {/* Typing Indicator */}
              {generationState.isGenerating && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="bg-card border border-border rounded-2xl px-4 py-3">
                      <TypingLoader />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error Display */}
              {generationState.error && (
                <div className="flex justify-start">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-2xl px-4 py-3 max-w-md">
                    <p className="text-sm text-destructive">❌ {generationState.error}</p>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Chat Input - Sticky at bottom, only show when not in centered layout */}
        {!showCenteredLayout && (
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
            <ChatInput
              onSend={handleSend}
              onLivePreview={handleLivePreview}
              isGenerating={generationState.isGenerating}
              placeholder="Describe what you want to generate..."
            />
          </div>
        )}
      </div>

      {/* Side Drawer - Show when opened */}
      {sidebarOpen && (
        <SideDrawer
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          history={history}
          onRestore={restoreFromHistory}
          onClearHistory={handleClearHistory}
          currentGeneration={currentGeneration || livePreview}
          isLivePreview={!currentGeneration && !!livePreview}
        />
      )}

      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmClearHistory}
        title="Clear All History"
        message="Are you sure you want to clear all generation history? This action cannot be undone and will remove all your previous generations."
        confirmText="Clear All"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

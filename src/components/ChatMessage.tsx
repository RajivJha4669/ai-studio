'use client';

import React from 'react';

interface ChatMessageProps {
  type: 'user' | 'ai';
  content: string;
  imageUrl?: string;
  style?: string;
  timestamp?: Date;
  isGenerating?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  imageUrl,
  style,
  timestamp,
  isGenerating = false,
}) => {
  const isUser = type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary'
          }`}>
            {isUser ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          
          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card border border-border'
          }`}>
            {/* Image */}
            {imageUrl && (
              <div className="mb-3">
                <img
                  src={imageUrl}
                  alt="Generated content"
                  className="max-w-full max-h-64 rounded-lg"
                />
              </div>
            )}
            
            {/* Text Content */}
            <div className="text-sm leading-relaxed">
              {content}
            </div>
            
            {/* Style Badge for AI messages */}
            {!isUser && style && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {style}
                </span>
              </div>
            )}
            
            {/* Timestamp */}
            {timestamp && (
              <div className={`text-xs mt-2 ${
                isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

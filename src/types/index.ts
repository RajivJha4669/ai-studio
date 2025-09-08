export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: string;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
}

export interface GenerationError {
  message: string;
}

export interface GenerationHistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
}

export type StyleOption = 'Editorial' | 'Streetwear' | 'Vintage' | 'Minimalist' | 'Artistic';

export interface ImageUploadState {
  file: File | null;
  preview: string | null;
  error: string | null;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  retryCount: number;
  abortController: AbortController | null;
}

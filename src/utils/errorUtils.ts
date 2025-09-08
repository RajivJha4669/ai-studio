export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export class RetryableError extends Error {
  constructor(message: string, public readonly isRetryable: boolean = true) {
    super(message);
    this.name = 'RetryableError';
  }
}

export const calculateRetryDelay = (
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number => {
  const delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
  return Math.min(delay, config.maxDelay);
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if it's not a retryable error
      if (error instanceof RetryableError && !error.isRetryable) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Call retry callback if provided
      onRetry?.(attempt, lastError);

      // Wait before retrying
      const delay = calculateRetryDelay(attempt, config);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};

export const isNetworkError = (error: Error): boolean => {
  return (
    error.name === 'NetworkError' ||
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('connection')
  );
};

export const createErrorHandler = (
  onError: (error: Error, context?: string) => void
) => {
  return (context?: string) => (error: unknown) => {
    const errorObj = error instanceof Error ? error : new Error(getErrorMessage(error));
    onError(errorObj, context);
  };
};

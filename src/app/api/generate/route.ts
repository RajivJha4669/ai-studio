import { GenerationError, GenerationRequest, GenerationResponse } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Simulate 20% error rate
const shouldSimulateError = () => Math.random() < 0.2;

// Simulate 1-2 second delay
const simulateDelay = () => Math.random() * 1000 + 1000;

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { imageDataUrl, prompt, style } = body;

    // Validate request
    if (!imageDataUrl || !prompt || !style) {
      return NextResponse.json(
        { message: 'Missing required fields' } as GenerationError,
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, simulateDelay()));

    // Simulate error 20% of the time
    if (shouldSimulateError()) {
      return NextResponse.json(
        { message: 'Model overloaded' } as GenerationError,
        { status: 500 }
      );
    }

    // Generate mock response
    const response: GenerationResponse = {
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: `https://picsum.photos/512/512?random=${Date.now()}`,
      prompt,
      style,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as GenerationError,
      { status: 500 }
    );
  }
}

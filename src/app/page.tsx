import { AIStudio } from '@/components/AIStudio';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AIStudio />
      </div>
    </ErrorBoundary>
  );
}

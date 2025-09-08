# AI Studio

A modern React web application that simulates an AI studio for generating amazing content with different styles. Built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Features

### Core Functionality
- **Image Upload & Preview**: Upload PNG/JPG images (≤10MB) with client-side downscaling to ≤1920px
- **Prompt Input**: Text input field for describing generation requirements
- **Style Selection**: Dropdown with 5 style options (Editorial, Streetwear, Vintage, Minimalist, Artistic)
- **Live Summary**: Real-time preview of image + prompt + style combination
- **Mock API Generation**: Simulated generation with 1-2s delay and 20% error rate
- **Generation History**: localStorage-based history of last 5 generations with restore functionality

### Advanced Features
- **Error Handling**: Exponential backoff retry logic (max 3 attempts) for failed requests
- **Loading States**: Spinner and abort functionality during generation
- **Accessibility**: Full keyboard navigation, focus states, and ARIA attributes
- **Performance**: React.memo optimizations and efficient re-rendering
- **PWA Ready**: Manifest file and offline-ready architecture
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4.0
- **Testing**: Jest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier
- **State Management**: React hooks (useState, useCallback, useEffect)
- **Storage**: localStorage for generation history

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Unit Tests (Watch Mode)
```bash
npm run test:watch
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/generate/      # Mock API endpoint
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── __tests__/         # Component unit tests
│   ├── AIStudio.tsx       # Main application component
│   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── GenerateButton.tsx # Generation button with loading states
│   ├── GenerationHistory.tsx # History display and restore
│   ├── ImageUpload.tsx    # File upload with validation
│   ├── LiveSummary.tsx    # Real-time preview
│   ├── PromptInput.tsx    # Text input for prompts
│   └── StyleSelector.tsx  # Style dropdown
├── types/                 # TypeScript type definitions
│   └── index.ts
└── utils/                 # Utility functions
    └── imageUtils.ts      # Image processing and validation
```

## 🎨 Design Decisions

### Architecture
- **Component-based**: Modular, reusable components with clear separation of concerns
- **Type Safety**: Strict TypeScript configuration for better development experience
- **Performance**: React.memo for preventing unnecessary re-renders
- **Error Handling**: Comprehensive error boundaries and user feedback

### User Experience
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Loading States**: Clear feedback during async operations

### Data Flow
- **Unidirectional**: Props down, callbacks up pattern
- **Local State**: React hooks for component state management
- **Persistence**: localStorage for generation history
- **API Integration**: RESTful API design with proper error handling

## 🔧 API Documentation

### POST /api/generate

Generates AI content based on uploaded image, prompt, and style.

**Request Body:**
```json
{
  "imageDataUrl": "data:image/jpeg;base64,...",
  "prompt": "A beautiful sunset over mountains",
  "style": "Editorial"
}
```

**Success Response (200):**
```json
{
  "id": "gen_1234567890_abc123",
  "imageUrl": "https://picsum.photos/512/512?random=1234567890",
  "prompt": "A beautiful sunset over mountains",
  "style": "Editorial",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (500):**
```json
{
  "message": "Model overloaded"
}
```

## 🚀 Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t ai-studio .
docker run -p 3000:3000 ai-studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Testing Library](https://testing-library.com/) for testing utilities
- [Playwright](https://playwright.dev/) for end-to-end testing
- [Picsum](https://picsum.photos/) for placeholder images in the mock API
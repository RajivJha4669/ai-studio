# AI Studio

A modern, ChatGPT-inspired React web application that simulates an AI studio for generating amazing content with different styles. Built with Next.js, TypeScript, and TailwindCSS, featuring a sleek dark/light theme interface with real-time chat functionality.

## 🚀 Features

### Core Functionality
- **Unified Chat Interface**: ChatGPT-like experience with text and image input in a single interface
- **Image Upload & Processing**: Upload PNG/JPG images (≤10MB) with interactive cropping and client-side downscaling to ≤1920px
- **Style Selection**: 5 style options (Editorial, Streetwear, Vintage, Minimalist, Artistic) with emoji integration
- **Live Preview**: Real-time preview of image + prompt + style combination
- **Mock API Generation**: Simulated generation with 1-2s delay and 20% error rate for realistic testing
- **Generation History**: localStorage-based history with restore functionality and custom confirmation dialogs

### Advanced Features
- **Error Handling**: Exponential backoff retry logic (max 3 attempts) for failed requests
- **Loading States**: Custom typing indicators and abort functionality during generation
- **Accessibility**: Full keyboard navigation, focus states, and ARIA attributes
- **Performance**: React.memo optimizations, efficient re-rendering, and code splitting
- **PWA Ready**: Manifest file and offline-ready architecture
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks
- **Theme System**: Dark/light mode with smooth transitions and persistent preferences

### User Experience
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Smooth Animations**: Custom scrollbars, backdrop blur effects, and transition animations
- **Data Persistence**: Chat messages and generation history saved to localStorage
- **Collapsible Sidebar**: Clean history management with custom confirmation dialogs
- **Auto-scroll**: Messages automatically scroll to show latest content
- **Image Cropping**: Interactive image cropper with precise control and preview

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4.0 with custom design system
- **Testing**: Jest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier
- **State Management**: React hooks (useState, useCallback, useEffect)
- **Storage**: localStorage for generation history and chat persistence
- **Image Processing**: Canvas API for client-side image manipulation

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
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── __tests__/         # Component unit tests
│   ├── ChatInterface.tsx  # Main chat interface
│   ├── ChatInput.tsx      # Unified input component
│   ├── ChatMessage.tsx    # Message display component
│   ├── ConfirmationDialog.tsx # Custom confirmation dialogs
│   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── ImageCropper.tsx   # Interactive image cropping
│   ├── SideDrawer.tsx     # Collapsible sidebar
│   ├── TypingLoader.tsx   # AI typing indicator
│   └── ThemeToggle.tsx    # Theme switcher
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Theme management
├── types/                 # TypeScript type definitions
│   └── index.ts
└── utils/                 # Utility functions
    ├── errorUtils.ts      # Error handling utilities
    └── imageUtils.ts      # Image processing utilities
```

## 🎨 Design Decisions

### Architecture
- **Component-based**: Modular, reusable components with clear separation of concerns
- **Type Safety**: Strict TypeScript configuration for better development experience
- **Performance**: React.memo, useCallback, and useMemo for preventing unnecessary re-renders
- **Error Handling**: Comprehensive error boundaries and user feedback

### User Experience
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Loading States**: Clear feedback during async operations
- **Data Persistence**: Seamless experience across browser sessions

### Data Flow
- **Unidirectional**: Props down, callbacks up pattern
- **Local State**: React hooks for component state management
- **Persistence**: localStorage for user data and preferences

## 🌟 Key Features in Detail

### Chat Interface
- **Unified Input**: Single input field for text and image uploads
- **Live Preview**: Real-time updates as you type or upload images
- **Message History**: Persistent chat messages with timestamps
- **Auto-scroll**: Automatically scrolls to show latest messages

### Image Processing
- **Interactive Cropping**: Drag to reposition, handles for resizing
- **Client-side Processing**: No server uploads, all processing in browser
- **Format Support**: PNG, JPG with automatic format detection
- **Size Optimization**: Automatic downscaling to optimal dimensions

### Theme System
- **Dark/Light Modes**: Smooth transitions between themes
- **Persistent Preferences**: Theme choice saved across sessions
- **System Integration**: Respects user's system preferences
- **Custom Design System**: Consistent colors, spacing, and typography

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Image Optimization**: Client-side processing reduces server load
- **Memoization**: Strategic use of React.memo and useCallback
- **Lazy Loading**: Components loaded only when needed
- **Bundle Optimization**: Tree shaking and dead code elimination

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured with Next.js and Prettier rules
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage with RTL and Playwright

## 📱 PWA Features

- **Manifest**: Complete PWA manifest with icons and metadata
- **Offline Ready**: Service worker architecture for offline functionality
- **Installable**: Can be installed as a native app on mobile devices
- **Responsive**: Optimized for all screen sizes

## 🎯 Future Enhancements

- **Real AI Integration**: Connect to actual AI image generation APIs
- **Advanced Image Editing**: More sophisticated image manipulation tools
- **Collaboration**: Real-time collaboration features
- **Export Options**: Multiple export formats and quality settings
- **Analytics**: Usage tracking and performance metrics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Developed with [Cursor](https://cursor.sh/) AI-powered editor
# CodeCrafters - Learning Content Generator

A modern, full-stack learning platform designed to help developers and tech enthusiasts explore technology domains, discover career paths, and leverage powerful tools for personalized learning experiences.

## 🚀 Features

### Core Features
- **Domain Explorer**: Browse and explore various technology domains including Web Development, Machine Learning, Cloud Computing, DevOps, and more
- **Career Path Guidance**: Interactive career advisor with personalized recommendations based on your skills, interests, and learning style
- **Language & Tool Discovery**: Comprehensive database of programming languages, frameworks, and development tools
- **Database Technologies**: Explore different database systems and their use cases

### AI-Powered Tools
- **Resource Summarizer**: Quickly summarize technical articles, documentation, and learning resources
- **Project Idea Generator**: Get creative project ideas tailored to your skill level and interests
- **Personalized Roadmap Generator**: Create custom learning paths based on your goals and current knowledge
- **Tech News Bot**: Stay updated with the latest technology trends and news
- **Concept Explainer**: Get clear explanations of complex technical concepts

### User Features
- **Firebase Authentication**: Secure sign-in with Google OAuth and passwordless email authentication
- **User Profiles**: Track your learning progress and preferences
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Mode Support**: Easy on the eyes with theme toggle functionality

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.9 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend & Services
- **AI Integration**: Google Gemini AI via Firebase Genkit
- **Authentication**: Firebase Auth (Google OAuth, Email Link)
- **Database**: Firestore for user data and progress tracking
- **ORM**: Prisma with SQLite (development) / PostgreSQL (production ready)

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Package Manager**: npm
- **Code Quality**: TypeScript strict mode, ESLint
- **Deployment**: Netlify with automatic deployments

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 20 or higher
- **npm**: Version 10 or higher (comes with Node.js)
- **Git**: For version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/phaneendrakumarbabu/learning-content-generator.git
cd learning-content-generator
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages and automatically generate the Prisma client.

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Gemini AI API Key
GOOGLE_GENAI_API_KEY=your_gemini_api_key

# Database URL (for development)
DATABASE_URL="file:./dev.db"
```

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Google and Email/Password providers
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the configuration values to your `.env.local`

### 5. Get Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
learning-content-generator/
├── src/
│   ├── ai/                      # AI flows and Genkit configuration
│   │   ├── flows/              # AI flow implementations
│   │   ├── genkit.ts           # Genkit setup
│   │   └── dev.ts              # Development server
│   ├── app/                     # Next.js App Router pages
│   │   ├── (routes)/           # Application routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── [feature]/          # Feature-specific components
│   ├── contexts/                # React Context providers
│   │   └── auth-context.tsx    # Authentication context
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions and data
│   │   ├── firebase.ts         # Firebase configuration
│   │   ├── domains.ts          # Domain data
│   │   ├── career-paths.ts     # Career path data
│   │   └── tools.ts            # Tool data
│   └── generated/               # Generated files (Prisma)
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                      # Static assets
├── .env.local                   # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── netlify.toml                 # Netlify configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json                 # Project dependencies
```

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with hot reload

## 🌐 Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure environment variables in Netlify:
   - Go to Site settings > Environment variables
   - Add all variables from `.env.local`
4. Deploy!

The project includes a `netlify.toml` configuration file that handles:
- Build command and publish directory
- Next.js plugin integration
- Node.js version specification
- Secrets scanning configuration

### Important: Firebase Authorized Domains

After deployment, add your Netlify domain to Firebase:
1. Go to Firebase Console > Authentication > Settings
2. Click on "Authorized domains"
3. Add your Netlify domain (e.g., `your-site.netlify.app`)

## 🔐 Authentication

The platform supports multiple authentication methods:

- **Google OAuth**: One-click sign-in with Google account
- **Email Link (Passwordless)**: Secure sign-in via email link
- **Email/Password**: Traditional authentication method

All authentication is handled securely through Firebase Authentication with optimized performance for fast sign-in experiences.

## 🎨 Customization

### Themes
The application supports light and dark themes. Users can toggle between themes using the theme switcher in the header.

### Styling
- Modify `tailwind.config.ts` for theme colors and design tokens
- Update `src/app/globals.css` for global styles
- Component styles use Tailwind CSS utility classes

### Content
- Domain data: `src/lib/domains.ts`
- Career paths: `src/lib/career-paths.ts`
- Tools database: `src/lib/tools.ts`

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes appropriate comments
- Passes TypeScript type checking
- Works on both light and dark themes

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Authentication by [Firebase](https://firebase.google.com/)

## 📧 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

Made with ❤️ for developers and tech enthusiasts

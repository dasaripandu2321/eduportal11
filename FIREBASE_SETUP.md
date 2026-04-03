# Firebase Setup Instructions

## Quick Setup Guide

To complete the Google Sign-in authentication setup, you need to configure Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `code-crafters` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Google** provider
5. Toggle **Enable**
6. Add your support email
7. Click **Save**

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register app with name: `code-crafters-web`
5. Copy the Firebase configuration object

### 4. Update Environment Variables

Update your `.env` file with the Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 5. Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location
5. Click **Done**

### 6. Configure Google OAuth (Optional - for additional security)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 client ID
5. Add authorized domains:
   - `localhost` (for development)
   - Your production domain

## Testing the Authentication

1. Start your development server: `npm run dev`
2. Navigate to any page (e.g., `/` or `/project-generator`)
3. You should be automatically redirected to `/login`
4. Click "Continue with Google"
5. Complete the Google sign-in flow
6. You should be redirected back to the home page
7. Now you can access all features of the application

## Authentication Flow

🔒 **Login Required**: The application now requires authentication for ALL pages
- When you start the app, you'll see the login page first
- After signing in, you can access all features
- Your session persists across browser restarts
- Sign out anytime using the user menu in the header

## Features Implemented

✅ **Google Sign-in Integration** - Users can sign in with their Google account
✅ **Firebase Authentication** - Secure authentication using Firebase Auth
✅ **Firestore Database** - User data is stored in Firestore
✅ **Protected Routes** - Some pages require authentication
✅ **Header Integration** - Shows user profile and sign-out option
✅ **Transformers Theme Support** - Login page adapts to the theme
✅ **Mobile Responsive** - Works on all device sizes
✅ **Session Management** - Automatic session handling
✅ **Redirect After Login** - Users are redirected to their intended page

## Security Features

- Secure session management with Firebase Auth
- Automatic token refresh
- Protected route middleware
- User data stored securely in Firestore
- HTTPS-only cookies in production

## Next Steps

1. Set up Firebase configuration as described above
2. Test the authentication flow
3. Optionally protect more routes by wrapping them with `<ProtectedRoute>`
4. Customize the user experience based on authentication state

The authentication system is now fully integrated with your existing Transformers theme and will work seamlessly with all your current features!
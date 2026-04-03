# Enable Google Authentication in Firebase

Your Firebase project is configured! Now you need to enable Google Authentication:

## Step 1: Enable Google Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **tech-innov-48b2c**
3. Click **Authentication** in the left sidebar
4. Click **Get started** (if first time)
5. Go to **Sign-in method** tab
6. Click on **Google** provider
7. Toggle **Enable**
8. Add your support email (required)
9. Click **Save**

## Step 2: Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location (closest to you)
5. Click **Done**

## Step 3: Test the Authentication

1. Your development server is running at: http://localhost:3000
2. Open the URL in your browser
3. You should see the login page
4. Click "Continue with Google"
5. Complete the Google sign-in flow
6. You should be redirected to the home page

## Current Configuration

✅ **Firebase Project**: tech-innov-48b2c  
✅ **Environment Variables**: Already configured  
✅ **Firebase SDK**: Already integrated  
✅ **Authentication Flow**: Ready to test  

## If Authentication Doesn't Work

Make sure you've completed Step 1 above. The Google provider must be enabled in Firebase Console for authentication to work.

## Next Steps

Once authentication is working:
- All pages will require login
- User data will be stored in Firestore
- Sessions will persist across browser restarts
- Users can sign out using the header menu

Your CodeCrafters application is ready for secure authentication! 🚀
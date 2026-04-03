# Firebase Setup Instructions

## Current Errors
- `auth/unauthorized-domain` - Your domain is not authorized in Firebase
- `auth/internal-error` - Usually caused by missing configuration

## Required Steps

### 1. Add Authorized Domains (CRITICAL)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **technav-codeconquerors**
3. Click **Authentication** in the left sidebar
4. Click the **Settings** tab (gear icon)
5. Scroll down to **Authorized domains** section
6. Click **Add domain** button
7. Add these domains one by one:
   - `localhost`
   - `127.0.0.1`
8. Click **Add** for each

### 2. Enable Authentication Methods

#### Enable Email/Password Authentication:
1. Go to **Authentication** → **Sign-in method** tab
2. Click on **Email/Password** provider
3. Toggle **Enable** to ON
4. Toggle **Email link (passwordless sign-in)** to ON
5. Click **Save**

#### Enable Google Authentication:
1. Click on **Google** provider
2. Toggle **Enable** to ON
3. Select a **Project support email** from dropdown
4. Click **Save**

### 3. Verify Configuration

After completing the above steps:
1. Restart your development server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try signing in again

## Your Current Firebase Config

```
Project ID: technav-codeconquerors
Auth Domain: technav-codeconquerors.firebaseapp.com
```

## Testing Authentication

Once setup is complete, you can test:
- ✅ Email/Password Sign In
- ✅ Email/Password Sign Up
- ✅ Google Sign In
- ✅ Password Reset
- ✅ Email Link (Passwordless) Sign In

## Common Issues

### Issue: "auth/unauthorized-domain"
**Solution**: Add `localhost` to authorized domains (Step 1 above)

### Issue: "auth/internal-error"
**Solution**: Enable authentication methods (Step 2 above)

### Issue: Google Sign-In popup blocked
**Solution**: Allow popups for localhost in your browser

## Need Help?

If you continue to have issues after completing these steps:
1. Check the browser console for specific error codes
2. Verify all environment variables are set correctly in `.env.local`
3. Ensure you're using the correct Firebase project

## Current Status

✅ API Keys configured in `.env.local`
✅ Code implementation is correct
❌ Firebase Console setup incomplete (follow steps above)

# Firebase Setup Verification Checklist

## Your Current Configuration
- Project ID: `conquerors-e3f90`
- Auth Domain: `conquerors-e3f90.firebaseapp.com`

## Verification Steps

### Step 1: Verify Authorized Domains
1. Go to: https://console.firebase.google.com/project/conquerors-e3f90/authentication/settings
2. Scroll to **"Authorized domains"** section
3. You MUST see these domains listed:
   - ✅ `conquerors-e3f90.firebaseapp.com` (default)
   - ✅ `localhost` (YOU MUST ADD THIS)
   - ✅ `127.0.0.1` (optional but recommended)

**IMPORTANT**: The domain should be EXACTLY `localhost` (no http://, no port number)

### Step 2: Verify Authentication Methods
1. Go to: https://console.firebase.google.com/project/conquerors-e3f90/authentication/providers
2. Check these are ENABLED:
   - ✅ Email/Password - Status should be "Enabled"
   - ✅ Google - Status should be "Enabled"

### Step 3: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or press: Ctrl+Shift+Delete and clear cache

### Step 4: Restart Dev Server
After adding domains in Firebase Console, you MUST restart:
1. Stop the current server
2. Start it again with `npm run dev`

## Common Mistakes

### ❌ WRONG: Adding domain with protocol
- `http://localhost` ❌
- `https://localhost` ❌
- `localhost:3000` ❌

### ✅ CORRECT: Just the domain
- `localhost` ✅

## Still Not Working?

If you've done all the above and it still doesn't work:

1. **Wait 2-3 minutes** - Firebase changes can take time to propagate
2. **Check browser console** - Look for the exact error message
3. **Try incognito mode** - Rules out browser extension issues
4. **Verify you're on the correct Firebase project** - Make sure you're looking at `conquerors-e3f90`

## Screenshot Verification

When you add `localhost` to authorized domains, you should see:
```
Authorized domains
These domains are authorized to use Firebase Authentication:

• conquerors-e3f90.firebaseapp.com
• localhost                          [Remove]
```

If you don't see `localhost` listed, it wasn't added correctly.

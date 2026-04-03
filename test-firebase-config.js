// Quick test to verify Firebase config is loaded
console.log('Firebase Configuration Check:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing');

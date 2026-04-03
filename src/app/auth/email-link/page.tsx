'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Zap } from 'lucide-react';
import { PrismFluxLoader } from '@/components/ui/prism-loader';

export default function EmailLinkPage() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error' | 'invalid'>('checking');
  const [message, setMessage] = useState('Checking your sign-in link...');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { completeSignInWithEmailLink } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      try {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        
        const debug = {
          fullUrl: currentUrl,
          pathname: window.location.pathname,
          search: window.location.search,
          params: Object.fromEntries(urlParams.entries()),
          isValidEmailLink: urlParams.has('oobCode') || !!localStorage.getItem('emailForSignIn'),
          storedEmail: localStorage.getItem('emailForSignIn')
        };
        
        setDebugInfo(debug);
        console.log('Email Link Debug Info:', debug);
        
        if (!debug.isValidEmailLink) {
          setStatus('invalid');
          setMessage('This is not a valid sign-in link. Please request a new one.');
          return;
        }

        setMessage('Valid sign-in link detected. Processing...');
        
        let email = debug.storedEmail;
        
        if (!email) {
          setMessage('Email confirmation required...');
          email = window.prompt('Please provide your email address for confirmation:');
        }
        
        if (!email) {
          setStatus('error');
          setMessage('Email address is required to complete sign-in.');
          return;
        }

        setMessage(`Signing in with ${email}...`);
        console.log('Attempting to complete sign-in with email:', email);
        
        const result = await completeSignInWithEmailLink(email);
        console.log('Sign-in completed successfully:', result.user.email);
        
        setStatus('success');
        setMessage('Successfully signed in! Redirecting to your dashboard...');
        
        // Clear the stored email
        localStorage.removeItem('emailForSignIn');
        
        // Wait a bit longer to ensure auth state is updated
        setTimeout(() => {
          console.log('Redirecting to home page...');
          router.push('/');
        }, 3000);
        
      } catch (error: any) {
        console.error('Email link sign-in error:', error);
        setStatus('error');
        setMessage(`Sign-in failed: ${error.message || 'Unknown error occurred'}`);
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(handleEmailLinkSignIn, 500);
    return () => clearTimeout(timer);
  }, [completeSignInWithEmailLink, router]);

  const getIcon = () => {
    switch (status) {
      case 'checking':
        return <PrismFluxLoader size={48} />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
      case 'invalid':
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <Zap className="h-12 w-12 text-blue-600" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'checking':
        return 'Signing You In...';
      case 'success':
        return 'Welcome to Edu Portal!';
      case 'error':
        return 'Sign-In Error';
      case 'invalid':
        return 'Invalid Link';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {message}
          </p>
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-left">
                <strong>Troubleshooting:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Make sure you're using the latest email link</li>
                  <li>Check if the link has expired (links expire after 1 hour)</li>
                  <li>Try requesting a new sign-in link</li>
                  <li>Make sure you're opening the link in the same browser</li>
                </ul>
              </div>
              
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
          
          {status === 'invalid' && (
            <div className="space-y-4">
              <div className="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md text-left">
                <strong>Debug Info:</strong>
                <div className="mt-2 text-xs font-mono">
                  <div>Valid Link: {debugInfo.isValidEmailLink ? 'Yes' : 'No'}</div>
                  <div>Stored Email: {debugInfo.storedEmail || 'None'}</div>
                  <div>URL Params: {Object.keys(debugInfo.params || {}).length} found</div>
                </div>
              </div>
              
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Go to Login Page
              </Button>
            </div>
          )}
          
          {status === 'success' && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              🎉 Authentication successful! You'll be redirected shortly.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
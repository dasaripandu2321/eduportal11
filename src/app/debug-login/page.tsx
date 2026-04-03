'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PrismFluxLoader } from '@/components/ui/prism-loader';

export default function DebugLoginPage() {
  const auth = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [isTestingEmailLink, setIsTestingEmailLink] = useState(false);
  const [emailLinkResult, setEmailLinkResult] = useState<string | null>(null);
  const [emailLinkError, setEmailLinkError] = useState<string | null>(null);

  const testEmailLinkSending = async () => {
    if (!testEmail) {
      setEmailLinkError('Please enter an email address');
      return;
    }

    try {
      setIsTestingEmailLink(true);
      setEmailLinkError(null);
      setEmailLinkResult(null);
      
      console.log('Testing email link sending to:', testEmail);
      await auth.sendSignInLink(testEmail);
      setEmailLinkResult('✅ Email link sent successfully! Check your email.');
      console.log('Email link sent successfully');
    } catch (error: any) {
      console.error('Email link test failed:', error);
      setEmailLinkError(`❌ Failed: ${error.message}`);
    } finally {
      setIsTestingEmailLink(false);
    }
  };

  const checkFirebaseConfig = () => {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
    
    return {
      hasApiKey: !!config.apiKey,
      hasAuthDomain: !!config.authDomain,
      hasProjectId: !!config.projectId,
      projectId: config.projectId,
      authDomain: config.authDomain
    };
  };

  const firebaseConfig = checkFirebaseConfig();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-4xl space-y-6">
        {/* Firebase Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Firebase Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {firebaseConfig.hasApiKey ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>API Key: {firebaseConfig.hasApiKey ? 'Configured' : 'Missing'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {firebaseConfig.hasAuthDomain ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Auth Domain: {firebaseConfig.hasAuthDomain ? 'Configured' : 'Missing'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {firebaseConfig.hasProjectId ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Project ID: {firebaseConfig.hasProjectId ? firebaseConfig.projectId : 'Missing'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span>Auth Domain: {firebaseConfig.authDomain}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Context Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Context Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Available Methods:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>signInWithGoogle: {typeof auth.signInWithGoogle}</li>
                  <li>signInWithEmail: {typeof auth.signInWithEmail}</li>
                  <li>signUpWithEmail: {typeof auth.signUpWithEmail}</li>
                  <li>sendSignInLink: {typeof auth.sendSignInLink}</li>
                  <li>completeSignInWithEmailLink: {typeof auth.completeSignInWithEmailLink}</li>
                  <li>resetPassword: {typeof auth.resetPassword}</li>
                  <li>signOut: {typeof auth.signOut}</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {auth.user ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span><strong>User:</strong> {auth.user ? `Logged in (${auth.user.email})` : 'Not logged in'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {!auth.loading ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  <span><strong>Loading:</strong> {auth.loading ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {auth ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span><strong>Context Status:</strong> {auth ? 'Context loaded' : 'Context not loaded'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Link Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Test Passwordless Email Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter your email to test passwordless sign-in"
              />
            </div>
            
            <Button
              onClick={testEmailLinkSending}
              disabled={isTestingEmailLink || !testEmail}
              className="w-full"
            >
              {isTestingEmailLink ? (
                <>
                  <PrismFluxLoader size={16} className="mr-2" />
                  Sending Email Link...
                </>
              ) : (
                'Test Send Email Link'
              )}
            </Button>
            
            {emailLinkResult && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                {emailLinkResult}
                <div className="mt-2 text-xs text-green-700">
                  <strong>If email doesn't arrive:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>Check spam/junk folder</li>
                    <li>Wait 5-10 minutes</li>
                    <li>Verify Firebase Console setup below</li>
                    <li>Try a Gmail address</li>
                  </ul>
                </div>
              </div>
            )}
            
            {emailLinkError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {emailLinkError}
                <div className="mt-2 text-xs text-red-700">
                  <strong>Common fixes:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>Enable Email Link provider in Firebase Console</li>
                    <li>Add localhost to authorized domains</li>
                    <li>Check browser console for detailed errors</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Email Not Arriving?</strong> This is usually because:
              </p>
              <ol className="list-decimal list-inside mt-2 text-xs text-yellow-700 space-y-1">
                <li><strong>Email Link provider not enabled</strong> in Firebase Console</li>
                <li><strong>Emails going to spam folder</strong> (check junk mail)</li>
                <li><strong>Email delivery delay</strong> (wait 5-10 minutes)</li>
                <li><strong>Domain not authorized</strong> (add localhost to Firebase)</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Firebase Console Setup Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Most Common Issue: Email Link Provider Not Enabled
                </p>
                <p className="text-xs text-red-700">
                  If emails show "sent" but don't arrive, the Email Link provider is likely disabled in Firebase Console.
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Follow these steps exactly to enable passwordless email authentication:
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">1</span>
                  <div>
                    <p className="font-semibold">Open Firebase Console</p>
                    <p className="text-xs text-muted-foreground">Click the link below to go directly to your project</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">2</span>
                  <div>
                    <p className="font-semibold">Go to Authentication → Sign-in method</p>
                    <p className="text-xs text-muted-foreground">Look for the "Sign-in providers" section</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">3</span>
                  <div>
                    <p className="font-semibold">Click on "Email/Password" provider</p>
                    <p className="text-xs text-muted-foreground">This opens the Email/Password configuration</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-xs">4</span>
                  <div>
                    <p className="font-semibold text-yellow-800">Enable "Email link (passwordless sign-in)"</p>
                    <p className="text-xs text-yellow-700">⚠️ This checkbox is often missed! Make sure it's checked ✅</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">5</span>
                  <div>
                    <p className="font-semibold">Add authorized domain: <code className="bg-gray-200 px-1 rounded">localhost</code></p>
                    <p className="text-xs text-muted-foreground">Required for development testing</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-green-50 rounded border border-green-200">
                  <span className="font-mono bg-green-100 px-2 py-1 rounded text-xs">6</span>
                  <div>
                    <p className="font-semibold text-green-800">Click "Save"</p>
                    <p className="text-xs text-green-700">Changes take effect immediately</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  🔗 Direct Links to Firebase Console
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Project:</strong> {firebaseConfig.projectId}
                  </div>
                  <div>
                    <strong>Authentication Setup:</strong>{' '}
                    <a 
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-mono text-xs"
                    >
                      Open Firebase Console →
                    </a>
                  </div>
                  <div>
                    <strong>Authorized Domains:</strong>{' '}
                    <a 
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-mono text-xs"
                    >
                      Check Domains →
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>📧 Still No Email?</strong> After enabling the provider:
                </p>
                <ul className="list-disc list-inside mt-2 text-xs text-amber-700 space-y-1">
                  <li>Check spam/junk folder (Firebase emails often go there initially)</li>
                  <li>Wait 5-10 minutes (email delivery can be delayed)</li>
                  <li>Try a Gmail address (some email providers block Firebase emails)</li>
                  <li>Add <code className="bg-amber-100 px-1 rounded">noreply@{firebaseConfig.projectId}.firebaseapp.com</code> to contacts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export default function TestEmailLinkPage() {
  const [urlInfo, setUrlInfo] = useState<any>({});
  const [isValidLink, setIsValidLink] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    
    const info = {
      fullUrl: currentUrl,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      params: Object.fromEntries(urlParams.entries()),
      isValidEmailLink: new URLSearchParams(window.location.search).has('oobCode') || !!localStorage.getItem('emailForSignIn'),
      storedEmail: localStorage.getItem('emailForSignIn')
    };
    
    setUrlInfo(info);
    setIsValidLink(info.isValidEmailLink);
  }, []);

  const testEmailLink = () => {
    console.log('URL Info:', urlInfo);
    console.log('Is valid email link:', isValidLink);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Email Link Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Current URL Information:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              <div><strong>Full URL:</strong> {urlInfo.fullUrl}</div>
              <div><strong>Pathname:</strong> {urlInfo.pathname}</div>
              <div><strong>Search:</strong> {urlInfo.search}</div>
              <div><strong>Hash:</strong> {urlInfo.hash}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">URL Parameters:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              {Object.keys(urlInfo.params || {}).length > 0 ? (
                <pre>{JSON.stringify(urlInfo.params, null, 2)}</pre>
              ) : (
                'No URL parameters found'
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Firebase Email Link Status:</h3>
            <div className={`p-3 rounded text-sm ${isValidLink ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div><strong>Is Valid Email Link:</strong> {isValidLink ? 'YES ✅' : 'NO ❌'}</div>
              <div><strong>Stored Email:</strong> {urlInfo.storedEmail || 'None'}</div>
            </div>
          </div>
          
          <Button onClick={testEmailLink} className="w-full">
            Log Debug Info to Console
          </Button>
          
          <div className="text-sm text-gray-600">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the email link you received</li>
              <li>If it redirects here, check the information above</li>
              <li>Click "Log Debug Info to Console" and check browser console (F12)</li>
              <li>Share the console output for debugging</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
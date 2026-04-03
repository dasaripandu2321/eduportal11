'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { GroupChat } from '@/components/group-chat';
import { PrismFluxLoader } from '@/components/ui/prism-loader';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PrismFluxLoader size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="h-[calc(100vh-8rem)] border rounded-2xl bg-card shadow-xl shadow-violet-100/50 dark:shadow-violet-900/20 overflow-hidden flex flex-col">
          <GroupChat />
        </div>
      </div>
    </div>
  );
}

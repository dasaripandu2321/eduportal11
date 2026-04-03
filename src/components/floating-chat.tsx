'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { GroupChat } from '@/components/group-chat';
import Link from 'next/link';

export function FloatingChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-110 transition-all duration-200 flex items-center justify-center"
        aria-label="Toggle chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] rounded-2xl border border-violet-200 dark:border-violet-800 bg-card shadow-2xl shadow-violet-500/20 flex flex-col overflow-hidden animate-scale-in">
          <GroupChat />
          <div className="px-4 pb-3 text-center">
            <Link href="/chat" onClick={() => setOpen(false)}
              className="text-xs text-violet-600 hover:underline">
              Open full chat →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection, addDoc, onSnapshot, query,
  orderBy, serverTimestamp, Timestamp, doc,
  updateDoc, arrayUnion, setDoc, deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Reply, X, MessageCircle, Users } from 'lucide-react';

interface ChatReply {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | null;
  replies: ChatReply[];
}

const COLORS = [
  'bg-violet-500', 'bg-cyan-500', 'bg-pink-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-blue-500', 'bg-rose-500', 'bg-teal-500',
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(ts: Timestamp | null) {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function GroupChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ id: string; name: string }[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showOnline, setShowOnline] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Presence: write heartbeat every 30s, clean up on unmount ──────────────
  useEffect(() => {
    if (!user) return;
    const presenceRef = doc(db, 'presence', user.id);

    const heartbeat = async () => {
      await setDoc(presenceRef, {
        userId: user.id,
        displayName: user.displayName || user.email || 'User',
        lastSeen: serverTimestamp(),
      }, { merge: true });
    };

    heartbeat();
    const interval = setInterval(heartbeat, 30_000);

    // Remove presence on tab close
    const handleUnload = () => deleteDoc(presenceRef);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      deleteDoc(presenceRef);
    };
  }, [user]);

  // ── Listen to presence collection ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'presence'), snap => {
      const now = Date.now();
      const active = snap.docs
        .map(d => d.data())
        .filter(d => {
          if (!d.lastSeen) return false;
          const ts: Timestamp = d.lastSeen;
          // Consider online if heartbeat within last 90 seconds
          return (now - ts.toMillis()) < 90_000;
        })
        .map(d => ({ id: d.userId, name: d.displayName }));
      setOnlineUsers(active);
    });
    return () => unsub();
  }, []);

  // ── Messages ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'group-chat'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      const msgs: ChatMessage[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<ChatMessage, 'id'>),
      }));
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;
    await addDoc(collection(db, 'group-chat'), {
      text: text.trim(),
      authorId: user.id,
      authorName: user.displayName || user.email,
      createdAt: serverTimestamp(),
      replies: [],
    });
    setText('');
  };

  const sendReply = async () => {
    if (!replyText.trim() || !user || !replyTo) return;
    const reply: ChatReply = {
      id: `r_${Date.now()}`,
      text: replyText.trim(),
      authorId: user.id,
      authorName: user.displayName || user.email || 'User',
      createdAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, 'group-chat', replyTo.id), {
      replies: arrayUnion(reply),
    });
    setReplyText('');
    setReplyTo(null);
  };

  const handleKey = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Community Chat</span>
        </div>

        {/* Online users badge — click to see who's online */}
        <button
          onClick={() => setShowOnline(o => !o)}
          className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <Users className="h-3 w-3" />
          <span>{onlineUsers.length} online</span>
        </button>
      </div>

      {/* Online users dropdown */}
      {showOnline && onlineUsers.length > 0 && (
        <div className="mx-4 mt-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
            Online now ({onlineUsers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map(u => (
              <div key={u.id} className="flex items-center gap-1.5 text-xs bg-white dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-full px-2 py-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className={u.id === user.id ? 'font-semibold' : ''}>
                  {u.id === user.id ? `${u.name} (you)` : u.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No messages yet. Be the first to say hello! 👋
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.authorId === user.id;
          const isOnline = onlineUsers.some(u => u.id === msg.authorId);
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="relative shrink-0 mt-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`text-white text-xs ${avatarColor(msg.authorName)}`}>
                    {initials(msg.authorName)}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>

              <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="font-medium text-foreground">{isMe ? 'You' : msg.authorName}</span>
                  <span>{timeAgo(msg.createdAt)}</span>
                </div>

                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>

                <button
                  onClick={() => { setReplyTo(msg); setReplyText(''); }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-violet-600 transition-colors"
                >
                  <Reply className="h-3 w-3" /> Reply
                </button>

                {msg.replies?.length > 0 && (
                  <div className={`space-y-1.5 border-l-2 border-violet-200 dark:border-violet-800 pl-3 ${isMe ? 'border-r-2 border-l-0 pr-3 pl-0' : ''}`}>
                    {msg.replies.map(r => (
                      <div key={r.id} className="space-y-0.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          {r.authorId === user.id ? 'You' : r.authorName}
                        </span>
                        <div className={`px-2.5 py-1.5 rounded-xl text-xs ${
                          r.authorId === user.id
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200'
                            : 'bg-muted'
                        }`}>
                          {r.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply banner */}
      {replyTo && (
        <div className="mx-4 mb-1 flex items-center justify-between px-3 py-2 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Reply className="h-3.5 w-3.5 text-violet-600 shrink-0" />
            <span className="text-muted-foreground truncate">
              Replying to <span className="font-medium text-foreground">{replyTo.authorId === user.id ? 'yourself' : replyTo.authorName}</span>: {replyTo.text.slice(0, 40)}{replyTo.text.length > 40 ? '…' : ''}
            </span>
          </div>
          <button onClick={() => setReplyTo(null)} className="shrink-0 ml-2 text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        {replyTo ? (
          <div className="flex gap-2">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => handleKey(e, sendReply)}
              placeholder={`Reply to ${replyTo.authorName}...`}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-violet-200 dark:border-violet-800 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 leading-relaxed"
            />
            <Button onClick={sendReply} disabled={!replyText.trim()} size="icon"
              className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => handleKey(e, sendMessage)}
              placeholder="Message the group... (Enter to send)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-violet-200 dark:border-violet-800 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 leading-relaxed"
            />
            <Button onClick={sendMessage} disabled={!text.trim()} size="icon"
              className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


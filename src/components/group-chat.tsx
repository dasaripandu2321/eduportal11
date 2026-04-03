'use client';

import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, remove, serverTimestamp, off, query, limitToLast, onDisconnect } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Reply, X, MessageCircle, Users, Wifi, WifiOff } from 'lucide-react';

interface ChatReply {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}

interface ChatMessage {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  replies?: Record<string, ChatReply>;
}

interface OnlineUser {
  id: string;
  name: string;
}

const COLORS = [
  'bg-violet-500','bg-cyan-500','bg-pink-500','bg-emerald-500',
  'bg-orange-500','bg-blue-500','bg-rose-500','bg-teal-500',
  'bg-amber-500','bg-lime-500','bg-sky-500','bg-fuchsia-500',
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function timeAgo(ts: number) {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export function GroupChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showOnline, setShowOnline] = useState(false);
  const [connected, setConnected] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Presence ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const presenceRef = ref(rtdb, `presence/${user.id}`);
    const connRef = ref(rtdb, '.info/connected');

    const userData = {
      userId: user.id,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      lastSeen: serverTimestamp(),
    };

    const unsub = onValue(connRef, snap => {
      if (snap.val() === true) {
        setConnected(true);
        set(presenceRef, userData);
        onDisconnect(presenceRef).remove();
      } else {
        setConnected(false);
      }
    });

    return () => {
      off(connRef);
      remove(presenceRef);
    };
  }, [user]);

  // ── Online users ──────────────────────────────────────────────────────────
  useEffect(() => {
    const presRef = ref(rtdb, 'presence');
    const unsub = onValue(presRef, snap => {
      const data = snap.val() || {};
      const users: OnlineUser[] = Object.values(data).map((u: any) => ({
        id: u.userId,
        name: u.displayName,
      }));
      setOnlineUsers(users);
    });
    return () => off(presRef);
  }, []);

  // ── Messages (last 100, persists across refresh) ──────────────────────────
  useEffect(() => {
    const msgsRef = query(ref(rtdb, 'group-chat'), limitToLast(100));
    const unsub = onValue(msgsRef, snap => {
      const data = snap.val() || {};
      const msgs: ChatMessage[] = Object.entries(data).map(([id, val]: any) => ({
        id,
        ...val,
      })).sort((a, b) => a.createdAt - b.createdAt);
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    });
    return () => off(msgsRef);
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;
    const msg = text.trim();
    setText('');
    try {
      await push(ref(rtdb, 'group-chat'), {
        text: msg,
        authorId: user.id,
        authorName: user.displayName || user.email?.split('@')[0] || 'User',
        createdAt: Date.now(),
        replies: {},
      });
    } catch {
      setText(msg);
    }
    inputRef.current?.focus();
  };

  const sendReply = async () => {
    if (!replyText.trim() || !user || !replyTo) return;
    const reply: Omit<ChatReply, 'id'> = {
      text: replyText.trim(),
      authorId: user.id,
      authorName: user.displayName || user.email?.split('@')[0] || 'User',
      createdAt: Date.now(),
    };
    await push(ref(rtdb, `group-chat/${replyTo.id}/replies`), reply);
    setReplyText('');
    setReplyTo(null);
  };

  const handleKey = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); }
  };

  if (!user) return null;

  const isOnline = (id: string) => onlineUsers.some(u => u.id === id);

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold text-sm">Community Chat</span>
          {connected
            ? <Wifi className="h-3.5 w-3.5 text-green-300" />
            : <WifiOff className="h-3.5 w-3.5 text-red-300" />}
        </div>
        <button
          onClick={() => setShowOnline(o => !o)}
          className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full transition-colors"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <Users className="h-3 w-3" />
          <span className="font-bold">{onlineUsers.length}</span>
          <span className="hidden sm:inline">online</span>
        </button>
      </div>

      {/* Online users panel */}
      {showOnline && onlineUsers.length > 0 && (
        <div className="mx-3 mt-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl shrink-0">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
          </p>
          <div className="flex flex-wrap gap-1.5">
            {onlineUsers.map(u => (
              <div key={u.id} className="flex items-center gap-1.5 text-xs bg-white dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className={u.id === user.id ? 'font-bold' : ''}>
                  {u.id === user.id ? `${u.name} (you)` : u.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection error */}
      {!connected && (
        <div className="mx-3 mt-2 px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 shrink-0">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          Connecting to chat...
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12 space-y-2">
            <MessageCircle className="h-10 w-10 opacity-20" />
            <p className="text-sm">No messages yet.</p>
            <p className="text-xs">Be the first to say hello! 👋</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.authorId === user.id;
          const online = isOnline(msg.authorId);
          const showName = idx === 0 || messages[idx - 1].authorId !== msg.authorId;
          const replies = msg.replies ? Object.entries(msg.replies).map(([id, r]) => ({ id, ...r })) : [];

          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="relative shrink-0 self-end">
                {showName ? (
                  <>
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={`text-white text-xs font-bold ${avatarColor(msg.authorName)}`}>
                        {initials(msg.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    {online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />}
                  </>
                ) : <div className="w-7" />}
              </div>

              <div className={`max-w-[78%] space-y-0.5 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {showName && (
                  <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-foreground">{isMe ? 'You' : msg.authorName}</span>
                    <span>{timeAgo(msg.createdAt)}</span>
                    {online && <span className="text-green-500 text-[10px]">● online</span>}
                  </div>
                )}

                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                  isMe ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-muted rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>

                <button
                  onClick={() => { setReplyTo(msg); setReplyText(''); inputRef.current?.focus(); }}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-violet-600 transition-colors px-1"
                >
                  <Reply className="h-3 w-3" /> Reply
                </button>

                {replies.length > 0 && (
                  <div className={`w-full space-y-1 border-l-2 border-violet-200 dark:border-violet-800 pl-2.5 ${isMe ? 'border-r-2 border-l-0 pr-2.5 pl-0' : ''}`}>
                    {replies.map(r => (
                      <div key={r.id} className="space-y-0.5">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {r.authorId === user.id ? 'You' : r.authorName}
                        </span>
                        <div className={`px-2.5 py-1.5 rounded-xl text-xs break-words ${
                          r.authorId === user.id ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200' : 'bg-muted/70'
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
        <div className="mx-3 mb-1 flex items-center justify-between px-3 py-2 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl text-xs shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Reply className="h-3.5 w-3.5 text-violet-600 shrink-0" />
            <span className="text-muted-foreground truncate">
              Replying to <span className="font-semibold text-foreground">{replyTo.authorId === user.id ? 'yourself' : replyTo.authorName}</span>: {replyTo.text.slice(0, 50)}{replyTo.text.length > 50 ? '…' : ''}
            </span>
          </div>
          <button onClick={() => setReplyTo(null)} className="shrink-0 ml-2 hover:text-foreground text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 pt-1 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={replyTo ? replyText : text}
            onChange={e => replyTo ? setReplyText(e.target.value) : setText(e.target.value)}
            onKeyDown={e => handleKey(e, replyTo ? sendReply : sendMessage)}
            placeholder={replyTo ? `Reply to ${replyTo.authorName}...` : 'Message everyone... (Enter to send)'}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-violet-200 dark:border-violet-800 bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 leading-relaxed max-h-28 overflow-y-auto"
            style={{ minHeight: '42px' }}
          />
          <Button
            onClick={replyTo ? sendReply : sendMessage}
            disabled={replyTo ? !replyText.trim() : !text.trim()}
            size="icon"
            className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shrink-0 h-[42px] w-[42px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {replyTo && (
          <button onClick={() => setReplyTo(null)} className="text-xs text-muted-foreground hover:text-foreground mt-1 ml-1">
            Cancel reply
          </button>
        )}
      </div>
    </div>
  );
}

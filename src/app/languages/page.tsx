'use client';

import { tools } from '@/lib/tools';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, FileCode } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function LanguagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const languages = tools.filter(t => t.category === 'Programming Language');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Programming Languages</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Select a language to access adaptive quizzes, smart study plans, and weakness detection.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.map((lang) => {
            const Icon = lang.icon;
            return (
              <Link key={lang.slug} href={`/languages/${lang.slug}`} className="group">
                <div className="h-full border rounded-2xl p-5 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="font-bold text-lg">{lang.name}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{lang.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="outline" className="text-xs">Adaptive Quiz</Badge>
                    <Badge variant="outline" className="text-xs">Study Plan</Badge>
                    <Badge variant="outline" className="text-xs">Weakness AI</Badge>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


'use client';

import { ProjectIdeaForm } from "@/components/project-idea-form";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProjectGeneratorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            AI Project Idea Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Stuck on what to build? Tell our AI about your skills and interests, and get a custom project idea to build your portfolio.
          </p>
        </header>
        <div className="max-w-4xl mx-auto">
          <ProjectIdeaForm />
        </div>
      </div>
    </div>
  );
}

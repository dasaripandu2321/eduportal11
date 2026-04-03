'use client';

import { useState, use } from 'react';
import { tools } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, CalendarDays, AlertTriangle, BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import { LanguageQuiz } from '@/components/language-quiz';
import { StudyPlanner } from '@/components/study-planner';
import { WeaknessDetector } from '@/components/weakness-detector';
import { StudyMaterials } from '@/components/study-materials';

export default function LanguagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = tools.find(t => t.slug === slug && t.category === 'Programming Language');

  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Language not found.
      </div>
    );
  }

  const Icon = tool.icon;

  const handleQuizDone = (topics: string[]) => {
    setWeakTopics(topics);
    setQuizDone(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{tool.name}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tool.description}</p>
          <div className="mt-3">
            <Badge variant="secondary">{tool.category}</Badge>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="planner" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Study Planner</span>
              <span className="sm:hidden">Plan</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Materials</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Adaptive Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="weakness" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Weaknesses</span>
              <span className="sm:hidden">Weak</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">Refs</span>
            </TabsTrigger>
          </TabsList>

          {/* Adaptive Quiz */}
          <TabsContent value="quiz">
            <div className="border rounded-2xl p-6 bg-card shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" /> Adaptive Quiz
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Questions adapt based on your answers and difficulty level. Correct answers unlock harder questions.
                </p>
              </div>
              <LanguageQuiz
                tool={tool}
                onWeaknessUpdate={setWeakTopics}
                onDone={handleQuizDone}
              />
            </div>
          </TabsContent>

          {/* Study Planner */}
          <TabsContent value="planner">
            <div className="border rounded-2xl p-6 bg-card shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-purple-600" /> Smart Study Planner
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generates a daily plan with topics, time slots, and revision cycles. Weak areas are prioritized automatically.
                </p>
              </div>
              <StudyPlanner tool={tool} weakTopics={weakTopics} />
            </div>
          </TabsContent>

          {/* Study Materials */}
          <TabsContent value="materials">
            <div className="border rounded-2xl p-6 bg-card shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" /> Study Materials
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Curated articles, videos, docs, and hands-on projects tailored to your level.
                </p>
              </div>
              <StudyMaterials tool={tool} />
            </div>
          </TabsContent>

          {/* Weakness Detection */}
          <TabsContent value="weakness">
            <div className="border rounded-2xl p-6 bg-card shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" /> Weakness Detection Engine
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Detects patterns like repeated mistakes and gives targeted AI-generated recommendations.
                </p>
              </div>
              <WeaknessDetector tool={tool} wrongTopics={weakTopics} quizDone={quizDone} />
            </div>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources">
            <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
              <div className="mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" /> Learning Resources
                </h2>
              </div>
              <ul className="space-y-3">
                {tool.resources.map((r, i) => (
                  <li key={i} className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{r.title}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">{r.type}</Badge>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm shrink-0 ml-4">
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <p className="text-sm font-medium mb-2 text-muted-foreground">Tips for Mastery</p>
                <ul className="space-y-2">
                  {tool.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

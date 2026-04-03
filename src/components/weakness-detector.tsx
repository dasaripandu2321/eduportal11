'use client';

import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Target, CheckCircle } from 'lucide-react';
import type { Tool } from '@/lib/tools';

interface WeaknessData {
  topic: string;
  count: number;
  recommendation: string;
}

interface Props {
  tool: Tool;
  wrongTopics: string[];
  quizDone: boolean;
}

function analyzeWeaknesses(tool: Tool, wrongTopics: string[]): WeaknessData[] {
  const freq: Record<string, number> = {};
  wrongTopics.forEach(t => { freq[t] = (freq[t] || 0) + 1; });

  const recs: Record<string, string> = {
    'Basics': `Review the ${tool.name} fundamentals — ${tool.resources[0]?.title || 'official docs'} is a great start.`,
    'Usage': `Practice real-world ${tool.name} usage through small projects.`,
    'Best Practices': `Study ${tool.tips[0] || 'best practices'} and apply them consistently.`,
    'Resources': `Explore ${tool.resources[0]?.title || 'learning resources'} to deepen your knowledge.`,
    'Advanced': `Work through ${tool.tips[tool.tips.length - 1] || 'advanced topics'} step by step.`,
    'Ecosystem': `Explore the ${tool.name} ecosystem — libraries, tools, and community resources.`,
  };

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => ({
      topic,
      count,
      recommendation: recs[topic] || `Spend more time practicing ${topic} in ${tool.name}.`,
    }));
}

export function WeaknessDetector({ tool, wrongTopics, quizDone }: Props) {
  const weaknesses = analyzeWeaknesses(tool, wrongTopics);

  if (!quizDone) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
        <Target className="h-10 w-10 mx-auto opacity-30" />
        <p>Complete the quiz to detect your weak areas.</p>
      </div>
    );
  }

  if (weaknesses.length === 0) {
    return (
      <div className="text-center py-8 space-y-3">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <p className="font-semibold text-green-700">No weaknesses detected!</p>
        <p className="text-sm text-muted-foreground">You answered all questions correctly. Great job!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>{weaknesses.length} weak area{weaknesses.length > 1 ? 's' : ''} detected based on your quiz performance.</span>
      </div>

      <div className="space-y-3">
        {weaknesses.map((w, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">{w.topic}</span>
              </div>
              <Badge className="bg-red-100 text-red-700 text-xs">
                {w.count} mistake{w.count > 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 rounded-lg px-3 py-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>{w.recommendation}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center pt-1">
        Retake the quiz after reviewing these areas to track improvement.
      </div>
    </div>
  );
}

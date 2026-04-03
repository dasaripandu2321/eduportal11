'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sprout, Flame, Zap, ChevronDown, ChevronUp, BookOpen, Code2, Video, FileText, Globe } from 'lucide-react';
import type { Tool } from '@/lib/tools';

type Level = 'beginner' | 'moderate' | 'pro';

interface Material {
  title: string;
  description: string;
  type: 'article' | 'video' | 'docs' | 'practice' | 'book';
  url: string;
  tag?: string;
}

interface LevelMaterials {
  overview: string;
  topics: string[];
  materials: Material[];
}

const typeIcon = {
  article:  { icon: FileText, color: 'text-blue-600',   bg: 'bg-blue-50'   },
  video:    { icon: Video,    color: 'text-red-600',    bg: 'bg-red-50'    },
  docs:     { icon: Globe,    color: 'text-green-600',  bg: 'bg-green-50'  },
  practice: { icon: Code2,    color: 'text-purple-600', bg: 'bg-purple-50' },
  book:     { icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const levelMeta = {
  beginner: {
    label: 'Beginner',
    icon: Sprout,
    color: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-200 hover:border-green-400',
    activeBorder: 'border-green-500 bg-green-50',
    desc: 'No prior experience needed',
  },
  moderate: {
    label: 'Moderate',
    icon: Flame,
    color: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700',
    border: 'border-yellow-200 hover:border-yellow-400',
    activeBorder: 'border-yellow-500 bg-yellow-50',
    desc: 'Comfortable with basics',
  },
  pro: {
    label: 'Pro',
    icon: Zap,
    color: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200 hover:border-purple-400',
    activeBorder: 'border-purple-500 bg-purple-50',
    desc: 'Deep expertise & mastery',
  },
} as const;

function getMaterials(tool: Tool): Record<Level, LevelMaterials> {
  const n = tool.name;
  const r = tool.resources;

  return {
    beginner: {
      overview: `Start your ${n} journey from scratch. These materials cover syntax, core concepts, and your first programs — no prior experience needed.`,
      topics: [
        `What is ${n} and why learn it`,
        'Setting up your development environment',
        'Variables, data types, and operators',
        'Control flow: if/else and loops',
        'Functions and basic scope',
        'Working with built-in data structures',
        'Reading error messages and debugging basics',
        'Writing your first complete program',
      ],
      materials: [
        {
          title: r[0]?.title || `${n} Official Documentation`,
          description: `The official starting point for learning ${n}. Read the getting started guide and follow along with examples.`,
          type: 'docs',
          url: r[0]?.url || '#',
          tag: 'Start Here',
        },
        {
          title: `${n} for Absolute Beginners`,
          description: `A beginner-friendly video series covering ${n} syntax and core concepts step by step.`,
          type: 'video',
          url: r.find(x => x.type === 'YouTube')?.url || r[0]?.url || '#',
          tag: 'Free',
        },
        {
          title: `Interactive ${n} Exercises`,
          description: `Practice ${n} basics with hands-on coding exercises. Write and run code directly in your browser.`,
          type: 'practice',
          url: r.find(x => x.type === 'Course')?.url || r[0]?.url || '#',
          tag: 'Hands-on',
        },
        {
          title: `${n} Cheat Sheet`,
          description: `A quick reference for ${n} syntax, common patterns, and built-in functions. Keep it open while coding.`,
          type: 'article',
          url: r[1]?.url || r[0]?.url || '#',
          tag: 'Reference',
        },
        {
          title: `Build: Hello World to Mini Projects`,
          description: `Follow along building small programs — a calculator, a to-do list, and a number guessing game — to solidify the basics.`,
          type: 'practice',
          url: r.find(x => x.type === 'Course')?.url || r[0]?.url || '#',
          tag: 'Project',
        },
      ],
    },

    moderate: {
      overview: `Level up your ${n} skills with intermediate patterns, tooling, testing, and real-world project structures.`,
      topics: [
        `${n} OOP, modules, and packages`,
        'File I/O and working with external data',
        'Error handling and logging patterns',
        'Unit testing and test-driven development',
        'Using the standard library effectively',
        'REST API consumption and HTTP clients',
        'Debugging with proper tools',
        'Code quality: linting, formatting, reviews',
        'Building a complete CRUD application',
      ],
      materials: [
        {
          title: r[1]?.title || `${n} Intermediate Guide`,
          description: `Dive deeper into ${n} — covers OOP, modules, error handling, and intermediate patterns with real examples.`,
          type: 'docs',
          url: r[1]?.url || r[0]?.url || '#',
          tag: 'Core Reading',
        },
        {
          title: `${n} Testing Fundamentals`,
          description: `Learn how to write unit tests, mock dependencies, and follow TDD principles in ${n}.`,
          type: 'article',
          url: r.find(x => x.type === 'Blog')?.url || r[0]?.url || '#',
          tag: 'Testing',
        },
        {
          title: `${n} Project: Build a REST API Client`,
          description: `A guided project where you consume a public API, handle errors, parse responses, and display data.`,
          type: 'practice',
          url: r.find(x => x.type === 'Course')?.url || r[0]?.url || '#',
          tag: 'Project',
        },
        {
          title: `${n} Code Quality & Best Practices`,
          description: `Learn linting tools, style guides, and code review techniques used by professional ${n} developers.`,
          type: 'article',
          url: r.find(x => x.type === 'Blog')?.url || r[0]?.url || '#',
          tag: 'Best Practices',
        },
        {
          title: `${n} Standard Library Deep Dive`,
          description: `Explore the most useful parts of the ${n} standard library with practical examples for each module.`,
          type: 'docs',
          url: r[0]?.url || '#',
          tag: 'Reference',
        },
        {
          title: `Intermediate ${n} Video Course`,
          description: `A structured video course covering intermediate ${n} topics including OOP, testing, and project architecture.`,
          type: 'video',
          url: r.find(x => x.type === 'YouTube')?.url || r[0]?.url || '#',
          tag: 'Free',
        },
      ],
    },

    pro: {
      overview: `Master ${n} at an expert level — internals, algorithms, system design, security, and open source contribution.`,
      topics: [
        `${n} runtime internals and memory model`,
        'Advanced data structures and algorithms',
        'Design patterns and architectural principles',
        'Concurrency, async, and parallel programming',
        'Performance profiling and optimization',
        'Security best practices and vulnerability prevention',
        'CI/CD pipelines and DevOps integration',
        'Microservices and distributed systems with ${n}',
        'Contributing to open source ${n} projects',
        'Interview-level algorithm challenges',
      ],
      materials: [
        {
          title: `${n} Internals & Runtime Deep Dive`,
          description: `Understand how ${n} works under the hood — memory management, the runtime, garbage collection, and execution model.`,
          type: 'book',
          url: r[r.length - 1]?.url || r[0]?.url || '#',
          tag: 'Advanced',
        },
        {
          title: `Algorithms & Data Structures in ${n}`,
          description: `Implement classic algorithms (sorting, searching, graph traversal) and data structures from scratch in ${n}.`,
          type: 'practice',
          url: r.find(x => x.type === 'Course')?.url || r[0]?.url || '#',
          tag: 'Algorithms',
        },
        {
          title: `${n} Design Patterns`,
          description: `Study and implement Gang of Four design patterns — Singleton, Factory, Observer, Strategy, and more — in ${n}.`,
          type: 'article',
          url: r.find(x => x.type === 'Blog')?.url || r[0]?.url || '#',
          tag: 'Architecture',
        },
        {
          title: `Concurrency & Async Patterns in ${n}`,
          description: `Master threads, async/await, channels, and concurrency primitives. Learn to avoid race conditions and deadlocks.`,
          type: 'article',
          url: r[0]?.url || '#',
          tag: 'Concurrency',
        },
        {
          title: `${n} Security Best Practices`,
          description: `Learn input validation, dependency auditing, secrets management, and OWASP top 10 as they apply to ${n}.`,
          type: 'docs',
          url: r[0]?.url || '#',
          tag: 'Security',
        },
        {
          title: `Advanced ${n} Video Masterclass`,
          description: `Expert-level video content covering performance, architecture, and production-grade ${n} development.`,
          type: 'video',
          url: r.find(x => x.type === 'YouTube')?.url || r[0]?.url || '#',
          tag: 'Masterclass',
        },
        {
          title: `Open Source ${n} Contribution Guide`,
          description: `How to find ${n} open source projects, understand codebases, submit PRs, and grow your reputation.`,
          type: 'article',
          url: r.find(x => x.type === 'Blog')?.url || r[0]?.url || '#',
          tag: 'Open Source',
        },
      ],
    },
  };
}

interface Props { tool: Tool; }

export function StudyMaterials({ tool }: Props) {
  const [level, setLevel] = useState<Level | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const allMaterials = getMaterials(tool);

  if (!level) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Choose your level to get curated study materials:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(levelMeta) as Level[]).map(lvl => {
            const meta = levelMeta[lvl];
            const Icon = meta.icon;
            const count = allMaterials[lvl].materials.length;
            return (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 text-center hover:shadow-md hover:scale-[1.02] bg-white dark:bg-card ${meta.border}`}
              >
                <Icon className={`h-8 w-8 ${meta.color}`} />
                <span className="font-bold text-base">{meta.label}</span>
                <span className="text-xs text-muted-foreground">{meta.desc}</span>
                <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}>
                  {count} materials
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const meta = levelMeta[level];
  const LevelIcon = meta.icon;
  const data = allMaterials[level];

  return (
    <div className="space-y-5">
      {/* Level header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LevelIcon className={`h-4 w-4 ${meta.color}`} />
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.badge}`}>{meta.label} Materials</span>
        </div>
        <button onClick={() => setLevel(null)} className="text-xs text-muted-foreground hover:text-foreground underline">
          Change level
        </button>
      </div>

      {/* Overview */}
      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-4">
        {data.overview}
      </p>

      {/* Topics covered */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Topics Covered</p>
        <div className="flex flex-wrap gap-2">
          {data.topics.map((t, i) => (
            <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
          ))}
        </div>
      </div>

      {/* Materials list */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Study Materials</p>
        {data.materials.map((mat, i) => {
          const Cfg = typeIcon[mat.type];
          const TypeIcon = Cfg.icon;
          const isOpen = expanded === i;
          return (
            <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'shadow-sm' : ''}`}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className={`p-2 rounded-lg shrink-0 ${Cfg.bg}`}>
                  <TypeIcon className={`h-4 w-4 ${Cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{mat.title}</span>
                    {mat.tag && (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${meta.badge}`}>{mat.tag}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{mat.type}</span>
                </div>
                {isOpen
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t bg-muted/20">
                  <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{mat.description}</p>
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                  >
                    Open Resource <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, RefreshCw, BookOpen, Zap, CheckCircle2, Sprout, Flame } from 'lucide-react';
import type { Tool } from '@/lib/tools';

type Level = 'beginner' | 'moderate' | 'pro';

interface StudySlot {
  time: string;
  topic: string;
  duration: string;
  type: 'learn' | 'practice' | 'revise' | 'project' | 'challenge';
}

interface DayPlan {
  day: string;
  slots: StudySlot[];
}

const typeConfig = {
  learn:     { label: 'Learn',     color: 'bg-blue-100 text-blue-700',    icon: BookOpen },
  practice:  { label: 'Practice',  color: 'bg-purple-100 text-purple-700', icon: Zap },
  revise:    { label: 'Revise',    color: 'bg-green-100 text-green-700',  icon: RefreshCw },
  project:   { label: 'Project',   color: 'bg-orange-100 text-orange-700', icon: Flame },
  challenge: { label: 'Challenge', color: 'bg-red-100 text-red-700',      icon: Zap },
};

const levelMeta = {
  beginner: {
    label: 'Beginner',
    icon: Sprout,
    color: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-300',
    activeBg: 'bg-green-600 text-white border-green-600',
    weeks: 4,
    desc: '4-week plan covering syntax, basics, and first projects',
  },
  moderate: {
    label: 'Moderate',
    icon: Flame,
    color: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700',
    border: 'border-yellow-300',
    activeBg: 'bg-yellow-500 text-white border-yellow-500',
    weeks: 6,
    desc: '6-week plan covering patterns, tooling, and real projects',
  },
  pro: {
    label: 'Pro',
    icon: Zap,
    color: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-300',
    activeBg: 'bg-purple-600 text-white border-purple-600',
    weeks: 8,
    desc: '8-week plan covering algorithms, architecture, and open source',
  },
} as const;

// ── Level-specific topic curricula ────────────────────────────────────────────

function getTopics(tool: Tool, level: Level, weakTopics: string[]): string[] {
  const n = tool.name;

  const curricula: Record<Level, string[]> = {
    beginner: [
      `What is ${n} & setting up environment`,
      `${n} syntax: variables, data types, operators`,
      `Control flow: if/else, loops`,
      `Functions and scope`,
      `${n} built-in data structures`,
      tool.tips[0] || 'Writing clean readable code',
      `Reading ${tool.resources[0]?.title || 'official docs'}`,
      `Build: Hello World CLI app`,
      `Error handling basics`,
      `Mini project: simple calculator`,
      `Code review & refactoring basics`,
      `Beginner recap & quiz review`,
    ],
    moderate: [
      `${n} OOP / modules / packages`,
      `Working with files and I/O`,
      tool.tips[0] || 'Best practices & style guides',
      `Testing: unit tests in ${n}`,
      `Debugging techniques & tools`,
      `${n} standard library deep dive`,
      tool.tips[1] || 'Intermediate patterns',
      `REST API consumption with ${n}`,
      `Error handling & logging patterns`,
      `Build: CRUD app with ${n}`,
      `Code quality: linting & formatting`,
      `Performance profiling basics`,
      `Intermediate project: build a CLI tool`,
      `Code review & pair programming`,
    ],
    pro: [
      `${n} internals & runtime model`,
      `Advanced data structures & algorithms`,
      `Design patterns in ${n}`,
      `Concurrency & async patterns`,
      `Memory management & optimization`,
      tool.tips[tool.tips.length - 1] || 'Advanced mastery techniques',
      `Security best practices in ${n}`,
      `CI/CD pipeline setup for ${n} projects`,
      `Microservices / system design with ${n}`,
      `Contributing to open source ${n} projects`,
      `Performance benchmarking & profiling`,
      `Advanced testing: integration & e2e`,
      `Architecture: scalable ${n} applications`,
      `Mentorship: code review & documentation`,
      `Capstone: full production-grade project`,
      `Interview prep: ${n} algorithm challenges`,
    ],
  };

  const base = curricula[level];
  const weak = weakTopics.slice(0, 3).map(t => `📌 Revisit: ${t}`);
  return [...weak, ...base];
}

function generatePlan(tool: Tool, level: Level, weakTopics: string[], hoursPerDay: number): DayPlan[] {
  const topics = getTopics(tool, level, weakTopics);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['08:00 AM', '10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM'];

  const slotTypes: Record<Level, StudySlot['type'][]> = {
    beginner:  ['learn', 'practice', 'revise'],
    moderate:  ['learn', 'practice', 'project', 'revise'],
    pro:       ['learn', 'challenge', 'project', 'practice', 'revise'],
  };
  const types = slotTypes[level];

  const totalDays = levelMeta[level].weeks * 5; // weekdays only
  const slotsPerDay = Math.max(1, Math.min(hoursPerDay, 3));

  return days.slice(0, 5).map((day, di) => {
    const slots: StudySlot[] = Array.from({ length: slotsPerDay }, (_, si) => ({
      time: times[(di + si) % times.length],
      topic: topics[(di * slotsPerDay + si) % topics.length],
      duration: `${Math.ceil((hoursPerDay / slotsPerDay) * 60)} min`,
      type: types[(di + si) % types.length],
    }));
    return { day, slots };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { tool: Tool; weakTopics: string[]; }

export function StudyPlanner({ tool, weakTopics }: Props) {
  const [level, setLevel] = useState<Level | null>(null);
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const handleSelectLevel = (lvl: Level) => {
    setLevel(lvl);
    setPlan(null);
    setCompleted(new Set());
  };

  const generate = () => {
    if (!level) return;
    setPlan(generatePlan(tool, level, weakTopics, hours));
    setCompleted(new Set());
  };

  const toggleComplete = (key: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // ── Level selector ──────────────────────────────────────────────────────────
  if (!level) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">Choose your level to get a tailored study plan:</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(levelMeta) as Level[]).map(lvl => {
            const meta = levelMeta[lvl];
            const Icon = meta.icon;
            return (
              <button
                key={lvl}
                onClick={() => handleSelectLevel(lvl)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 text-center hover:shadow-md ${meta.border} bg-white dark:bg-card hover:scale-[1.02]`}
              >
                <Icon className={`h-8 w-8 ${meta.color}`} />
                <span className="font-bold text-base">{meta.label}</span>
                <span className="text-xs text-muted-foreground leading-snug">{meta.desc}</span>
                <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}>
                  {meta.weeks} weeks
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
  const totalSessions = plan ? plan.reduce((a, d) => a + d.slots.length, 0) : 0;

  return (
    <div className="space-y-5">
      {/* Level header + change */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LevelIcon className={`h-4 w-4 ${meta.color}`} />
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.badge}`}>{meta.label} Plan</span>
          <span className="text-xs text-muted-foreground">{meta.weeks}-week curriculum</span>
        </div>
        <button onClick={() => setLevel(null)} className="text-xs text-muted-foreground hover:text-foreground underline">
          Change level
        </button>
      </div>

      {/* Hours + generate */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Hours/day:</span>
          {[1, 2, 3].map(h => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${hours === h ? 'bg-blue-600 text-white border-blue-600' : 'border-border hover:border-blue-400'}`}
            >
              {h}h
            </button>
          ))}
        </div>
        <Button onClick={generate} size="sm" className="gap-2 ml-auto">
          <Calendar className="h-4 w-4" />
          {plan ? 'Regenerate' : 'Generate Plan'}
        </Button>
      </div>

      {/* Weak areas notice */}
      {weakTopics.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <span className="text-xs text-orange-700 font-medium w-full">Weak areas added to plan:</span>
          {weakTopics.slice(0, 3).map((t, i) => (
            <Badge key={i} className="bg-orange-100 text-orange-700 text-xs">{t}</Badge>
          ))}
        </div>
      )}

      {/* Plan */}
      {plan && (
        <div className="space-y-3">
          {plan.map((day) => (
            <div key={day.day} className="border rounded-xl overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-semibold text-sm flex items-center justify-between">
                <span>{day.day}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {day.slots.filter((_, si) => completed.has(`${day.day}-${si}`)).length}/{day.slots.length} done
                </span>
              </div>
              <div className="divide-y">
                {day.slots.map((slot, si) => {
                  const key = `${day.day}-${si}`;
                  const done = completed.has(key);
                  const Cfg = typeConfig[slot.type];
                  const Icon = Cfg.icon;
                  return (
                    <div key={si} className={`flex items-center gap-3 px-4 py-3 transition-all ${done ? 'opacity-40 line-through' : ''}`}>
                      <span className="text-xs text-muted-foreground w-20 shrink-0">{slot.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ${Cfg.color}`}>
                        <Icon className="h-3 w-3" />{Cfg.label}
                      </span>
                      <span className="text-sm flex-1 min-w-0 truncate">{slot.topic}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{slot.duration}</span>
                      <button onClick={() => toggleComplete(key)} className="shrink-0">
                        <CheckCircle2 className={`h-5 w-5 transition-colors ${done ? 'text-green-500' : 'text-muted-foreground/30 hover:text-green-400'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Progress summary */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 px-1">
            <span>{completed.size} of {totalSessions} sessions completed</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${meta.badge}`}>
              {totalSessions > 0 ? Math.round((completed.size / totalSessions) * 100) : 0}% this week
            </span>
          </div>
        </div>
      )}

      {!plan && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Set your daily hours and generate your {meta.label} study plan.
        </div>
      )}
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Sprout, Flame, Zap } from 'lucide-react';
import type { Tool } from '@/lib/tools';

export type LearnerLevel = 'beginner' | 'moderate' | 'pro';

interface Question {
  id: number;
  text: string;
  code?: string;        // starter/hint code shown to user
  options: string[];
  correct: number;
  topic: string;
  type?: 'mcq' | 'code'; // code = user types answer
  codeAnswer?: string;   // expected answer keywords for validation
  codeHint?: string;     // hint shown after wrong attempt
}

// ── Per-level question banks ──────────────────────────────────────────────────

function beginnerQuestions(lang: Tool): Question[] {
  const n = lang.name;
  return [
    {
      id: 1, topic: 'What is it?',
      text: `What is ${n}?`,
      options: [
        lang.description.slice(0, 70) + '...',
        'A type of database management system',
        'A cloud hosting platform',
        'A version control tool',
      ], correct: 0,
    },
    {
      id: 2, topic: 'Category',
      text: `${n} belongs to which category?`,
      options: [lang.category, 'Operating System', 'Network Protocol', 'Hardware Driver'],
      correct: 0,
    },
    {
      id: 3, topic: 'First Step',
      text: `What is the first thing a beginner should do when learning ${n}?`,
      options: [
        'Read the official documentation and try simple examples',
        'Build a production app immediately',
        'Skip tutorials and read source code',
        'Memorize all syntax rules first',
      ], correct: 0,
    },
    {
      id: 4, topic: 'Resource',
      text: `Which resource is recommended for learning ${n}?`,
      options: [lang.resources[0].title, 'Random social media posts', 'No resources needed', 'Only paid bootcamps'],
      correct: 0,
    },
    {
      id: 5, topic: 'Basic Tip',
      text: `A good beginner tip for ${n} is:`,
      options: [lang.tips[0], 'Avoid writing any code', 'Skip error messages', 'Never ask for help'],
      correct: 0,
    },
    {
      id: 6, topic: 'Purpose',
      text: `${n} is most commonly used for:`,
      options: [
        `Building ${lang.category.toLowerCase()} solutions`,
        'Designing hardware circuits',
        'Managing physical servers only',
        'Creating spreadsheets',
      ], correct: 0,
    },
    {
      id: 7, topic: 'Syntax',
      text: `When starting with ${n}, which habit is most important?`,
      options: [
        'Practice writing small programs daily',
        'Only read, never write code',
        'Copy-paste everything without understanding',
        'Avoid running your code',
      ], correct: 0,
    },
    {
      id: 8, topic: 'Community',
      text: `Where can beginners get help with ${n}?`,
      options: [
        'Official docs, forums, and community channels',
        'There is no community for this language',
        'Only paid support is available',
        'You must figure it out alone',
      ], correct: 0,
    },
  ];
}

function moderateQuestions(lang: Tool): Question[] {
  const n = lang.name;

  const codeChallenge: Question = {
    id: 1, topic: 'Code Challenge', type: 'code',
    text: n === 'Python'
      ? `Write a Python function called "add" that takes two numbers and returns their sum.\nExample: add(3, 4) should return 7`
      : n === 'JavaScript'
      ? `Write a JavaScript function called "add" that takes two numbers and returns their sum.\nExample: add(3, 4) should return 7`
      : n === 'Java'
      ? `Write a Java method called "add" that takes two integers and returns their sum.\nExample: add(3, 4) should return 7`
      : n === 'C#'
      ? `Write a C# method called "Add" that takes two integers and returns their sum.\nExample: Add(3, 4) should return 7`
      : n === 'Go'
      ? `Write a Go function called "add" that takes two integers and returns their sum.\nExample: add(3, 4) should return 7`
      : n === 'C++'
      ? `Write a C++ function called "add" that takes two integers and returns their sum.\nExample: add(3, 4) should return 7`
      : n === 'C'
      ? `Write a C function called "add" that takes two integers and returns their sum.\nExample: add(3, 4) should return 7`
      : `Write a function called "add" that takes two numbers and returns their sum.\nExample: add(3, 4) should return 7`,
    code: n === 'Python'
      ? `def add(a, b):\n    # your code here`
      : n === 'JavaScript'
      ? `function add(a, b) {\n  // your code here\n}`
      : n === 'Java'
      ? `public static int add(int a, int b) {\n    // your code here\n}`
      : n === 'C#'
      ? `public static int Add(int a, int b) {\n    // your code here\n}`
      : n === 'Go'
      ? `func add(a int, b int) int {\n    // your code here\n}`
      : n === 'C++'
      ? `int add(int a, int b) {\n    // your code here\n}`
      : n === 'C'
      ? `int add(int a, int b) {\n    /* your code here */\n}`
      : `function add(a, b) {\n  // your code here\n}`,
    codeAnswer: 'return a + b',
    codeHint: n === 'Python'
      ? `def add(a, b):\n    return a + b`
      : n === 'JavaScript' || n === 'Java' || n === 'C#' || n === 'C++' || n === 'C'
      ? `return a + b;`
      : `return a + b`,
    options: [], correct: 0,
  };

  return [
    codeChallenge,
    {
      id: 2, topic: 'Best Practices',
      text: `Which is a recommended intermediate practice in ${n}?`,
      options: [lang.tips[0], 'Avoid version control', 'Write all logic in one file', 'Skip code reviews'],
      correct: 0,
    },
    {
      id: 3, topic: 'Tooling',
      text: `What tooling or ecosystem knowledge is important for ${n} developers?`,
      options: [
        `Understanding ${lang.category} tools and package managers`,
        'Only using Notepad for editing',
        'Avoiding all third-party libraries',
        'Ignoring build systems',
      ], correct: 0,
    },
    {
      id: 4, topic: 'Debugging',
      text: `When debugging ${n} code, what is the best approach?`,
      options: [
        'Use a debugger, read error messages carefully, and isolate the issue',
        'Delete the code and start over every time',
        'Ignore all warnings',
        'Only ask others without trying yourself',
      ], correct: 0,
    },
    {
      id: 5, topic: 'Code Quality',
      text: `How do intermediate ${n} developers improve code quality?`,
      options: [
        'Code reviews, linting, and following style guides',
        'Writing as little code as possible',
        'Avoiding comments entirely',
        'Never refactoring',
      ], correct: 0,
    },
    {
      id: 6, topic: 'Project Structure',
      text: `How should a moderate ${n} developer organize a project?`,
      options: [
        'Separate concerns, use modules, and follow conventions',
        'Put everything in one file',
        'Avoid folder structures',
        'Use random file names',
      ], correct: 0,
    },
    {
      id: 7, topic: 'Testing',
      text: `Why is testing important in ${n} development?`,
      options: [
        'It catches bugs early and ensures code reliability',
        'Tests slow down development with no benefit',
        'Only large companies need tests',
        'Testing is optional and rarely useful',
      ], correct: 0,
    },
    {
      id: 8, topic: 'Performance',
      text: `How does an intermediate ${n} developer approach performance?`,
      options: [
        'Profile first, then optimize bottlenecks',
        'Optimize everything upfront before writing logic',
        'Rewrite in a different language immediately',
        'Ignore performance entirely',
      ], correct: 0,
    },
  ];
}

function proQuestions(lang: Tool): Question[] {
  const n = lang.name;
  const isPy = n === 'Python';
  const isJS = n === 'JavaScript';
  const isJava = n === 'Java';
  const isCS = n === 'C#';
  const isGo = n === 'Go';
  const isCpp = n === 'C++';
  const isC = n === 'C';

  // ── 4 tough coding challenges ─────────────────────────────────────────────

  const challenges: Question[] = [
    // 1. Two Sum — classic interview problem
    {
      id: 1, topic: 'Two Sum', type: 'code',
      text: `Given an array of integers and a target, return the indices of the two numbers that add up to the target.\nEach input has exactly one solution. You may not use the same element twice.\n\nExample:\n  twoSum([2, 7, 11, 15], 9) → [0, 1]\n  twoSum([3, 2, 4], 6)      → [1, 2]`,
      code: isPy
        ? `def twoSum(nums, target):\n    # Use a hash map for O(n) solution\n    # your code here`
        : isJS
        ? `function twoSum(nums, target) {\n  // Use a Map for O(n) solution\n  // your code here\n}`
        : isJava
        ? `public static int[] twoSum(int[] nums, int target) {\n    // Use HashMap for O(n) solution\n    // your code here\n}`
        : isCS
        ? `public static int[] TwoSum(int[] nums, int target) {\n    // Use Dictionary for O(n) solution\n    // your code here\n}`
        : isGo
        ? `func twoSum(nums []int, target int) []int {\n    // Use map for O(n) solution\n    // your code here\n}`
        : isCpp
        ? `vector<int> twoSum(vector<int>& nums, int target) {\n    // Use unordered_map for O(n) solution\n    // your code here\n}`
        : `int* twoSum(int* nums, int n, int target) {\n    /* Use hash map for O(n) solution */\n    /* your code here */\n}`,
      codeAnswer: isPy ? 'map|dict|{}|complement' : isGo ? 'map[int]int|complement' : 'map|Map|HashMap|Dictionary|complement',
      codeHint: isPy
        ? `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i`
        : isJS
        ? `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}`
        : isJava
        ? `Map<Integer,Integer> map = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) {\n    int comp = target - nums[i];\n    if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n    map.put(nums[i], i);\n}`
        : `// Store each number's index in a hash map.\n// For each element, check if (target - element) exists in the map.`,
      options: [], correct: 0,
    },

    // 2. Linked List — detect cycle
    {
      id: 2, topic: 'Linked List Cycle', type: 'code',
      text: `Implement Floyd's cycle detection algorithm.\nWrite a function "hasCycle" that returns true if a linked list has a cycle, false otherwise.\nUse O(1) extra space (two-pointer approach).\n\nNode structure is given in the starter code.`,
      code: isPy
        ? `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\ndef hasCycle(head):\n    # Use slow and fast pointers\n    # your code here`
        : isJS
        ? `// Node: { val, next }\nfunction hasCycle(head) {\n  // Use slow and fast pointers\n  // your code here\n}`
        : isJava
        ? `// class Node { int val; Node next; }\npublic static boolean hasCycle(Node head) {\n    // Use slow and fast pointers\n    // your code here\n}`
        : isCS
        ? `// class Node { public int val; public Node next; }\npublic static bool HasCycle(Node head) {\n    // Use slow and fast pointers\n    // your code here\n}`
        : isGo
        ? `// type Node struct { Val int; Next *Node }\nfunc hasCycle(head *Node) bool {\n    // Use slow and fast pointers\n    // your code here\n}`
        : isCpp
        ? `// struct Node { int val; Node* next; };\nbool hasCycle(Node* head) {\n    // Use slow and fast pointers\n    // your code here\n}`
        : `/* struct Node { int val; struct Node* next; }; */\nbool hasCycle(struct Node* head) {\n    /* Use slow and fast pointers */\n}`,
      codeAnswer: 'slow|fast|slow == fast|slow===fast',
      codeHint: isPy
        ? `def hasCycle(head):\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`
        : isJS
        ? `function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}`
        : `// slow moves 1 step, fast moves 2 steps.\n// If they meet, there's a cycle.\n// If fast reaches null, no cycle.`,
      options: [], correct: 0,
    },

    // 3. Binary Search
    {
      id: 3, topic: 'Binary Search', type: 'code',
      text: `Implement binary search.\nWrite a function "binarySearch" that takes a sorted array and a target, and returns the index of the target, or -1 if not found.\nMust run in O(log n) time.\n\nExample:\n  binarySearch([1,3,5,7,9], 5) → 2\n  binarySearch([1,3,5,7,9], 4) → -1`,
      code: isPy
        ? `def binarySearch(arr, target):\n    left, right = 0, len(arr) - 1\n    # your code here`
        : isJS
        ? `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  // your code here\n}`
        : isJava
        ? `public static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    // your code here\n}`
        : isCS
        ? `public static int BinarySearch(int[] arr, int target) {\n    int left = 0, right = arr.Length - 1;\n    // your code here\n}`
        : isGo
        ? `func binarySearch(arr []int, target int) int {\n    left, right := 0, len(arr)-1\n    // your code here\n}`
        : isCpp
        ? `int binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    // your code here\n}`
        : `int binarySearch(int* arr, int n, int target) {\n    int left = 0, right = n - 1;\n    /* your code here */\n}`,
      codeAnswer: 'mid|while|left <= right',
      codeHint: isPy
        ? `while left <= right:\n    mid = (left + right) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: left = mid + 1\n    else: right = mid - 1\nreturn -1`
        : isJS
        ? `while (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (arr[mid] === target) return mid;\n  else if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;`
        : `// Calculate mid = (left + right) / 2\n// If arr[mid] == target → return mid\n// If arr[mid] < target  → left = mid + 1\n// If arr[mid] > target  → right = mid - 1`,
      options: [], correct: 0,
    },

    // 4. Memoized Fibonacci
    {
      id: 4, topic: 'Memoization', type: 'code',
      text: `Write a function "fib" that returns the nth Fibonacci number using memoization (top-down dynamic programming).\nNaive recursion is O(2^n) — your solution must be O(n).\n\nExample:\n  fib(0) → 0\n  fib(1) → 1\n  fib(10) → 55\n  fib(50) → 12586269025`,
      code: isPy
        ? `def fib(n, memo={}):\n    # Use memo dict to cache results\n    # your code here`
        : isJS
        ? `function fib(n, memo = {}) {\n  // Use memo object to cache results\n  // your code here\n}`
        : isJava
        ? `private static Map<Integer,Long> memo = new HashMap<>();\npublic static long fib(int n) {\n    // Use memo map to cache results\n    // your code here\n}`
        : isCS
        ? `private static Dictionary<int,long> memo = new();\npublic static long Fib(int n) {\n    // Use memo dictionary to cache results\n    // your code here\n}`
        : isGo
        ? `var memo = map[int]int64{}\nfunc fib(n int) int64 {\n    // Use memo map to cache results\n    // your code here\n}`
        : isCpp
        ? `unordered_map<int,long long> memo;\nlong long fib(int n) {\n    // Use memo map to cache results\n    // your code here\n}`
        : `long long memo[100] = {0};\nlong long fib(int n) {\n    /* Use memo array to cache results */\n}`,
      codeAnswer: 'memo|cache|memoize|dp',
      codeHint: isPy
        ? `def fib(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]`
        : isJS
        ? `function fib(n, memo = {}) {\n  if (n <= 1) return n;\n  if (n in memo) return memo[n];\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n}`
        : `// Base cases: fib(0)=0, fib(1)=1\n// Check if n is already in memo before recursing\n// Store result in memo before returning`,
      options: [], correct: 0,
    },
  ];

  // ── 4 tough MCQ questions ─────────────────────────────────────────────────

  return [
    ...challenges,
    {
      id: 5, topic: 'Memory Management',
      text: `In ${n}, what is the most likely cause of a memory leak in a long-running process?`,
      options: [
        'Holding references to objects that are no longer needed, preventing garbage collection',
        'Using too many local variables inside functions',
        'Declaring constants at module level',
        'Using built-in data structures instead of custom ones',
      ], correct: 0,
    },
    {
      id: 6, topic: 'Concurrency Bug',
      text: `Two threads in a ${n} program both read a shared counter (value=5), increment it, and write back. What is the final value?`,
      options: [
        '6 — a race condition causes one increment to be lost',
        '7 — both increments are always applied correctly',
        '5 — the counter never changes with threads',
        '0 — threads reset shared memory',
      ], correct: 0,
    },
    {
      id: 7, topic: 'Big-O Analysis',
      text: `A function has two nested loops each iterating n times, followed by a single loop iterating n times. What is the overall time complexity?`,
      options: [
        'O(n²) — the nested loops dominate',
        'O(n³) — all three loops multiply',
        'O(n) — loops are added not multiplied',
        'O(log n) — loops cancel each other out',
      ], correct: 0,
    },
    {
      id: 8, topic: 'Deadlock',
      text: `Which condition is NOT required for a deadlock to occur in a ${n} concurrent program?`,
      options: [
        'Preemption — resources can be forcibly taken from a thread',
        'Mutual exclusion — resources held by only one thread at a time',
        'Hold and wait — a thread holds one resource while waiting for another',
        'Circular wait — a circular chain of threads each waiting on the next',
      ], correct: 0,
    },
  ];
}

function shuffle(questions: Question[]): Question[] {
  return questions.map(q => {
    const opts = [...q.options];
    const correctText = opts[q.correct];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...q, options: opts, correct: opts.indexOf(correctText) };
  });
}

// ── Level config ──────────────────────────────────────────────────────────────

const levelConfig = {
  beginner: {
    label: 'Beginner',
    icon: Sprout,
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200 hover:border-green-400',
    activeBg: 'bg-green-600 text-white border-green-600',
    badge: 'bg-green-100 text-green-700',
    desc: 'New to the language? Start here with fundamentals and core concepts.',
    questions: beginnerQuestions,
  },
  moderate: {
    label: 'Moderate',
    icon: Flame,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
    activeBg: 'bg-yellow-500 text-white border-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
    desc: 'Comfortable with basics? Test your intermediate knowledge and best practices.',
    questions: moderateQuestions,
  },
  pro: {
    label: 'Pro',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    activeBg: 'bg-purple-600 text-white border-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    desc: 'Expert-level questions on architecture, security, and advanced patterns.',
    questions: proQuestions,
  },
} as const;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  tool: Tool;
  onWeaknessUpdate: (topics: string[]) => void;
  onDone?: (wrongTopics: string[]) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LanguageQuiz({ tool, onWeaknessUpdate, onDone }: Props) {
  const [level, setLevel] = useState<LearnerLevel | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [codeResult, setCodeResult] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  // track per-question answers for the solutions review
  const [history, setHistory] = useState<{
    question: Question;
    userAnswer: string;   // option text or typed code
    correct: boolean;
  }[]>([]);

  const startQuiz = (lvl: LearnerLevel) => {
    const qs = shuffle(levelConfig[lvl].questions(tool));
    setLevel(lvl);
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setWrongTopics([]);
    setDone(false);
    setStreak(0);
    setUserCode('');
    setCodeResult(null);
    setShowHint(false);
    setHistory([]);
    onWeaknessUpdate([]);
  };

  const handleCodeSubmit = () => {
    const q = questions[current];
    const normalized = userCode.toLowerCase().replace(/\s+/g, ' ').trim();
    const keywords = (q.codeAnswer || '').toLowerCase().split('|');
    const isCorrect = keywords.some(kw => normalized.includes(kw.trim()));
    setCodeResult(isCorrect ? 'correct' : 'wrong');
    setAnswered(true);
    setHistory(prev => [...prev, { question: q, userAnswer: userCode, correct: isCorrect }]);
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setWrongTopics(prev => {
        const updated = [...prev, q.topic];
        onWeaknessUpdate(updated);
        return updated;
      });
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = questions[current];
    const isCorrect = idx === q.correct;
    setHistory(prev => [...prev, { question: q, userAnswer: q.options[idx], correct: isCorrect }]);
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setWrongTopics(prev => {
        const updated = [...prev, q.topic];
        onWeaknessUpdate(updated);
        return updated;
      });
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
      onDone?.(wrongTopics);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setUserCode('');
      setCodeResult(null);
      setShowHint(false);
    }
  };

  // ── Level selector ──────────────────────────────────────────────────────────
  if (!level) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">Choose your experience level to get a tailored test:</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(levelConfig) as LearnerLevel[]).map(lvl => {
            const cfg = levelConfig[lvl];
            const Icon = cfg.icon;
            return (
              <button
                key={lvl}
                onClick={() => startQuiz(lvl)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 text-center ${cfg.bg}`}
              >
                <Icon className={`h-8 w-8 ${cfg.color}`} />
                <span className="font-bold text-base">{cfg.label}</span>
                <span className="text-xs text-muted-foreground leading-snug">{cfg.desc}</span>
                <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
                  {lvl === 'moderate' ? '1 Code + 7 MCQ' : lvl === 'pro' ? '4 Code + 4 MCQ' : '8 Questions'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const cfg = levelConfig[level];
  const q = questions[current];

  // ── Results ─────────────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const LevelIcon = cfg.icon;
    return (
      <div className="space-y-6">
        {/* Score summary */}
        <div className="text-center space-y-3 py-4">
          <Trophy className="h-14 w-14 text-yellow-500 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <LevelIcon className={`h-5 w-5 ${cfg.color}`} />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${cfg.badge}`}>{cfg.label} Level</span>
          </div>
          <p className="text-2xl font-bold">{score}/{questions.length} correct</p>
          <Progress value={pct} className="max-w-xs mx-auto" />
          <p className="text-muted-foreground text-sm">
            {pct >= 80 ? '🎉 Excellent! You have strong knowledge at this level.' : pct >= 50 ? '👍 Good effort! Review the solutions below and retry.' : '📚 Keep studying — review every solution carefully below.'}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={() => startQuiz(level)} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Retry {cfg.label}
            </Button>
            <Button onClick={() => setLevel(null)} variant="ghost">Change Level</Button>
          </div>
        </div>

        {/* Solutions review */}
        <div className="space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2 border-t pt-4">
            <span>📋</span> Full Solutions Review
          </h3>
          {history.map((entry, i) => {
            const isCode = entry.question.type === 'code';
            return (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden ${entry.correct ? 'border-green-200' : 'border-red-200'}`}
              >
                {/* Question header */}
                <div className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold ${entry.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {entry.correct
                    ? <CheckCircle className="h-4 w-4 shrink-0" />
                    : <XCircle className="h-4 w-4 shrink-0" />}
                  <span>Q{i + 1} · {entry.question.topic}</span>
                  {isCode && <span className="ml-auto font-mono bg-gray-800 text-green-400 px-2 py-0.5 rounded">&lt;/&gt; Code</span>}
                </div>

                <div className="px-4 py-3 space-y-3">
                  {/* Question text */}
                  <p className="text-sm font-medium whitespace-pre-line">{entry.question.text}</p>

                  {isCode ? (
                    <div className="space-y-2">
                      {/* User's code */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Your answer:</p>
                        <pre className={`text-xs font-mono rounded-xl p-3 border whitespace-pre overflow-x-auto ${entry.correct ? 'bg-green-950 text-green-300 border-green-800' : 'bg-red-950 text-red-300 border-red-800'}`}>
                          {entry.userAnswer || '(no code submitted)'}
                        </pre>
                      </div>
                      {/* Correct solution always shown */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">✅ Correct solution:</p>
                        <pre className="bg-gray-950 text-yellow-300 text-xs font-mono rounded-xl p-3 border border-gray-800 whitespace-pre overflow-x-auto">
                          {entry.question.codeHint || '// See language documentation'}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {entry.question.options.map((opt, oi) => {
                        const isCorrectOpt = oi === entry.question.correct;
                        const isUserPick = opt === entry.userAnswer;
                        let cls = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ';
                        if (isCorrectOpt) cls += 'bg-green-50 border-green-400 text-green-800 font-medium';
                        else if (isUserPick && !isCorrectOpt) cls += 'bg-red-50 border-red-300 text-red-700 line-through';
                        else cls += 'border-border text-muted-foreground opacity-50';
                        return (
                          <div key={oi} className={cls}>
                            {isCorrectOpt && <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />}
                            {isUserPick && !isCorrectOpt && <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                            {!isCorrectOpt && !isUserPick && <span className="w-3.5 shrink-0" />}
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Quiz ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>{cfg.label}</span>
          <span className="text-xs text-muted-foreground">Q{current + 1}/{questions.length}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-xs">{q.topic}</Badge>
          {q.type === 'code' && <Badge className="bg-gray-800 text-green-400 text-xs font-mono">&lt;/&gt; Code</Badge>}
          {streak >= 2 && <Badge className="bg-orange-100 text-orange-700 text-xs">🔥 {streak}</Badge>}
          <button onClick={() => setLevel(null)} className="text-xs text-muted-foreground hover:text-foreground underline">
            Change level
          </button>
        </div>
      </div>

      <Progress value={(current / questions.length) * 100} />

      {/* Question text */}
      <div className="bg-muted/40 rounded-xl p-4">
        <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{q.text}</p>
      </div>

      {/* CODE CHALLENGE */}
      {q.type === 'code' ? (
        <div className="space-y-3">
          {/* Starter code */}
          {q.code && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">Starter template:</p>
              <pre className="bg-gray-950 text-gray-300 text-xs rounded-xl p-4 font-mono leading-relaxed border border-gray-800 whitespace-pre overflow-x-auto">
                {q.code}
              </pre>
            </div>
          )}

          {/* Code editor textarea */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-medium">Your solution:</p>
            <textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              disabled={answered}
              rows={8}
              spellCheck={false}
              placeholder="Write your code here..."
              className="w-full bg-gray-950 text-green-300 text-sm font-mono rounded-xl p-4 border border-gray-700 focus:border-blue-500 focus:outline-none resize-y leading-relaxed placeholder:text-gray-600 disabled:opacity-70"
            />
          </div>

          {/* Feedback */}
          {codeResult === 'correct' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-xl text-green-700 text-sm">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Correct! Great solution.</span>
            </div>
          )}
          {codeResult === 'wrong' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-sm">
                <XCircle className="h-5 w-5 shrink-0" />
                <span>Not quite right. Review your logic and try again, or check the hint.</span>
              </div>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Show hint / solution
                </button>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hint / Solution:</p>
                  <pre className="bg-gray-950 text-yellow-300 text-xs rounded-xl p-3 font-mono border border-gray-800 whitespace-pre overflow-x-auto">
                    {q.codeHint}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Submit / Next */}
          {!answered ? (
            <Button
              onClick={handleCodeSubmit}
              disabled={!userCode.trim()}
              className="w-full gap-2"
            >
              Submit Code <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full gap-2">
              {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        /* MCQ */
        <div className="space-y-3">
          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ';
              if (!answered) {
                cls += 'hover:border-blue-400 hover:bg-blue-50 cursor-pointer border-border';
              } else if (i === q.correct) {
                cls += 'border-green-500 bg-green-50 text-green-800';
              } else if (i === selected && i !== q.correct) {
                cls += 'border-red-400 bg-red-50 text-red-700';
              } else {
                cls += 'border-border opacity-40';
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}>
                  <span className="flex items-center gap-2">
                    {answered && i === q.correct && <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />}
                    {answered && i === selected && i !== q.correct && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          {answered && (
            <Button onClick={handleNext} className="w-full gap-2">
              {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'dots' | 'grid' | 'waves' | 'particles';
}

export function AnimatedBackground({ 
  className, 
  variant = 'dots' 
}: AnimatedBackgroundProps) {
  if (variant === 'dots') {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
        <style jsx>{`
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'waves') {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
              </linearGradient>
            </defs>
            <path
              d="M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z"
              fill="url(#wave-gradient)"
              className="animate-pulse"
            />
            <path
              d="M0,500 C300,400 600,600 1200,500 L1200,800 L0,800 Z"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'particles') {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
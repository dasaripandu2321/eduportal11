'use client';

import { cn } from '@/lib/utils';

interface AnimatedLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'spinner' | 'pulse' | 'wave';
}

export function AnimatedLoader({ 
  className, 
  size = 'md', 
  variant = 'dots' 
}: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center gap-1', className)}>
        <div className={cn(
          'rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-bounce',
          sizeClasses[size]
        )} style={{ animationDelay: '0ms' }}></div>
        <div className={cn(
          'rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce',
          sizeClasses[size]
        )} style={{ animationDelay: '150ms' }}></div>
        <div className={cn(
          'rounded-full bg-gradient-to-r from-pink-500 to-orange-500 animate-bounce',
          sizeClasses[size]
        )} style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn('relative', className)}>
        <div className={cn(
          'rounded-full border-4 border-gray-200 animate-spin',
          sizeClasses[size]
        )}>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn(
          'rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse',
          sizeClasses[size]
        )}></div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn('flex items-end justify-center gap-1', className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse',
              size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : 'w-2 h-8'
            )}
            style={{ 
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    );
  }

  return null;
}
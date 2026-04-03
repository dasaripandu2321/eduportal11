'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';

interface GradientButtonProps extends ButtonProps {
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'rainbow';
  animated?: boolean;
  glow?: boolean;
}

const gradientClasses = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
  secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
  accent: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600',
  success: 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600',
  info: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
  rainbow: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-600 hover:to-red-600',
};

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradient = 'primary', animated = false, glow = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105',
          gradientClasses[gradient],
          animated && 'animate-gradient-x bg-[length:200%_200%]',
          glow && 'hover:shadow-2xl hover:shadow-blue-500/25',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
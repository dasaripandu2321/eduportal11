'use client';

import React from 'react';

interface PrismLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PrismLoader({ size = 40, color = '#3b82f6', className = '' }: PrismLoaderProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className="relative animate-spin"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 50 50"
          className="animate-spin"
        >
          <defs>
            <linearGradient id="prism-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="50%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer ring */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#prism-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            filter="url(#glow)"
            className="animate-pulse"
          >
            <animate
              attributeName="stroke-dasharray"
              dur="2s"
              values="0 31.416;15.708 15.708;0 31.416"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              dur="2s"
              values="0;-15.708;-31.416"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Inner ring */}
          <circle
            cx="25"
            cy="25"
            r="12"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="18.85"
            strokeDashoffset="18.85"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dasharray"
              dur="1.5s"
              values="0 18.85;9.425 9.425;0 18.85"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              dur="1.5s"
              values="0;-9.425;-18.85"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Center dot */}
          <circle
            cx="25"
            cy="25"
            r="3"
            fill={color}
            opacity="0.8"
            className="animate-pulse"
          >
            <animate
              attributeName="r"
              dur="1s"
              values="2;4;2"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              dur="1s"
              values="0.8;0.4;0.8"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
}

export function FluxLoader({ size = 60, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDuration: '0.6s' }}></div>
        
        {/* Center pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function PrismFluxLoader({ size = 50, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
        
        {/* Middle ring */}
        <div 
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
        
        {/* Inner ring */}
        <div 
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-500 border-r-cyan-500 animate-spin"
          style={{ animationDuration: '0.8s' }}
        ></div>
        
        {/* Center prism effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 w-4 h-4 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
      </div>
    </div>
  );
}
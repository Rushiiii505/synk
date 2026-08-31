'use client';

import React from 'react';

interface SynkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  variant?: 'lime' | 'dark' | 'white';
}

export function SynkLogo({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'lime',
}: SynkLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-base', container: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'gap-2.5' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', container: 'gap-3' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', container: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.container} select-none ${className}`}>
      {/* Brand Icon Glyph */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Rounded Geometric Canvas */}
          <rect
            width="48"
            height="48"
            rx="14"
            className={
              variant === 'white'
                ? 'fill-white'
                : variant === 'dark'
                ? 'fill-slate-950'
                : 'fill-slate-950'
            }
          />

          {/* Connected Synk Synchronized Nodes & Flux Curve */}
          <defs>
            <linearGradient id="synkGradientLime" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A3E635" />
              <stop offset="0.5" stopColor="#84CC16" />
              <stop offset="1" stopColor="#65A30D" />
            </linearGradient>
            <linearGradient id="synkGradientViolet" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C084FC" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Interlocking S-curves representing synchronization & treasury flow */}
          <path
            d="M34 16C34 13.7909 32.2091 12 30 12H18C14.6863 12 12 14.6863 12 18C12 21.3137 14.6863 24 18 24H30C33.3137 24 36 26.6863 36 30C36 33.3137 33.3137 36 30 36H18C15.7909 36 14 34.2091 14 32"
            stroke="url(#synkGradientLime)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Synchronized Energy Nodes */}
          <circle cx="34" cy="16" r="3" fill="#A3E635" />
          <circle cx="14" cy="32" r="3" fill="#84CC16" />
          <circle cx="24" cy="24" r="2" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showWordmark && (
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight font-sans ${currentSize.text} ${
              variant === 'white' ? 'text-white' : 'text-slate-950'
            }`}
          >
            synk
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 ml-1 mb-2 animate-pulse" />
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'emerald';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/40 focus:ring-indigo-500',
      emerald:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/40 focus:ring-emerald-500',
      secondary:
        'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 focus:ring-slate-400',
      outline:
        'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700/80 hover:border-slate-600 focus:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-slate-400',
      danger:
        'bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/40 shadow-lg shadow-rose-600/20 focus:ring-rose-500',
      glass:
        'bg-white/[0.06] hover:bg-white/[0.12] text-slate-100 border border-white/10 backdrop-blur-md focus:ring-indigo-400',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 gap-1.5 rounded-md h-7',
      sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg h-8.5',
      md: 'text-sm px-4 py-2 gap-2 rounded-lg h-10',
      lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl h-12',
      icon: 'p-2 w-9 h-9 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

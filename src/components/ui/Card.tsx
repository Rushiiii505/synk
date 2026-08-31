import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'indigo' | 'emerald' | 'rose' | 'amber';
  hoverEffect?: boolean;
}

export function Card({
  className,
  glow = 'none',
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: '',
    indigo: 'hover:border-indigo-500/50 hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.25)]',
    emerald: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)]',
    rose: 'hover:border-rose-500/50 hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)]',
    amber: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]',
  };

  return (
    <div
      className={cn(
        'rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md transition-all duration-200',
        hoverEffect && 'hover:-translate-y-0.5 cursor-pointer',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pb-3 border-b border-slate-800/60', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-slate-100 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-slate-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-3 border-t border-slate-800/60 flex items-center', className)} {...props}>
      {children}
    </div>
  );
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (isNaN(amount)) amount = 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount).replace('INR', '₹');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getDaysRemaining(dueDateString: string): { days: number; isOverdue: boolean; label: string } {
  if (!dueDateString) return { days: 0, isOverdue: false, label: 'No due date' };
  const due = new Date(dueDateString);
  const now = new Date();
  due.setHours(23, 59, 59, 999);
  const diffTime = due.getTime() - now.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days: Math.abs(days), isOverdue: true, label: `${Math.abs(days)}d overdue` };
  } else if (days === 0) {
    return { days: 0, isOverdue: false, label: 'Due today' };
  } else if (days === 1) {
    return { days: 1, isOverdue: false, label: 'Due tomorrow' };
  } else {
    return { days: days, isOverdue: false, label: `${days}d left` };
  }
}

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#84cc16', '#7c3aed', '#0ea5e9', '#f59e0b', '#ec4899'],
  });
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

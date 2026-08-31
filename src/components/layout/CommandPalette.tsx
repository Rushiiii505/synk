'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckSquare,
  CreditCard,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { formatCurrency } from '@/lib/utils';

interface CommandResultItem {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    stickyNotes,
    expenses,
    openQuickAction,
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    const navItems: CommandResultItem[] = [
      { id: 'nav_trello', type: 'Navigation', title: '📋 Jump to Trello Board', icon: <CheckSquare className="w-4 h-4 text-indigo-600" />, action: () => scrollTo('trello-section') },
      { id: 'nav_notepad', type: 'Navigation', title: '📝 Jump to Team Notepad', icon: <FileText className="w-4 h-4 text-purple-600" />, action: () => scrollTo('notepad-section') },
      { id: 'nav_finance', type: 'Navigation', title: '💳 Jump to Cashflow Hub', icon: <CreditCard className="w-4 h-4 text-lime-600" />, action: () => scrollTo('cashflow-section') },
      { id: 'nav_team', type: 'Navigation', title: '👥 Jump to Team & Settings', icon: <CheckSquare className="w-4 h-4 text-blue-600" />, action: () => scrollTo('team-section') },
    ];

    const quickActions: CommandResultItem[] = [
      { id: 'qa_task', type: 'Action', title: 'Add a Trello Card', icon: <Plus className="w-4 h-4 text-lime-600" />, action: () => openQuickAction('task') },
      { id: 'qa_note', type: 'Action', title: 'Post a Sticky Memo', icon: <Plus className="w-4 h-4 text-purple-600" />, action: () => openQuickAction('note') },
      { id: 'qa_exp', type: 'Action', title: 'Log Cashflow (IN / OUT)', icon: <Plus className="w-4 h-4 text-emerald-600" />, action: () => openQuickAction('expense') },
    ];

    const matchedCards: CommandResultItem[] = tasks
      .filter((t) => !q || t.title.toLowerCase().includes(q) || t.tags.some((tg) => tg.toLowerCase().includes(q)))
      .map((t) => ({
        id: `task_${t.id}`,
        type: 'Trello Cards',
        title: t.title,
        subtitle: `List: ${t.status} ${t.budgetAmount ? `• Budget: ${formatCurrency(t.budgetAmount)}` : ''}`,
        icon: <CheckSquare className="w-4 h-4 text-indigo-600" />,
        action: () => scrollTo('trello-section'),
      }));

    const matchedNotes: CommandResultItem[] = stickyNotes
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .map((n) => ({
        id: `note_${n.id}`,
        type: 'Team Notepad',
        title: n.title,
        subtitle: n.content.slice(0, 50),
        icon: <FileText className="w-4 h-4 text-purple-600" />,
        action: () => scrollTo('notepad-section'),
      }));

    const matchedExpenses: CommandResultItem[] = expenses
      .filter((e) => !q || e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
      .map((e) => ({
        id: `exp_${e.id}`,
        type: 'Cashflow',
        title: `${e.type === 'IN' ? '+ ' : '- '}${e.title}`,
        subtitle: `${e.category} • ${formatCurrency(e.amount)} • Paid by ${e.paidBy?.name || 'User'}`,
        icon: <CreditCard className="w-4 h-4 text-emerald-600" />,
        action: () => scrollTo('cashflow-section'),
      }));

    let all: CommandResultItem[] = [
      ...quickActions,
      ...navItems,
      ...matchedCards,
      ...matchedNotes,
      ...matchedExpenses,
    ];

    if (q) {
      all = all.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.type.toLowerCase().includes(q)
      );
    }

    return all.slice(0, 10);
  }, [query, tasks, stickyNotes, expenses, openQuickAction]);

  const handleSelect = (index: number) => {
    const item = results[index];
    if (item) {
      item.action();
      setIsCommandPaletteOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
            className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search across Trello cards, sticky memos, cashflow, and actions..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <kbd className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="p-2 max-h-[60vh] overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                  No matching results found for &quot;{query}&quot;
                </div>
              ) : (
                results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-xl bg-white shadow-xs shrink-0 border border-slate-100">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-[11px] text-slate-500 truncate font-normal">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {item.type}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>↑↓ to navigate • ↵ to select</span>
              <span className="font-mono text-[10px]">Universal Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

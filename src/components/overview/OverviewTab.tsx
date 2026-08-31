'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { ReferenceHeroCards } from '@/components/finance/ReferenceHeroCards';
import {
  TrendingUp,
  CheckCircle2,
  FileText,
  CreditCard,
  Users,
  ArrowUpRight,
  Sparkles,
  Zap,
  Plus,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

export function OverviewTab() {
  const {
    currentWorkspace,
    tasks,
    stickyNotes,
    expenses,
    activities,
    setActiveTab,
    openQuickAction,
  } = useWorkspace();
  const { currentUser, users } = useAuth();

  if (!currentWorkspace) return null;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const liquidBalance = Math.max(0, currentWorkspace.totalCapital - totalSpent);
  const completedTasks = tasks.filter((t) => t.status === 'Completed' || t.status === '✅ Done').length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4.5rem)] overflow-y-auto p-6 lg:p-8 space-y-8 bg-[#F8F9FD] select-none">
      {/* 1. Reference Hero Cards */}
      <ReferenceHeroCards />

      {/* 2. Collaborative Velocity & Recent Memos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Trello Highlights */}
        <div className="rounded-3xl p-6 bg-white border border-slate-150 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs">
                📋
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Sprint Trello Deliverables
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('trello')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Open Board →
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveTab('trello')}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{task.title}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    List: {task.status} {task.budgetAmount ? `• $${task.budgetAmount} budget` : ''}
                  </span>
                </div>
                <div className="flex items-center -space-x-1.5 shrink-0">
                  {task.assignees.map((u) => (
                    <img
                      key={u.id}
                      src={u.avatar}
                      alt={u.name}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Notepad Sticky Notes Highlights */}
        <div className="rounded-3xl p-6 bg-white border border-slate-150 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                📝
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Team Notepad & Scratchpad
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('notepad')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              Open Notepad →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stickyNotes.slice(0, 2).map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveTab('notepad')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  note.color === 'mint'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <h4 className="text-xs font-extrabold truncate mb-1">{note.title}</h4>
                <p className="text-[11px] line-clamp-3 leading-relaxed opacity-80">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

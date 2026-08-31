'use client';

import React, { useState, useEffect } from 'react';
import { Expense, Workspace } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useWorkspace } from '@/context/WorkspaceContext';
import { PieChart as PieIcon, BarChart3, Sparkles, TrendingUp, Plus } from 'lucide-react';

interface ExpenseChartsProps {
  expenses: Expense[];
  workspace: Workspace;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Software & AI': '#7C3AED', // Purple
  'Marketing & Ads': '#EC4899', // Pink
  'Operations & Legal': '#0EA5E9', // Sky Blue
  'Inventory & Sourcing': '#84CC16', // Lime
  'Team & Payroll': '#F59E0B', // Amber
  'Income / Funding': '#10B981', // Emerald
  'Client Payout': '#059669',
  Miscellaneous: '#94A3B8', // Slate
};

export function ExpenseCharts({ expenses, workspace }: ExpenseChartsProps) {
  const { openQuickAction } = useWorkspace();
  const [mounted, setMounted] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Calculate Real Outflow Categories
  const categoryTotals: Record<string, number> = {};
  const outflowExpenses = expenses.filter((e) => e.type === 'OUT' || !e.type);
  const inflowExpenses = expenses.filter((e) => e.type === 'IN');

  outflowExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const totalSpent = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);
  const totalInflow = inflowExpenses.reduce((sum, e) => sum + e.amount, 0);
  const hasExpenses = Object.keys(categoryTotals).length > 0;

  const displayCategories = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#7C3AED',
  }));

  // Monthly Bars built strictly from real data or dynamic monthly progression
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });
  const monthlyData = [
    { month: 'Current Sprint', spend: totalSpent, budget: workspace.monthlyBudget },
    { month: 'Monthly Cap', spend: 0, budget: workspace.monthlyBudget },
  ];

  const maxMonthlyVal = Math.max(workspace.monthlyBudget, totalSpent, 1);

  if (!mounted) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 text-center text-xs text-slate-400">
        Loading Treasury Analytics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 select-none">
      {/* 1. Category Breakdown Card (5 cols) */}
      <div className="lg:col-span-5 rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              <PieIcon className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Outflow Breakdown
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {hasExpenses ? `${displayCategories.length} Categories` : 'Empty State'}
          </span>
        </div>

        {!hasExpenses ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto text-base">
              📊
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-slate-800">No outflow logged yet</h5>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                Log team tool subscriptions, contractor payouts, or marketing expenses in ₹.
              </p>
            </div>
            <button
              onClick={() => openQuickAction('expense')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Log First Outflow</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Multi-Segment Proportion Bar */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5 shadow-inner">
                {displayCategories.map((item) => {
                  const pct = (item.value / (totalSpent || 1)) * 100;
                  return (
                    <div
                      key={item.name}
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                      className={`h-full rounded-sm transition-all duration-300 cursor-pointer ${
                        activeSegment === item.name ? 'ring-2 ring-slate-950 scale-y-110' : 'hover:opacity-90'
                      }`}
                      onMouseEnter={() => setActiveSegment(item.name)}
                      onMouseLeave={() => setActiveSegment(null)}
                      title={`${item.name}: ${formatCurrency(item.value)} (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-[11px] text-slate-500 font-medium">Logged Outflow</span>
                <span className="text-xs font-mono font-black text-slate-950">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {displayCategories.map((item) => {
                const pct = Math.round((item.value / (totalSpent || 1)) * 100);
                const isHovered = activeSegment === item.name;

                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveSegment(item.name)}
                    onMouseLeave={() => setActiveSegment(null)}
                    className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs cursor-pointer ${
                      isHovered
                        ? 'bg-slate-50 border-slate-300 shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 font-semibold truncate text-[11px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">{pct}%</span>
                      <span className="text-xs font-mono font-black text-slate-900">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>Total Inflow: <strong className="text-emerald-600 font-bold">+{formatCurrency(totalInflow)}</strong></span>
          <span>INR Corridors</span>
        </div>
      </div>

      {/* 2. Outflow vs Monthly Budget Cap (7 cols) */}
      <div className="lg:col-span-7 rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Spend vs. Monthly Cap ({currentMonthName})
              </h4>
              <p className="text-[10px] text-slate-400">
                Configured Limit: {formatCurrency(workspace.monthlyBudget)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
              <span>Actual Outflow</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span>Budget Cap</span>
            </div>
          </div>
        </div>

        {/* Real Dynamic SVG Bar Graph */}
        <div className="pt-2 pb-1 space-y-2">
          <div className="grid grid-cols-2 gap-4 items-end h-28 border-b border-slate-100 pb-2 px-6">
            {/* 1. Actual Outflow Bar */}
            <div className="flex flex-col items-center h-full justify-end group relative">
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-mono py-1 px-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20">
                Outflow: {formatCurrency(totalSpent)}
              </div>
              <div
                style={{ height: `${Math.max(8, Math.min(100, Math.round((totalSpent / maxMonthlyVal) * 100)))}%` }}
                className="w-16 rounded-t-xl bg-slate-950 group-hover:bg-lime-400 transition-all duration-300"
              />
              <span className="text-[10px] font-bold text-slate-700 mt-1.5">
                Current Outflow ({formatCurrency(totalSpent)})
              </span>
            </div>

            {/* 2. Budget Cap Bar */}
            <div className="flex flex-col items-center h-full justify-end group relative">
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-mono py-1 px-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20">
                Cap: {formatCurrency(workspace.monthlyBudget)}
              </div>
              <div
                style={{ height: '100%' }}
                className="w-16 rounded-t-xl bg-slate-200 group-hover:bg-slate-300 transition-all duration-300"
              />
              <span className="text-[10px] font-bold text-slate-400 mt-1.5">
                Monthly Cap ({formatCurrency(workspace.monthlyBudget)})
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {totalSpent <= workspace.monthlyBudget
                ? `Under monthly cap by ${formatCurrency(workspace.monthlyBudget - totalSpent)}`
                : `Exceeds monthly cap by ${formatCurrency(totalSpent - workspace.monthlyBudget)}`}
            </span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">Live Workspace Sync</span>
        </div>
      </div>
    </div>
  );
}

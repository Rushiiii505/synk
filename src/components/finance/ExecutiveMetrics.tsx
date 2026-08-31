'use client';

import React from 'react';
import { Workspace, Expense } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  CreditCard,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  ShieldCheck,
} from 'lucide-react';

interface ExecutiveMetricsProps {
  workspace: Workspace;
  expenses: Expense[];
}

export function ExecutiveMetrics({ workspace, expenses }: ExecutiveMetricsProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const liquidBalance = Math.max(0, workspace.totalCapital - totalSpent);
  const budgetUtilization = Math.min(100, Math.round((totalSpent / workspace.monthlyBudget) * 100));

  // Compute burn rate per day
  const dailyBurn = totalSpent > 0 ? (totalSpent / 30).toFixed(0) : '0';
  const runwayMonths =
    totalSpent > 0 ? (liquidBalance / (totalSpent / 1)).toFixed(1) : '18.0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Capital Injected */}
      <Card glow="indigo" className="p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Capital Injected
          </span>
          <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono tracking-tight">
          {formatCurrency(workspace.totalCapital)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Treasury Verified
          </span>
          <span>Seed / Series A</span>
        </div>
      </Card>

      {/* 2. Month-to-Date Outflow */}
      <Card glow="rose" className="p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Spend (MTD)
          </span>
          <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono tracking-tight">
          {formatCurrency(totalSpent)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-rose-400 flex items-center gap-0.5 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> ~${dailyBurn}/day burn
          </span>
          <span>{expenses.length} transactions</span>
        </div>
      </Card>

      {/* 3. Liquid Runway Balance */}
      <Card glow="emerald" className="p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Remaining Liquid Runway
          </span>
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono tracking-tight">
          {formatCurrency(liquidBalance)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> ~{runwayMonths} months runway
          </span>
          <span>Liquid Assets</span>
        </div>
      </Card>

      {/* 4. Budget Utilization */}
      <Card glow="amber" className="p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Monthly Target Utilization
          </span>
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono tracking-tight flex items-baseline gap-2">
          <span>{budgetUtilization}%</span>
          <span className="text-xs font-normal text-slate-400">
            of {formatCurrency(workspace.monthlyBudget)}
          </span>
        </div>
        <div className="mt-2.5">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetUtilization > 85
                  ? 'bg-rose-500'
                  : budgetUtilization > 60
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${budgetUtilization}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

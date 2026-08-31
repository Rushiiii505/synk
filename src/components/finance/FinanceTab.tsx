'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { ExpenseCharts } from './ExpenseCharts';
import { ExpenseLedger } from './ExpenseLedger';
import { Plus, CreditCard } from 'lucide-react';

export function FinanceTab() {
  const { currentWorkspace, expenses, openQuickAction } = useWorkspace();

  if (!currentWorkspace) return null;

  return (
    <div id="cashflow-section" className="space-y-4 select-none">
      {/* 1. Cashflow Ledger (Primary) */}
      <div className="space-y-3">
        <div className="p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-lime-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-xs">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Cashflow Ledger (Money IN & Money OUT)
              </h3>
              <p className="text-[10px] text-slate-400">
                Filter inflows & outflows in ₹ (INR), attach receipts, and split costs
              </p>
            </div>
          </div>

          <button
            onClick={() => openQuickAction('expense')}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Cashflow</span>
          </button>
        </div>

        <ExpenseLedger />
      </div>

      {/* 2. Visual Spending & Retention Analytics */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Treasury Outflow & Category Analytics
            </h4>
            <p className="text-[10px] text-slate-400">Live breakdown of team operational expenditures.</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            INR Corridors
          </span>
        </div>

        <ExpenseCharts workspace={currentWorkspace} expenses={expenses} />
      </div>
    </div>
  );
}

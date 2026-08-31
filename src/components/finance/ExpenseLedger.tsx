'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Expense } from '@/types';
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Users,
  Trash2,
  Download,
  Filter,
  CreditCard,
  Building,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ReceiptViewerModal } from './ReceiptViewerModal';
import { SplitCostModal } from './SplitCostModal';
import { UserAvatar } from '@/components/ui/UserAvatar';

export function ExpenseLedger() {
  const { expenses, deleteExpense, openQuickAction, currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<Expense | null>(null);
  const [selectedSplitExpense, setSelectedSplitExpense] = useState<Expense | null>(null);

  const filteredExpenses = expenses.filter((e) => {
    // 1. Flow Filter
    if (typeFilter !== 'ALL') {
      if (typeFilter === 'IN' && e.type !== 'IN') return false;
      if (typeFilter === 'OUT' && e.type === 'IN') return false;
    }
    // 2. Category Filter
    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) {
      return false;
    }
    // 3. Search Filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.paidBy.name.toLowerCase().includes(q) ||
      (e.notes && e.notes.toLowerCase().includes(q))
    );
  });

  const totalIn = filteredExpenses
    .filter((e) => e.type === 'IN')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOut = filteredExpenses
    .filter((e) => e.type === 'OUT' || !e.type)
    .reduce((sum, e) => sum + e.amount, 0);

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return;
    const headers = ['Flow', 'Title', 'Category', 'Amount (INR)', 'Paid By', 'Method', 'Date', 'Notes'];
    const rows = filteredExpenses.map((e) => [
      e.type === 'IN' ? 'IN' : 'OUT',
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      e.amount,
      `"${e.paidBy.name}"`,
      `"${e.paymentMethod}"`,
      e.date,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `synk-ledger-${currentWorkspace?.slug || 'workspace'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="expense-ledger" className="space-y-3.5 select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              💳
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
                <span>Treasury Ledger</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {expenses.length} Entries
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Single ledger tracking client retainers, operational expenses, and team splits in ₹.
          </p>
        </div>

        {/* 2 Flow Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openQuickAction('expense')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Money IN</span>
          </button>

          <button
            onClick={() => openQuickAction('expense')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            <span>- Money OUT</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {/* Flow Segmented Buttons */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                typeFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                typeFilter === 'IN'
                  ? 'bg-emerald-100 text-emerald-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              + IN ({formatCurrency(totalIn)})
            </button>
            <button
              onClick={() => setTypeFilter('OUT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                typeFilter === 'OUT'
                  ? 'bg-rose-100 text-rose-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              - OUT ({formatCurrency(totalOut)})
            </button>
          </div>

          {/* Search Field */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 shadow-xs"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="hidden sm:block px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 cursor-pointer shadow-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="Income / Funding">Income / Funding</option>
            <option value="Client Payout">Client Payout</option>
            <option value="Software & AI">Software & AI</option>
            <option value="Marketing & Ads">Marketing & Ads</option>
            <option value="Operations & Legal">Operations & Legal</option>
            <option value="Inventory & Sourcing">Inventory & Sourcing</option>
            <option value="Team & Payroll">Team & Payroll</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 1. Mobile Card View (shown on screens < 768px) */}
      <div className="md:hidden space-y-2.5">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto text-base">
              💳
            </div>
            <div className="text-xs font-bold text-slate-700">No cashflow entries found</div>
            <button
              onClick={() => openQuickAction('expense')}
              className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold hover:bg-slate-800"
            >
              <Plus className="w-3 h-3" />
              <span>Log Entry</span>
            </button>
          </div>
        ) : (
          filteredExpenses.map((exp) => {
            const isIncome = exp.type === 'IN';
            const hasSplits = exp.splits && exp.splits.length > 0;
            const settledSplits = hasSplits
              ? exp.splits!.filter((s) => s.paid).length
              : 0;

            return (
              <div
                key={exp.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5"
              >
                {/* Top Row: Flow Pill & Amount in ₹ */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      <span>{isIncome ? 'IN' : 'OUT'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {exp.category}
                    </span>
                  </div>

                  <div className="text-sm font-mono font-black">
                    <span className={isIncome ? 'text-emerald-600' : 'text-slate-950'}>
                      {isIncome ? '+' : '-'}{formatCurrency(exp.amount)}
                    </span>
                  </div>
                </div>

                {/* Title & Receipt */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {exp.receiptUrl && (
                      <button
                        onClick={() => setSelectedReceiptExpense(exp)}
                        className="p-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shrink-0 cursor-pointer"
                        title="View Invoice"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="text-xs font-extrabold text-slate-900 line-clamp-1">
                      {exp.title}
                    </span>
                  </div>
                </div>

                {/* Payer, Date & Method */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <UserAvatar name={exp.paidBy.name} email={exp.paidBy.email} size="xs" />
                    <span className="font-semibold text-slate-700 truncate max-w-[100px]">{exp.paidBy.name}</span>
                    <span>•</span>
                    <span>{exp.paymentMethod}</span>
                  </div>
                  <span className="font-mono text-[10px]">{formatDate(exp.date)}</span>
                </div>

                {/* Bottom Actions: Split & Delete */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {!isIncome ? (
                    <button
                      onClick={() => setSelectedSplitExpense(exp)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                        hasSplits
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>
                        {hasSplits
                          ? `${settledSplits}/${exp.splits!.length} Settled`
                          : 'Split Cost'}
                      </span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Treasury Inflow</span>
                  )}

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Table View (shown on md:block) */}
      <div className="hidden md:block rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Flow</th>
                <th className="py-3.5 px-4">Transaction / Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount (₹)</th>
                <th className="py-3.5 px-4">Paid By / Received By</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Cost Split</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-base font-bold">
                        💳
                      </div>
                      <div className="text-xs font-bold text-slate-700">No cashflow entries recorded yet</div>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        Start tracking incoming client retainers (Money IN) and operational team expenses (Money OUT).
                      </p>
                      <button
                        onClick={() => openQuickAction('expense')}
                        className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log First Cashflow Entry</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const isIncome = exp.type === 'IN';
                  const hasSplits = exp.splits && exp.splits.length > 0;
                  const settledSplits = hasSplits
                    ? exp.splits!.filter((s) => s.paid).length
                    : 0;

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isIncome ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{isIncome ? 'IN' : 'OUT'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {exp.receiptUrl && (
                            <button
                              onClick={() => setSelectedReceiptExpense(exp)}
                              className="p-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0 cursor-pointer"
                              title="View Invoice / Receipt"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="font-bold text-slate-900 line-clamp-1">
                            {exp.title}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-semibold">{exp.category}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-xs">
                        <span className={isIncome ? 'text-emerald-700' : 'text-slate-900'}>
                          {isIncome ? '+' : '-'}{formatCurrency(exp.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            name={exp.paidBy.name}
                            email={exp.paidBy.email}
                            size="xs"
                          />
                          <span className="text-slate-700 font-semibold">{exp.paidBy.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {exp.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {formatDate(exp.date)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {!isIncome ? (
                          <button
                            onClick={() => setSelectedSplitExpense(exp)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              hasSplits
                                ? 'bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                            }`}
                          >
                            <Users className="w-3 h-3" />
                            <span>
                              {hasSplits
                                ? `${settledSplits}/${exp.splits!.length} Settled`
                                : 'Split Cost'}
                            </span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Treasury In</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Receipt Viewer Modal */}
      <ReceiptViewerModal
        expense={selectedReceiptExpense}
        isOpen={Boolean(selectedReceiptExpense)}
        onClose={() => setSelectedReceiptExpense(null)}
      />

      {/* Split Cost Calculator Modal */}
      <SplitCostModal
        expense={selectedSplitExpense}
        isOpen={Boolean(selectedSplitExpense)}
        onClose={() => setSelectedSplitExpense(null)}
      />
    </div>
  );
}

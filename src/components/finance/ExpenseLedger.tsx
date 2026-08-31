'use client';

import React, { useState } from 'react';
import { Expense, ExpenseType } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { ReceiptViewerModal } from './ReceiptViewerModal';
import { SplitCostModal } from './SplitCostModal';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  Search,
  Receipt,
  Users,
  Download,
  Plus,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ExpenseLedger() {
  const {
    expenses,
    deleteExpense,
    openQuickAction,
    addToast,
    totalIncome,
    totalOutflow,
    liquidBalance,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<Expense | null>(null);
  const [selectedSplitExpense, setSelectedSplitExpense] = useState<Expense | null>(null);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidBy.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || (typeFilter === 'IN' ? e.type === 'IN' : e.type === 'OUT' || !e.type);
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Type,Title,Amount,Currency,Category,Date,PaidBy,PaymentMethod,Status\n';
    const rows = filteredExpenses
      .map(
        (e) =>
          `"${e.id}","${e.type || 'OUT'}","${e.title}",${e.amount},"${e.currency}","${e.category}","${e.date}","${e.paidBy.name}","${e.paymentMethod}","${e.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synk_cashflow_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('CSV Exported', `${filteredExpenses.length} transactions saved`, 'success');
  };

  return (
    <div className="space-y-4 select-none">
      {/* Cashflow IN vs OUT Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Money IN Card */}
        <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Inflow (Money IN)</span>
            <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
              +{formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Money OUT Card */}
        <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Outflow (Money OUT)</span>
            <div className="text-xl font-black text-rose-700 font-mono mt-0.5">
              -{formatCurrency(totalOutflow)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Net Reserve Card */}
        <div className="p-4 rounded-3xl card-vibrant-lime shadow-xs flex items-center justify-between text-slate-950">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-800">Net Liquid Buffer</span>
            <div className="text-xl font-black font-mono mt-0.5">
              {formatCurrency(liquidBalance)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-950/10 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-150 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Type Switcher Pills */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200 text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                typeFilter === 'ALL' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({expenses.length})
            </button>
            <button
              onClick={() => setTypeFilter('IN')}
              className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                typeFilter === 'IN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <ArrowDownLeft className="w-3 h-3" />
              <span>Money IN</span>
            </button>
            <button
              onClick={() => setTypeFilter('OUT')}
              className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                typeFilter === 'OUT' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              <span>Money OUT</span>
            </button>
          </div>

          <div className="relative min-w-[180px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search transactions, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Categories</option>
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-3xl border border-slate-150 bg-white shadow-xs overflow-hidden">
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
                              className="p-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
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
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
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
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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

      {/* Modals */}
      <ReceiptViewerModal
        expense={selectedReceiptExpense}
        isOpen={Boolean(selectedReceiptExpense)}
        onClose={() => setSelectedReceiptExpense(null)}
      />

      <SplitCostModal
        expense={selectedSplitExpense}
        isOpen={Boolean(selectedSplitExpense)}
        onClose={() => setSelectedSplitExpense(null)}
      />
    </div>
  );
}

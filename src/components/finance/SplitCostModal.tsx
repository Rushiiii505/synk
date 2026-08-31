'use client';

import React, { useState, useEffect } from 'react';
import { Expense, SplitShare } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { Calculator, Check, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface SplitCostModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SplitCostModal({ expense, isOpen, onClose }: SplitCostModalProps) {
  const { splitExpense } = useWorkspace();
  const { users } = useAuth();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [customShares, setCustomShares] = useState<Record<string, number>>({});
  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (expense) {
      if (expense.splits && expense.splits.length > 0) {
        setSelectedUserIds(expense.splits.map((s) => s.userId));
        const custom: Record<string, number> = {};
        const paid: Record<string, boolean> = {};
        expense.splits.forEach((s) => {
          custom[s.userId] = s.amount;
          paid[s.userId] = s.paid;
        });
        setCustomShares(custom);
        setPaidStatus(paid);
      } else {
        const defaultIds = users.slice(0, 3).map((u) => u.id);
        setSelectedUserIds(defaultIds);
        const perPerson = Number((expense.amount / defaultIds.length).toFixed(2));
        const custom: Record<string, number> = {};
        const paid: Record<string, boolean> = {};
        defaultIds.forEach((id) => {
          custom[id] = perPerson;
          paid[id] = id === expense.paidBy.id;
        });
        setCustomShares(custom);
        setPaidStatus(paid);
      }
    }
  }, [expense, users]);

  if (!expense) return null;

  const toggleUserSelection = (userId: string) => {
    let updated: string[];
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length <= 1) return;
      updated = selectedUserIds.filter((id) => id !== userId);
    } else {
      updated = [...selectedUserIds, userId];
    }
    setSelectedUserIds(updated);

    const perPerson = Number((expense.amount / updated.length).toFixed(2));
    const newCustom: Record<string, number> = {};
    const newPaid: Record<string, boolean> = { ...paidStatus };
    updated.forEach((id) => {
      newCustom[id] = perPerson;
      if (newPaid[id] === undefined) {
        newPaid[id] = id === expense.paidBy.id;
      }
    });
    setCustomShares(newCustom);
    setPaidStatus(newPaid);
  };

  const toggleMemberPaid = (userId: string) => {
    setPaidStatus((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const perPersonAmount =
    selectedUserIds.length > 0
      ? Number((expense.amount / selectedUserIds.length).toFixed(2))
      : 0;

  const totalCollected = selectedUserIds.reduce((sum, id) => {
    const amount = splitMethod === 'equal' ? perPersonAmount : customShares[id] || 0;
    return sum + (paidStatus[id] ? amount : 0);
  }, 0);

  const remainingToCollect = Math.max(0, expense.amount - totalCollected);

  const handleSaveSplit = () => {
    const splits: SplitShare[] = selectedUserIds.map((userId) => {
      const user = users.find((u) => u.id === userId);
      const amount = splitMethod === 'equal' ? perPersonAmount : customShares[userId] || 0;
      return {
        userId,
        userName: user?.name || 'Member',
        userAvatar: user?.avatar || '',
        amount,
        paid: Boolean(paidStatus[userId]),
      };
    });

    splitExpense(expense.id, splits);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <span>Team Cost Split & Settlements</span>
        </div>
      }
      description={`Split "${expense.title}" (${formatCurrency(expense.amount)}) among team members`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Invoice</span>
            <div className="text-base font-black text-slate-900 font-mono mt-0.5">
              {formatCurrency(expense.amount)}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Settled Share</span>
            <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
              {formatCurrency(totalCollected)}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Unsettled</span>
            <div className="text-base font-black text-amber-700 font-mono mt-0.5">
              {formatCurrency(remainingToCollect)}
            </div>
          </div>
        </div>

        {/* Split Method Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase">
            Included Team Members ({selectedUserIds.length})
          </label>
          <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200 text-xs">
            <button
              onClick={() => setSplitMethod('equal')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                splitMethod === 'equal' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Equal Split ({formatCurrency(perPersonAmount)} ea)
            </button>
            <button
              onClick={() => setSplitMethod('custom')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                splitMethod === 'custom' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Custom Amounts
            </button>
          </div>
        </div>

        {/* Member list */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {users.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);
            const isPaid = Boolean(paidStatus[user.id]);
            const isPayer = user.id === expense.paidBy.id;

            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  onClick={() => toggleUserSelection(user.id)}
                  className="flex items-center gap-3 cursor-pointer select-none min-w-0 flex-1"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-lime-600 focus:ring-0 pointer-events-none"
                  />
                  <UserAvatar name={user.name} email={user.email} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {user.name}
                      </span>
                      {isPayer && (
                        <span className="text-[10px] bg-lime-100 text-lime-800 px-1.5 py-0.2 rounded-full font-bold">
                          Paid by
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">{user.email}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-3 shrink-0">
                    {splitMethod === 'custom' ? (
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={customShares[user.id] || ''}
                        onChange={(e) =>
                          setCustomShares({
                            ...customShares,
                            [user.id]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:bg-white focus:border-slate-900 shadow-xs"
                      />
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {formatCurrency(perPersonAmount)}
                      </span>
                    )}

                    <button
                      onClick={() => toggleMemberPaid(user.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                        isPaid
                          ? 'bg-lime-100 text-lime-800 border border-lime-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                      }`}
                    >
                      {isPaid && <Check className="w-3 h-3" />}
                      <span>{isPaid ? 'Settled' : 'Pending'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSplit}
            className="px-6 py-2.5 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-md active:scale-95 transition-all"
          >
            Apply & Save Split
          </button>
        </div>
      </div>
    </Modal>
  );
}

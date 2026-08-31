'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Building2, DollarSign, Sparkles } from 'lucide-react';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = useState('');
  const [capital, setCapital] = useState('100000');
  const [monthlyBudget, setMonthlyBudget] = useState('15000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createWorkspace(
      name.trim(),
      '#84cc16',
      parseFloat(capital) || 100000,
      parseFloat(monthlyBudget) || 15000
    );

    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <span>Create Multi-Tenant Workspace</span>
        </div>
      }
      description="Spin up an isolated operations & Trello board hub."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
            Workspace Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Nexus Creator Collective"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Total Capital (₹)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:bg-white focus:border-slate-900 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Monthly Budget (₹)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:bg-white focus:border-slate-900 shadow-xs"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all"
          >
            Create Workspace
          </button>
        </div>
      </form>
    </Modal>
  );
}

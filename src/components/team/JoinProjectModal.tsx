'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Users, ArrowRight, KeyRound, Sparkles } from 'lucide-react';

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinProjectModal({ isOpen, onClose }: JoinProjectModalProps) {
  const { joinWorkspaceByCode, workspaces } = useWorkspace();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const success = joinWorkspaceByCode(code.trim());
    if (success) {
      setCode('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <KeyRound className="w-4 h-4" />
          </div>
          <span>Join a synk Workspace</span>
        </div>
      }
      description="Enter an invite code or workspace slug to join your team."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
            Invite Code or Project Slug
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="e.g. SYNK2026 or SCALE99"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 uppercase"
          />
        </div>

        {/* Demo suggestions */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Available Demo Projects</span>
          <div className="flex flex-wrap gap-2">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setCode(ws.joinCode || ws.slug)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-400 transition-colors"
              >
                {ws.name} ({ws.joinCode || ws.slug})
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Join Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
}

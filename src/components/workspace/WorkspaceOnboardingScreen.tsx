'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, KeyRound, Plus, ArrowRight, Sparkles, LogOut } from 'lucide-react';

interface WorkspaceOnboardingScreenProps {
  onCompleted?: () => void;
}

export function WorkspaceOnboardingScreen({ onCompleted }: WorkspaceOnboardingScreenProps) {
  const { createWorkspace, joinWorkspaceByCode, workspaces } = useWorkspace();
  const { currentUser, signOut } = useAuth();

  const [tab, setTab] = useState<'join' | 'create'>('join');
  const [joinCode, setJoinCode] = useState('');
  const [wsName, setWsName] = useState('');
  const [capital, setCapital] = useState('1500000');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const ok = joinWorkspaceByCode(joinCode.trim());
    if (ok && onCompleted) onCompleted();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) return;
    createWorkspace(wsName.trim(), '#84cc16', parseFloat(capital) || 1500000, 250000);
    if (onCompleted) onCompleted();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* User Greeting Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-xl mx-auto shadow-md">
            ⚡
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">
            Welcome to synk, {currentUser?.name || 'there'}!
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Join an existing team project or start a fresh workspace.
          </p>
        </div>

        {/* Action Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-full">
            <button
              type="button"
              onClick={() => setTab('join')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                tab === 'join' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join with Code</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('create')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                tab === 'create' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New</span>
            </button>
          </div>

          {tab === 'join' ? (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Invite Code or Project Slug
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. SYNK2026 or SCALE99"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>

              {/* Suggestions */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Available Demo Projects</span>
                <div className="flex flex-wrap gap-2">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => setJoinCode(ws.joinCode || ws.slug)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-400 transition-colors"
                    >
                      {ws.name} ({ws.joinCode || ws.slug})
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Enter Project Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Apex Engineering Collective"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Initial Capital Treasury (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Create Clean Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* User Sign Out */}
          <div className="pt-2 text-center">
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out ({currentUser?.email})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { SynkLogo } from '@/components/ui/SynkLogo';
import {
  Building2,
  KeyRound,
  Plus,
  ArrowRight,
  LogOut,
  Sparkles,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProjectSelectPageProps {
  onSelected?: () => void;
}

export function ProjectSelectPage({ onSelected }: ProjectSelectPageProps) {
  const { createWorkspace, joinWorkspaceByCode, userWorkspaces, switchWorkspace, deleteWorkspace } = useWorkspace();
  const { currentUser, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<'existing' | 'create' | 'join'>(
    userWorkspaces.length > 0 ? 'existing' : 'create'
  );
  const [joinCode, setJoinCode] = useState('');
  const [wsName, setWsName] = useState('');
  const [capital, setCapital] = useState('1000000');
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!joinCode.trim()) return;

    const ok = joinWorkspaceByCode(joinCode.trim());
    if (ok) {
      if (onSelected) onSelected();
    } else {
      setErrorMsg('Project ID not found. Please verify the code with your team creator.');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!wsName.trim()) {
      setErrorMsg('Please enter a project workspace name');
      return;
    }

    createWorkspace(wsName.trim(), '#84cc16', parseFloat(capital) || 1000000, 200000);
    if (onSelected) onSelected();
  };

  const handleOpenExisting = (workspaceId: string) => {
    switchWorkspace(workspaceId);
    if (onSelected) onSelected();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-3.5 sm:p-6 text-slate-900 select-none relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-lime-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-4 sm:space-y-5 relative z-10">
        {/* Centered Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <SynkLogo size="lg" variant="dark" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Welcome, {currentUser?.name || 'Collaborator'}
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Choose a saved workspace, launch a new project, or enter a team ID.
          </p>
        </div>

        {/* Polished White Glass Card */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4 sm:space-y-5">
          {/* Segmented Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 flex-wrap gap-1">
            {userWorkspaces.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('existing');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'existing'
                    ? 'bg-white text-slate-950 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Your Projects ({userWorkspaces.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveTab('create');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white text-slate-950 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('join');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-white text-slate-950 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join with ID</span>
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: User's Past Projects */}
          {activeTab === 'existing' && userWorkspaces.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Past Project to Open
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {userWorkspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100/70 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => handleOpenExisting(ws.id)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-lime-100 border border-lime-300 text-lime-800 flex items-center justify-center font-bold text-xs shrink-0">
                        ⚡
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors truncate">
                            {ws.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-bold border border-purple-200">
                            {ws.joinCode}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          Reserve: {formatCurrency(ws.totalCapital)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenExisting(ws.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteWorkspace(ws.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Project from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Create New Project */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-3.5 max-w-md mx-auto">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                  Project Workspace Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Apex Product Collective"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                  Initial Capital Reserve (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  A unique Join ID (e.g. SYNK-XXXX) will be generated and saved to your account.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-slate-950 text-white font-black text-xs hover:bg-slate-800 shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Join via ID */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-3.5 max-w-md mx-auto">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                  Enter Unique Project ID
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. SYNK-8492"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 uppercase tracking-widest transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Joined projects will automatically be saved to your account.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-slate-950 text-white font-black text-xs hover:bg-slate-800 shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect & Save Project</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </button>
              </div>
            </form>
          )}

          {/* Footer with User info */}
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Signed in as <strong className="text-slate-800">{currentUser?.email}</strong></span>
            <button
              onClick={() => signOut()}
              className="font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

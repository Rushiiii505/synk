'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { SynkLogo } from '@/components/ui/SynkLogo';
import { PixelSwap } from '@/components/ui/PixelSwap';
import { PresenceAvatarGroup } from '@/components/layout/PresenceAvatarGroup';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  KeyRound,
  LogOut,
  Copy,
  Check,
  Building2,
  Sparkles,
  TrendingUp,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function ReferenceHeroCards() {
  const {
    currentWorkspace,
    userWorkspaces,
    switchWorkspace,
    liquidBalance,
    totalIncome,
    totalOutflow,
    tasks,
    expenses,
    openQuickAction,
    setHasSelectedProject,
    addToast,
  } = useWorkspace();

  const { currentUser, signOut } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);

  if (!currentWorkspace) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentWorkspace.joinCode);
    setCopiedCode(true);
    addToast('Unique Project ID Copied', `Share ${currentWorkspace.joinCode} with your teammates`, 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const completedTasks = tasks.filter((t) => t.status === 'Completed' || t.status === 'Done' || t.status === '✅ Done').length;
  const inProgressTasks = tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Done' && t.status !== '✅ Done').length;

  return (
    <div id="hero-overview" className="space-y-3.5 select-none">
      {/* 1. Mobile-First Balanced Header with Mathematically Centered Synk Logo */}
      <div className="relative p-3 sm:px-5 sm:py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left Section: Active Project & Quick Switcher Dropdown */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2 relative z-10">
          <div className="relative">
            <button
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 text-xs font-extrabold text-slate-900 transition-all cursor-pointer shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="truncate max-w-[120px] sm:max-w-[150px]">{currentWorkspace.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Switcher Dropdown for Past Projects */}
            {isWsDropdownOpen && (
              <div className="absolute top-11 left-0 w-64 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Your Past Workspaces ({userWorkspaces.length})
                </div>
                <div className="space-y-1 my-1 max-h-48 overflow-y-auto">
                  {userWorkspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        switchWorkspace(ws.id);
                        setIsWsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        ws.id === currentWorkspace.id
                          ? 'bg-lime-100 text-lime-950 font-black'
                          : 'text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="truncate flex-1">{ws.name}</span>
                      <span className="text-[10px] font-mono text-purple-700 ml-2">{ws.joinCode}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-1.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsWsDropdownOpen(false);
                      setHasSelectedProject(false);
                    }}
                    className="w-full py-1 text-center text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    + Create or Join Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Unique Project Join ID Badge */}
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-mono text-xs font-bold border border-purple-200/80 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Click to copy Unique Project ID"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span>ID: {currentWorkspace.joinCode}</span>
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-purple-500" />
            )}
          </button>
        </div>

        {/* Center: Mathematically Centered Synk Logo */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center my-1 md:my-0">
          <SynkLogo size="md" showWordmark={true} />
        </div>

        {/* Right Section: Live Presence Avatars, User Profile & Actions */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <PresenceAvatarGroup max={3} />

            {currentUser && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                <UserAvatar name={currentUser.name} email={currentUser.email} size="xs" />
                <span className="hidden sm:inline truncate max-w-[90px]">{currentUser.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setHasSelectedProject(false)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Switch Workspace"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Switch</span>
            </button>

            <button
              onClick={() => signOut()}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-xs border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tight 12-Column Hero Operations Grid with ReactBits PixelSwap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left (7 cols): PixelSwap Treasury Engine */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xs border border-slate-200/90 bg-white">
          <PixelSwap
            trigger="hover"
            pattern="diagonal"
            pixelSize={32}
            duration={750}
            pixelDuration={280}
            fade={true}
            className="w-full h-full min-h-[150px]"
            firstContent={
              <div className="w-full h-full p-4 sm:p-5 card-vibrant-lime flex flex-col justify-between select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
                      Treasury Reserve
                    </span>
                    <span className="text-[10px] bg-slate-950/10 px-2 py-0.5 rounded-full font-mono font-bold text-slate-950">
                      INR (₹)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800/80 italic flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-slate-900" />
                    <span>Hover for Analytics</span>
                  </span>
                </div>

                <div className="my-1 flex items-baseline justify-between flex-wrap gap-1">
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                    {formatCurrency(liquidBalance)}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
                    <span className="text-emerald-950">In: +{formatCurrency(totalIncome)}</span>
                    <span className="text-slate-950">Out: -{formatCurrency(totalOutflow)}</span>
                  </div>
                </div>

                {/* 3 Quick Action Pill Buttons */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-950/10 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickAction('expense');
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl bg-white/80 hover:bg-white text-slate-950 text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Inflow</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickAction('expense');
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl bg-white/80 hover:bg-white text-slate-950 text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                    <span>- Outflow</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickAction('task');
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl bg-white/80 hover:bg-white text-slate-950 text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-950" />
                    <span>+ Card</span>
                  </button>
                </div>
              </div>
            }
            secondContent={
              <div className="w-full h-full p-4 sm:p-5 bg-slate-950 text-white flex flex-col justify-between select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                    <span className="text-xs font-extrabold text-lime-400 uppercase tracking-wide">
                      Live Velocity & Health
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-1.5">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Tasks</span>
                    <span className="text-base font-mono font-black text-white">{inProgressTasks} In Flight</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Completed</span>
                    <span className="text-base font-mono font-black text-emerald-400">{completedTasks} Done</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Ledger</span>
                    <span className="text-base font-mono font-black text-lime-400">{expenses.length} Entries</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
                    <span>Runway 100% stable</span>
                  </span>
                  <span className="text-lime-400 font-mono text-[11px]">INR Corridors</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Right (5 cols): Rapid Operations Deck */}
        <div className="lg:col-span-5 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Operations Deck
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Quick Triggers
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            <button
              onClick={() => openQuickAction('note')}
              className="p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 text-left transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span className="text-base block mb-0.5">📝</span>
              <span className="text-xs font-extrabold text-amber-950 block">Post Memo</span>
              <span className="text-[10px] text-amber-700 block">Sticky note to board</span>
            </button>

            <button
              onClick={() => openQuickAction('task')}
              className="p-2.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-200/80 text-left transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span className="text-base block mb-0.5">📋</span>
              <span className="text-xs font-extrabold text-indigo-950 block">Add Sprint Card</span>
              <span className="text-[10px] text-indigo-700 block">Kanban with ₹ budget</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            <span>Sprint & Cashflow Hub</span>
            <span className="font-mono text-slate-800 font-bold">synk v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

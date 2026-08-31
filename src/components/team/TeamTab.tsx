'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { InviteMemberModal } from './InviteMemberModal';
import { JoinProjectModal } from './JoinProjectModal';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  Users,
  UserPlus,
  Building2,
  Trash2,
  Sparkles,
  KeyRound,
  Copy,
  Check,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function TeamTab() {
  const { currentWorkspace, updateWorkspace, invites, revokeInvite, addToast, setHasSelectedProject } = useWorkspace();
  const { users, currentUser } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [wsName, setWsName] = useState(currentWorkspace?.name || 'synk Workspace');
  const [wsCapital, setWsCapital] = useState(currentWorkspace?.totalCapital?.toString() || '1000000');
  const [wsBudget, setWsBudget] = useState(currentWorkspace?.monthlyBudget?.toString() || '200000');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      setWsName(currentWorkspace.name);
      setWsCapital(currentWorkspace.totalCapital.toString());
      setWsBudget(currentWorkspace.monthlyBudget.toString());
    }
  }, [currentWorkspace?.id, currentWorkspace?.name, currentWorkspace?.totalCapital, currentWorkspace?.monthlyBudget]);

  if (!currentWorkspace) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCapital = parseFloat(wsCapital);
    const parsedBudget = parseFloat(wsBudget);

    updateWorkspace({
      name: wsName.trim() || currentWorkspace.name,
      totalCapital: isNaN(parsedCapital) ? currentWorkspace.totalCapital : parsedCapital,
      monthlyBudget: isNaN(parsedBudget) ? currentWorkspace.monthlyBudget : parsedBudget,
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentWorkspace.joinCode);
    setCopiedCode(true);
    addToast('Join Code Copied', `${currentWorkspace.joinCode} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentWorkspaceInvites = invites.filter((i) => i.workspaceId === currentWorkspace.id);

  return (
    <div id="team-section" className="space-y-3.5 select-none">
      {/* Top Header */}
      <div className="p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shadow-xs">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              Collaborators & Project Settings
            </h2>
            <p className="text-[10px] text-slate-400">
              Manage organization members, treasury limits, and Unique Project ID for <strong className="text-slate-700">{currentWorkspace.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setHasSelectedProject(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span>Switch / Join</span>
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-lime-400" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Grid: Member Directory + Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Member Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Active Team Members ({users.length})
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                Live Presence
              </span>
            </div>

            <div className="space-y-2">
              {users.map((user) => {
                const isCurrent = user.id === currentUser?.id;

                return (
                  <div
                    key={user.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar
                        name={user.name}
                        email={user.email}
                        size="md"
                        showStatus={true}
                        status={user.status}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {user.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-lime-100 text-lime-800 px-2 py-0.2 rounded-full font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate font-mono">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                        Collaborator
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize font-mono">
                        {user.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Invitations */}
          {currentWorkspaceInvites.length > 0 && (
            <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Pending Invitations ({currentWorkspaceInvites.length})
              </h4>
              <div className="space-y-2">
                {currentWorkspaceInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="font-bold text-slate-800">{inv.email}</span>
                    <button
                      onClick={() => revokeInvite(inv.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Unique Project ID & Settings */}
        <div className="space-y-4">
          {/* Unique Project ID Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Unique Project ID</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Share with Team</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-sm font-black font-mono text-slate-900 tracking-wider">
                {currentWorkspace.joinCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition-colors cursor-pointer"
                title="Copy Join Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Teammates can enter this Unique Project ID to join this workspace instantly.
            </p>
          </div>

          {/* Treasury Limit Settings */}
          <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Treasury Limits (₹)
              </h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  Total Capital Reserve (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={wsCapital}
                  onChange={(e) => setWsCapital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  Monthly Outflow Cap (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={wsBudget}
                  onChange={(e) => setWsBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
                />
              </div>

              <div className="pt-1.5">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-slate-950 text-white font-black text-xs hover:bg-slate-800 shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  Save Treasury Limits
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <JoinProjectModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
}

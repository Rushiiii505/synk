'use client';

import React, { useState } from 'react';
import { useWorkspace, NavigationTab } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { UserSwitchModal } from '@/components/auth/UserSwitchModal';
import {
  ChevronDown,
  Plus,
  PanelLeftClose,
  PanelLeft,
  KeyRound,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function Sidebar() {
  const {
    workspaces,
    currentWorkspace,
    activeTab,
    setActiveTab,
    switchWorkspace,
    createWorkspace,
    tasks,
    expenses,
    stickyNotes,
  } = useWorkspace();

  const { currentUser } = useAuth();

  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const baseCap = currentWorkspace?.totalCapital || 0;
  const liquidBalance = Math.max(0, baseCap - totalSpent);
  const monthlyCap = currentWorkspace?.monthlyBudget || 1;
  const budgetUtilization = Math.min(100, Math.round((totalSpent / monthlyCap) * 100));

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed' && t.status !== '✅ Done').length;

  const navItems: { id: NavigationTab; label: string; icon: string; count?: number | string }[] = [
    {
      id: 'all',
      label: 'All-in-One Dashboard',
      icon: '⚡',
    },
    {
      id: 'trello',
      label: 'Trello Board',
      icon: '📋',
      count: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'notepad',
      label: 'Team Notepad',
      icon: '📝',
      count: stickyNotes.length > 0 ? stickyNotes.length : undefined,
    },
    {
      id: 'finance',
      label: 'Cashflow Ledger',
      icon: '💳',
      count: `${budgetUtilization}%`,
    },
    {
      id: 'team',
      label: 'Team & Access',
      icon: '👥',
    },
  ];

  return (
    <>
      <aside
        className={`relative flex flex-col h-screen bg-white border-r border-slate-150 transition-all duration-300 z-20 shrink-0 select-none shadow-xs ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <button
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              className={`w-full flex items-center justify-between p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all ${
                isCollapsed ? 'justify-center p-2' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-slate-950 shadow-xs shrink-0 bg-lime-400"
                >
                  ⚡
                </div>
                {!isCollapsed && (
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-900 truncate block">
                      {currentWorkspace?.name || 'synk Workspace'}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      ID: {currentWorkspace?.joinCode || 'SYNK-XXXX'}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />}
            </button>

            {/* Dropdown Menu */}
            {isWsDropdownOpen && (
              <div className="absolute top-14 left-0 w-full p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Your Workspaces
                </div>
                <div className="space-y-1 my-1">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        switchWorkspace(ws.id);
                        setIsWsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                        ws.id === currentWorkspace?.id
                          ? 'bg-slate-100 font-extrabold text-slate-950'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center text-[10px] font-bold">
                        ⚡
                      </span>
                      <span className="truncate flex-1 font-bold">{ws.name}</span>
                      <span className="text-[9px] font-mono text-purple-600 font-bold">{ws.joinCode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  const el = document.getElementById(
                    item.id === 'trello'
                      ? 'trello-section'
                      : item.id === 'notepad'
                      ? 'notepad-section'
                      : item.id === 'finance'
                      ? 'cashflow-section'
                      : item.id === 'team'
                      ? 'team-section'
                      : 'hero-overview'
                  );
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!isCollapsed && item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100">
          {currentUser && (
            <div
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-lime-400"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 text-left">
                  <span className="text-xs font-extrabold text-slate-900 truncate block">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {currentUser.email}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      <UserSwitchModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
    </>
  );
}

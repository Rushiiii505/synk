'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  UserPlus,
  KeyRound,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useWorkspace, NavigationTab } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { PresenceAvatarGroup } from './PresenceAvatarGroup';
import { InviteMemberModal } from '@/components/team/InviteMemberModal';
import { JoinProjectModal } from '@/components/team/JoinProjectModal';
import { UserSwitchModal } from '@/components/auth/UserSwitchModal';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { AuthModal } from '@/components/auth/AuthModal';

export function Topbar() {
  const {
    activeTab,
    setActiveTab,
    currentWorkspace,
    setIsCommandPaletteOpen,
    openQuickAction,
  } = useWorkspace();

  const { currentUser, signOut, isLiveSupabase } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const scrollToSection = (id: string, tabId: NavigationTab) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-slate-150 flex items-center justify-between shrink-0 shadow-xs select-none">
        {/* Left: Brand Logo & Workspace Switcher */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsCreateWsOpen(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-xs group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-950 tracking-tight font-mono">
                synk
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {currentWorkspace?.name || 'Workspace'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main Single-Page Anchor Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-full border border-slate-200">
          <button
            onClick={() => scrollToSection('hero-overview', 'all')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>✨</span>
            <span>All-in-One</span>
          </button>

          <button
            onClick={() => scrollToSection('trello-section', 'trello')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'trello'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>📋</span>
            <span>Trello Board</span>
          </button>

          <button
            onClick={() => scrollToSection('notepad-section', 'notepad')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'notepad'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>📝</span>
            <span>Team Notepad</span>
          </button>

          <button
            onClick={() => scrollToSection('cashflow-section', 'finance')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'finance'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>💳</span>
            <span>Cashflow (IN/OUT)</span>
          </button>

          <button
            onClick={() => scrollToSection('team-section', 'team')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'team'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>👥</span>
            <span>Team</span>
          </button>
        </nav>

        {/* Right: Search, Join, Presence, Auth, and + New button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Search */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="px-1.5 py-0.5 rounded-full bg-white text-[9px] text-slate-500 font-mono border border-slate-200">
              ⌘K
            </kbd>
          </button>

          {/* Join Project button */}
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors border border-purple-200"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span>Join Code</span>
          </button>

          {/* Live Team Presence Avatars */}
          <div className="hidden md:block border-l border-slate-200 pl-2">
            <PresenceAvatarGroup max={3} />
          </div>

          {/* User Profile Avatar with Presence Modal */}
          {currentUser && (
            <div
              onClick={() => setIsUserModalOpen(true)}
              className="relative cursor-pointer hover:scale-105 transition-transform"
              title="Switch User Persona & Presence"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-lime-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
          )}

          {/* Sign in / Sign Up Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors hidden sm:flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-600" />
            <span>Account</span>
          </button>

          {/* Black Pill "+ Action" Button */}
          <div className="relative">
            <button
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className="flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>

            {/* Quick Action Dropdown */}
            {isQuickMenuOpen && (
              <div
                className="absolute right-0 top-11 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setIsQuickMenuOpen(false)}
              >
                <button
                  onClick={() => openQuickAction('task')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span>📋</span>
                  <span>Add Trello Card</span>
                </button>
                <button
                  onClick={() => openQuickAction('note')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span>📝</span>
                  <span>Add Sticky Memo</span>
                </button>
                <button
                  onClick={() => openQuickAction('expense')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span>💳</span>
                  <span>Log Money IN / OUT</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <JoinProjectModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      <UserSwitchModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <CreateWorkspaceModal isOpen={isCreateWsOpen} onClose={() => setIsCreateWsOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { ProjectSelectPage } from '@/components/workspace/ProjectSelectPage';
import { ReferenceHeroCards } from '@/components/finance/ReferenceHeroCards';
import { TrelloBoard } from '@/components/trello/TrelloBoard';
import { TeamNotepad } from '@/components/notepad/TeamNotepad';
import { FinanceTab } from '@/components/finance/FinanceTab';
import { TeamTab } from '@/components/team/TeamTab';
import { QuickActionModal } from '@/components/layout/QuickActionModal';
import { CommandPalette } from '@/components/layout/CommandPalette';

export default function Home() {
  const { isAuthenticated, currentUser } = useAuth();
  const { currentWorkspace, hasSelectedProject } = useWorkspace();

  // 1. If not authenticated, show modern dark luxury Auth Screen
  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  // 2. If authenticated but has not selected/created a workspace, show Project Selection / Join Screen
  if (!hasSelectedProject || !currentWorkspace) {
    return <ProjectSelectPage />;
  }

  // 3. Compact, High-Density, State-of-the-Art Single-Page Workspace
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-lime-400 selection:text-slate-950 flex flex-col antialiased">
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-4 pb-12">
        {/* 1. Header & Interactive PixelSwap Operations Banner */}
        <ReferenceHeroCards />

        {/* 2. Collaborative Trello Sprint Board */}
        <TrelloBoard />

        {/* 3. Team Sticky Notepad & Live Shared Scratchpad */}
        <TeamNotepad />

        {/* 4. Cashflow In & Out Ledger & Split Hub */}
        <FinanceTab />

        {/* 5. Team Directory & Project Treasury Limits */}
        <TeamTab />
      </main>

      {/* Global Modals */}
      <QuickActionModal />
      <CommandPalette />
    </div>
  );
}

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
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { QuickActionModal } from '@/components/layout/QuickActionModal';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { Sparkles } from 'lucide-react';

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

        {/* 6. React Bits ScrollReveal Manifesto Deck */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl text-center select-none space-y-2 mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Synchronized Team Operations</span>
          </div>

          <ScrollReveal
            baseOpacity={0.15}
            enableBlur={true}
            baseRotation={1.5}
            blurStrength={4}
            textClassName="text-white text-base sm:text-lg font-black max-w-2xl mx-auto leading-relaxed"
          >
            Synchronize high-velocity sprint execution with real-time treasury cashflows in Indian Rupees. Zero friction, complete collaborative alignment.
          </ScrollReveal>
        </div>
      </main>

      {/* Global Modals */}
      <QuickActionModal />
      <CommandPalette />
    </div>
  );
}

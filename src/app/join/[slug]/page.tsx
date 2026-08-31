'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { SynkLogo } from '@/components/ui/SynkLogo';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function JoinWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { workspaces, switchWorkspace, addToast } = useWorkspace();
  const { currentUser } = useAuth();
  const [targetWs, setTargetWs] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      const found = workspaces.find(
        (w) => w.slug.toLowerCase() === slug.toLowerCase() || w.joinCode.toLowerCase() === slug.toLowerCase()
      );
      if (found) {
        setTargetWs(found);
      }
    }
  }, [slug, workspaces]);

  const handleConfirmJoin = () => {
    if (targetWs) {
      switchWorkspace(targetWs.id);
      addToast(`Welcome to ${targetWs.name}! 🎉`, `Project ID: ${targetWs.joinCode}`, 'success');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-6 text-slate-100 selection:bg-lime-400">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
        <div className="flex justify-center">
          <SynkLogo size="xl" variant="white" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Invitation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Join {targetWs?.name || 'synk Workspace'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You were invited to collaborate on sprint Trello cards, team sticky notepads, and treasury cashflows.
          </p>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-left">
            <UserAvatar name={currentUser.name} email={currentUser.email} size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500">{currentUser.email}</div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-lime-100 text-lime-800">
              Collaborator
            </span>
          </div>
        )}

        <div className="pt-2 space-y-3">
          <button
            onClick={handleConfirmJoin}
            className="w-full py-3 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Accept Invite & Enter Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

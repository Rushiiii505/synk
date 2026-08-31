'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';
import { UserPlus, Copy, Check, Mail, Trash2 } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const { currentWorkspace, inviteMember, invites, revokeInvite, addToast } = useWorkspace();
  const [email, setEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!currentWorkspace) return null;

  const joinCode = currentWorkspace.joinCode;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    inviteMember(email.trim());
    setEmail('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopiedLink(true);
    addToast('Unique Project ID Copied', `Share ${joinCode} with your teammate`, 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentWorkspaceInvites = invites.filter((i) => i.workspaceId === currentWorkspace.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <UserPlus className="w-4 h-4" />
          </div>
          <span>Invite Team Collaborators</span>
        </div>
      }
      description={`Add teammates to collaborate on ${currentWorkspace.name} Trello board & treasury.`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Shareable Project ID Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
            Unique Project Join ID
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={joinCode}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-bold shrink-0 hover:bg-slate-800 transition-colors shadow-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>

        {/* Email Invitation Form */}
        <form onSubmit={handleSendInvite} className="space-y-3">
          <label className="block text-[10px] uppercase font-bold text-slate-500">
            Invite via Email
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              required
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Invite</span>
            </button>
          </div>
        </form>

        {/* Pending Invites */}
        {currentWorkspaceInvites.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2">
              Pending Invites ({currentWorkspaceInvites.length})
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {currentWorkspaceInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-bold text-slate-800">{inv.email}</span>
                  <button
                    onClick={() => revokeInvite(inv.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { UserStatus } from '@/types';
import { UserCheck, Check, Smile } from 'lucide-react';

interface UserSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSwitchModal({ isOpen, onClose }: UserSwitchModalProps) {
  const { currentUser, users, switchUser, updateUserStatus } = useAuth();
  const [customStatusInput, setCustomStatusInput] = useState(currentUser?.customStatus || '');

  const statusOptions: { label: string; value: UserStatus; dotColor: string }[] = [
    { label: 'Online / Available', value: 'online', dotColor: 'bg-emerald-500' },
    { label: 'Deep Focus Mode', value: 'focusing', dotColor: 'bg-purple-500' },
    { label: 'In a Meeting', value: 'meeting', dotColor: 'bg-indigo-500' },
    { label: 'Away / AFK', value: 'away', dotColor: 'bg-amber-500' },
  ];

  const handleUpdateStatus = (status: UserStatus) => {
    updateUserStatus(status, customStatusInput);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <span>Collaborative Team Persona & Presence</span>
        </div>
      }
      description="Switch active demo profile or update your real-time status."
      maxWidth="md"
    >
      <div className="space-y-5 select-none">
        {/* User Profiles list */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">
            Switch Team Member ({users.length})
          </label>
          <div className="space-y-2">
            {users.map((user) => {
              const isSelected = user.id === currentUser?.id;
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-lime-50 border-lime-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{user.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{user.email}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Presence Status */}
        {currentUser && (
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">
              My Focus Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleUpdateStatus(opt.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    currentUser.status === opt.value
                      ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

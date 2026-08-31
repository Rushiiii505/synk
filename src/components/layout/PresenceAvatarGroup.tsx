'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { UserAvatar } from '@/components/ui/UserAvatar';

export function PresenceAvatarGroup({ max = 4 }: { max?: number }) {
  const { users, currentUser } = useAuth();
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  const displayedUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="relative flex items-center select-none">
      <div className="flex items-center -space-x-1.5 overflow-hidden p-0.5">
        {displayedUsers.map((user) => {
          const isCurrent = user.id === currentUser?.id;
          return (
            <div
              key={user.id}
              className="relative group cursor-pointer transition-transform duration-150 hover:scale-110 hover:z-30"
              onMouseEnter={() => setHoveredUser(user)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <UserAvatar
                name={user.name}
                email={user.email}
                size="sm"
                showStatus={true}
                status={user.status}
                className={isCurrent ? 'ring-2 ring-lime-400' : 'ring-1 ring-white/30'}
              />
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div className="flex items-center justify-center w-6 h-6 rounded-xl bg-slate-100 ring-1 ring-white text-[10px] font-mono font-black text-slate-600">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Hover Info Tooltip */}
      {hoveredUser && (
        <div className="absolute top-9 right-0 z-50 w-52 p-3 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2.5">
            <UserAvatar name={hoveredUser.name} email={hoveredUser.email} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">{hoveredUser.name}</span>
                {hoveredUser.id === currentUser?.id && (
                  <span className="text-[9px] bg-lime-400 text-slate-950 px-1 rounded font-bold">You</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1 font-medium">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hoveredUser.status === 'online' ? 'bg-lime-400' : 'bg-amber-400'
                  }`}
                />
                {hoveredUser.status}
              </span>
            </div>
          </div>
          {hoveredUser.customStatus && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
              {hoveredUser.customStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

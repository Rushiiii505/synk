import { UserStatus } from '@/types';

interface UserAvatarProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: UserStatus | 'busy';
}

const GRADIENTS = [
  'from-lime-400 to-emerald-600 text-slate-950',
  'from-indigo-500 to-purple-600 text-white',
  'from-cyan-400 to-blue-600 text-white',
  'from-amber-400 to-orange-600 text-slate-950',
  'from-pink-500 to-rose-600 text-white',
  'from-emerald-400 to-teal-600 text-slate-950',
  'from-violet-500 to-fuchsia-600 text-white',
];

const SIZE_CLASSES = {
  xs: 'w-4 h-4 text-[9px] font-black',
  sm: 'w-6 h-6 text-[10px] font-black',
  md: 'w-8 h-8 text-xs font-black',
  lg: 'w-10 h-10 text-sm font-black',
  xl: 'w-13 h-13 text-base font-black',
};

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-lime-400 ring-slate-950',
  focusing: 'bg-purple-500 ring-slate-950',
  meeting: 'bg-indigo-500 ring-slate-950',
  busy: 'bg-rose-500 ring-slate-950',
  away: 'bg-amber-400 ring-slate-950',
  offline: 'bg-slate-500 ring-slate-950',
};

export function UserAvatar({
  name = 'User',
  email = '',
  size = 'md',
  className = '',
  showStatus = false,
  status = 'online',
}: UserAvatarProps) {
  // Extract clean initials
  const cleanName = (name || email || 'U').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : cleanName.slice(0, 2).toUpperCase();

  // Deterministic gradient selection
  const hash = (cleanName + email).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = GRADIENTS[hash % GRADIENTS.length];

  return (
    <div className="relative inline-flex shrink-0 select-none">
      <div
        className={`rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center tracking-tight shadow-xs ring-1 ring-white/20 uppercase font-mono ${SIZE_CLASSES[size]} ${className}`}
        title={name || email}
      >
        {initials}
      </div>

      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ${STATUS_COLORS[status]}`}
        />
      )}
    </div>
  );
}

export default UserAvatar;

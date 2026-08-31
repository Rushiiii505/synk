'use client';

import React, { useState, useRef, useEffect } from 'react';
import { StickyNote, StickyNoteColor } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  Plus,
  Pin,
  Trash2,
  Sparkles,
  Search,
  Check,
  Copy,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

const NOTE_COLORS: Record<
  StickyNoteColor,
  { bg: string; border: string; header: string; text: string; ring: string }
> = {
  yellow: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    header: 'bg-amber-100/70',
    text: 'text-amber-950',
    ring: 'focus:border-amber-400',
  },
  mint: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    header: 'bg-emerald-100/70',
    text: 'text-emerald-950',
    ring: 'focus:border-emerald-400',
  },
  lavender: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    header: 'bg-purple-100/70',
    text: 'text-purple-950',
    ring: 'focus:border-purple-400',
  },
  sky: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    header: 'bg-sky-100/70',
    text: 'text-sky-950',
    ring: 'focus:border-sky-400',
  },
  peach: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    header: 'bg-rose-100/70',
    text: 'text-rose-950',
    ring: 'focus:border-rose-400',
  },
  white: {
    bg: 'bg-white',
    border: 'border-slate-200',
    header: 'bg-slate-50',
    text: 'text-slate-900',
    ring: 'focus:border-slate-400',
  },
};

export function TeamNotepad() {
  const {
    stickyNotes,
    addStickyNote,
    updateStickyNote,
    deleteStickyNote,
    togglePinStickyNote,
    addToast,
  } = useWorkspace();
  const { currentUser, users } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [activeUploadNoteId, setActiveUploadNoteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Master Shared Scratchpad text state with persistence
  const [scratchpadContent, setScratchpadContent] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_scratchpad_text');
      if (saved) return saved;
    }
    return `# 🚀 synk Operations Scratchpad\n\n- [x] Sprint backlog prioritized on Trello\n- [x] Client Retainer recorded (+₹3,50,000 IN)\n- [ ] Finalize treasury allocation deck\n\n> "Keep everything collaborative, minimal, and fast."`;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('synk_scratchpad_text', scratchpadContent);
  }, [scratchpadContent]);

  const filteredNotes = stickyNotes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = selectedColor === 'all' || n.color === selectedColor;
    return matchesSearch && matchesColor;
  });

  const handleCreateNewMemo = (color: StickyNoteColor = 'yellow') => {
    addStickyNote({
      title: '📝 Quick Memo',
      content: 'Click here to write notes, action items, or sprint ideas...',
      color,
      isPinned: false,
      author: currentUser || { id: 'u_anon', name: 'Member', email: 'user@synk.app', avatar: '', status: 'online', color: '#84cc16' },
      tags: ['Memo'],
    });
  };

  const handleCopyScratchpad = () => {
    navigator.clipboard.writeText(scratchpadContent);
    setCopied(true);
    addToast('Scratchpad Copied', 'Copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNoteImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadNoteId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateStickyNote(activeUploadNoteId, { imageUrl: result });
        setActiveUploadNoteId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="notepad-section" className="space-y-4 select-none">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              📝
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
                <span>Team Notepad</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {stickyNotes.length} Memos
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time sticky memos, image diagrams, and live shared scratchpads.
          </p>
        </div>

        <button
          onClick={() => handleCreateNewMemo('yellow')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>+ Add Sticky Memo</span>
        </button>
      </div>

      {/* Hidden File Input for Memos */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleNoteImageUpload}
      />

      {/* 1. Live Collaborative Scratchpad Container */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="text-xs font-extrabold text-slate-900">Live Team Scratchpad</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Synced
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center -space-x-1.5 mr-2">
              {users.slice(0, 3).map((u) => (
                <UserAvatar
                  key={u.id}
                  name={u.name}
                  email={u.email}
                  size="xs"
                  className="ring-1 ring-white"
                />
              ))}
            </div>
            <button
              onClick={handleCopyScratchpad}
              className="p-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Copy Scratchpad Content"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Scratchpad Text Area */}
        <textarea
          rows={2}
          value={scratchpadContent}
          onChange={(e) => setScratchpadContent(e.target.value)}
          placeholder="Type live notes, meeting minutes, or checklists..."
          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner resize-y"
        />
      </div>

      {/* 2. Sticky Memos Board Section */}
      <div className="space-y-3">
        {/* Filter / Color Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Sticky Memos ({filteredNotes.length})
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[160px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search memos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium shadow-xs"
              />
            </div>

            {/* Quick Color Buttons to add note */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
              {(['yellow', 'mint', 'lavender', 'sky', 'peach'] as StickyNoteColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCreateNewMemo(c)}
                  className={`w-4 h-4 rounded-full border border-slate-300 transition-transform hover:scale-125 cursor-pointer ${
                    NOTE_COLORS[c].bg
                  }`}
                  title={`Add ${c} note`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-sm mx-auto">
              📝
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">No team memos posted yet</h4>
              <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                Post quick memos, architecture sketches, sprint reminders, or client briefs.
              </p>
            </div>
            <button
              onClick={() => handleCreateNewMemo('yellow')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Post First Memo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredNotes.map((note) => {
              const theme = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;

              return (
                <div
                  key={note.id}
                  className={`p-3.5 rounded-2xl border ${theme.border} ${theme.bg} shadow-xs flex flex-col justify-between space-y-2.5 transition-all hover:shadow-md relative group`}
                >
                  {/* Note Header */}
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => updateStickyNote(note.id, { title: e.target.value })}
                      className={`text-xs font-extrabold ${theme.text} bg-transparent focus:outline-none border-b border-transparent focus:border-slate-400 w-full truncate`}
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePinStickyNote(note.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          note.isPinned
                            ? 'text-amber-700 bg-amber-200/60'
                            : 'text-slate-400 hover:text-slate-700 opacity-60 group-hover:opacity-100'
                        }`}
                        title={note.isPinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveUploadNoteId(note.id);
                          fileInputRef.current?.click();
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Attach Diagram / Image"
                      >
                        <ImageIcon className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => deleteStickyNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete Memo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Attached Diagram / Screenshot */}
                  {note.imageUrl && (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden border border-black/10 group/img">
                      <img
                        src={note.imageUrl}
                        alt="Attached Diagram"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => updateStickyNote(note.id, { imageUrl: undefined })}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Note Content */}
                  <textarea
                    rows={4}
                    value={note.content}
                    onChange={(e) => updateStickyNote(note.id, { content: e.target.value })}
                    className={`w-full bg-transparent text-xs ${theme.text} leading-relaxed focus:outline-none resize-none`}
                  />

                  {/* Note Footer: Color picker & Author */}
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1">
                      {(['yellow', 'mint', 'lavender', 'sky', 'peach'] as StickyNoteColor[]).map(
                        (c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => updateStickyNote(note.id, { color: c })}
                            className={`w-3.5 h-3.5 rounded-full border border-black/10 transition-transform ${
                              NOTE_COLORS[c].bg
                            } ${note.color === c ? 'scale-125 ring-1 ring-slate-900' : 'opacity-60'}`}
                          />
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <UserAvatar name={note.author.name} email={note.author.email} size="xs" />
                      <span className="truncate max-w-[80px]">{note.author.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

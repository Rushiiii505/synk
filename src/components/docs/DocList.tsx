'use client';

import React, { useState } from 'react';
import { Doc, DocCategory } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Plus, Search, Pin, Folder, Tag, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface DocListProps {
  onSelectDoc: (id: string) => void;
  selectedDocId: string | null;
}

export function DocList({ onSelectDoc, selectedDocId }: DocListProps) {
  const { docs, openQuickAction } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    '#Strategy',
    '#MeetingNotes',
    '#Operations',
    '#Branding',
    '#Product',
    '#Engineering',
  ];

  const filteredDocs = docs.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const pinnedDocs = filteredDocs.filter((d) => d.isPinned);
  const unpinnedDocs = filteredDocs.filter((d) => !d.isPinned);

  return (
    <div className="w-full sm:w-80 lg:w-88 border-r border-slate-800/80 bg-slate-950/80 flex flex-col h-full shrink-0 select-none">
      {/* Header & New Doc Button */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">Documents & Specs</h3>
          </div>
          <button
            onClick={() => openQuickAction('doc')}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1 text-xs font-semibold px-2.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter docs or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Folder Tags Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Docs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Pinned Section */}
        {pinnedDocs.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-semibold text-amber-400/80 px-2 flex items-center gap-1">
              <Pin className="w-3 h-3" />
              <span>Pinned Knowledge</span>
            </div>
            {pinnedDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md shadow-indigo-950/40'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{doc.icon || '📄'}</span>
                      <span className="text-xs font-semibold text-slate-100 truncate block">
                        {doc.title}
                      </span>
                    </div>
                    <Pin className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1.5">
                    {doc.content.replace(/[#*`_\[\]]/g, '').slice(0, 60)}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="text-indigo-400 font-medium">{doc.category}</span>
                    <span>{formatRelativeTime(doc.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Regular Docs Section */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-semibold text-slate-500 px-2 tracking-wider">
            All Documents ({unpinnedDocs.length})
          </div>

          {unpinnedDocs.length === 0 && pinnedDocs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No docs match the selected filter.
            </div>
          ) : (
            unpinnedDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md shadow-indigo-950/40'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{doc.icon || '📄'}</span>
                    <span className="text-xs font-semibold text-slate-100 truncate block">
                      {doc.title}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1.5">
                    {doc.content.replace(/[#*`_\[\]]/g, '').slice(0, 60)}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="text-indigo-400 font-medium">{doc.category}</span>
                    <span>{formatRelativeTime(doc.updatedAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

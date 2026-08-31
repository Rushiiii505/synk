'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Doc, DocCategory } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
  Quote,
  Pin,
  Trash2,
  Copy,
  Download,
  Eye,
  Edit3,
  Sparkles,
  Users,
  Clock,
  FileDown,
  Check,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface DocEditorProps {
  doc: Doc;
}

export function DocEditor({ doc }: DocEditorProps) {
  const { updateDoc, deleteDoc, togglePinDoc, addToast } = useWorkspace();
  const { currentUser, users } = useAuth();

  const [title, setTitle] = useState(doc.title);
  const [content, setContent] = useState(doc.content);
  const [category, setCategory] = useState<DocCategory>(doc.category);
  const [tagsInput, setTagsInput] = useState(doc.tags.join(', '));
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when selected doc changes
  useEffect(() => {
    setTitle(doc.title);
    setContent(doc.content);
    setCategory(doc.category);
    setTagsInput(doc.tags.join(', '));
  }, [doc.id]);

  // Auto-save debounced
  useEffect(() => {
    const handler = setTimeout(() => {
      if (title !== doc.title || content !== doc.content || category !== doc.category) {
        setIsSaving(true);
        const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
        updateDoc(doc.id, {
          title,
          content,
          category,
          tags,
        });
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [title, content, category, tagsInput, doc.id]);

  // Word count & Reading time
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Markdown Insertion Helper
  const insertMarkdown = (before: string, after: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultPlaceholder;

    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    addToast('Markdown Copied', 'Content copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Document Downloaded', `${title}.md exported`, 'success');
  };

  // Simulating active collaborative editors
  const otherEditors = users.filter((u) => u.id !== currentUser?.id && u.status !== 'offline').slice(0, 2);

  // Render markdown parser preview (clean lightweight markdown renderer)
  const renderMarkdownPreview = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="prose prose-invert max-w-none text-slate-200 space-y-3 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-bold text-white tracking-tight border-b border-slate-800 pb-2 mt-4">
                {line.replace('# ', '')}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-semibold text-slate-100 mt-4 border-b border-slate-800/60 pb-1">
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-semibold text-slate-200 mt-3">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('- [x] ') || line.startsWith('- [ ] ')) {
            const checked = line.startsWith('- [x] ');
            return (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-xs border ${checked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 bg-slate-900'}`}>
                  {checked && '✓'}
                </span>
                <span className={checked ? 'line-through text-slate-400' : ''}>
                  {line.replace(/- \[[ x]\] /, '')}
                </span>
              </div>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-slate-300">
                {line.replace('- ', '')}
              </li>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-indigo-500 pl-4 py-1 italic text-indigo-200 bg-indigo-950/20 rounded-r-lg">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.startsWith('```')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                <code>{line}</code>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }
          return (
            <p key={idx} className="text-slate-300">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/60 overflow-hidden">
      {/* Top Editor Toolbar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl">{doc.icon || '📄'}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DocCategory)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-indigo-400 focus:outline-none focus:border-indigo-500"
          >
            <option value="#Strategy">#Strategy</option>
            <option value="#MeetingNotes">#MeetingNotes</option>
            <option value="#Operations">#Operations</option>
            <option value="#Branding">#Branding</option>
            <option value="#Product">#Product</option>
            <option value="#Engineering">#Engineering</option>
          </select>

          {/* Auto-saving status */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span>{isSaving ? 'Saving...' : 'Auto-saved'}</span>
          </div>
        </div>

        {/* Live Collaborator Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center -space-x-2">
            {otherEditors.map((editor) => (
              <div key={editor.id} className="relative group">
                <img
                  src={editor.avatar}
                  alt={editor.name}
                  className="w-6 h-6 rounded-full ring-2 ring-slate-900 object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline-block font-mono">
            {otherEditors.length > 0 ? `${otherEditors[0].name.split(' ')[0]} active` : 'Solo session'}
          </span>

          {/* View mode toggle */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Edit Markdown"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors hidden md:block ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split View"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Preview Render"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action buttons */}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => togglePinDoc(doc.id)}
            className={doc.isPinned ? 'text-amber-400 hover:text-amber-300' : 'text-slate-400'}
            title={doc.isPinned ? 'Unpin Document' : 'Pin Document'}
          >
            <Pin className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopyMarkdown}
            title="Copy Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleDownloadMarkdown}
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => deleteDoc(doc.id)}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            title="Delete Document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Markdown Quick Syntax Bar */}
      {viewMode !== 'preview' && (
        <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => insertMarkdown('# ', '', 'Heading 1')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('## ', '', 'Heading 2')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('### ', '', 'Heading 3')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-800 mx-1" />
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**', 'bold text')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*', 'italic text')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('- [ ] ', '', 'Checklist task')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Checklist Item"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('- ', '', 'Bullet item')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('```typescript\n', '\n```', 'console.log("hello");')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('> ', '', 'Important quotation')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor & Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`flex-1 flex flex-col p-6 overflow-y-auto ${viewMode === 'split' ? 'border-r border-slate-800/80' : ''}`}>
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title..."
              className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-none focus:outline-none placeholder-slate-600 mb-4"
            />

            {/* Tags line */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
              <span className="text-xs text-slate-500 font-mono">Tags:</span>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Add tags comma separated..."
                className="bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none flex-1"
              />
            </div>

            {/* Content Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your notes, strategy specs, blockquotes or Markdown here..."
              className="flex-1 w-full bg-transparent text-slate-200 font-mono text-sm leading-relaxed border-none focus:outline-none resize-none min-h-[400px]"
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/30">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">{title}</h1>
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800/80">
              <Badge variant="indigo" size="sm">
                {category}
              </Badge>
              {doc.tags.map((t) => (
                <span key={t} className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
            {renderMarkdownPreview(content)}
          </div>
        )}
      </div>

      {/* Editor Footer Stats */}
      <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            ~{readTimeMin} min read
          </span>
          <span>•</span>
          <span>Last edited by {doc.lastEditedBy?.name || currentUser?.name || 'Member'} ({formatRelativeTime(doc.updatedAt)})</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span>Markdown Mode</span>
        </div>
      </div>
    </div>
  );
}

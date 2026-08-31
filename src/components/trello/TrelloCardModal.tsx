'use client';

import React, { useState, useRef } from 'react';
import { Task, CardColorLabel } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import {
  CheckSquare,
  Clock,
  Trash2,
  Plus,
  User as UserIcon,
  AlignLeft,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysRemaining } from '@/lib/utils';

interface TrelloCardModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_OPTIONS: { label: CardColorLabel; bg: string; text: string; border: string }[] = [
  { label: 'lime', bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-300' },
  { label: 'purple', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  { label: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  { label: 'amber', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  { label: 'rose', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  { label: 'slate', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
];

export function TrelloCardModal({ task, isOpen, onClose }: TrelloCardModalProps) {
  const { updateTask, deleteTask, toggleSubtask, trelloLists } = useWorkspace();
  const { users } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [notepadNotes, setNotepadNotes] = useState(task?.notepadNotes || task?.description || '');
  const [budgetAmount, setBudgetAmount] = useState(task?.budgetAmount?.toString() || '');
  const [imageUrl, setImageUrl] = useState(task?.imageUrl || '');

  if (!task) return null;

  const dueInfo = getDaysRemaining(task.dueDate);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const progress =
    task.subtasks.length > 0
      ? Math.round((completedSubtasks / task.subtasks.length) * 100)
      : 0;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtasks = [
      ...task.subtasks,
      { id: `st_${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ];
    updateTask(task.id, { subtasks: newSubtasks });
    setNewSubtaskTitle('');
  };

  const handleSaveNotes = () => {
    updateTask(task.id, {
      notepadNotes,
      budgetAmount: parseFloat(budgetAmount) || undefined,
      imageUrl: imageUrl || undefined,
    });
  };

  const handleColorChange = (color: CardColorLabel) => {
    updateTask(task.id, { colorLabel: color });
  };

  const handleListChange = (listId: string) => {
    const list = trelloLists.find((l) => l.id === listId);
    updateTask(task.id, { listId, status: list?.title || task.status });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        updateTask(task.id, { imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleSaveNotes();
        onClose();
      }}
      title={
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-900" />
          <span className="text-base font-extrabold text-slate-900">{task.title}</span>
        </div>
      }
      description={`In list "${task.status}" • Created ${formatDate(task.createdAt)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-800">
        {/* Cover Image Preview (if attached) */}
        {imageUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 group">
            <img src={imageUrl} alt="Card Cover" className="w-full h-48 object-cover" />
            <button
              onClick={() => {
                setImageUrl('');
                updateTask(task.id, { imageUrl: undefined });
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
              title="Remove Cover Image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Control Bar: List, Color Label, Budget Tag in ₹ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Trello List
            </label>
            <select
              value={task.listId || ''}
              onChange={(e) => handleListChange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {trelloLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Color Tag
            </label>
            <div className="flex items-center gap-1.5 pt-0.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => handleColorChange(c.label)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${c.bg} ${
                    task.colorLabel === c.label ? 'scale-115 ring-2 ring-slate-900' : 'hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Budget / Spend (₹)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-500">₹</span>
              <input
                type="number"
                placeholder="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                onBlur={handleSaveNotes}
                className="w-full pl-6 pr-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Card Image Attachment Toolbar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Attach Card Image / Mockup</span>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <Upload className="w-3 h-3" />
              <span>{imageUrl ? 'Change Image' : 'Upload Image'}</span>
            </button>
          </div>
        </div>

        {/* Card Notepad / Notes Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>Card Notepad & Specifications</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Auto-saved</span>
          </div>
          <textarea
            rows={4}
            value={notepadNotes}
            onChange={(e) => setNotepadNotes(e.target.value)}
            onBlur={handleSaveNotes}
            placeholder="Type shared card notes, specs, links, or Markdown here..."
            className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans shadow-inner"
          />
        </div>

        {/* Assignees & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Card Members</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {task.assignees.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-purple-200 shadow-xs"
                >
                  <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-800">{u.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-lime-50/60 border border-lime-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-lime-900 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline & Due Date</span>
            </h4>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>{formatDate(task.dueDate)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${dueInfo.isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-lime-200 text-lime-900'}`}>
                {dueInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Subtask Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checklist ({completedSubtasks}/{task.subtasks.length})</span>
            </h4>
            <span className="text-xs font-mono font-bold text-emerald-700">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200">
            <div
              className="h-full bg-lime-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {task.subtasks.map((st) => (
              <div
                key={st.id}
                onClick={() => toggleSubtask(task.id, st.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  st.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                }`}
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-lime-600 focus:ring-0 pointer-events-none"
                />
                <span className="text-xs font-semibold">{st.title}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Add an item to checklist..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <Button type="submit" variant="secondary" size="xs" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Item
            </Button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Card</span>
          </button>

          <button
            onClick={() => {
              handleSaveNotes();
              onClose();
            }}
            className="px-6 py-2 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

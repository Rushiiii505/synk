'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { CardColorLabel, StickyNoteColor, ExpenseCategory, ExpenseType } from '@/types';
import {
  CheckSquare,
  FileText,
  CreditCard,
  Sparkles,
  Upload,
  ArrowDownLeft,
  ArrowUpRight,
  Image as ImageIcon,
  X,
} from 'lucide-react';

export function QuickActionModal() {
  const {
    isQuickActionOpen,
    closeQuickAction,
    quickActionType,
    addTask,
    addStickyNote,
    addExpense,
    trelloLists,
  } = useWorkspace();
  const { currentUser } = useAuth();

  const [activeType, setActiveType] = useState<'task' | 'note' | 'expense'>('task');

  // Task / Trello Card Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskListId, setTaskListId] = useState('');
  const [taskColor, setTaskColor] = useState<CardColorLabel>('lime');
  const [taskBudget, setTaskBudget] = useState('');
  const [taskImage, setTaskImage] = useState<string>('');

  // Sticky Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState<StickyNoteColor>('yellow');
  const [noteImage, setNoteImage] = useState<string>('');

  // Expense / Cashflow Form
  const [expType, setExpType] = useState<ExpenseType>('OUT');
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Software & AI');
  const [expMethod, setExpMethod] = useState<'UPI / GPay' | 'Corporate Card' | 'Wire Transfer' | 'NetBanking' | 'Razorpay / Stripe' | 'Apple Pay'>('UPI / GPay');
  const [receiptImage, setReceiptImage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quickActionType === 'note') setActiveType('note');
    else if (quickActionType === 'expense') setActiveType('expense');
    else if (quickActionType === 'task') setActiveType('task');
  }, [quickActionType]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>, target: 'task' | 'note' | 'expense') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'task') setTaskImage(result);
        else if (target === 'note') setNoteImage(result);
        else if (target === 'expense') setReceiptImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const list = trelloLists.find((l) => l.id === taskListId) || trelloLists[0];

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      notepadNotes: taskDesc.trim(),
      listId: list.id,
      status: list.title,
      priority: 'High',
      colorLabel: taskColor,
      budgetAmount: parseFloat(taskBudget) || undefined,
      imageUrl: taskImage || undefined,
      assignees: currentUser ? [currentUser] : [],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Trello', 'Deliverable'],
      subtasks: [
        { id: `st_${Date.now()}_1`, title: 'Review deliverable requirements', completed: false },
        { id: `st_${Date.now()}_2`, title: 'Ship & verify with team', completed: false },
      ],
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskBudget('');
    setTaskImage('');
    closeQuickAction();
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addStickyNote({
      title: noteTitle.trim(),
      content: noteContent.trim() || 'New collaborative memo notes...',
      color: noteColor,
      isPinned: false,
      imageUrl: noteImage || undefined,
      author: currentUser || { id: 'u_anon', name: 'Member', email: 'user@synk.app', avatar: '', status: 'online', color: '#84cc16' },
      tags: ['Memo'],
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteImage('');
    closeQuickAction();
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    addExpense({
      type: expType,
      title: expTitle.trim(),
      amount: parseFloat(expAmount) || 0,
      currency: 'INR',
      category: expCategory,
      date: new Date().toISOString(),
      paidBy: currentUser || { id: 'u_anon', name: 'Member', email: 'user@synk.app', avatar: '', status: 'online', color: '#84cc16' },
      paymentMethod: expMethod,
      status: 'Paid',
      receiptUrl: receiptImage || undefined,
    });

    setExpTitle('');
    setExpAmount('');
    setReceiptImage('');
    closeQuickAction();
  };

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={closeQuickAction}
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="text-base font-extrabold text-slate-900">Quick Workspace Action</span>
        </div>
      }
      description="Create a Trello Card, Team Sticky Memo, or Log Money IN/OUT in seconds."
      maxWidth="md"
    >
      {/* Type Switcher Pills */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full mb-5">
        <button
          type="button"
          onClick={() => setActiveType('task')}
          className={`flex-1 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeType === 'task'
              ? 'bg-slate-950 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>📋</span>
          <span>Trello Card</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('note')}
          className={`flex-1 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeType === 'note'
              ? 'bg-slate-950 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>📝</span>
          <span>Sticky Memo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('expense')}
          className={`flex-1 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeType === 'expense'
              ? 'bg-slate-950 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>💳</span>
          <span>Cashflow (IN/OUT)</span>
        </button>
      </div>

      {/* Task / Card Form */}
      {activeType === 'task' && (
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Card Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Integrate UPI Payouts and Split Engine"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Trello List
              </label>
              <select
                value={taskListId}
                onChange={(e) => setTaskListId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {trelloLists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Budget / Spend (₹)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="25000"
                  value={taskBudget}
                  onChange={(e) => setTaskBudget(e.target.value)}
                  className="w-full pl-6 pr-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Image Upload for Task */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Attach Cover Image / Wireframe
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleImagePick(e, 'task')}
            />
            {taskImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 h-24">
                <img src={taskImage} alt="Task Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setTaskImage('')}
                  className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:border-slate-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Card Notepad Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add details, notes, or checklist items..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeQuickAction}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all"
            >
              Create Card
            </button>
          </div>
        </form>
      )}

      {/* Sticky Note Form */}
      {activeType === 'note' && (
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Memo Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 💡 Marketing Sprint Priorities"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Sticky Note Color
            </label>
            <div className="flex items-center gap-2">
              {(['yellow', 'mint', 'lavender', 'sky', 'peach'] as StickyNoteColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNoteColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    c === 'yellow'
                      ? 'bg-amber-100 border-amber-300'
                      : c === 'mint'
                      ? 'bg-emerald-100 border-emerald-300'
                      : c === 'lavender'
                      ? 'bg-purple-100 border-purple-300'
                      : c === 'sky'
                      ? 'bg-sky-100 border-sky-300'
                      : 'bg-rose-100 border-rose-300'
                  } ${noteColor === c ? 'scale-125 ring-2 ring-slate-900' : 'hover:scale-110'}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Memo Content
            </label>
            <textarea
              rows={4}
              placeholder="Write your quick thoughts, action items, or reminders..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeQuickAction}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all"
            >
              Post Memo
            </button>
          </div>
        </form>
      )}

      {/* Expense (Cashflow IN & OUT) Form */}
      {activeType === 'expense' && (
        <form onSubmit={handleCreateExpense} className="space-y-4">
          {/* Flow Type Toggle (Money IN vs Money OUT) */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Flow Direction
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExpType('IN');
                  setExpCategory('Income / Funding');
                }}
                className={`flex-1 py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  expType === 'IN'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Money IN (Income / Advance)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExpType('OUT');
                  setExpCategory('Software & AI');
                }}
                className={`flex-1 py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  expType === 'OUT'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Money OUT (Expense / Bill)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Transaction Title / Description
            </label>
            <input
              type="text"
              required
              placeholder={expType === 'IN' ? 'e.g. Client Retainer Advance Payment' : 'e.g. AWS & Dedicated Database Hosting'}
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="50000"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full pl-6 pr-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Category
              </label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {expType === 'IN' ? (
                  <>
                    <option value="Income / Funding">Income / Funding</option>
                    <option value="Client Payout">Client Payout</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </>
                ) : (
                  <>
                    <option value="Software & AI">Software & AI</option>
                    <option value="Marketing & Ads">Marketing & Ads</option>
                    <option value="Operations & Legal">Operations & Legal</option>
                    <option value="Inventory & Sourcing">Inventory & Sourcing</option>
                    <option value="Team & Payroll">Team & Payroll</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Payment Method
              </label>
              <select
                value={expMethod}
                onChange={(e) => setExpMethod(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="UPI / GPay">UPI / GPay</option>
                <option value="Corporate Card">Corporate Card</option>
                <option value="Wire Transfer">Wire Transfer</option>
                <option value="NetBanking">NetBanking</option>
                <option value="Razorpay / Stripe">Razorpay / Stripe</option>
                <option value="Apple Pay">Apple Pay</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Attach Receipt / Invoice
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="receipt-file-input"
                onChange={(e) => handleImagePick(e, 'expense')}
              />
              {receiptImage ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 h-8 flex items-center px-2 bg-slate-50 text-[10px] text-slate-700 font-bold">
                  <span className="truncate">Receipt Attached</span>
                  <button
                    type="button"
                    onClick={() => setReceiptImage('')}
                    className="ml-auto text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById('receipt-file-input')?.click()}
                  className="w-full py-1.5 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:border-slate-400 flex items-center justify-center gap-1 transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Receipt</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeQuickAction}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all"
            >
              Log Transaction
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

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
  Plus,
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
    const parsedBudget = parseFloat(taskBudget);

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      notepadNotes: taskDesc.trim(),
      listId: list?.id || 'list_backlog',
      status: list?.title || 'In Progress',
      priority: 'High',
      colorLabel: taskColor,
      budgetAmount: isNaN(parsedBudget) ? undefined : parsedBudget,
      imageUrl: taskImage || undefined,
      assignees: currentUser ? [currentUser] : [],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Sprint'],
      subtasks: [
        { id: `st_${Date.now()}_1`, title: 'Review sprint requirements', completed: false },
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
      content: noteContent.trim() || 'Click to write notes or sprint action items...',
      color: noteColor,
      isPinned: false,
      author: currentUser || { id: 'u_anon', name: 'Member', email: 'user@synk.app', avatar: '', status: 'online', color: '#84cc16' },
      imageUrl: noteImage || undefined,
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

    const parsedAmount = parseFloat(expAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addExpense({
      title: expTitle.trim(),
      amount: parsedAmount,
      type: expType,
      category: expType === 'IN' ? 'Income / Funding' : expCategory,
      currency: 'INR',
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

  const colorPills: Record<CardColorLabel, string> = {
    lime: 'bg-lime-400',
    purple: 'bg-purple-400',
    blue: 'bg-sky-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    slate: 'bg-slate-400',
  };

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={closeQuickAction}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs shadow-xs">
            ⚡
          </div>
          <span className="text-sm sm:text-base font-black text-slate-900">Quick Workspace Action</span>
        </div>
      }
      description="Instantly create a Trello Sprint Card, Team Sticky Memo, or Log Money IN/OUT in ₹."
      maxWidth="md"
    >
      {/* Type Switcher Pills */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 mb-4 gap-1">
        <button
          type="button"
          onClick={() => setActiveType('task')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeType === 'task'
              ? 'bg-white text-slate-950 shadow-sm font-black'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>📋</span>
          <span className="truncate">Trello Card</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('note')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeType === 'note'
              ? 'bg-white text-slate-950 shadow-sm font-black'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>📝</span>
          <span className="truncate">Sticky Memo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('expense')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeType === 'expense'
              ? 'bg-white text-slate-950 shadow-sm font-black'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>💳</span>
          <span className="truncate">Cashflow (₹)</span>
        </button>
      </div>

      {/* 1. Task / Trello Card Form */}
      {activeType === 'task' && (
        <form onSubmit={handleCreateTask} className="space-y-3.5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              Card Title / Sprint Deliverable
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Integrate UPI Payouts and Split Engine"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Sprint Column
              </label>
              <select
                value={taskListId || trelloLists[0]?.id}
                onChange={(e) => setTaskListId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 cursor-pointer shadow-xs"
              >
                {trelloLists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Task Budget Limit (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 25000"
                  value={taskBudget}
                  onChange={(e) => setTaskBudget(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Color Label & Image Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Color Tag
              </label>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {(['lime', 'purple', 'blue', 'amber', 'rose', 'slate'] as CardColorLabel[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTaskColor(c)}
                    className={`w-5 h-5 rounded-full ${colorPills[c]} transition-transform cursor-pointer ${
                      taskColor === c ? 'ring-2 ring-slate-950 scale-110 shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleImagePick(e, 'task')}
              />
              {taskImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-10 flex items-center justify-between p-1 bg-slate-50">
                  <img src={taskImage} alt="Task Cover" className="w-12 h-full object-cover rounded-lg" />
                  <span className="text-[10px] font-bold text-slate-600">Attached</span>
                  <button
                    type="button"
                    onClick={() => setTaskImage('')}
                    className="p-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload Image</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              Notepad Description / Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Add key deliverables, acceptance criteria, or team context..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-slate-950 text-white font-black text-xs hover:bg-slate-800 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Create Sprint Card</span>
              <Plus className="w-4 h-4 text-lime-400" />
            </button>
          </div>
        </form>
      )}

      {/* 2. Sticky Memo Form */}
      {activeType === 'note' && (
        <form onSubmit={handleCreateNote} className="space-y-3.5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              Memo Subject
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Design Critique Notes & Sprint Goals"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Note Color
              </label>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {(['yellow', 'mint', 'lavender', 'sky', 'peach'] as StickyNoteColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNoteColor(c)}
                    className={`w-5 h-5 rounded-full border border-slate-300 transition-transform cursor-pointer ${
                      c === 'yellow' ? 'bg-amber-100' : c === 'mint' ? 'bg-emerald-100' : c === 'lavender' ? 'bg-purple-100' : c === 'sky' ? 'bg-sky-100' : 'bg-rose-100'
                    } ${noteColor === c ? 'ring-2 ring-slate-950 scale-110 shadow-xs' : 'opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Attach Diagram
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleImagePick(e, 'note')}
              />
              {noteImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-10 flex items-center justify-between p-1 bg-slate-50">
                  <img src={noteImage} alt="Note Attachment" className="w-12 h-full object-cover rounded-lg" />
                  <span className="text-[10px] font-bold text-slate-600">Attached</span>
                  <button
                    type="button"
                    onClick={() => setNoteImage('')}
                    className="p-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload Sketch</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              Memo Notes & Scratchpad
            </label>
            <textarea
              rows={3}
              placeholder="Type team ideas, meeting minutes, architecture sketches..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-slate-950 text-white font-black text-xs hover:bg-slate-800 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Post Sticky Memo</span>
              <Plus className="w-4 h-4 text-lime-400" />
            </button>
          </div>
        </form>
      )}

      {/* 3. Cashflow IN / OUT Form */}
      {activeType === 'expense' && (
        <form onSubmit={handleCreateExpense} className="space-y-3.5">
          {/* Flow Selector */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              Transaction Flow
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExpType('IN')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  expType === 'IN'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>+ Money IN (Retainer / Funding)</span>
              </button>

              <button
                type="button"
                onClick={() => setExpType('OUT')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  expType === 'OUT'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>- Money OUT (Operational Cost)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              Description / Vendor
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={expType === 'IN' ? 'e.g. Apex Client Monthly Retainer' : 'e.g. Supabase Pro Subscription'}
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Amount in Rupees (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="e.g. 15000"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 cursor-pointer shadow-xs"
              >
                {expType === 'IN' ? (
                  <>
                    <option value="Income / Funding">Income / Funding</option>
                    <option value="Client Payout">Client Retainer</option>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Payment Channel
              </label>
              <select
                value={expMethod}
                onChange={(e) => setExpMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 cursor-pointer shadow-xs"
              >
                <option value="UPI / GPay">UPI / GPay</option>
                <option value="Corporate Card">Corporate Card</option>
                <option value="Wire Transfer">Wire Transfer / NEFT</option>
                <option value="NetBanking">NetBanking</option>
                <option value="Razorpay / Stripe">Razorpay / Stripe</option>
                <option value="Apple Pay">Apple Pay</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                Attach Invoice / Receipt
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleImagePick(e, 'expense')}
              />
              {receiptImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-10 flex items-center justify-between p-1 bg-slate-50">
                  <img src={receiptImage} alt="Receipt" className="w-12 h-full object-cover rounded-lg" />
                  <span className="text-[10px] font-bold text-slate-600">Attached</span>
                  <button
                    type="button"
                    onClick={() => setReceiptImage('')}
                    className="p-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload Receipt</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3 rounded-full text-white font-black text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                expType === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-950 hover:bg-slate-800'
              }`}
            >
              <span>{expType === 'IN' ? 'Record Inflow (+₹)' : 'Record Outflow (-₹)'}</span>
              <Plus className="w-4 h-4 text-lime-400" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Task, TaskStatus, CardColorLabel } from '@/types';
import {
  Plus,
  X,
  Search,
  CheckSquare,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
} from 'lucide-react';
import { TrelloCardModal } from './TrelloCardModal';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatCurrency, getDaysRemaining } from '@/lib/utils';

export function TrelloBoard() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToList,
    trelloLists,
    addTrelloList,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick inline add card state
  const [activeAddListId, setActiveAddListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardBudget, setNewCardBudget] = useState('');
  const [newCardLabel, setNewCardLabel] = useState<CardColorLabel>('lime');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    if (dragOverListId !== listId) {
      setDragOverListId(listId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      const targetList = trelloLists.find((l) => l.id === targetListId);
      moveTaskToList(taskId, targetListId, targetList?.title);
    }
    setDraggedTaskId(null);
    setDragOverListId(null);
  };

  const handleInlineAddCard = (listId: string) => {
    if (!newCardTitle.trim()) return;

    const targetList = trelloLists.find((l) => l.id === listId);

    addTask({
      title: newCardTitle.trim(),
      description: '',
      status: (targetList?.title as TaskStatus) || 'In Progress',
      listId,
      priority: 'Medium',
      assignees: [],
      tags: ['Sprint'],
      subtasks: [],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      colorLabel: newCardLabel,
      budgetAmount: parseFloat(newCardBudget) || undefined,
      notepadNotes: '',
    });

    setNewCardTitle('');
    setNewCardBudget('');
    setActiveAddListId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (t.notepadNotes && t.notepadNotes.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  const colorPills: Record<CardColorLabel, string> = {
    lime: 'bg-lime-400',
    purple: 'bg-purple-400',
    blue: 'bg-sky-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    slate: 'bg-slate-400',
  };

  return (
    <div id="trello-board" className="space-y-3 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            📋
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span>Agile Sprint Board</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {tasks.length} Cards
              </span>
            </h2>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          <button
            onClick={() => setActiveAddListId(trelloLists[0]?.id || 'list_backlog')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-lime-400" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Trello Columns with Smooth Mobile Swipe */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-0.5 items-start touch-pan-x snap-x snap-mandatory -mx-2 px-2 sm:mx-0 sm:px-0">
        {trelloLists.map((list, listIndex) => {
          const listTasks = filteredTasks.filter(
            (t) => t.listId === list.id || t.status === list.title
          );
          const isOver = dragOverListId === list.id;

          const hasPrev = listIndex > 0;
          const hasNext = listIndex < trelloLists.length - 1;

          return (
            <div
              key={list.id}
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDrop={(e) => handleDrop(e, list.id)}
              className={`w-[82vw] max-w-[290px] sm:w-76 shrink-0 snap-center flex flex-col rounded-2xl bg-white border transition-all duration-150 shadow-xs ${
                isOver ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/20' : 'border-slate-200/90'
              }`}
            >
              {/* Column Header */}
              <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-xs font-extrabold text-slate-900 truncate">{list.title}</h3>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold font-mono">
                    {listTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setActiveAddListId(list.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Add card to list"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2 max-h-[480px] overflow-y-auto">
                {/* Inline Add Card Composer */}
                {activeAddListId === list.id && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-indigo-200 shadow-xs space-y-2 animate-in fade-in zoom-in-95">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Card title / task name..."
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInlineAddCard(list.id);
                        if (e.key === 'Escape') setActiveAddListId(null);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />

                    {/* Color Label Picker */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {(['lime', 'purple', 'blue', 'amber', 'rose'] as CardColorLabel[]).map(
                          (c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setNewCardLabel(c)}
                              className={`w-4 h-4 rounded-full ${colorPills[c]} transition-transform ${
                                newCardLabel === c ? 'ring-2 ring-slate-950 scale-110' : 'opacity-70'
                              }`}
                            />
                          )
                        )}
                      </div>

                      {/* Optional Budget in INR */}
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400">₹</span>
                        <input
                          type="number"
                          placeholder="Budget"
                          value={newCardBudget}
                          onChange={(e) => setNewCardBudget(e.target.value)}
                          className="w-14 text-[10px] font-mono font-bold focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleInlineAddCard(list.id)}
                        className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Add Card
                      </button>
                      <button
                        onClick={() => setActiveAddListId(null)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {listTasks.map((task) => {
                  const dueInfo = getDaysRemaining(task.dueDate);
                  const completedSubs = task.subtasks.filter((s) => s.completed).length;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                      }}
                      className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden space-y-2"
                    >
                      {/* Top Label & Quick Shift Arrows */}
                      <div className="flex items-center justify-between">
                        {task.colorLabel ? (
                          <div className={`w-8 h-1.5 rounded-full ${colorPills[task.colorLabel]}`} />
                        ) : (
                          <div />
                        )}

                        {/* Mobile & Touch Quick Shift Arrows */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {hasPrev && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const prevList = trelloLists[listIndex - 1];
                                moveTaskToList(task.id, prevList.id, prevList.title);
                              }}
                              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 cursor-pointer"
                              title={`Move to ${trelloLists[listIndex - 1].title}`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {hasNext && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextList = trelloLists[listIndex + 1];
                                moveTaskToList(task.id, nextList.id, nextList.title);
                              }}
                              className="px-1.5 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-all active:scale-95 flex items-center gap-0.5 cursor-pointer"
                              title={`Move to ${trelloLists[listIndex + 1].title}`}
                            >
                              <span className="text-[9px] hidden sm:inline">{trelloLists[listIndex + 1].title}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Attached Cover Image */}
                      {task.imageUrl && (
                        <div className="w-full h-24 rounded-xl overflow-hidden mb-1 border border-slate-100">
                          <img
                            src={task.imageUrl}
                            alt={task.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Card Title */}
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 leading-snug">
                        {task.title}
                      </h4>

                      {/* Card Notepad Notes Snippet */}
                      {(task.notepadNotes || task.description) && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {task.notepadNotes || task.description}
                        </p>
                      )}

                      {/* Bottom Row: Budget Chip in ₹, Checklist Count & Avatars */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Budget / FinTech Tag in INR */}
                          {task.budgetAmount !== undefined && (
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                              <span>{formatCurrency(task.budgetAmount)}</span>
                            </span>
                          )}

                          {/* Subtasks Count */}
                          {task.subtasks.length > 0 && (
                            <span
                              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                completedSubs === task.subtasks.length
                                  ? 'bg-lime-100 text-lime-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <CheckSquare className="w-3 h-3" />
                              {completedSubs}/{task.subtasks.length}
                            </span>
                          )}

                          {/* Due Date Chip */}
                          <span
                            className={`text-[10px] font-medium flex items-center gap-0.5 ${
                              dueInfo.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {dueInfo.label}
                          </span>
                        </div>

                        {/* Assignee Avatars */}
                        <div className="flex items-center -space-x-1.5 shrink-0">
                          {task.assignees.map((assignee) => (
                            <UserAvatar
                              key={assignee.id}
                              name={assignee.name}
                              email={assignee.email}
                              size="xs"
                              className="ring-1 ring-white"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {listTasks.length === 0 && !activeAddListId && (
                  <button
                    onClick={() => setActiveAddListId(list.id)}
                    className="w-full py-3.5 border border-dashed border-slate-200/90 rounded-xl flex items-center justify-center text-slate-400 text-xs font-semibold hover:border-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    + Add a card
                  </button>
                )}
              </div>

              {/* Bottom Quick Add Card Bar */}
              {activeAddListId !== list.id && listTasks.length > 0 && (
                <div className="p-2 pt-0">
                  <button
                    onClick={() => setActiveAddListId(list.id)}
                    className="w-full py-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add another card</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trello Card Detail / Edit Modal */}
      <TrelloCardModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Task, TrelloList, CardColorLabel } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { TrelloCardModal } from './TrelloCardModal';
import {
  Plus,
  Clock,
  CheckSquare,
  Search,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { formatCurrency, getDaysRemaining } from '@/lib/utils';

export function TrelloBoard() {
  const {
    trelloLists,
    addTrelloList,
    deleteTrelloList,
    tasks,
    addTask,
    moveTaskToList,
    openQuickAction,
  } = useWorkspace();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick Inline Add Card per list
  const [activeAddListId, setActiveAddListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardBudget, setNewCardBudget] = useState('');

  // Quick Add List State
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  // Drag and Drop
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    setDragOverListId(listId);
  };

  const handleDrop = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskToList(taskId, listId);
    }
    setDraggedTaskId(null);
    setDragOverListId(null);
  };

  const handleCreateInlineCard = (listId: string) => {
    if (!newCardTitle.trim()) return;

    addTask({
      title: newCardTitle.trim(),
      description: '',
      listId,
      status: trelloLists.find((l) => l.id === listId)?.title || 'In Progress',
      priority: 'High',
      colorLabel: 'lime',
      budgetAmount: parseFloat(newCardBudget) || undefined,
      assignees: currentUser ? [currentUser] : [],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Trello', 'Deliverable'],
      subtasks: [{ id: `st_${Date.now()}`, title: 'Initial deliverable review', completed: false }],
    });

    setNewCardTitle('');
    setNewCardBudget('');
    setActiveAddListId(null);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    addTrelloList(newListTitle.trim());
    setNewListTitle('');
    setIsAddingList(false);
  };

  const colorPills: Record<CardColorLabel, string> = {
    lime: 'bg-lime-400',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-400',
    rose: 'bg-rose-500',
    slate: 'bg-slate-400',
  };

  const filteredTasks = tasks.filter(
    (t) =>
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tg) => tg.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="trello-section" className="space-y-3.5 select-none">
      {/* Trello Header Banner */}
      <div className="p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-lime-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-xs">
            📋
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              Collaborative Sprint Trello Board
            </h2>
            <p className="text-[10px] text-slate-400">
              Drag & drop cards across agile sprint columns with budget tags in ₹
            </p>
          </div>
        </div>

        {/* Search & Add Card button */}
        <div className="flex items-center gap-2.5">
          <div className="relative min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              placeholder="Search board cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <button
            onClick={() => openQuickAction('task')}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Trello Columns with Smooth Mobile Swipe */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 items-start touch-pan-x snap-x snap-mandatory -mx-2 px-2 sm:mx-0 sm:px-0">
        {trelloLists.map((list) => {
          const listTasks = filteredTasks.filter(
            (t) => t.listId === list.id || t.status === list.title
          );
          const isOver = dragOverListId === list.id;

          return (
            <div
              key={list.id}
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDrop={(e) => handleDrop(e, list.id)}
              className={`w-[80vw] max-w-[300px] sm:w-76 shrink-0 snap-center flex flex-col rounded-2xl bg-white border transition-all duration-150 shadow-xs ${
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

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveAddListId(activeAddListId === list.id ? null : list.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Add a card to this list"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  {trelloLists.length > 3 && (
                    <button
                      onClick={() => deleteTrelloList(list.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete List"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card List Area */}
              <div className="flex-1 p-2.5 space-y-2 max-h-[480px] overflow-y-auto">
                {/* Inline Card Creator Form */}
                {activeAddListId === list.id && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter a title for this card..."
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className="relative w-28">
                        <span className="absolute left-2 top-1 text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          placeholder="Budget"
                          value={newCardBudget}
                          onChange={(e) => setNewCardBudget(e.target.value)}
                          className="w-full pl-5 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => setActiveAddListId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCreateInlineCard(list.id)}
                          className="px-3 py-1 bg-slate-950 text-white rounded-full text-xs font-bold shadow-xs"
                        >
                          Add
                        </button>
                      </div>
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
                      className="p-3 rounded-2xl bg-white border border-slate-150 hover:border-indigo-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
                    >
                      {/* Attached Cover Image */}
                      {task.imageUrl && (
                        <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 border border-slate-100">
                          <img
                            src={task.imageUrl}
                            alt={task.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Top Label Bar */}
                      {task.colorLabel && (
                        <div
                          className={`w-8 h-1.5 rounded-full mb-2 ${
                            colorPills[task.colorLabel]
                          }`}
                        />
                      )}

                      {/* Card Title */}
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 leading-snug">
                        {task.title}
                      </h4>

                      {/* Card Notepad Notes Snippet */}
                      {(task.notepadNotes || task.description) && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {task.notepadNotes || task.description}
                        </p>
                      )}

                      {/* Bottom Row: Budget Chip in ₹, Checklist Count & Avatars */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
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
                    <span>Add card</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Another List */}
        <div className="w-76 sm:w-80 shrink-0">
          {isAddingList ? (
            <form
              onSubmit={handleCreateList}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 animate-in fade-in"
            >
              <input
                type="text"
                autoFocus
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold shadow-xs"
                >
                  Add List
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingList(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="w-full py-3.5 rounded-3xl bg-white hover:bg-slate-50 border border-dashed border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add another list</span>
            </button>
          )}
        </div>
      </div>

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

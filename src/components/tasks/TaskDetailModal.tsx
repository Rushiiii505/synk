'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import {
  CheckSquare,
  Clock,
  Trash2,
  Plus,
  Calendar,
  Tag,
  User as UserIcon,
  FileText,
  CreditCard,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { formatDate, getDaysRemaining, triggerConfetti } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const { updateTask, deleteTask, toggleSubtask, docs, expenses, setSelectedDocId, setActiveTab } = useWorkspace();
  const { users } = useAuth();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!task) return null;

  const dueInfo = getDaysRemaining(task.dueDate);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const progress = task.subtasks.length > 0 ? Math.round((completedSubtasks / task.subtasks.length) * 100) : 0;

  const priorityColors = {
    Urgent: 'rose' as const,
    High: 'amber' as const,
    Medium: 'indigo' as const,
    Low: 'slate' as const,
  };

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

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    updateTask(task.id, { priority: newPriority });
  };

  const linkedDocs = docs.filter((d) => task.relatedDocIds?.includes(d.id));
  const linkedExpenses = expenses.filter((e) => task.relatedExpenseIds?.includes(e.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Badge variant={priorityColors[task.priority]} size="sm" dot>
            {task.priority}
          </Badge>
          <span className="text-sm font-bold text-slate-100 line-clamp-1">{task.title}</span>
        </div>
      }
      description={`Created on ${formatDate(task.createdAt)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status & Priority Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Workflow Status
            </label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Priority Level
            </label>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Due Date
            </label>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={dueInfo.isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                {formatDate(task.dueDate)} ({dueInfo.label})
              </span>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Description & Context
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {task.description || 'No detailed description provided.'}
          </div>
        </div>

        {/* Assignees & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Assignees
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {task.assignees.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800"
                >
                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-medium text-slate-200">{u.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap items-center gap-1.5">
              {task.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Subtasks Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Subtasks Checklist ({completedSubtasks}/{task.subtasks.length})
            </h4>
            <span className="text-xs font-mono text-emerald-400">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {task.subtasks.map((st) => (
              <div
                key={st.id}
                onClick={() => toggleSubtask(task.id, st.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                  st.completed
                    ? 'bg-slate-950/30 border-slate-800 text-slate-500 line-through'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-200 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 pointer-events-none"
                />
                <span className="text-xs font-medium">{st.title}</span>
              </div>
            ))}
          </div>

          {/* Add subtask */}
          <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Add subtask..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Button type="submit" variant="secondary" size="xs" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add
            </Button>
          </form>
        </div>

        {/* Cross-Linked Docs & Expenses */}
        {(linkedDocs.length > 0 || linkedExpenses.length > 0) && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cross-Linked Workspace Artifacts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {linkedDocs.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDocId(d.id);
                    setActiveTab('notepad');
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-500/60 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-slate-200 font-medium truncate">{d.title}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0 ml-1" />
                </div>
              ))}

              {linkedExpenses.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => {
                    setActiveTab('finance');
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 hover:border-rose-500/60 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CreditCard className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-slate-200 font-medium truncate">
                      {exp.title} (${exp.amount})
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-rose-400 shrink-0 ml-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Task
          </Button>

          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

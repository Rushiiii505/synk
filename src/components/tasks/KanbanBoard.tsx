'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Badge } from '@/components/ui/Badge';
import {
  Clock,
  CheckCircle2,
  Plus,
  MoreHorizontal,
  FileText,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getDaysRemaining } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string; dot: string }[] = [
  { id: 'Backlog', label: 'Backlog', color: 'border-slate-800', dot: 'bg-slate-500' },
  { id: 'To Do', label: 'To Do', color: 'border-indigo-500/40', dot: 'bg-indigo-400' },
  { id: 'In Progress', label: 'In Progress', color: 'border-amber-500/40', dot: 'bg-amber-400' },
  { id: 'Review', label: 'Review', color: 'border-purple-500/40', dot: 'bg-purple-400' },
  { id: 'Completed', label: 'Completed', color: 'border-emerald-500/40', dot: 'bg-emerald-400' },
];

export function KanbanBoard({ tasks, onSelectTask }: KanbanBoardProps) {
  const { moveTaskStatus, openQuickAction } = useWorkspace();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, status);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const priorityVariants: Record<TaskPriority, 'rose' | 'amber' | 'indigo' | 'slate'> = {
    Urgent: 'rose',
    High: 'amber',
    Medium: 'indigo',
    Low: 'slate',
  };

  return (
    <div className="flex-1 flex gap-4 overflow-x-auto p-6 min-h-0 select-none">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`w-76 sm:w-80 shrink-0 flex flex-col rounded-2xl bg-slate-900/50 border transition-all duration-150 ${
              isOver ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-950/50 scale-[1.01]' : 'border-slate-800/80'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-semibold text-slate-100">{col.label}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-medium">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => openQuickAction('task')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Add task to column"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5 min-h-[150px]">
              {columnTasks.map((task) => {
                const dueInfo = getDaysRemaining(task.dueDate);
                const completedSubs = task.subtasks.filter((s) => s.completed).length;
                const progress =
                  task.subtasks.length > 0
                    ? Math.round((completedSubs / task.subtasks.length) * 100)
                    : 0;

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onSelectTask(task)}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-black/60 transition-all cursor-grab active:cursor-grabbing group relative"
                  >
                    {/* Header: Priority + Due info */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={priorityVariants[task.priority]} size="sm" dot>
                        {task.priority}
                      </Badge>

                      <span
                        className={`text-[10px] font-medium flex items-center gap-1 ${
                          dueInfo.isOverdue
                            ? 'text-rose-400 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {dueInfo.label}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white leading-snug">
                      {task.title}
                    </h4>

                    {/* Description preview */}
                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Subtask Progress Bar */}
                    {task.subtasks.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-500" />
                            <span>Subtasks</span>
                          </span>
                          <span className="font-mono">{completedSubs}/{task.subtasks.length}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer: Tags, Linked items & Assignees */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {task.relatedDocIds && task.relatedDocIds.length > 0 && (
                          <span title="Linked Document" className="text-indigo-400">
                            <FileText className="w-3 h-3" />
                          </span>
                        )}
                        {task.relatedExpenseIds && task.relatedExpenseIds.length > 0 && (
                          <span title="Linked Expense" className="text-rose-400">
                            <CreditCard className="w-3 h-3" />
                          </span>
                        )}
                        {task.tags.slice(0, 1).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* Multi-Assignee Avatars */}
                      <div className="flex items-center -space-x-1.5">
                        {task.assignees.map((assignee) => (
                          <img
                            key={assignee.id}
                            src={assignee.avatar}
                            alt={assignee.name}
                            title={assignee.name}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-900"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {columnTasks.length === 0 && (
                <div className="h-28 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-slate-600 text-xs font-medium">
                  Drop items here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

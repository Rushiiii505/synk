'use client';

import React from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Clock,
  CheckCircle2,
  MoreHorizontal,
  FileText,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { formatDate, getDaysRemaining } from '@/lib/utils';

interface TaskListViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export function TaskListView({ tasks, onSelectTask }: TaskListViewProps) {
  const { moveTaskStatus, deleteTask } = useWorkspace();

  const priorityVariants: Record<TaskPriority, 'rose' | 'amber' | 'indigo' | 'slate'> = {
    Urgent: 'rose',
    High: 'amber',
    Medium: 'indigo',
    Low: 'slate',
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">Done</th>
                <th className="py-3.5 px-4">Task Name & Tags</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assignees</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Subtasks</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                const dueInfo = getDaysRemaining(task.dueDate);
                const completedSubs = task.subtasks.filter((s) => s.completed).length;

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-800/40 transition-colors group cursor-pointer ${
                      isCompleted ? 'opacity-60 bg-slate-950/20' : ''
                    }`}
                    onClick={() => onSelectTask(task)}
                  >
                    {/* Checkbox toggle */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          moveTaskStatus(task.id, isCompleted ? 'To Do' : 'Completed')
                        }
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 hover:border-indigo-400 bg-slate-950'
                        }`}
                      >
                        {isCompleted && '✓'}
                      </button>
                    </td>

                    {/* Title & Tags */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {task.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          moveTaskStatus(task.id, e.target.value as TaskStatus)
                        }
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Backlog">Backlog</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <Badge variant={priorityVariants[task.priority]} size="sm" dot>
                        {task.priority}
                      </Badge>
                    </td>

                    {/* Assignees */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center -space-x-1.5">
                        {task.assignees.map((assignee) => (
                          <img
                            key={assignee.id}
                            src={assignee.avatar}
                            alt={assignee.name}
                            title={assignee.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-900"
                          />
                        ))}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          dueInfo.isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {dueInfo.label}
                      </span>
                    </td>

                    {/* Subtasks Progress */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-slate-400">
                        {completedSubs}/{task.subtasks.length}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/20 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

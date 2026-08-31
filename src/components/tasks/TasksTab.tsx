'use client';

import React, { useState } from 'react';
import { Task, TaskPriority } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { KanbanBoard } from './KanbanBoard';
import { TaskListView } from './TaskListView';
import { TaskDetailModal } from './TaskDetailModal';
import { Button } from '@/components/ui/Button';
import {
  Kanban,
  List,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';

export function TasksTab() {
  const { tasks, openQuickAction } = useWorkspace();
  const { users } = useAuth();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    const matchesAssignee =
      assigneeFilter === 'All' || t.assignees.some((a) => a.id === assigneeFilter);

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Control Bar: Filters & View Switcher */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        {/* Left: Search & Filter inputs */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter tasks by name, tag, or spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">🔴 Urgent</option>
            <option value="High">🟠 High</option>
            <option value="Medium">🟣 Medium</option>
            <option value="Low">⚪ Low</option>
          </select>

          {/* Assignee filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 hidden sm:block"
          >
            <option value="All">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: View Toggles & Add Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sprint status summary pills */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            {urgentCount > 0 && (
              <span className="px-2 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 font-medium">
                {urgentCount} Urgent
              </span>
            )}
            <span className="px-2 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium">
              {completedCount}/{tasks.length} Completed
            </span>
          </div>

          {/* View switcher */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Add Task Button */}
          <Button
            variant="emerald"
            size="sm"
            onClick={() => openQuickAction('task')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="h-8"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={filteredTasks} onSelectTask={handleSelectTask} />
      ) : (
        <TaskListView tasks={filteredTasks} onSelectTask={handleSelectTask} />
      )}

      {/* Detail & Edit Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}

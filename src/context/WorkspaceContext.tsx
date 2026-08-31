'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  Workspace,
  Task,
  Expense,
  ActivityItem,
  TeamInvite,
  TaskStatus,
  SplitShare,
  StickyNote,
  TrelloList,
  Doc,
} from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { generateId, triggerConfetti } from '@/lib/utils';

export type NavigationTab = 'all' | 'trello' | 'notepad' | 'finance' | 'team';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

const DEFAULT_TRELLO_LISTS: TrelloList[] = [
  { id: 'list_backlog', title: 'Ideas & Backlog', colorDot: 'bg-slate-400' },
  { id: 'list_todo', title: 'To Do', colorDot: 'bg-indigo-500' },
  { id: 'list_inprogress', title: 'In Progress', colorDot: 'bg-amber-500' },
  { id: 'list_review', title: 'Review', colorDot: 'bg-purple-500' },
  { id: 'list_done', title: 'Done', colorDot: 'bg-lime-500' },
];

interface WorkspaceContextType {
  workspaces: Workspace[];
  userWorkspaces: Workspace[];
  currentWorkspace: Workspace | null;
  hasSelectedProject: boolean;
  setHasSelectedProject: (selected: boolean) => void;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, color?: string, totalCapital?: number, monthlyBudget?: number) => Workspace;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  deleteWorkspace: (workspaceId: string) => void;
  joinWorkspaceByCode: (code: string) => boolean;

  // Trello Lists & Cards
  trelloLists: TrelloList[];
  addTrelloList: (title: string) => void;
  deleteTrelloList: (listId: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, status: TaskStatus) => void;
  moveTaskToList: (taskId: string, listId: string, statusName?: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Sticky Notepad
  stickyNotes: StickyNote[];
  addStickyNote: (note: Omit<StickyNote, 'id' | 'workspaceId' | 'updatedAt'>) => StickyNote;
  updateStickyNote: (noteId: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (noteId: string) => void;
  togglePinStickyNote: (noteId: string) => void;

  // Cashflow IN / OUT
  expenses: Expense[];
  totalIncome: number;
  totalOutflow: number;
  liquidBalance: number;
  addExpense: (expense: Omit<Expense, 'id' | 'workspaceId' | 'createdAt'>) => Expense;
  updateExpense: (expenseId: string, updates: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;
  splitExpense: (expenseId: string, splits: SplitShare[]) => void;

  // Team Invites
  invites: TeamInvite[];
  inviteMember: (email: string) => void;
  revokeInvite: (inviteId: string) => void;

  // Navigation & UI state
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activities: ActivityItem[];
  virtualCards: any[];
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  quickActionType: 'task' | 'note' | 'expense' | 'doc' | null;
  openQuickAction: (type: 'task' | 'note' | 'expense' | 'doc') => void;
  closeQuickAction: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Cloud Sync
  isCloudSynced: boolean;

  // Backward compatibility
  docs: Doc[];
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
  addDoc: (doc: any) => any;
  updateDoc: (id: string, updates: any) => void;
  deleteDoc: (id: string) => void;
  togglePinDoc: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_clean_workspaces');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const [userWorkspaceIds, setUserWorkspaceIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && currentUser?.email) {
      const saved = localStorage.getItem(`synk_user_ws_ids_${currentUser.email.toLowerCase()}`);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_clean_ws_id');
      if (saved) return saved;
    }
    return null;
  });

  const [trelloLists, setTrelloLists] = useState<TrelloList[]>(DEFAULT_TRELLO_LISTS);

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_clean_tasks');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const [allStickyNotes, setAllStickyNotes] = useState<StickyNote[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_clean_sticky_notes');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const [allExpenses, setAllExpenses] = useState<Expense[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_clean_expenses');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const [invites, setInvites] = useState<TeamInvite[]>([]);

  // Modals & UI states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'task' | 'note' | 'expense' | 'doc' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local Persistence
  useEffect(() => {
    localStorage.setItem('synk_clean_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(
        `synk_user_ws_ids_${currentUser.email.toLowerCase()}`,
        JSON.stringify(userWorkspaceIds)
      );
    }
  }, [userWorkspaceIds, currentUser?.email]);

  useEffect(() => {
    if (currentWorkspaceId) {
      localStorage.setItem('synk_clean_ws_id', currentWorkspaceId);
    } else {
      localStorage.removeItem('synk_clean_ws_id');
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    localStorage.setItem('synk_clean_tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('synk_clean_sticky_notes', JSON.stringify(allStickyNotes));
  }, [allStickyNotes]);

  useEffect(() => {
    localStorage.setItem('synk_clean_expenses', JSON.stringify(allExpenses));
  }, [allExpenses]);

  // 1. PULL CLOUD SYNC: Pull workspaces, tasks, notes, expenses from Supabase Cloud on login / device change
  useEffect(() => {
    const syncFromCloud = async () => {
      if (!currentUser) return;
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user?.user_metadata) {
          const meta = data.user.user_metadata;
          if (meta.synk_cloud_workspaces && Array.isArray(meta.synk_cloud_workspaces) && meta.synk_cloud_workspaces.length > 0) {
            setWorkspaces((prev) => {
              const map = new Map<string, Workspace>();
              prev.forEach((w) => map.set(w.id, w));
              meta.synk_cloud_workspaces.forEach((w: Workspace) => map.set(w.id, w));
              return Array.from(map.values());
            });
          }
          if (meta.synk_cloud_user_ws_ids && Array.isArray(meta.synk_cloud_user_ws_ids) && meta.synk_cloud_user_ws_ids.length > 0) {
            setUserWorkspaceIds((prev) => Array.from(new Set([...prev, ...meta.synk_cloud_user_ws_ids])));
          }
          if (meta.synk_cloud_current_ws_id) {
            setCurrentWorkspaceId((prev) => prev || meta.synk_cloud_current_ws_id);
          }
          if (meta.synk_cloud_tasks && Array.isArray(meta.synk_cloud_tasks) && meta.synk_cloud_tasks.length > 0) {
            setAllTasks((prev) => {
              const map = new Map<string, Task>();
              prev.forEach((t) => map.set(t.id, t));
              meta.synk_cloud_tasks.forEach((t: Task) => map.set(t.id, t));
              return Array.from(map.values());
            });
          }
          if (meta.synk_cloud_sticky_notes && Array.isArray(meta.synk_cloud_sticky_notes) && meta.synk_cloud_sticky_notes.length > 0) {
            setAllStickyNotes((prev) => {
              const map = new Map<string, StickyNote>();
              prev.forEach((n) => map.set(n.id, n));
              meta.synk_cloud_sticky_notes.forEach((n: StickyNote) => map.set(n.id, n));
              return Array.from(map.values());
            });
          }
          if (meta.synk_cloud_expenses && Array.isArray(meta.synk_cloud_expenses) && meta.synk_cloud_expenses.length > 0) {
            setAllExpenses((prev) => {
              const map = new Map<string, Expense>();
              prev.forEach((e) => map.set(e.id, e));
              meta.synk_cloud_expenses.forEach((e: Expense) => map.set(e.id, e));
              return Array.from(map.values());
            });
          }
          setIsCloudSynced(true);
        }
      } catch (err) {
        console.warn('Cloud sync load warning:', err);
      }
    };
    syncFromCloud();
  }, [currentUser]);

  // 2. PUSH CLOUD SYNC: Automatically persist updates to Supabase User Metadata so Phone & Laptop stay synced
  useEffect(() => {
    if (!currentUser) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await supabase.auth.updateUser({
          data: {
            synk_cloud_workspaces: workspaces,
            synk_cloud_user_ws_ids: userWorkspaceIds,
            synk_cloud_current_ws_id: currentWorkspaceId,
            synk_cloud_tasks: allTasks,
            synk_cloud_sticky_notes: allStickyNotes,
            synk_cloud_expenses: allExpenses,
          },
        });
        setIsCloudSynced(true);
      } catch (err) {
        console.warn('Cloud sync push warning:', err);
      }
    }, 800);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [workspaces, userWorkspaceIds, currentWorkspaceId, allTasks, allStickyNotes, allExpenses, currentUser]);

  const userWorkspaces = useMemo(() => {
    if (userWorkspaceIds.length === 0) {
      return workspaces;
    }
    return workspaces.filter((w) => userWorkspaceIds.includes(w.id));
  }, [workspaces, userWorkspaceIds]);

  const currentWorkspace = useMemo(() => {
    if (!currentWorkspaceId) return null;
    return workspaces.find((w) => w.id === currentWorkspaceId) || null;
  }, [workspaces, currentWorkspaceId]);

  const hasSelectedProject = Boolean(currentWorkspace);

  const tasks = useMemo(() => {
    if (!currentWorkspace) return [];
    return allTasks.filter((t) => t.workspaceId === currentWorkspace.id);
  }, [allTasks, currentWorkspace]);

  const stickyNotes = useMemo(() => {
    if (!currentWorkspace) return [];
    return allStickyNotes.filter((n) => n.workspaceId === currentWorkspace.id);
  }, [allStickyNotes, currentWorkspace]);

  const expenses = useMemo(() => {
    if (!currentWorkspace) return [];
    return allExpenses.filter((e) => e.workspaceId === currentWorkspace.id);
  }, [allExpenses, currentWorkspace]);

  // Treasury calculations (in INR ₹)
  const totalIncome = useMemo(() => {
    return expenses.filter((e) => e.type === 'IN').reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalOutflow = useMemo(() => {
    return expenses.filter((e) => e.type === 'OUT' || !e.type).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const liquidBalance = useMemo(() => {
    const baseCap = currentWorkspace?.totalCapital || 0;
    return baseCap + totalIncome - totalOutflow;
  }, [currentWorkspace, totalIncome, totalOutflow]);

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    const targetWs = workspaces.find((w) => w.id === workspaceId);
    if (targetWs) {
      addToast(`Workspace: ${targetWs.name}`, `Unique ID: ${targetWs.joinCode}`, 'info');
    }
  };

  const setHasSelectedProject = (selected: boolean) => {
    if (!selected) {
      setCurrentWorkspaceId(null);
    }
  };

  const createWorkspace = (
    name: string,
    color: string = '#84cc16',
    totalCapital: number = 1000000,
    monthlyBudget: number = 200000
  ): Workspace => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const uniqueJoinCode = `SYNK-${randomSuffix}`;

    const newWs: Workspace = {
      id: generateId('ws'),
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      joinCode: uniqueJoinCode,
      logo: '⚡',
      color,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      totalCapital,
      monthlyBudget,
    };

    setWorkspaces((prev) => [newWs, ...prev]);
    setUserWorkspaceIds((prev) => Array.from(new Set([newWs.id, ...prev])));
    setCurrentWorkspaceId(newWs.id);
    addToast('Workspace Launched! 🎉', `Share Join ID: ${uniqueJoinCode}`, 'success');
    return newWs;
  };

  const updateWorkspace = (updates: Partial<Workspace>) => {
    if (!currentWorkspace) return;
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === currentWorkspace.id ? { ...w, ...updates } : w))
    );
    addToast('Project Settings Saved', 'Workspace configuration updated', 'success');
  };

  const deleteWorkspace = (workspaceId: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
    setUserWorkspaceIds((prev) => prev.filter((id) => id !== workspaceId));
    if (currentWorkspaceId === workspaceId) {
      setCurrentWorkspaceId(null);
    }
    addToast('Workspace Removed', '', 'info');
  };

  const joinWorkspaceByCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = workspaces.find(
      (w) => w.joinCode.toUpperCase() === cleanCode || w.slug.toUpperCase() === cleanCode
    );

    if (found) {
      setUserWorkspaceIds((prev) => Array.from(new Set([found.id, ...prev])));
      setCurrentWorkspaceId(found.id);
      addToast(`Connected to ${found.name}! 🎉`, `Project ID: ${found.joinCode}`, 'success');
      return true;
    }
    return false;
  };

  const addTrelloList = (title: string) => {
    const newList: TrelloList = {
      id: generateId('list'),
      title,
      colorDot: 'bg-indigo-500',
    };
    setTrelloLists((prev) => [...prev, newList]);
    addToast('List Added', title, 'success');
  };

  const deleteTrelloList = (listId: string) => {
    setTrelloLists((prev) => prev.filter((l) => l.id !== listId));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>): Task => {
    if (!currentWorkspace) throw new Error('No workspace active');
    const newTask: Task = {
      ...taskData,
      id: generateId('task'),
      workspaceId: currentWorkspace.id,
      listId: taskData.listId || trelloLists[0]?.id || 'list_backlog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllTasks((prev) => [newTask, ...prev]);
    addToast('Card Added to Board', newTask.title, 'success');
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
          if ((updates.status === 'Completed' || updates.status === 'Done' || updates.status === '✅ Done') && t.status !== 'Completed' && t.status !== 'Done') {
            triggerConfetti();
            addToast('Task Completed! 🎉', t.title, 'success');
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('Card Removed', '', 'info');
  };

  const moveTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const moveTaskToList = (taskId: string, listId: string, statusName?: string) => {
    const targetList = trelloLists.find((l) => l.id === listId);
    const newStatus = statusName || targetList?.title || 'In Progress';
    updateTask(taskId, { listId, status: newStatus });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  const addStickyNote = (noteData: Omit<StickyNote, 'id' | 'workspaceId' | 'updatedAt'>): StickyNote => {
    if (!currentWorkspace) throw new Error('No workspace active');
    const newNote: StickyNote = {
      ...noteData,
      id: generateId('note'),
      workspaceId: currentWorkspace.id,
      updatedAt: new Date().toISOString(),
    };
    setAllStickyNotes((prev) => [newNote, ...prev]);
    addToast('Note Posted', newNote.title, 'success');
    return newNote;
  };

  const updateStickyNote = (noteId: string, updates: Partial<StickyNote>) => {
    setAllStickyNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteStickyNote = (noteId: string) => {
    setAllStickyNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const togglePinStickyNote = (noteId: string) => {
    setAllStickyNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'workspaceId' | 'createdAt'>): Expense => {
    if (!currentWorkspace) throw new Error('No workspace active');
    const newExpense: Expense = {
      ...expenseData,
      id: generateId('exp'),
      workspaceId: currentWorkspace.id,
      currency: 'INR',
      createdAt: new Date().toISOString(),
    };
    setAllExpenses((prev) => [newExpense, ...prev]);
    const isIncome = newExpense.type === 'IN';
    addToast(
      isIncome ? 'Money IN Added (+)' : 'Money OUT Added (-)',
      `${newExpense.title} — ₹${newExpense.amount.toLocaleString('en-IN')}`,
      isIncome ? 'success' : 'info'
    );
    return newExpense;
  };

  const updateExpense = (expenseId: string, updates: Partial<Expense>) => {
    setAllExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? { ...e, ...updates } : e))
    );
  };

  const deleteExpense = (expenseId: string) => {
    setAllExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  const splitExpense = (expenseId: string, splits: SplitShare[]) => {
    setAllExpenses((prev) =>
      prev.map((e) => {
        if (e.id === expenseId) {
          return { ...e, splits };
        }
        return e;
      })
    );
    addToast('Expense Split Saved', `Split with ${splits.length} members`, 'success');
  };

  const inviteMember = (email: string) => {
    if (!currentWorkspace) return;
    const newInvite: TeamInvite = {
      id: generateId('inv'),
      workspaceId: currentWorkspace.id,
      email,
      invitedBy: currentUser?.name || 'Collaborator',
      inviteToken: `${currentWorkspace.joinCode}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setInvites((prev) => [newInvite, ...prev]);
    addToast('Invitation Link Ready', `Share code ${currentWorkspace.joinCode} with ${email}`, 'success');
  };

  const revokeInvite = (inviteId: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  };

  const openQuickAction = (type: 'task' | 'note' | 'expense' | 'doc') => {
    setQuickActionType(type);
    setIsQuickActionOpen(true);
  };

  const closeQuickAction = () => {
    setIsQuickActionOpen(false);
    setQuickActionType(null);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        userWorkspaces,
        currentWorkspace,
        hasSelectedProject,
        setHasSelectedProject,
        switchWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        joinWorkspaceByCode,

        trelloLists,
        addTrelloList,
        deleteTrelloList,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        moveTaskToList,
        toggleSubtask,

        stickyNotes,
        addStickyNote,
        updateStickyNote,
        deleteStickyNote,
        togglePinStickyNote,

        expenses,
        totalIncome,
        totalOutflow,
        liquidBalance,
        addExpense,
        updateExpense,
        deleteExpense,
        splitExpense,

        invites,
        inviteMember,
        revokeInvite,

        activeTab: 'all',
        setActiveTab: () => {},
        activities: [],
        virtualCards: [],
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickActionOpen,
        setIsQuickActionOpen,
        quickActionType,
        openQuickAction,
        closeQuickAction,

        toasts,
        addToast,
        removeToast,
        isCloudSynced,

        // Docs backward compatibility
        docs: [],
        selectedDocId: null,
        setSelectedDocId: () => {},
        addDoc: (d: any) => d,
        updateDoc: () => {},
        deleteDoc: () => {},
        togglePinDoc: () => {},
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

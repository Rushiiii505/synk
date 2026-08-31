export type Role = 'Owner' | 'Admin' | 'Member' | 'Viewer';

export type UserStatus = 'online' | 'focusing' | 'meeting' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: Role;
  status: UserStatus;
  customStatus?: string;
  currentActivity?: string;
  color: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  joinCode: string; // e.g. "SYNK-4821"
  logo: string;
  color: string;
  plan?: 'Starter' | 'Pro' | 'Enterprise';
  createdAt: string;
  memberCount: number;
  totalCapital: number; // in INR
  monthlyBudget: number; // in INR
}

export type CardColorLabel = 'lime' | 'purple' | 'blue' | 'amber' | 'rose' | 'slate';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Completed' | string;

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TrelloList {
  id: string;
  title: string;
  colorDot?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  listId?: string;
  title: string;
  description: string;
  notepadNotes?: string;
  status: TaskStatus;
  priority: TaskPriority;
  colorLabel?: CardColorLabel;
  budgetAmount?: number; // in INR (₹)
  imageUrl?: string; // Attached Image / Wireframe
  attachments?: string[];
  assignees: User[];
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  relatedDocIds?: string[];
  relatedExpenseIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type StickyNoteColor = 'yellow' | 'mint' | 'lavender' | 'sky' | 'peach' | 'white';

export interface StickyNote {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  color: StickyNoteColor;
  isPinned: boolean;
  imageUrl?: string; // Attached Image
  author: User;
  updatedAt: string;
  tags?: string[];
}

export type ExpenseType = 'IN' | 'OUT'; // Money IN (Income/Funding) vs Money OUT (Expense)

export type ExpenseCategory = 
  | 'Income / Funding'
  | 'Client Payout'
  | 'Software & AI' 
  | 'Marketing & Ads' 
  | 'Operations & Legal' 
  | 'Inventory & Sourcing' 
  | 'Team & Payroll'
  | 'Miscellaneous';

export type PaymentStatus = 'Paid' | 'Pending' | 'Reimbursed';

export interface SplitShare {
  userId: string;
  userName: string;
  userAvatar: string;
  amount: number; // in INR
  paid: boolean;
}

export interface Expense {
  id: string;
  workspaceId: string;
  type: ExpenseType; // 'IN' or 'OUT'
  title: string;
  amount: number; // in INR (₹)
  currency: string;
  category: ExpenseCategory;
  date: string;
  paidBy: User;
  paymentMethod: 'UPI / GPay' | 'Corporate Card' | 'Wire Transfer' | 'NetBanking' | 'Razorpay / Stripe' | 'Apple Pay';
  status: PaymentStatus;
  receiptUrl?: string; // Attached Invoice Receipt
  notes?: string;
  splits?: SplitShare[];
  createdAt: string;
}

export interface VirtualCard {
  id: string;
  name: string;
  brand: 'Apple' | 'Visa' | 'Mastercard' | 'RuPay';
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  color: 'purple' | 'lime' | 'blue' | 'black';
  subscriptionMonthly?: number;
  subscriptionService?: string;
  balance: number;
  limit: number;
}

export interface ActivityItem {
  id: string;
  workspaceId: string;
  user: User;
  action: 'created_task' | 'completed_task' | 'logged_expense' | 'updated_doc' | 'joined_team' | 'split_expense' | 'created_note';
  targetTitle: string;
  targetType: 'task' | 'doc' | 'expense' | 'member' | 'note';
  timestamp: string;
  details?: string;
}

export interface TeamInvite {
  id: string;
  workspaceId: string;
  email: string;
  role?: Role;
  invitedBy: string;
  inviteToken: string;
  createdAt: string;
  status: 'pending' | 'accepted';
}

export type DocCategory = 'Engineering' | 'Product' | 'Operations' | 'Marketing' | 'General';
export interface Doc {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  category: DocCategory;
  icon?: string;
  isPinned: boolean;
  author: User;
  lastEditedBy: User;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

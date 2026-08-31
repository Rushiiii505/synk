'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserStatus } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  allUsers: User[];
  setCurrentUser: (user: User | null) => void;
  switchUser: (userId: string) => void;
  updateUserStatus: (status: UserStatus, customStatus?: string) => void;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isLiveSupabase: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_real_users');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synk_real_current_user');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return null;
  });

  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  useEffect(() => {
    localStorage.setItem('synk_real_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('synk_real_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('synk_real_current_user');
    }
  }, [currentUser]);

  // Sync Supabase Auth Session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setIsLiveSupabase(true);
          const sbUser = data.session.user;
          const cleanEmail = sbUser.email || 'user@synk.app';
          const cleanName = sbUser.user_metadata?.full_name || cleanEmail.split('@')[0];

          const existing = users.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
          if (existing) {
            setCurrentUser(existing);
          } else {
            const newUser: User = {
              id: sbUser.id,
              name: cleanName,
              email: cleanEmail,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
              status: 'online',
              color: '#84cc16',
            };
            setUsers((prev) => [...prev, newUser]);
            setCurrentUser(newUser);
          }
        }
      } catch (err) {
        console.warn('Supabase session info:', err);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLiveSupabase(true);
        const sbUser = session.user;
        const cleanEmail = sbUser.email || 'user@synk.app';
        const cleanName = sbUser.user_metadata?.full_name || cleanEmail.split('@')[0];

        const existing = users.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
        if (existing) {
          setCurrentUser(existing);
        } else {
          const newUser: User = {
            id: sbUser.id,
            name: cleanName,
            email: cleanEmail,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
            status: 'online',
            color: '#84cc16',
          };
          setUsers((prev) => [...prev, newUser]);
          setCurrentUser(newUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const updateUserStatus = (status: UserStatus, customStatus?: string) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        status,
        customStatus: customStatus !== undefined ? customStatus : prev.customStatus,
      };
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  const signUp = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];

    try {
      if (password) {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName },
          },
        });
        if (error && !error.message.includes('already registered')) {
          console.warn('Supabase signup notice:', error.message);
        }
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        status: 'online',
        color: '#84cc16',
      };

      setUsers((prev) => {
        const filtered = prev.filter((u) => u.email !== cleanEmail);
        return [...filtered, newUser];
      });
      setCurrentUser(newUser);
      return { success: true };
    } catch (err: any) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        status: 'online',
        color: '#84cc16',
      };

      setUsers((prev) => [...prev.filter((u) => u.email !== cleanEmail), newUser]);
      setCurrentUser(newUser);
      return { success: true };
    }
  };

  const signIn = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (password) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) {
          console.warn('Supabase signin notice:', error.message);
        }
      }

      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setCurrentUser(existing);
        return { success: true };
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        status: 'online',
        color: '#84cc16',
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true };
    } catch (err: any) {
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setCurrentUser(existing);
        return { success: true };
      }
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out:', err);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        users,
        allUsers: users,
        setCurrentUser,
        switchUser: (userId: string) => {
          const found = users.find((u) => u.id === userId);
          if (found) setCurrentUser(found);
        },
        updateUserStatus,
        signUp,
        signIn,
        signOut,
        isLiveSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

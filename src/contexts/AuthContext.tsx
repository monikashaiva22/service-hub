import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { findUserByEmail, initStore } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initStore();
    const saved = localStorage.getItem('vsbs_current_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email: string, password: string): string | null => {
    const found = findUserByEmail(email);
    if (!found) return 'User not found';
    if (found.password !== password) return 'Invalid password';
    setUser(found);
    localStorage.setItem('vsbs_current_user', JSON.stringify(found));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vsbs_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChangedListener, signOut } from '@/lib/firebase/auth';
import { apiFetch } from '@/lib/api';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string | null;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserRole: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  updateUserRole: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserRole = async (role: string) => {
    if (!user) return;
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, role }),
      });

      if (response.ok) {
        setUser({ ...user, role });
      }
    } catch (error) {
      console.error('Update role error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await apiFetch('/api/auth/me', { method: 'DELETE' });
    } catch (error) {
      console.error('Session clear error:', error);
    }
    try {
      await signOut();
    } catch (error) {
      console.error('Firebase sign out error:', error);
    }
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionUser = await apiFetch<UserProfile | null>('/api/auth/me');
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChangedListener(async (fbUser) => {
      if (fbUser) {
        try {
          const userData = await apiFetch<UserProfile>('/api/auth/me');
          if (userData) {
            setUser(userData);
          } else {
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
              photoURL: fbUser.photoURL,
              role: null,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: null,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, updateUserRole }}>
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

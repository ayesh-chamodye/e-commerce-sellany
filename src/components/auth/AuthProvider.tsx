'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { listenToAuth, getRedirectUser } from '@/lib/firebase/auth';

interface User {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, firebaseUser: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveSession = async (fbUser: FirebaseUser | null) => {
    setFirebaseUser(fbUser);
    if (fbUser) {
      try {
        const intendedRole = sessionStorage.getItem('sellany_intended_role');
        const url = intendedRole ? `/api/auth/me?role=${encodeURIComponent(intendedRole)}` : '/api/auth/me';
        sessionStorage.removeItem('sellany_intended_role');

        const idToken = await fbUser.getIdToken(true);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${idToken}` },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          const text = await res.text();
          console.error('Failed to load user profile', res.status, text);
          setUser(null);
        }
      } catch (error) {
        console.error('Session resolution error:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const resolveSession = async (fbUser: FirebaseUser | null) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const intendedRole = sessionStorage.getItem('sellany_intended_role');
          const url = intendedRole ? `/api/auth/me?role=${encodeURIComponent(intendedRole)}` : '/api/auth/me';
          sessionStorage.removeItem('sellany_intended_role');

          const idToken = await fbUser.getIdToken(true);
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${idToken}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const data = await res.json();
            if (mounted) {
              setUser(data.user);
            }
          } else {
            if (mounted) {
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Session resolution error:', error);
          if (mounted) {
            setUser(null);
          }
        }
      } else {
        if (mounted) {
          setUser(null);
        }
      }
      if (mounted) {
        setLoading(false);
      }
    };

    const init = async () => {
      try {
        const redirectResult = await getRedirectUser();
        console.log('Redirect result:', redirectResult);
        if (redirectResult && mounted) {
          await resolveSession(redirectResult);
          return;
        }
      } catch (error) {
        console.error('getRedirectResult error:', error);
      }

      const unsubscribe = listenToAuth(async (fbUser) => {
        console.log('Auth state changed:', fbUser);
        if (mounted) {
          await resolveSession(fbUser);
        }
      });

      return unsubscribe;
    };

    let cleanup: (() => void) | undefined;

    init().then((unsub) => {
      if (typeof unsub === 'function') {
        cleanup = unsub;
      }
    });

    return () => {
      mounted = false;
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return <AuthContext.Provider value={{ user, firebaseUser, loading }}>{children}</AuthContext.Provider>;
}

export function useSession() {
  return useContext(AuthContext);
}

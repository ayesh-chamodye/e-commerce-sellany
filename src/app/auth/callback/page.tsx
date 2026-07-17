'use client';

import { useEffect } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { saveUserRole } from '@/lib/firebase/register';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const startAuth = async () => {
      const alreadyRedirecting = sessionStorage.getItem('sellany_google_redirecting');
      if (!alreadyRedirecting) {
        sessionStorage.setItem('sellany_google_redirecting', 'true');
        await signInWithGoogle();
      }
    };
    startAuth();
  }, []);

  useEffect(() => {
    const finish = async () => {
      if (!loading) {
        if (user) {
          const pendingRole = sessionStorage.getItem('sellany_pending_role') as 'buyer' | 'seller' | null;
          if (pendingRole) {
            await saveUserRole(user, pendingRole);
            sessionStorage.removeItem('sellany_pending_role');
          }
          sessionStorage.removeItem('sellany_google_redirecting');
          window.location.href = '/dashboard';
        } else {
          sessionStorage.removeItem('sellany_google_redirecting');
          window.location.href = '/auth/signin';
        }
      }
    };
    finish();
  }, [user, loading]);

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-sm text-gray-600">Completing sign in...</div>
    </div>
  );
}

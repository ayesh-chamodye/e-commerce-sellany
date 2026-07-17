'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      window.location.href = '/auth/signin';
      return;
    }

    const target = user.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';
    window.location.href = target;
  }, [user, loading]);

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-sm text-gray-600">Redirecting to your dashboard...</div>
    </div>
  );
}


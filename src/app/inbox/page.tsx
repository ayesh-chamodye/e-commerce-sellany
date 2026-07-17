'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function InboxPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/signin';
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-600">Your messages and conversations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don&apos;t have any messages yet.</p>
          <p className="text-sm text-gray-400">Start a conversation from a listing page</p>
        </div>
      </div>
    </div>
  );
}

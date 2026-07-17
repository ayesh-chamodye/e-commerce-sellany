'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function OrdersPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
          <a href="/marketplace" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Browse Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}

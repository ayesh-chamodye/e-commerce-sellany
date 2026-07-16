'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { updateUserRole } from '@/app/actions/updateRole';
import type { Session } from 'next-auth';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const user = session.user as any;
      if (user.role && user.role !== 'buyer') {
        router.push('/');
      }
    }
  }, [session, status, router]);

  const handleRoleUpdate = async () => {
    if (!session?.user) return;
    setUpdating(true);
    
    try {
      await updateUserRole((session.user as any).id, selectedRole);
      router.push('/');
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SellAny!</h2>
          <p className="text-gray-600">Choose how you want to use the platform</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setSelectedRole('buyer')}
              className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                selectedRole === 'buyer'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedRole === 'buyer' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">I want to buy</h3>
                  <p className="text-sm text-gray-600">Browse and purchase services, goods, and accounts</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('seller')}
              className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                selectedRole === 'seller'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedRole === 'seller' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">I want to sell</h3>
                  <p className="text-sm text-gray-600">List your services, goods, or accounts for sale</p>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={handleRoleUpdate}
            disabled={updating}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {updating ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

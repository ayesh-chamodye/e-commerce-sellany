'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, loading, signOut: authSignOut } = useAuth();

  const handleSignOut = async () => {
    await authSignOut();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SellAny</h1>
            {user && !loading && (
              <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || user.email}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user && !loading ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <a
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

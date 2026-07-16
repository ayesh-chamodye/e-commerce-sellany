'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/firebase/auth';

export function Navbar() {
  const { user, loading } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profile = user;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900">SellAny</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/marketplace" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Marketplace
              </Link>
              {profile?.role === 'seller' && (
                <>
                  <Link href="/dashboard/seller" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/list/create" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Sell
                  </Link>
                </>
              )}
              {profile?.role === 'buyer' && (
                <Link href="/dashboard/buyer" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
              )}
              <Link href="/inbox" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Inbox
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user && !loading && (
              <div className="flex items-center gap-4">
                <Link href="/list/create" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Start Selling
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    {profile?.image ? (
                      <img src={profile.image} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {profile?.name?.charAt(0) || user.email?.charAt(0)}
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/dashboard/seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Dashboard
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Orders
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!user && !loading && (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signin" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/marketplace" className="block text-sm font-medium text-gray-700 hover:text-indigo-600">
              Marketplace
            </Link>
            {profile?.role === 'seller' && (
              <>
                <Link href="/dashboard/seller" className="block text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <Link href="/list/create" className="block text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Sell
                </Link>
              </>
            )}
            <Link href="/inbox" className="block text-sm font-medium text-gray-700 hover:text-indigo-600">
              Inbox
            </Link>
            {!user && (
              <Link href="/auth/signin" className="block text-sm font-medium text-indigo-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

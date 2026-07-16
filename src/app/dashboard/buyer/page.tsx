'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Order, Favorite } from '@/types/database';

export default function BuyerDashboardPage() {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [ordersRes, favoritesRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*, seller:profiles(*), listing:listings(*)')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('favorites')
          .select('*, listing:listings(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (favoritesRes.data) setFavorites(favoritesRes.data);
      setDataLoading(false);
    };

    fetchData();
  }, [user, supabase]);

  if (loading || dataLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
        <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your orders and favorites</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
            <span className="text-sm text-gray-500">{orders.length} orders</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link href="/marketplace" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {order.listing?.images?.[0] && (
                          <img src={order.listing.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{order.listing?.title}</h3>
                        <p className="text-sm text-gray-500">Seller: {order.seller?.full_name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium text-gray-900">${order.total_amount}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favorites */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Favorites</h2>
            <span className="text-sm text-gray-500">{favorites.length} items</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {favorites.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No favorites yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {favorites.map((fav) => (
                  <Link
                    key={fav.id}
                    href={`/services/${fav.listing?.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {fav.listing?.images?.[0] && (
                        <img src={fav.listing.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{fav.listing?.title}</h3>
                      <p className="text-sm text-indigo-600 font-medium">${fav.listing?.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

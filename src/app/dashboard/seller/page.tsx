'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Listing, Order } from '@/types/database';

export default function SellerDashboardPage() {
  const { user, profile, loading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalListings: 0, totalSales: 0, totalRevenue: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user || profile?.role !== 'seller') return;

    const fetchData = async () => {
      const [listingsRes, ordersRes] = await Promise.all([
        supabase
          .from('listings')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('*, buyer:profiles(*), listing:listings(*)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (listingsRes.data) {
        setListings(listingsRes.data);
        setStats({
          totalListings: listingsRes.data.length,
          totalSales: listingsRes.data.reduce((sum, l) => sum + l.sales, 0),
          totalRevenue: listingsRes.data.reduce((sum, l) => sum + l.sales * l.price, 0),
        });
      }
      if (ordersRes.data) setOrders(ordersRes.data);
      setDataLoading(false);
    };

    fetchData();
  }, [user, profile, supabase]);

  if (loading || dataLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'seller') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You need seller permissions to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your listings and orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Listings</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-indigo-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
            <Link href="/list/create" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              + New Listing
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {listings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No listings yet</p>
                <Link href="/list/create" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Create your first listing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images?.[0] && (
                        <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                      <p className="text-sm text-gray-500">${listing.price} • {listing.sales} sales</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      {order.buyer?.avatar_url && (
                        <img src={order.buyer.avatar_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{order.buyer?.full_name}</h3>
                      <p className="text-sm text-gray-500 truncate">{order.listing?.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total_amount}</p>
                      <span className={`text-xs font-medium ${
                        order.status === 'completed' ? 'text-green-600' :
                        order.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

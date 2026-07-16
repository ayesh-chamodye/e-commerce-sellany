'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Listing, Category } from '@/types/database';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const [listingsRes, categoriesRes] = await Promise.all([
        supabase
          .from('listings')
          .select('*, seller:profiles(*), category:categories(*)')
          .eq('status', 'active')
          .eq('featured', true)
          .limit(8),
        supabase.from('categories').select('*').limit(8),
      ]);

      if (listingsRes.data) setFeaturedListings(listingsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Buy & Sell Services,<br />
              Goods & Accounts
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              The all-in-one marketplace where talented sellers meet buyers. 
              Find professional services, unique products, or sell your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/list/create"
                className="px-8 py-4 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors border border-indigo-500"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find exactly what you need across our diverse categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/marketplace?category=${category.slug}`}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  {category.icon && <span className="text-2xl">{category.icon}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover top-rated services and products from our best sellers
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/services/${listing.id}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {listing.featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-md">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(listing.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({listing.review_count})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        {listing.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-indigo-600">${listing.discount_price}</span>
                            <span className="text-sm text-gray-500 line-through">${listing.price}</span>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              -{listing.discount_percentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-indigo-600">${listing.price}</span>
                        )}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                        {listing.seller?.avatar_url && (
                          <img src={listing.seller.avatar_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Listings
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start buying or selling in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create an Account</h3>
              <p className="text-gray-600">Sign up with Google in seconds and set up your profile as a buyer or seller.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse or List</h3>
              <p className="text-gray-600">Explore thousands of services and products, or create your own listings with images and videos.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Trade</h3>
              <p className="text-gray-600">Message sellers, place orders, and leave reviews. It's that simple!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers and sellers on SellAny. Create your account today and start exploring.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

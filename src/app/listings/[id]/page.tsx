'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, isInCart, getCount } = useCart();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        const data = (await response.json()) as Listing;
        setListing(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load listing';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!listing) return;
    await addItem(listing);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!listing) return;
    await addItem(listing);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-600">Loading listing...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-red-600">{error || 'Listing not found'}</div>
      </div>
    );
  }

  const inCart = isInCart(listing.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              width={800}
              height={600}
              className="w-full h-96 object-cover rounded-xl"
              unoptimized
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-6xl">📦</span>
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <span className="text-sm text-indigo-600 font-medium capitalize bg-indigo-50 px-3 py-1 rounded-full">
              {listing.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>

          <div className="text-4xl font-bold text-indigo-600 mb-6">${listing.price}</div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{listing.description || 'No description provided.'}</p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {listing.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{listing.sellerName}</p>
                <p className="text-sm text-gray-500">Seller</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBuyNow}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex-1 px-6 py-3 border font-medium rounded-lg transition-colors ${
                addedToCart || inCart
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {addedToCart ? 'Added!' : inCart ? 'In Cart' : 'Add to Cart'}
            </button>
            {user && listing.sellerId === user.uid && (
              <Link
                href={`/listings/${listing.id}/edit`}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Edit
              </Link>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/cart"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Cart ({getCount()})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

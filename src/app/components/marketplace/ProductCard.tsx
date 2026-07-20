'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductCardProps {
  listing: Listing;
}

export function ProductCard({ listing }: ProductCardProps) {
  const router = useRouter();
  const { addItem, isInCart, getCount } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(listing);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(listing);
    router.push('/checkout');
  };

  const inCart = isInCart(listing.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/listings/${listing.id}`} className="block">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/listings/${listing.id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
              {listing.title}
            </h3>
          </Link>
          <span className="text-lg font-bold text-indigo-600 ml-2">${listing.price}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{listing.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
            {listing.category}
          </span>
          <span className="text-xs text-gray-500">by {listing.sellerName}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBuyNow}
            className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className={`flex-1 px-3 py-2 border text-sm font-medium rounded-lg transition-colors ${
              addedToCart || inCart
                ? 'border-green-500 text-green-700 bg-green-50'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {addedToCart ? 'Added!' : inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

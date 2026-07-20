'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getCount, syncCartFromServer } = useCart();
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      await syncCartFromServer();
      setLoading(false);
    };
    loadCart();
  }, [syncCartFromServer]);

  const handleRemove = async (listingId: string) => {
    setRemovingId(listingId);
    await removeItem(listingId);
    setRemovingId(null);
  };

  const handleQuantityChange = async (listingId: string, delta: number) => {
    const item = items.find((i) => i.listingId === listingId);
    if (!item) return;
    await updateQuantity(listingId, item.quantity + delta);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-600">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({getCount()} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex gap-4 bg-white border border-gray-200 rounded-lg p-4 transition-opacity ${
                removingId === item.listingId ? 'opacity-50' : ''
              }`}
            >
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {item.listing.images && item.listing.images.length > 0 ? (
                  <Image
                    src={item.listing.images[0]}
                    alt={item.listing.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    📦
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/listings/${item.listing.id}`}
                  className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2"
                >
                  {item.listing.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.listing.sellerName}</p>
                <p className="text-lg font-bold text-indigo-600 mt-2">${item.listing.price}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.listingId, -1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.listingId, 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.listingId)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ${(item.listing.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full block text-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/marketplace"
              className="w-full block text-center mt-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

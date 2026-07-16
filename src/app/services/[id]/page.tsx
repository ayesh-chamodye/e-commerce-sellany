'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Listing, Review, Order } from '@/types/database';
import Image from 'next/image';

export default function ServiceDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const { user, profile } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchListing = async () => {
      const { data } = await supabase
        .from('listings')
        .select('*, seller:profiles(*), category:categories(*)')
        .eq('id', params.id)
        .single();

      if (data) {
        setListing(data);
        
        // Increment views
        await supabase
          .from('listings')
          .update({ views: data.views + 1 })
          .eq('id', params.id);
      }

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, reviewer:profiles(*)')
        .eq('listing_id', params.id)
        .order('created_at', { ascending: false });

      if (reviewsData) setReviews(reviewsData);

      setLoading(false);
    };

    fetchListing();
  }, [params.id, supabase]);

  const handleInquiry = async () => {
    if (!user || !inquiryMessage.trim()) return;
    setSubmitting(true);

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: listing?.seller_id,
      listing_id: listing?.id,
      subject: `Inquiry about ${listing?.title}`,
      content: inquiryMessage,
    });

    setInquiryMessage('');
    setShowInquiryForm(false);
    setSubmitting(false);
    alert('Message sent to seller!');
  };

  const handleBuy = async () => {
    if (!user) {
      alert('Please sign in to purchase');
      return;
    }
    setOrderLoading(true);

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        seller_id: listing?.seller_id,
        listing_id: listing?.id,
        price: listing?.discount_price || listing?.price,
        quantity: 1,
        total_amount: listing?.discount_price || listing?.price,
      })
      .select()
      .single();

    setOrderLoading(false);
    
    if (order) {
      alert('Order placed successfully! Check your orders.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
        <Link href="/marketplace" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const price = listing.discount_price || listing.price;
  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              {listing.images?.[selectedImage] ? (
                <Image
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-indigo-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          {(listing.youtube_url || listing.video_url) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video</h3>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {listing.youtube_url ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${listing.youtube_url.split('watch?v=')[1] || listing.youtube_url.split('/').pop()}`}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video controls className="w-full h-full">
                    <source src={listing.video_url!} />
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
            
            {listing.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {listing.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              {listing.delivery_time && (
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="font-medium text-gray-900">{listing.delivery_time} days</p>
                </div>
              )}
              {listing.revisions && (
                <div>
                  <p className="text-sm text-gray-500">Revisions</p>
                  <p className="font-medium text-gray-900">{listing.revisions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {review.reviewer?.avatar_url && (
                          <Image src={review.reviewer.avatar_url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{review.reviewer?.full_name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {review.content && <p className="text-gray-700">{review.content}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Purchase Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="mb-6">
              {listing.discount_price ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-indigo-600">${listing.discount_price}</span>
                  <span className="text-xl text-gray-500 line-through">${listing.price}</span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Save {listing.discount_percentage}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-indigo-600">${listing.price}</span>
              )}
            </div>

            {!isOwner && (
              <div className="space-y-3">
                <button
                  onClick={handleBuy}
                  disabled={orderLoading || listing.status !== 'active'}
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {orderLoading ? 'Processing...' : 'Buy Now'}
                </button>
                <button
                  onClick={() => setShowInquiryForm(!showInquiryForm)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Send Inquiry
                </button>
              </div>
            )}

            {isOwner && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">This is your listing</p>
              </div>
            )}

            {showInquiryForm && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Write your message to the seller..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
                <button
                  onClick={handleInquiry}
                  disabled={submitting || !inquiryMessage.trim()}
                  className="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">Seller</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                  {listing.seller?.avatar_url && (
                    <Image src={listing.seller.avatar_url} alt="" fill className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{listing.seller?.full_name}</p>
                  <p className="text-sm text-gray-500">{listing.sales} sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

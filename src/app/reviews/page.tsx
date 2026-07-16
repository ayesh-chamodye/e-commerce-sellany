import { Suspense } from 'react';
import ReviewsForm from './ReviewsForm';

export default function ReviewsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <ReviewsFormWrapper />
    </Suspense>
  );
}

function ReviewsFormWrapper() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No order specified</h2>
        <p className="text-gray-600">Please select an order to review</p>
      </div>
    );
  }

  return <ReviewsForm orderId={orderId} />;
}

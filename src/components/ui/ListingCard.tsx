import Link from 'next/link';
import Image from 'next/image';

interface ListingCardProps {
  listing: any;
}

export function ListingCard({ listing }: ListingCardProps) {
  const listingId = listing._id || listing.id;

  return (
    <Link
      href={`/services/${listingId}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-md capitalize">
          {listing.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{listing.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-sm text-gray-500">({listing.reviewCount || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {listing.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-indigo-600">${listing.discountPrice}</span>
                <span className="text-sm text-gray-500 line-through">${listing.price}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  -{listing.discountPercentage}%
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-indigo-600">${listing.price}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{listing.sales || 0} sales</span>
        </div>
      </div>
    </Link>
  );
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Listing } from '@/models/Listing';
import { Review } from '@/models/Review';
import { User } from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const listing = await Listing.findById(id).lean();
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const seller = await User.findById(listing.sellerId).select('name email image').lean();
    const reviews = await Review.find({ listingId: id })
      .sort({ createdAt: -1 })
      .populate('reviewerId', 'name email image')
      .lean();

    return NextResponse.json({ ...listing, seller, reviews });
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

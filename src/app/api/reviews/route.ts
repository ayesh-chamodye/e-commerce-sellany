import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Review } from '@/models/Review';
import { Listing } from '@/models/Listing';
import { Order } from '@/models/Order';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (listingId) {
      const reviews = await Review.find({ listingId })
        .sort({ createdAt: -1 })
        .populate('reviewerId', 'name email image')
        .lean();
      return NextResponse.json(reviews);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();
    const userId = session.user.id;

    const order = await Order.findById(data.orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const revieweeId = userId === order.buyerId ? order.sellerId : order.buyerId;

    const review = await Review.create({
      ...data,
      reviewerId: userId,
      revieweeId,
    });

    const avgRating = await Review.aggregate([
      { $match: { listingId: data.listingId } },
      { $group: { _id: '$listingId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (avgRating.length > 0) {
      await Listing.findByIdAndUpdate(data.listingId, {
        rating: avgRating[0].avg,
        reviewCount: avgRating[0].count,
      });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Favorite } from '@/models/Favorite';
import { Listing } from '@/models/Listing';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const favorites = await Favorite.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .populate('listingId')
      .lean();

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { listingId } = await request.json();
    const userId = session.user.id;

    const existing = await Favorite.findOne({ userId, listingId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return NextResponse.json({ favorited: false });
    }

    await Favorite.create({ userId, listingId });
    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const featured = searchParams.get('featured');

    let query: any = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }
    if (featured === 'true') {
      query.featured = true;
    }

    let sort: any = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    if (sortBy === 'price_desc') sort = { price: -1 };

    const listings = await Listing.find(query)
      .sort(sort)
      .limit(50)
      .lean();

    const listingsWithSeller = await Promise.all(
      listings.map(async (listing) => {
        const seller = await User.findById(listing.sellerId).select('name email image').lean();
        return { ...listing, seller };
      })
    );

    return NextResponse.json(listingsWithSeller);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    if (user.role !== 'seller') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const data = await request.json();
    
    const listing = await Listing.create({
      ...data,
      sellerId: user.id,
      views: 0,
      sales: 0,
      rating: 0,
      reviewCount: 0,
      featured: false,
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Failed to create listing:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

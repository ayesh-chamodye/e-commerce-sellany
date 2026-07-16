import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Order } from '@/models/Order';
import { Listing } from '@/models/Listing';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'buyer';
    const userId = session.user.id;

    const query = role === 'seller' ? { sellerId: userId } : { buyerId: userId };
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('buyerId', 'name email image')
      .populate('sellerId', 'name email image')
      .populate('listingId')
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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
    
    const order = await Order.create({
      ...data,
      buyerId: userId,
    });

    await Listing.findByIdAndUpdate(data.listingId, { $inc: { sales: 1 } });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

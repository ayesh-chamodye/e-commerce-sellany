import { NextResponse } from 'next/server';
import { getDocument } from '@/lib/firebase/firestore';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await getDocument<Record<string, unknown>>(`listings/${id}`);

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const sellerId = (listing as Record<string, unknown>).sellerId as string;
    const seller = await getDocument<{ name?: string; email?: string; image?: string }>(`users/${sellerId}`);

    const q = query(collection(db, 'reviews'), where('listingId', '==', id));
    const snap = await getDocs(q);
    const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    reviews.sort((a: Record<string, unknown>, b: Record<string, unknown>) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

    return NextResponse.json({ ...listing, seller, reviews });
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

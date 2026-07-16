import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDocument } from '@/lib/firebase/firestore';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (listingId) {
      const q = query(collection(db, 'reviews'), where('listingId', '==', listingId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    const userId = payload.sub;

    const data = await request.json();

    const order = await getDocument<{ buyerId?: string; sellerId?: string }>(`orders/${data.orderId}`);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const revieweeId = userId === order.buyerId ? order.sellerId : order.buyerId;

    const reviewRef = doc(collection(db, 'reviews'));
    const review = {
      ...data,
      reviewerId: userId,
      revieweeId,
      createdAt: new Date().toISOString(),
    };
    await setDoc(reviewRef, review);

    const q = query(collection(db, 'reviews'), where('listingId', '==', data.listingId));
    const snap = await getDocs(q);
    const allReviews = snap.docs.map((d) => d.data());
    const totalRating = allReviews.reduce((sum: number, r: Record<string, unknown>) => sum + (r.rating as number), 0);
    const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    const listingRef = doc(db, 'listings', data.listingId);
    await updateDoc(listingRef, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    return NextResponse.json({ id: reviewRef.id, ...review }, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

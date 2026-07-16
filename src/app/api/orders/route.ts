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
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDocument } from '@/lib/firebase/firestore';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    const userId = payload.sub;

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'buyer';
    const field = role === 'seller' ? 'sellerId' : 'buyerId';

    const q = query(collection(db, 'orders'), where(field, '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const enrichedOrders = await Promise.all(
      orders.map(async (order: Record<string, unknown>) => {
        const buyer = await getDocument<{ name?: string; email?: string; image?: string }>(`users/${order.buyerId}`);
        const seller = await getDocument<{ name?: string; email?: string; image?: string }>(`users/${order.sellerId}`);
        const listing = await getDocument<Record<string, unknown>>(`listings/${order.listingId}`);
        return { ...order, buyer, seller, listing };
      })
    );

    return NextResponse.json(enrichedOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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

    const orderRef = doc(collection(db, 'orders'));
    const order = {
      ...data,
      buyerId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(orderRef, order);

    const listingRef = doc(db, 'listings', data.listingId);
    await updateDoc(listingRef, { sales: increment(1) });

    return NextResponse.json({ id: orderRef.id, ...order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

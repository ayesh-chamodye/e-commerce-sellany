import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getServerSession } from '@/lib/api';
import { Listing } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItemsQuery = query(
      collection(db, 'cartItems'),
      where('userId', '==', session.uid)
    );
    const snapshot = await getDocs(cartItemsQuery);
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, listing, quantity = 1 } = body;

    if (!listingId || !listing) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cartItemId = `${session.uid}_${listingId}`;
    const cartItemRef = doc(db, 'cartItems', cartItemId);

    await setDoc(
      cartItemRef,
      {
        userId: session.uid,
        listingId,
        listing: {
          id: listing.id,
          title: listing.title,
          price: listing.price,
          images: listing.images,
          sellerName: listing.sellerName,
          category: listing.category,
        } as Listing,
        quantity,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ id: cartItemId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });
    }

    const cartItemId = `${session.uid}_${listingId}`;
    await deleteDoc(doc(db, 'cartItems', cartItemId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { getServerSession } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['active', 'sold', 'draft', 'inactive'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const listingRef = doc(db, 'listings', id);
    const listingDoc = await getDoc(listingRef);

    if (!listingDoc.exists()) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const listingData = listingDoc.data();
    if (listingData.sellerId !== session.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await updateDoc(listingRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating listing status:', error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const listingRef = doc(db, 'listings', id);
    const listingDoc = await getDoc(listingRef);

    if (!listingDoc.exists()) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const listingData = listingDoc.data();
    if (listingData.sellerId !== session.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteDoc(listingRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}

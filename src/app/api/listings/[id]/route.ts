import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getServerSession } from '@/lib/api';
import { Listing } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const data = docSnap.data();
    const listing: Listing = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Listing;

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

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
    const { title, description, price, category, images, status } = body;

    const listingRef = doc(db, 'listings', id);
    const listingDoc = await getDoc(listingRef);

    if (!listingDoc.exists()) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const listingData = listingDoc.data();
    if (listingData.sellerId !== session.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (images !== undefined) updateData.images = images;
    if (status !== undefined) updateData.status = status;

    await updateDoc(listingRef, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating listing:', error);
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

    await updateDoc(listingRef, {
      status: 'inactive',
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}

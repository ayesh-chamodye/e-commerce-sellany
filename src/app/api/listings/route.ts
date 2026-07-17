import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Listing } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limitCount = parseInt(searchParams.get('limit') || '20');

    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    let listings: Listing[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Listing);
    });

    if (category) {
      listings = listings.filter((listing) => listing.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      listings = listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, category, images, sellerId, sellerName } = body;

    if (!title || !price || !sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase/client');

    const docRef = await addDoc(collection(db, 'listings'), {
      title,
      description: description || '',
      price,
      category: category || 'general',
      images: images || [],
      sellerId,
      sellerName: sellerName || 'Anonymous',
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

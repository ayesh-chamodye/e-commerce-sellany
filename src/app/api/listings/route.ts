import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDocument } from '@/lib/firebase/firestore';

function matchesSearch(item: Record<string, unknown>, search: string): boolean {
  const lower = search.toLowerCase();
  const title = (item.title as string) || '';
  const description = (item.description as string) || '';
  return title.toLowerCase().includes(lower) || description.toLowerCase().includes(lower);
}

function matchesFilters(item: Record<string, unknown>, filters: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}): boolean {
  if (filters.categoryId && (item as any).categoryId !== filters.categoryId) return false;
  if (filters.featured && !(item as any).featured) return false;
  const price = (item as any).price as number;
  if (filters.minPrice !== undefined && price < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
  return true;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const featuredParam = searchParams.get('featured');

    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
    const featured = featuredParam === 'true';

    let q = query(collection(db, 'listings'), where('status', '==', 'active'), limit(50));
    const snap = await getDocs(q);
    let listings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>));

    if (search) listings = listings.filter((item) => matchesSearch(item, search));
    if (categoryId) listings = listings.filter((item) => matchesFilters(item, { categoryId }));
    if (minPrice !== undefined || maxPrice !== undefined) {
      listings = listings.filter((item) => matchesFilters(item, { minPrice, maxPrice }));
    }
    if (featured) listings = listings.filter((item) => matchesFilters(item, { featured: true }));

    if (sortBy === 'price_asc') listings.sort((a, b) => (a.price as number) - (b.price as number));
    else if (sortBy === 'price_desc') listings.sort((a, b) => (b.price as number) - (a.price as number));
    else listings.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

    const listingsWithSeller = await Promise.all(
      listings.map(async (listing) => {
        const sellerId = (listing as any).sellerId as string;
        const seller = await getDocument<{ name?: string; email?: string; image?: string }>(`users/${sellerId}`);
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    const uid = payload.sub;

    const user = await getDocument<{ role?: string }>(`users/${uid}`);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    const listingRef = doc(collection(db, 'listings'));
    const listing = {
      ...data,
      sellerId: uid,
      views: 0,
      sales: 0,
      rating: 0,
      reviewCount: 0,
      featured: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(listingRef, listing);

    return NextResponse.json({ id: listingRef.id, ...listing }, { status: 201 });
  } catch (error) {
    console.error('Failed to create listing:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

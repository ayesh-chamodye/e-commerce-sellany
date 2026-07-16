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
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDocument } from '@/lib/firebase/firestore';
import {
  IListing,
  IFavorite,
} from '@/types/database';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    const userId = payload.sub;

    const q = query(collection(db, 'favorites'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const favorites = snap.docs.map(async (d) => {
      const fav = { id: d.id, ...d.data() } as IFavorite;
      const listing = await getDocument<IListing>(`listings/${fav.listingId}`);
      return { ...fav, listing };
    });

    const results = await Promise.all(favorites);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
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

    const { listingId } = await request.json();

    const q = query(collection(db, 'favorites'), where('userId', '==', userId), where('listingId', '==', listingId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      for (const docSnap of snap.docs) {
        await deleteDoc(docSnap.ref);
      }
      return NextResponse.json({ favorited: false });
    }

    const favRef = doc(collection(db, 'favorites'));
    await setDoc(favRef, {
      userId,
      listingId,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}

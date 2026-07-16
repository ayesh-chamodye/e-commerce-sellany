import { NextResponse } from 'next/server';
import { collection, orderBy, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function GET() {
  try {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

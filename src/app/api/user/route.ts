import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, role } = body;

    if (!uid || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    await setDoc(userRef, {
      uid,
      role,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

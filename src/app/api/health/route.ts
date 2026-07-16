import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const count = snap.size;
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      userCount: count,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

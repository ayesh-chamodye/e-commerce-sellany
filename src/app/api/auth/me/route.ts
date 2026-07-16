import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';
import { getDocument } from '@/lib/firebase/firestore';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const payload = await verifyFirebaseToken(idToken);
    const uid = payload.sub;

    const user = await getDocument<{
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: string;
    }>(`users/${uid}`);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: { ...user, id: uid } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

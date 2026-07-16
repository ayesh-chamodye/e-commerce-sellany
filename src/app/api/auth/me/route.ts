import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';
import { getDocument, setDocument } from '@/lib/firebase/firestore';

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
      const newUser = {
        email: payload.email,
        name: payload.name,
        image: payload.picture,
        role: 'buyer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDocument('users', newUser, uid);
      return NextResponse.json({ user: { ...newUser, id: uid } });
    }

    return NextResponse.json({ user: { ...user, id: uid } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

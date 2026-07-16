import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';

export async function auth() {
  const authHeader = process.env.AUTHORIZATION || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    return { user: { id: payload.sub, email: payload.email, name: payload.name, image: payload.picture } };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

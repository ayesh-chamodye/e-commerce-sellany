import { NextRequest, NextResponse } from 'next/server';
import { googleOAuthConfig } from '@/lib/googleOAuth';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { SignJWT, jwtVerify } from 'jose';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string | null;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sellany_session')?.value;

    if (!sessionToken) {
      return NextResponse.json<UserProfile | null>(null, { status: 200 });
    }

    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
      const uid = payload.uid as string;

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return NextResponse.json<UserProfile>({
          uid,
          email: payload.email as string,
          displayName: payload.name as string,
          photoURL: payload.picture as string,
          role: data.role || payload.role,
        });
      }

      return NextResponse.json<UserProfile>({
        uid,
        email: payload.email as string,
        displayName: payload.name as string,
        photoURL: payload.picture as string,
        role: payload.role as string,
      });
    } catch (jwtError) {
      return NextResponse.json<UserProfile | null>(null, { status: 200 });
    }
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json<UserProfile | null>(null, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, name, picture, role } = body;

    const sessionToken = await new SignJWT({ 
      uid,
      email,
      name,
      picture,
      role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set('sellany_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('sellany_session');
  return response;
}

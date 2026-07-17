import { NextRequest, NextResponse } from 'next/server';
import { googleOAuthConfig } from '@/lib/googleOAuth';
import { db } from '@/lib/firebase/client';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

async function exchangeCodeForTokens(code: string): Promise<{ access_token: string; id_token: string }> {
  if (!googleOAuthConfig.clientId || !googleOAuthConfig.clientSecret || !googleOAuthConfig.redirectUri) {
    throw new Error('Google OAuth is not configured');
  }

  const response = await fetch(googleOAuthConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: googleOAuthConfig.clientId,
      client_secret: googleOAuthConfig.clientSecret,
      redirect_uri: googleOAuthConfig.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token exchange failed:', response.status, errorText);
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    id_token: data.id_token,
  };
}

async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(googleOAuthConfig.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

async function createSessionToken(userInfo: GoogleUserInfo, role: string): Promise<string> {
  const token = await new SignJWT({ 
    uid: userInfo.sub,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    if (error) {
      console.error('Google OAuth error response:', error);
      return NextResponse.redirect(new URL('/auth/signin?error=google_auth_denied', request.url));
    }

    if (!code) {
      console.error('Missing authorization code');
      return NextResponse.redirect(new URL('/auth/signin?error=no_code', request.url));
    }

    const storedState = request.cookies.get('google_oauth_state')?.value;
    if (!storedState || state !== storedState) {
      console.error('Invalid state parameter');
      return NextResponse.redirect(new URL('/auth/signin?error=invalid_state', request.url));
    }

    if (!googleOAuthConfig.clientId || !googleOAuthConfig.clientSecret || !googleOAuthConfig.redirectUri) {
      console.error('Google OAuth not configured');
      return NextResponse.redirect(new URL('/auth/signin?error=not_configured', request.url));
    }

    const tokens = await exchangeCodeForTokens(code);
    const userInfo = await getUserInfo(tokens.access_token);

    const pendingRole = request.cookies.get('sellany_pending_role')?.value as 'buyer' | 'seller' | undefined;
    const role = pendingRole || 'buyer';

    try {
      const userRef = doc(db, 'users', userInfo.sub);
      const userDoc = await getDoc(userRef);

      const userData = {
        uid: userInfo.sub,
        email: userInfo.email,
        displayName: userInfo.name,
        photoURL: userInfo.picture,
        role,
        emailVerified: userInfo.email_verified,
        updatedAt: serverTimestamp(),
        ...(userDoc.exists() ? {} : { createdAt: serverTimestamp() }),
      };

      await setDoc(userRef, userData, { merge: true });
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
    }

    const sessionToken = await createSessionToken(userInfo, role);

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('sellany_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.delete('google_oauth_state');
    response.cookies.delete('sellany_pending_role');

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=callback_failed', request.url));
  }
}

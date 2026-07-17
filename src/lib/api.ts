import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return null as T;
    }
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export interface SessionUser {
  uid: string;
  email: string;
  name: string;
  picture: string;
  role: string;
}

export async function getServerSession(request: NextRequest): Promise<SessionUser | null> {
  const sessionToken = request.cookies.get('sellany_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    return {
      uid: payload.uid as string,
      email: payload.email as string,
      name: payload.name as string,
      picture: payload.picture as string,
      role: (payload.role as string) || 'buyer',
    };
  } catch {
    return null;
  }
}

export function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    uid: user.uid,
    email: user.email,
    name: user.name,
    picture: user.picture,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

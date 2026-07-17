import { NextRequest, NextResponse } from 'next/server';
import { generateGoogleAuthUrl } from '@/lib/googleOAuth';

export async function GET(request: NextRequest) {
  try {
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = generateGoogleAuthUrl(state);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    console.error('Google auth init error:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=oauth_not_configured', request.url));
  }
}

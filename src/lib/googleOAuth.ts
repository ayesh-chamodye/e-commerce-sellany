export const googleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || (process.env.NODE_ENV === 'production' ? 'https://e-commerce-sellany.vercel.app/api/auth/callback/google' : 'http://localhost:3000/api/auth/callback/google'),
  scopes: ['openid', 'profile', 'email'],
};

export function generateGoogleAuthUrl(state: string): string {
  if (!googleOAuthConfig.clientId || !googleOAuthConfig.redirectUri) {
    throw new Error('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI environment variables.');
  }

  const params = new URLSearchParams({
    client_id: googleOAuthConfig.clientId,
    redirect_uri: googleOAuthConfig.redirectUri,
    response_type: 'code',
    scope: googleOAuthConfig.scopes.join(' '),
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${googleOAuthConfig.authorizationUrl}?${params.toString()}`;
}

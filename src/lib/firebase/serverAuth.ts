import { SignJWT, importPKCS8 } from 'jose';

const FIREBASE_PROJECT_ID = 'sellany-502609';
const JWKS_URL = `https://firebase.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/publicKeys`;

interface FirebaseTokenPayload {
  aud: string;
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  iat: number;
  exp: number;
}

let publicKeys: { kid: string; publicKey: string }[] | null = null;

async function getPublicKeys() {
  if (publicKeys) return publicKeys;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error('Failed to fetch Firebase public keys');
  const keys: { kid: string; publicKey: string }[] = await res.json();
  if (!keys || keys.length === 0) throw new Error('No Firebase public keys available');
  publicKeys = keys;
  return publicKeys;
}

export async function verifyFirebaseToken(idToken: string): Promise<FirebaseTokenPayload> {
  const keys = await getPublicKeys();
  const segments = idToken.split('.');
  if (segments.length !== 3) throw new Error('Invalid token format');

  const headerRaw = Buffer.from(segments[0], 'base64').toString('utf8');
  const header = JSON.parse(headerRaw) as { kid: string; alg: string };
  const key = keys.find((k) => k.kid === header.kid);
  if (!key) throw new Error('Matching public key not found');

  const expectedAud = FIREBASE_PROJECT_ID;
  const payloadRaw = Buffer.from(segments[1], 'base64').toString('utf8');
  const payload = JSON.parse(payloadRaw) as FirebaseTokenPayload;

  if (payload.aud !== expectedAud) throw new Error('Wrong audience');
  if (payload.exp * 1000 < Date.now()) throw new Error('Token expired');

  const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${key.publicKey}\n-----END PUBLIC KEY-----`;
  const publicKey = await importPKCS8(publicKeyPem, header.alg);
  const { jwtVerify } = await import('jose');
  const result = await jwtVerify(idToken, publicKey, {
    algorithms: [header.alg],
    audience: expectedAud,
  });

  return result.payload as unknown as FirebaseTokenPayload;
}

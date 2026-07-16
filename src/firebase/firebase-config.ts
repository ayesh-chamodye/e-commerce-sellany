import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export async function signInWithGoogleRedirect() {
  await signInWithRedirect(auth, googleProvider);
}

export const signInWithGoogle = signInWithGoogleRedirect;

export async function ensureUserDocument(user: User | null | undefined) {
  if (!user?.uid) return null;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  const payload = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    provider: user.providerData?.[0]?.providerId ?? 'google.com',
    createdAt: snapshot.exists() ? snapshot.data()?.createdAt ?? serverTimestamp() : serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(userRef, payload, { merge: true });
  return payload;
}

export async function handleGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);

    if (!result?.user) {
      return null;
    }

    return ensureUserDocument(result.user);
  } catch (error) {
    console.error('Google redirect auth failed:', error);
    throw error;
  }
}

if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await ensureUserDocument(user);
    }
  });

  void handleGoogleRedirectResult();
}

export default firebaseApp;

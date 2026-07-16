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
  apiKey: "AIzaSyCuWpBXg9o0VCst7mADZowKro5T3pt47CA",
  authDomain: "sellany-502609.firebaseapp.com",
  projectId: "sellany-502609",
  storageBucket: "sellany-502609.firebasestorage.app",
  messagingSenderId: "1098367987126",
  appId: "1:1098367987126:web:d2c460be73f42c139fa517",
  measurementId: "G-6XDPLV39JN"
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

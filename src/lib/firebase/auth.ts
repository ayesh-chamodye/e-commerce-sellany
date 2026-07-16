import { auth } from './config';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  getRedirectResult,
} from 'firebase/auth';

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    const code = (error as any)?.code;
    if (code === 'auth/popup-blocked' || code === 'auth/popup-closed') {
      await signInWithRedirect(auth, provider);
      return;
    }
    throw error;
  }
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function listenToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getRedirectUser() {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

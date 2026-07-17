import { auth } from './client';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
}

export async function getRedirectUser() {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (error) {
    console.error('getRedirectResult error:', error);
    return null;
  }
}

export function onAuthStateChangedListener(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signOut() {
  await firebaseSignOut(auth);
}

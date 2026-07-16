import { auth } from './config';
import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function listenToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

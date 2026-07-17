import { auth } from './client';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { db } from './client';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
  role: 'buyer' | 'seller'
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: name,
    role,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

export async function saveUserRole(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }, role: 'buyer' | 'seller') {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

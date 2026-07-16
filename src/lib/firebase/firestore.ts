import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';

export async function getDocument<T>(path: string): Promise<T | null> {
  const ref = doc(db, path);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as T) : null;
}

export async function getDocuments<T>(
  path: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, path), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export async function setDocument(path: string, data: Record<string, unknown>, id?: string) {
  const ref = id ? doc(db, path, id) : doc(collection(db, path));
  await setDoc(ref, data);
  return ref.id;
}

export async function updateDocument(path: string, data: Record<string, unknown>, id: string) {
  const ref = doc(db, path, id);
  await updateDoc(ref, data);
}

export async function deleteDocument(path: string, id: string) {
  const ref = doc(db, path, id);
  await deleteDoc(ref);
}

export async function getPaginatedDocuments<T>(
  path: string,
  pageSize = 12,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ items: T[]; lastDoc?: QueryDocumentSnapshot }> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
  if (lastDoc) constraints.push(startAfter(lastDoc));
  const q = query(collection(db, path), ...constraints);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  return { items, lastDoc: snap.docs[snap.docs.length - 1] };
}

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadFile(path: string, file: File | Blob): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

'use server';

import { revalidatePath } from 'next/cache';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';
import { updateDocument } from '@/lib/firebase/firestore';

export async function updateUserRole(userId: string, role: 'buyer' | 'seller') {
  try {
    await updateDocument('users', { role }, userId);
    revalidatePath('/');
    revalidatePath('/dashboard/seller');
    revalidatePath('/dashboard/buyer');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

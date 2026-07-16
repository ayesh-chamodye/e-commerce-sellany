'use server';

import { connectToDatabase } from '@/lib/mongodb/connection';
import { User } from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, role: 'buyer' | 'seller') {
  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { role });
    revalidatePath('/');
    revalidatePath('/dashboard/seller');
    revalidatePath('/dashboard/buyer');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

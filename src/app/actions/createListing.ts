'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api';

export async function createListing(data: Record<string, unknown>) {
  try {
    const listing = await apiFetch('/api/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    revalidatePath('/marketplace');
    return listing;
  } catch (error) {
    console.error('Failed to create listing:', error);
    throw new Error('Failed to create listing');
  }
}

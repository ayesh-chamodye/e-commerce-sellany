import mongoose, { Schema, models, model } from 'mongoose';
import type { IFavorite } from '@/types/database';

const FavoriteSchema = new Schema<IFavorite>({
  userId: { type: String, required: true, index: true },
  listingId: { type: String, required: true, index: true },
}, { timestamps: true });

FavoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export const Favorite = models.Favorite || model<IFavorite>('Favorite', FavoriteSchema);

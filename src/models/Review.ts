import mongoose, { Schema, models, model } from 'mongoose';
import type { IReview } from '@/types/database';

const ReviewSchema = new Schema<IReview>({
  orderId: { type: String, required: true, index: true },
  reviewerId: { type: String, required: true, index: true },
  revieweeId: { type: String, required: true, index: true },
  listingId: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String },
}, { timestamps: true });

ReviewSchema.index({ listingId: 1, createdAt: -1 });

export const Review = models.Review || model<IReview>('Review', ReviewSchema);

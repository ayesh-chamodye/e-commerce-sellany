import mongoose, { Schema, models, model } from 'mongoose';
import type { IListing } from '@/types/database';

const ListingSchema = new Schema<IListing>({
  sellerId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  discountPercentage: { type: Number },
  categoryId: { type: String, index: true },
  type: { type: String, enum: ['service', 'goods', 'account'], default: 'service' },
  status: { type: String, enum: ['active', 'inactive', 'sold', 'pending'], default: 'active', index: true },
  images: [{ type: String }],
  videoUrl: { type: String },
  youtubeUrl: { type: String },
  tags: [{ type: String }],
  deliveryTime: { type: Number },
  revisions: { type: Number },
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ sellerId: 1, createdAt: -1 });

export const Listing = models.Listing || model<IListing>('Listing', ListingSchema);

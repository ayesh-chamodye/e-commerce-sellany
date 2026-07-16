import mongoose, { Schema, models, model } from 'mongoose';
import type { ICategory } from '@/types/database';

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
}, { timestamps: true });

export const Category = models.Category || model<ICategory>('Category', CategorySchema);

import mongoose, { Schema, models, model } from 'mongoose';
import type { IUser } from '@/types/database';

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  phone: { type: String },
  accounts: [{ type: Schema.Types.Mixed }],
}, { timestamps: true });

export const User = models.User || model<IUser>('User', UserSchema);

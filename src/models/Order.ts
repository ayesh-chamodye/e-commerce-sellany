import mongoose, { Schema, models, model } from 'mongoose';
import type { IOrder } from '@/types/database';

const OrderSchema = new Schema<IOrder>({
  buyerId: { type: String, required: true, index: true },
  sellerId: { type: String, required: true, index: true },
  listingId: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'cancelled', 'refunded'], 
    default: 'pending',
    index: true 
  },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true });

export const Order = models.Order || model<IOrder>('Order', OrderSchema);

import mongoose, { Schema, models, model } from 'mongoose';
import type { IMessage } from '@/types/database';

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true, index: true },
  receiverId: { type: String, required: true, index: true },
  orderId: { type: String, index: true },
  listingId: { type: String, index: true },
  subject: { type: String },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  parentId: { type: String, index: true },
}, { timestamps: true });

MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1 });

export const Message = models.Message || model<IMessage>('Message', MessageSchema);

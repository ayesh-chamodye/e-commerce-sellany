import { connectToDatabase } from '@/lib/mongodb/connection';
import { Listing } from '@/models/Listing';
import { Category } from '@/models/Category';
import { Order } from '@/models/Order';
import { Message } from '@/models/Message';
import { Review } from '@/models/Review';
import { Favorite } from '@/models/Favorite';
import { User } from '@/models/User';
import type { IListing, ICategory, IOrder, IMessage, IReview, IFavorite } from '@/types/database';

export async function getFeaturedListings(limit = 8): Promise<IListing[]> {
  await connectToDatabase();
  return await Listing.find({ status: 'active', featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getCategories(): Promise<ICategory[]> {
  await connectToDatabase();
  return await Category.find().sort({ createdAt: -1 }).lean();
}

export async function getListings(filters: {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}): Promise<IListing[]> {
  await connectToDatabase();
  let query: any = { status: 'active' };

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }
  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }
  if (filters.minPrice !== undefined) {
    query.price = { ...query.price, $gte: filters.minPrice };
  }
  if (filters.maxPrice !== undefined) {
    query.price = { ...query.price, $lte: filters.maxPrice };
  }

  let sort: any = { createdAt: -1 };
  if (filters.sortBy === 'price_asc') sort = { price: 1 };
  if (filters.sortBy === 'price_desc') sort = { price: -1 };

  return await Listing.find(query)
    .sort(sort)
    .lean();
}

export async function getListingById(id: string): Promise<IListing | null> {
  await connectToDatabase();
  return await Listing.findById(id).lean();
}

export async function getListingReviews(listingId: string): Promise<(IReview & { reviewer: any })[]> {
  await connectToDatabase();
  return await Review.find({ listingId })
    .sort({ createdAt: -1 })
    .populate('reviewerId', 'name email image')
    .lean();
}

export async function createListing(data: Partial<IListing> & { sellerId: string }) {
  await connectToDatabase();
  return await Listing.create(data);
}

export async function createOrder(data: Partial<IOrder>) {
  await connectToDatabase();
  return await Order.create(data);
}

export async function getOrders(userId: string, role: 'buyer' | 'seller'): Promise<(IOrder & { seller?: any; buyer?: any; listing?: any })[]> {
  await connectToDatabase();
  const query = role === 'buyer' ? { buyerId: userId } : { sellerId: userId };
  return await Order.find(query)
    .sort({ createdAt: -1 })
    .populate('buyerId', 'name email image')
    .populate('sellerId', 'name email image')
    .populate('listingId')
    .lean();
}

export async function getMessages(userId: string, partnerId: string): Promise<(IMessage & { sender: any; receiver: any })[]> {
  await connectToDatabase();
  return await Message.find({
    $or: [
      { senderId: userId, receiverId: partnerId },
      { senderId: partnerId, receiverId: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name email image')
    .populate('receiverId', 'name email image')
    .lean();
}

export async function getConversations(userId: string) {
  await connectToDatabase();
  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name email image')
    .populate('receiverId', 'name email image')
    .lean();

  const convMap = new Map<string, any>();
  for (const msg of messages) {
    const partnerId = (msg as any).senderId === userId ? (msg as any).receiverId : (msg as any).senderId;
    if (!convMap.has(partnerId)) {
      convMap.set(partnerId, {
        partnerId,
        partner: (msg as any).senderId === userId ? (msg as any).receiverId : (msg as any).senderId,
        lastMessage: msg,
      });
    }
  }
  return Array.from(convMap.values());
}

export async function createMessage(data: Partial<IMessage> & { senderId: string }) {
  await connectToDatabase();
  return await Message.create(data);
}

export async function markMessagesAsRead(userId: string, partnerId: string) {
  await connectToDatabase();
  return await Message.updateMany(
    { receiverId: userId, senderId: partnerId, read: false },
    { $set: { read: true } }
  );
}

export async function getFavorites(userId: string) {
  await connectToDatabase();
  return await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .populate('listingId')
    .lean();
}

export async function toggleFavorite(userId: string, listingId: string) {
  await connectToDatabase();
  const existing = await Favorite.findOne({ userId, listingId });
  if (existing) {
    await Favorite.findByIdAndDelete(existing._id);
    return { favorited: false };
  }
  await Favorite.create({ userId, listingId });
  return { favorited: true };
}

export async function incrementListingViews(id: string) {
  await connectToDatabase();
  return await Listing.findByIdAndUpdate(id, { $inc: { views: 1 } });
}

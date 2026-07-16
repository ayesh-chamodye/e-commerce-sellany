export interface IUser {
  _id?: string;
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role: 'buyer' | 'seller' | 'admin';
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  accounts?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: Date;
}

export interface IListing {
  _id?: string;
  sellerId: string;
  seller?: {
    name?: string;
    email?: string;
    image?: string;
  };
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  categoryId?: string;
  type: 'service' | 'goods' | 'account';
  status: 'active' | 'inactive' | 'sold' | 'pending';
  images: string[];
  videoUrl?: string;
  youtubeUrl?: string;
  tags: string[];
  deliveryTime?: number;
  revisions?: number;
  views: number;
  sales: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reviews?: (IReview & { reviewer: any })[];
}

export interface IOrder {
  _id?: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  price: number;
  quantity: number;
  totalAmount: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  orderId?: string;
  listingId?: string;
  subject?: string;
  content: string;
  read: boolean;
  parentId?: string;
  createdAt?: Date;
}

export interface IReview {
  _id?: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  listingId: string;
  rating: number;
  content?: string;
  createdAt?: Date;
}

export interface IFavorite {
  _id?: string;
  userId: string;
  listingId: string;
  createdAt?: Date;
}

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: 'buyer' | 'seller' | 'admin';
  bio: string;
  location: string;
  website: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
};

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  discount_percentage: number | null;
  category_id: string | null;
  type: 'service' | 'goods' | 'account';
  status: 'active' | 'inactive' | 'sold' | 'pending';
  images: string[];
  video_url: string | null;
  youtube_url: string | null;
  tags: string[];
  delivery_time: number | null;
  revisions: number | null;
  views: number;
  sales: number;
  rating: number;
  review_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  seller?: Profile;
  category?: Category;
};

export type Order = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  price: number;
  quantity: number;
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
  buyer?: Profile;
  seller?: Profile;
  listing?: Listing;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  order_id: string | null;
  listing_id: string | null;
  subject: string | null;
  content: string;
  read: boolean;
  parent_id: string | null;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
};

export type Review = {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewee_id: string;
  listing_id: string;
  rating: number;
  content: string;
  created_at: string;
  reviewer?: Profile;
  reviewee?: Profile;
  listing?: Listing;
};

export type Favorite = {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
};

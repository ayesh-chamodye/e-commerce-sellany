import { NextResponse } from 'next/server';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

async function seed() {
  const userSnap = await getDocs(collection(db, 'users'));
  if (userSnap.empty) {
    const users = [
      { name: 'Tech Solutions Store', email: 'tech@example.com', image: 'https://images.unsplash.com/photo-1560179707-f14e90b0c7c4?w=200', role: 'seller', bio: 'We provide premium tech products and digital services', location: 'New York, USA', website: 'https://techsolutions.example.com', phone: '' },
      { name: 'Creative Design Hub', email: 'design@example.com', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200', role: 'seller', bio: 'Professional graphic design and branding services', location: 'London, UK', website: 'https://creativedesignhub.example.com', phone: '' },
      { name: 'Digital Marketing Pro', email: 'marketing@example.com', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200', role: 'seller', bio: 'SEO, social media marketing, and advertising expert', location: 'San Francisco, USA', website: 'https://digitalmarketingpro.example.com', phone: '' },
      { name: 'Code Masters', email: 'code@example.com', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200', role: 'seller', bio: 'Full-stack development and software solutions', location: 'Berlin, Germany', website: 'https://codemasters.example.com', phone: '' },
      { name: 'Media Studio', email: 'media@example.com', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', role: 'seller', bio: 'Video production, animation, and editing services', location: 'Los Angeles, USA', website: 'https://mediastudio.example.com', phone: '' },
      { name: 'Pixel Perfect Graphics', email: 'pixel@example.com', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200', role: 'seller', bio: 'UI/UX design, illustrations, and brand identity', location: 'Toronto, Canada', website: 'https://pixelperfect.example.com', phone: '' },
      { name: 'Cloud Hosting Services', email: 'cloud@example.com', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200', role: 'seller', bio: 'Reliable cloud hosting, domains, and server management', location: 'Singapore', website: 'https://cloudhosting.example.com', phone: '' },
      { name: 'WriteWell Agency', email: 'write@example.com', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200', role: 'seller', bio: 'Content writing, copywriting, and translation in 12 languages', location: 'Dublin, Ireland', website: 'https://writewell.example.com', phone: '' },
      { name: 'GameZone Accounts', email: 'games@example.com', image: 'https://images.unsplash.com/photo-1511512578045-d9209520d8b4?w=200', role: 'seller', bio: 'Premium gaming accounts, in-game items, and boosting services', location: 'Tokyo, Japan', website: 'https://gamezone.example.com', phone: '' },
      { name: 'Mobile Gadgets Hub', email: 'gadgets@example.com', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200', role: 'seller', bio: 'Latest smartphones, accessories, and wearable tech', location: 'Dubai, UAE', website: 'https://mobilegadgets.example.com', phone: '' },
      { name: 'SoundWave Studio', email: 'audio@example.com', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200', role: 'seller', bio: 'Music production, mixing, mastering, and sound effects', location: 'Nashville, USA', website: 'https://soundwave.example.com', phone: '' },
      { name: 'PhotoPro Gallery', email: 'photo@example.com', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200', role: 'seller', bio: 'Stock photography, photo editing, and drone footage', location: 'Auckland, New Zealand', website: 'https://photopro.example.com', phone: '' },
      { name: 'Account Marketplace', email: 'accounts@example.com', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=200', role: 'seller', bio: 'Social media, streaming, and business account sales', location: 'Mumbai, India', website: 'https://accountmarket.example.com', phone: '' },
      { name: 'Software License Store', email: 'licenses@example.com', image: 'https://images.unsplash.com/photo-1555066931-436663dc9c2a?w=200', role: 'seller', bio: 'Genuine software licenses, tools, and enterprise solutions', location: 'Amsterdam, Netherlands', website: 'https://softwarelicenses.example.com', phone: '' },
      { name: 'SEO Growth Partners', email: 'seo@example.com', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=200', role: 'seller', bio: 'SEO audits, link building, and organic growth strategies', location: 'Chicago, USA', website: 'https://seogrowth.example.com', phone: '' },
    ];

    for (const u of users) {
      const ref = doc(collection(db, 'users'));
      await setDoc(ref, { ...u, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
  }

  const categorySnap = await getDocs(collection(db, 'categories'));
  if (categorySnap.empty) {
    const categories = [
      { name: 'Web Development', slug: 'web-development', description: 'Professional web development services', icon: '💻' },
      { name: 'Graphic Design', slug: 'graphic-design', description: 'Logo design, branding, and visual identity', icon: '🎨' },
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, social media, and advertising', icon: '📈' },
      { name: 'Writing & Translation', slug: 'writing-translation', description: 'Content writing and translation services', icon: '✍️' },
      { name: 'Video & Animation', slug: 'video-animation', description: 'Video editing, animation, and production', icon: '🎬' },
      { name: 'Music & Audio', slug: 'music-audio', description: 'Music production, mixing, and mastering', icon: '🎵' },
      { name: 'Accounts', slug: 'accounts', description: 'Buy and sell social media, gaming, and business accounts', icon: '👤' },
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, laptops, and accessories', icon: '📱' },
      { name: 'Software', slug: 'software', description: 'Software licenses, tools, and applications', icon: '📦' },
      { name: 'Photography', slug: 'photography', description: 'Photography services and stock photos', icon: '📷' },
    ];

    const categoryIds: Record<string, string> = {};
    for (const c of categories) {
      const ref = doc(collection(db, 'categories'));
      await setDoc(ref, { ...c, createdAt: new Date().toISOString() });
      categoryIds[c.slug] = ref.id;
    }

    const listings = [
      { sellerId: 'user-001', title: 'Custom Website Development', description: 'Professional responsive website built with React, Next.js, and Node.js.', price: 1500.00, discountPrice: 1299.00, discountPercentage: 13, categoryId: categoryIds['web-development'], type: 'service', images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'], tags: ['web', 'react'], deliveryTime: 21, revisions: 5, views: 450, sales: 38, rating: 4.9, reviewCount: 42, featured: true, status: 'active' },
      { sellerId: 'user-001', title: 'E-commerce Website Package', description: 'Complete e-commerce solution with Stripe integration.', price: 2500.00, discountPrice: 1999.00, discountPercentage: 20, categoryId: categoryIds['web-development'], type: 'service', images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'], tags: ['ecommerce', 'shopify'], deliveryTime: 30, revisions: 8, views: 320, sales: 25, rating: 4.8, reviewCount: 31, featured: true, status: 'active' },
      { sellerId: 'user-001', title: 'Windows 11 Pro License', description: 'Genuine Windows 11 Pro license key.', price: 89.99, discountPrice: 69.99, discountPercentage: 22, categoryId: categoryIds['software'], type: 'goods', images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800'], tags: ['windows', 'license'], deliveryTime: 1, revisions: 0, views: 890, sales: 156, rating: 4.7, reviewCount: 89, featured: false, status: 'active' },
      { sellerId: 'user-002', title: 'Professional Logo Design', description: 'Modern and memorable logo design.', price: 199.00, discountPrice: 149.00, discountPercentage: 25, categoryId: categoryIds['graphic-design'], type: 'service', images: ['https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800'], tags: ['logo', 'branding'], deliveryTime: 5, revisions: 10, views: 680, sales: 124, rating: 4.9, reviewCount: 98, featured: true, status: 'active' },
      { sellerId: 'user-002', title: 'Social Media Branding Package', description: 'Complete branding package.', price: 499.00, discountPrice: 399.00, discountPercentage: 20, categoryId: categoryIds['graphic-design'], type: 'service', images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'], tags: ['branding'], deliveryTime: 7, revisions: 5, views: 420, sales: 67, rating: 4.8, reviewCount: 54, featured: true, status: 'active' },
      { sellerId: 'user-003', title: 'SEO Optimization Package', description: 'Complete SEO audit and optimization.', price: 599.00, discountPrice: 499.00, discountPercentage: 17, categoryId: categoryIds['digital-marketing'], type: 'service', images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'], tags: ['seo'], deliveryTime: 14, revisions: 3, views: 560, sales: 78, rating: 4.7, reviewCount: 65, featured: true, status: 'active' },
      { sellerId: 'user-004', title: 'React Native Mobile App', description: 'Cross-platform mobile app development.', price: 3500.00, discountPrice: 2999.00, discountPercentage: 14, categoryId: categoryIds['web-development'], type: 'service', images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'], tags: ['react-native'], deliveryTime: 45, revisions: 10, views: 280, sales: 19, rating: 4.9, reviewCount: 22, featured: true, status: 'active' },
      { sellerId: 'user-005', title: 'Professional Video Editing', description: 'High-quality video editing.', price: 299.00, discountPrice: 249.00, discountPercentage: 17, categoryId: categoryIds['video-animation'], type: 'service', images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'], tags: ['video'], deliveryTime: 7, revisions: 5, views: 410, sales: 56, rating: 4.8, reviewCount: 47, featured: true, status: 'active' },
      { sellerId: 'user-007', title: 'Cloud VPS Hosting - 1 Year', description: 'High-performance cloud VPS.', price: 480.00, discountPrice: 420.00, discountPercentage: 12, categoryId: categoryIds['web-development'], type: 'service', images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'], tags: ['hosting'], deliveryTime: 1, revisions: 0, views: 760, sales: 210, rating: 4.8, reviewCount: 134, featured: true, status: 'active' },
      { sellerId: 'user-009', title: 'Level 100 Gaming Account', description: 'Max-level gaming account.', price: 249.00, discountPrice: 199.00, discountPercentage: 20, categoryId: categoryIds['accounts'], type: 'account', images: ['https://images.unsplash.com/photo-1511512578045-d9209520d8b4?w=800'], tags: ['gaming'], deliveryTime: 1, revisions: 0, views: 1200, sales: 340, rating: 4.4, reviewCount: 210, featured: true, status: 'active' },
      { sellerId: 'user-010', title: 'iPhone 15 Pro Max 256GB', description: 'Brand new iPhone 15 Pro Max.', price: 1199.00, discountPrice: 1099.00, discountPercentage: 8, categoryId: categoryIds['electronics'], type: 'goods', images: ['https://images.unsplash.com/photo-1696446701796-da75a4c0e4e4?w=800'], tags: ['iphone'], deliveryTime: 3, revisions: 0, views: 3400, sales: 520, rating: 4.9, reviewCount: 389, featured: true, status: 'active' },
      { sellerId: 'user-014', title: 'Adobe Photoshop Lifetime License', description: 'Genuine Adobe Photoshop license.', price: 249.00, discountPrice: 199.00, discountPercentage: 20, categoryId: categoryIds['software'], type: 'goods', images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800'], tags: ['adobe'], deliveryTime: 1, revisions: 0, views: 1800, sales: 420, rating: 4.7, reviewCount: 289, featured: true, status: 'active' },
    ];

    for (const listing of listings) {
      const ref = doc(collection(db, 'listings'));
      await setDoc(ref, { ...listing, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
  }

  return {
    users: (await getDocs(collection(db, 'users'))).size,
    categories: (await getDocs(collection(db, 'categories'))).size,
    listings: (await getDocs(collection(db, 'listings'))).size,
    reviews: (await getDocs(collection(db, 'reviews'))).size,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await seed();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

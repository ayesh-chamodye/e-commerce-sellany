import { connectToDatabase } from '@/lib/mongodb/connection';
import { Category } from '@/models/Category';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';

async function seed() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Demo Seller',
        email: 'seller@example.com',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        role: 'seller',
      });
      console.log('Demo seller user created');
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany([
        { name: 'Web Development', slug: 'web-development', description: 'Professional web development services', icon: '💻' },
        { name: 'Graphic Design', slug: 'graphic-design', description: 'Logo design, branding, and visual identity', icon: '🎨' },
        { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, social media, and advertising', icon: '📈' },
        { name: 'Writing & Translation', slug: 'writing-translation', description: 'Content writing and translation services', icon: '✍️' },
        { name: 'Video & Animation', slug: 'video-animation', description: 'Video editing, animation, and production', icon: '🎬' },
        { name: 'Music & Audio', slug: 'music-audio', description: 'Music production, mixing, and mastering', icon: '🎵' },
        { name: 'Accounts', slug: 'accounts', description: 'Buy and sell social media, gaming, and business accounts', icon: '👤' },
        { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, laptops, and accessories', icon: '📱' },
      ]);
      console.log('Categories seeded');
    }

    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      await Listing.insertMany([
        {
          sellerId: '00000000-0000-0000-0000-000000000000',
          title: 'Professional Logo Design',
          description: 'I will create a modern and professional logo design for your business. Includes unlimited revisions until you are satisfied.',
          price: 99.00,
          discountPrice: 79.00,
          discountPercentage: 20,
          categoryId: '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800'],
          tags: ['logo', 'design', 'branding'],
          deliveryTime: 3,
          revisions: 3,
          views: 150,
          sales: 12,
          rating: 4.8,
          reviewCount: 8,
          featured: true,
          status: 'active',
        },
        {
          sellerId: '00000000-0000-0000-0000-000000000000',
          title: 'Full Stack Web Development',
          description: 'Complete web application development using React, Node.js, and PostgreSQL. Responsive design, database integration, and deployment.',
          price: 500.00,
          discountPrice: null,
          discountPercentage: null,
          categoryId: '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'],
          tags: ['web', 'development', 'react', 'nodejs'],
          deliveryTime: 14,
          revisions: 5,
          views: 320,
          sales: 25,
          rating: 4.9,
          reviewCount: 15,
          featured: true,
          status: 'active',
        },
        {
          sellerId: '00000000-0000-0000-0000-000000000000',
          title: 'Instagram Account - 50K Followers',
          description: 'Established Instagram account with 50,000+ followers. High engagement rate, niche in lifestyle and fashion.',
          price: 299.00,
          discountPrice: 249.00,
          discountPercentage: 17,
          categoryId: '',
          type: 'account',
          images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
          tags: ['instagram', 'social-media', 'followers'],
          deliveryTime: 1,
          revisions: 0,
          views: 200,
          sales: 5,
          rating: 4.5,
          reviewCount: 3,
          featured: false,
          status: 'active',
        },
        {
          sellerId: '00000000-0000-0000-0000-000000000000',
          title: 'SEO Optimization Package',
          description: 'Complete SEO audit and optimization for your website. Includes keyword research, on-page SEO, and technical improvements.',
          price: 150.00,
          discountPrice: null,
          discountPercentage: null,
          categoryId: '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
          tags: ['seo', 'marketing', 'optimization'],
          deliveryTime: 7,
          revisions: 2,
          views: 180,
          sales: 18,
          rating: 4.7,
          reviewCount: 12,
          featured: true,
          status: 'active',
        },
      ]);
      console.log('Listings seeded');
    }

    console.log('Seed completed');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();

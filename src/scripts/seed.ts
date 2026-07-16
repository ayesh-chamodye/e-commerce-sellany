import { connectToDatabase } from '@/lib/mongodb/connection';
import { Category } from '@/models/Category';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import { Review } from '@/models/Review';

async function seed() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Create demo users/sellers
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          id: 'user-001',
          name: 'Tech Solutions Store',
          email: 'tech@example.com',
          image: 'https://images.unsplash.com/photo-1560179707-f14e90b0c7c4?w=200',
          role: 'seller',
          bio: 'We provide premium tech products and digital services',
          location: 'New York, USA',
        },
        {
          id: 'user-002',
          name: 'Creative Design Hub',
          email: 'design@example.com',
          image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
          role: 'seller',
          bio: 'Professional graphic design and branding services',
          location: 'London, UK',
        },
        {
          id: 'user-003',
          name: 'Digital Marketing Pro',
          email: 'marketing@example.com',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
          role: 'seller',
          bio: 'SEO, social media marketing, and advertising expert',
          location: 'San Francisco, USA',
        },
        {
          id: 'user-004',
          name: 'Code Masters',
          email: 'code@example.com',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
          role: 'seller',
          bio: 'Full-stack development and software solutions',
          location: 'Berlin, Germany',
        },
        {
          id: 'user-005',
          name: 'Media Studio',
          email: 'media@example.com',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          role: 'seller',
          bio: 'Video production, animation, and editing services',
          location: 'Los Angeles, USA',
        },
      ]);
      console.log('Demo sellers created');
    }

    // Create categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const categories = await Category.insertMany([
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
      ]);
      console.log('Categories seeded');
    }

    // Get categories for listings
    const categories = await Category.find().lean();
    const categoryMap = new Map(categories.map(c => [c.slug, c._id]));

    // Create listings
    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      const listings = [
        // Tech Solutions Store
        {
          sellerId: 'user-001',
          title: 'Custom Website Development',
          description: 'Professional responsive website built with React, Next.js, and Node.js. Includes database integration, payment setup, and deployment.',
          price: 1500.00,
          discountPrice: 1299.00,
          discountPercentage: 13,
          categoryId: categoryMap.get('web-development')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
          tags: ['web', 'react', 'nextjs', 'nodejs'],
          deliveryTime: 21,
          revisions: 5,
          views: 450,
          sales: 38,
          rating: 4.9,
          reviewCount: 42,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-001',
          title: 'E-commerce Website Package',
          description: 'Complete e-commerce solution with Stripe integration, inventory management, and admin dashboard.',
          price: 2500.00,
          discountPrice: 1999.00,
          discountPercentage: 20,
          categoryId: categoryMap.get('web-development')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'],
          tags: ['ecommerce', 'shopify', 'stripe'],
          deliveryTime: 30,
          revisions: 8,
          views: 320,
          sales: 25,
          rating: 4.8,
          reviewCount: 31,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-001',
          title: 'Windows 11 Pro License',
          description: 'Genuine Windows 11 Pro license key with lifetime validity. Instant delivery via email.',
          price: 89.99,
          discountPrice: 69.99,
          discountPercentage: 22,
          categoryId: categoryMap.get('software')?.toString() || '',
          type: 'goods',
          images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800'],
          tags: ['windows', 'license', 'software'],
          deliveryTime: 1,
          revisions: 0,
          views: 890,
          sales: 156,
          rating: 4.7,
          reviewCount: 89,
          featured: false,
          status: 'active',
        },
        // Creative Design Hub
        {
          sellerId: 'user-002',
          title: 'Professional Logo Design',
          description: 'Modern and memorable logo design with unlimited revisions. Includes vector files and brand guidelines.',
          price: 199.00,
          discountPrice: 149.00,
          discountPercentage: 25,
          categoryId: categoryMap.get('graphic-design')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800'],
          tags: ['logo', 'branding', 'design'],
          deliveryTime: 5,
          revisions: 10,
          views: 680,
          sales: 124,
          rating: 4.9,
          reviewCount: 98,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-002',
          title: 'Social Media Branding Package',
          description: 'Complete branding package including logo, color palette, typography, and social media templates.',
          price: 499.00,
          discountPrice: 399.00,
          discountPercentage: 20,
          categoryId: categoryMap.get('graphic-design')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
          tags: ['branding', 'social-media', 'templates'],
          deliveryTime: 7,
          revisions: 5,
          views: 420,
          sales: 67,
          rating: 4.8,
          reviewCount: 54,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-002',
          title: 'Premium Icon Set - 500+ Icons',
          description: 'High-quality vector icons for web and mobile apps. SVG, PNG, and Figma formats included.',
          price: 49.00,
          discountPrice: 29.00,
          discountPercentage: 41,
          categoryId: categoryMap.get('graphic-design')?.toString() || '',
          type: 'goods',
          images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
          tags: ['icons', 'vector', 'ui'],
          deliveryTime: 1,
          revisions: 0,
          views: 230,
          sales: 89,
          rating: 4.6,
          reviewCount: 45,
          featured: false,
          status: 'active',
        },
        // Digital Marketing Pro
        {
          sellerId: 'user-003',
          title: 'SEO Optimization Package',
          description: 'Complete SEO audit and optimization for your website. Includes keyword research, on-page SEO, and technical improvements.',
          price: 599.00,
          discountPrice: 499.00,
          discountPercentage: 17,
          categoryId: categoryMap.get('digital-marketing')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
          tags: ['seo', 'optimization', 'marketing'],
          deliveryTime: 14,
          revisions: 3,
          views: 560,
          sales: 78,
          rating: 4.7,
          reviewCount: 65,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-003',
          title: 'Social Media Management (1 Month)',
          description: 'Full social media management for 3 platforms. Includes content creation, scheduling, and analytics reports.',
          price: 799.00,
          discountPrice: 699.00,
          discountPercentage: 13,
          categoryId: categoryMap.get('digital-marketing')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800'],
          tags: ['social-media', 'management', 'content'],
          deliveryTime: 30,
          revisions: 5,
          views: 340,
          sales: 45,
          rating: 4.6,
          reviewCount: 38,
          featured: false,
          status: 'active',
        },
        // Code Masters
        {
          sellerId: 'user-004',
          title: 'React Native Mobile App',
          description: 'Cross-platform mobile app development for iOS and Android. Includes push notifications and backend integration.',
          price: 3500.00,
          discountPrice: 2999.00,
          discountPercentage: 14,
          categoryId: categoryMap.get('web-development')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'],
          tags: ['react-native', 'mobile', 'ios', 'android'],
          deliveryTime: 45,
          revisions: 10,
          views: 280,
          sales: 19,
          rating: 4.9,
          reviewCount: 22,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-004',
          title: 'API Development & Integration',
          description: 'Custom REST API development with authentication, documentation, and third-party integrations.',
          price: 1200.00,
          discountPrice: 999.00,
          discountPercentage: 17,
          categoryId: categoryMap.get('web-development')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'],
          tags: ['api', 'backend', 'integration'],
          deliveryTime: 14,
          revisions: 5,
          views: 190,
          sales: 34,
          rating: 4.8,
          reviewCount: 28,
          featured: false,
          status: 'active',
        },
        // Media Studio
        {
          sellerId: 'user-005',
          title: 'Professional Video Editing',
          description: 'High-quality video editing for YouTube, social media, or business. Includes color grading, sound design, and motion graphics.',
          price: 299.00,
          discountPrice: 249.00,
          discountPercentage: 17,
          categoryId: categoryMap.get('video-animation')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'],
          tags: ['video', 'editing', 'youtube'],
          deliveryTime: 7,
          revisions: 5,
          views: 410,
          sales: 56,
          rating: 4.8,
          reviewCount: 47,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-005',
          title: 'Animated Explainer Video',
          description: '60-second custom animated explainer video with professional voiceover and background music.',
          price: 899.00,
          discountPrice: 799.00,
          discountPercentage: 11,
          categoryId: categoryMap.get('video-animation')?.toString() || '',
          type: 'service',
          images: ['https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800'],
          tags: ['animation', 'explainer', 'video'],
          deliveryTime: 14,
          revisions: 3,
          views: 260,
          sales: 31,
          rating: 4.9,
          reviewCount: 26,
          featured: true,
          status: 'active',
        },
        {
          sellerId: 'user-005',
          title: 'Stock Video Footage Bundle',
          description: '100+ high-resolution stock video clips for commercial use. 4K quality with various themes.',
          price: 79.00,
          discountPrice: 59.00,
          discountPercentage: 25,
          categoryId: categoryMap.get('video-animation')?.toString() || '',
          type: 'goods',
          images: ['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800'],
          tags: ['stock', 'footage', '4k'],
          deliveryTime: 1,
          revisions: 0,
          views: 180,
          sales: 42,
          rating: 4.5,
          reviewCount: 19,
          featured: false,
          status: 'active',
        },
      ];

      await Listing.insertMany(listings);
      console.log('Listings seeded');

      // Create some mock reviews
      const allListings = await Listing.find().lean();
      const demoBuyerId = 'user-buyer-001';
      
      for (const listing of allListings.slice(0, 8)) {
        const existingReview = await Review.findOne({ listingId: listing._id, reviewerId: demoBuyerId });
        if (!existingReview) {
          await Review.create({
            orderId: 'order-mock-001',
            reviewerId: demoBuyerId,
            revieweeId: listing.sellerId,
            listingId: listing._id,
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            content: 'Great work! Highly recommended. The seller delivered exactly what was promised and the quality exceeded my expectations.',
          });
        }
      }
      console.log('Mock reviews created');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
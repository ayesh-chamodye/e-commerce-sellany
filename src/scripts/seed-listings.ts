import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuWpBXg9o0VCst7mADZowKro5T3pt47CA",
  authDomain: "sellany-502609.firebaseapp.com",
  databaseURL: "https://sellany-502609-default-rtdb.firebaseio.com",
  projectId: "sellany-502609",
  storageBucket: "sellany-502609.firebasestorage.app",
  messagingSenderId: "1098367987126",
  appId: "1:1098367987126:web:d2c460be73f42c139fa517",
  measurementId: "G-6XDPLV39JN"
};

let app: FirebaseApp;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const mockListings = [
  {
    title: "Professional Logo Design",
    description: "Get a stunning, modern logo design for your business. Includes 3 initial concepts, unlimited revisions, and all file formats (AI, EPS, PNG, JPG, SVG).",
    price: 149,
    category: "services",
    images: ["https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-1",
    sellerName: "DesignPro Studio",
    status: "active",
  },
  {
    title: "Social Media Management Package",
    description: "Complete social media management for 1 month. Includes 20 posts, content creation, hashtag research, and weekly analytics reports.",
    price: 299,
    category: "services",
    images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-1",
    sellerName: "SocialBoost Agency",
    status: "active",
  },
  {
    title: "Website Development - React/Next.js",
    description: "Custom website built with modern React/Next.js. Responsive design, SEO optimized, fast loading, and deployed to Vercel.",
    price: 899,
    category: "services",
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-2",
    sellerName: "WebWizards",
    status: "active",
  },
  {
    title: "iPhone 14 Pro Max - 256GB",
    description: "Brand new iPhone 14 Pro Max in Space Black. 256GB storage, A16 Bionic chip, 48MP camera, Always-On display. Factory unlocked.",
    price: 999,
    category: "products",
    images: ["https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-3",
    sellerName: "TechDeals",
    status: "active",
  },
  {
    title: "Handmade Leather Wallet",
    description: "Handcrafted genuine leather wallet with RFID blocking. Multiple card slots, ID window, and bill compartment. Ages beautifully.",
    price: 49,
    category: "products",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-4",
    sellerName: "LeatherCraft Co",
    status: "active",
  },
  {
    title: "Gaming PC - RTX 4080, 32GB RAM",
    description: "High-end gaming PC with Intel i9-13900K, RTX 4080, 32GB DDR5, 1TB NVMe SSD. Perfect for 4K gaming and content creation.",
    price: 2499,
    category: "products",
    images: ["https://images.unsplash.com/photo-1587831990711-23d4d291e7f2?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-3",
    sellerName: "TechDeals",
    status: "active",
  },
  {
    title: "Netflix Premium Account - 1 Year",
    description: "Netflix Premium subscription for 1 year. 4K Ultra HD, 4 simultaneous streams, download on 6 devices. Instant delivery.",
    price: 89,
    category: "accounts",
    images: ["https://images.unsplash.com/photo-1574375927938-5ff6f7338d35?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-5",
    sellerName: "DigitalKeys",
    status: "active",
  },
  {
    title: "Spotify Premium - Individual (12 Months)",
    description: "Spotify Premium Individual plan for 12 months. Ad-free music, offline listening, unlimited skips. Full warranty included.",
    price: 59,
    category: "accounts",
    images: ["https://images.unsplash.com/photo-1614680323772-9e6f9c7b7e4d?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-5",
    sellerName: "DigitalKeys",
    status: "active",
  },
  {
    title: "Custom WordPress Website",
    description: "Professional WordPress website with custom theme. Up to 10 pages, contact form, SEO setup, and 30 days of free support.",
    price: 599,
    category: "services",
    images: ["https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-2",
    sellerName: "WebWizards",
    status: "active",
  },
  {
    title: "Nike Air Jordan 1 Retro High",
    description: "Brand new Nike Air Jordan 1 Retro High OG. Size 10, authentic, comes with original box and receipt. Multiple colorways available.",
    price: 180,
    category: "products",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-6",
    sellerName: "SneakerVault",
    status: "active",
  },
  {
    title: "Video Editing Service - 5 Minute Video",
    description: "Professional video editing for YouTube, TikTok, or Instagram. Includes color grading, transitions, text overlays, and background music.",
    price: 79,
    category: "services",
    images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-1",
    sellerName: "DesignPro Studio",
    status: "active",
  },
  {
    title: "Canva Pro - 1 Year Subscription",
    description: "Canva Pro subscription for 12 months. Access to premium templates, elements, photos, and fonts. Instant account delivery.",
    price: 39,
    category: "accounts",
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-5",
    sellerName: "DigitalKeys",
    status: "active",
  },
  {
    title: "SaaS Landing Page Template",
    description: "Modern, conversion-optimized landing page template for SaaS products. Built with HTML/CSS/JS, easy to customize, responsive design.",
    price: 29,
    category: "digital",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-2",
    sellerName: "WebWizards",
    status: "active",
  },
  {
    title: "SEO Audit & Optimization",
    description: "Comprehensive SEO audit of your website. Includes technical analysis, keyword research, competitor analysis, and actionable recommendations.",
    price: 199,
    category: "services",
    images: ["https://images.unsplash.com/photo-1543286386-713b5a19c3aa?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-7",
    sellerName: "SEO Masters",
    status: "active",
  },
  {
    title: "Logo Animation Pack",
    description: "50+ professional logo animation presets for After Effects. Easy to customize, 4K resolution, perfect for brand intros and outros.",
    price: 34,
    category: "digital",
    images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"],
    sellerId: "mock-seller-1",
    sellerName: "DesignPro Studio",
    status: "active",
  },
];

async function seedListings() {
  console.log('Starting to seed listings...');

  for (const listing of mockListings) {
    try {
      const docRef = await addDoc(collection(db, 'listings'), {
         ...listing,
         createdAt: new Date(),
         updatedAt: new Date(),
       });
      console.log(`Created listing: ${listing.title} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`Error creating listing "${listing.title}":`, error);
    }
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seedListings();
# SellAny - E-Commerce Marketplace

A fully functional Next.js e-commerce platform for buying and selling services, goods, and accounts, similar to Fiverr.

## Features

- **Google Authentication** - Sign in with Google
- **Marketplace** - Browse services, goods, and accounts
- **Image Gallery** - Multiple images per listing
- **Video Support** - YouTube URL embedding
- **Discounts** - Sellers can set discount prices
- **Reviews & Ratings** - Buyers can leave reviews
- **Messaging System** - Real-time inbox with replying
- **Order Management** - Track orders from purchase to completion
- **Seller & Buyer Dashboards** - Manage listings, orders, and favorites
- **Search & Filters** - Find exactly what you need
- **Responsive Design** - Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e-commerce-sellany
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/schema.sql` and run it
4. (Optional) Run `supabase/seed-data.sql` to add sample data

### 4. Enable Google Authentication

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret)
4. Set the redirect URL to `http://localhost:3000/auth/callback`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/       # Auth callback handler
│   │   ├── role-selection/ # Role selection after signup
│   │   └── signin/         # Sign in page
│   ├── dashboard/
│   │   ├── buyer/          # Buyer dashboard
│   │   └── seller/         # Seller dashboard
│   ├── inbox/              # Messaging inbox
│   ├── list/
│   │   └── create/         # Create new listing
│   ├── marketplace/        # Browse listings
│   ├── orders/             # Order history
│   ├── reviews/            # Leave reviews
│   ├── services/
│   │   └── [id]/           # Service detail page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/               # Auth components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Utility functions
├── types/
│   └── database.ts         # TypeScript types
└── middleware.ts           # Auth middleware
```

## User Roles

- **Buyer**: Browse marketplace, purchase items, leave reviews, message sellers
- **Seller**: Create listings, manage orders, respond to messages, view analytics

## Database Schema

### Tables

- `profiles` - User profiles (extends auth.users)
- `categories` - Listing categories
- `listings` - Services, goods, and accounts
- `orders` - Purchase orders
- `messages` - Messaging/inbox
- `reviews` - User reviews and ratings
- `favorites` - Wishlist

## Key Features Explained

### Image Gallery
Listings support multiple images. Users can browse through the gallery on the service detail page.

### Video Support
Sellers can add YouTube URLs to their listings. The video is embedded using an iframe.

### Discounts
Sellers can set both a regular price and a discount price. The platform automatically calculates the discount percentage.

### Messaging
Buyers can send inquiries to sellers through the messaging system. Real-time updates are supported via Supabase Realtime.

### Reviews
After completing an order, buyers can leave a 1-5 star rating and written review.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Environment Variables

See `.env.local.example` for required environment variables.

## License

MIT

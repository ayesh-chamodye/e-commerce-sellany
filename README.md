# SellAny

A Next.js e-commerce marketplace built with Firebase and Vercel Blob. Supports buyers, sellers, product listings, cart, checkout, orders, favorites, and real-time messaging.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Firebase Firestore & Auth
- Vercel Blob
- Tailwind CSS
- Zustand
- lucide-react

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Firebase config and JWT secret.

3. Run the dev server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run seed` — seed mock listings into Firestore
- `npm run seed:messages` — seed mock inbox conversations/messages into Firestore

## Project Structure

- `src/app` — Next.js app router pages and API routes
- `src/components` — shared UI components
- `src/contexts` — React context providers
- `src/hooks` — custom hooks
- `src/lib` — Firebase, auth, API helpers
- `src/scripts` — seed scripts
- `src/stores` — Zustand stores
- `src/types` — TypeScript interfaces

## Features

- Buyer and seller roles with role switching
- Marketplace with search and category filtering
- Product detail page with Buy Now and Add to Cart
- Shopping cart with quantity controls
- Checkout flow with order creation
- Seller product management (create, edit, delete)
- Inbox with conversations and messages
- Orders, favorites, and settings pages

## Environment Variables

Create a `.env.local` file with:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `JWT_SECRET`

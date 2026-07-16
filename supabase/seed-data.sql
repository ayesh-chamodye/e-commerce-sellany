-- Seed data for testing
-- Run this in Supabase SQL Editor after creating the schema

-- Insert categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Web Development', 'web-development', 'Professional web development services', '💻'),
  ('Graphic Design', 'graphic-design', 'Logo design, branding, and visual identity', '🎨'),
  ('Digital Marketing', 'digital-marketing', 'SEO, social media, and advertising', '📈'),
  ('Writing & Translation', 'writing-translation', 'Content writing and translation services', '✍️'),
  ('Video & Animation', 'video-animation', 'Video editing, animation, and production', '🎬'),
  ('Music & Audio', 'music-audio', 'Music production, mixing, and mastering', '🎵'),
  ('Accounts', 'accounts', 'Buy and sell social media, gaming, and business accounts', '👤'),
  ('Electronics', 'electronics', 'Gadgets, phones, laptops, and accessories', '📱');

-- Insert sample listings
INSERT INTO public.listings (seller_id, title, description, price, discount_price, discount_percentage, category_id, type, images, tags, delivery_time, revisions, views, sales, rating, review_count, featured) 
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'Professional Logo Design',
  'I will create a modern and professional logo design for your business. Includes unlimited revisions until you are satisfied.',
  99.00,
  79.00,
  20,
  (SELECT id FROM public.categories WHERE slug = 'graphic-design'),
  'service',
  ARRAY['https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800'],
  ARRAY['logo', 'design', 'branding'],
  3,
  3,
  150,
  12,
  4.8,
  8,
  true;

INSERT INTO public.listings (seller_id, title, description, price, discount_price, discount_percentage, category_id, type, images, tags, delivery_time, revisions, views, sales, rating, review_count, featured) 
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'Full Stack Web Development',
  'Complete web application development using React, Node.js, and PostgreSQL. Responsive design, database integration, and deployment.',
  500.00,
  NULL,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'web-development'),
  'service',
  ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'],
  ARRAY['web', 'development', 'react', 'nodejs'],
  14,
  5,
  320,
  25,
  4.9,
  15,
  true;

INSERT INTO public.listings (seller_id, title, description, price, discount_price, discount_percentage, category_id, type, images, tags, delivery_time, revisions, views, sales, rating, review_count, featured) 
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'Instagram Account - 50K Followers',
  'Established Instagram account with 50,000+ followers. High engagement rate, niche in lifestyle and fashion.',
  299.00,
  249.00,
  17,
  (SELECT id FROM public.categories WHERE slug = 'accounts'),
  'account',
  ARRAY['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
  ARRAY['instagram', 'social-media', 'followers'],
  1,
  0,
  200,
  5,
  4.5,
  3,
  false;

INSERT INTO public.listings (seller_id, title, description, price, discount_price, discount_percentage, category_id, type, images, tags, delivery_time, revisions, views, sales, rating, review_count, featured) 
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'SEO Optimization Package',
  'Complete SEO audit and optimization for your website. Includes keyword research, on-page SEO, and technical improvements.',
  150.00,
  NULL,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'digital-marketing'),
  'service',
  ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
  ARRAY['seo', 'marketing', 'optimization'],
  7,
  2,
  180,
  18,
  4.7,
  12,
  true;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/auth/AuthProvider';
import type { ICategory } from '@/types/database';
import { apiFetch } from '@/lib/api';
import { createListing } from '@/app/actions/createListing';

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    type: 'service',
    deliveryTime: '',
    revisions: '',
    tags: '',
    images: '',
    youtubeUrl: '',
  });

  useEffect(() => {
    if (!loading && user?.role !== 'seller') {
      router.push('/');
    }
    const fetchCategories = async () => {
      try {
        const cats = await apiFetch('/api/categories');
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const images = formData.images.split(',').map(img => img.trim()).filter(Boolean);
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    const youtubeMatch = formData.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    const youtubeUrl = youtubeMatch ? youtubeMatch[1] : formData.youtubeUrl;

    const discountPercentage = formData.discountPrice
      ? Math.round((1 - parseFloat(formData.discountPrice) / parseFloat(formData.price)) * 100)
      : undefined;

    await createListing({
      sellerId: user.id,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      discountPercentage,
      categoryId: formData.categoryId || undefined,
      type: formData.type as any,
      deliveryTime: formData.deliveryTime ? parseInt(formData.deliveryTime) : undefined,
      revisions: formData.revisions ? parseInt(formData.revisions) : undefined,
      tags,
      images,
      youtubeUrl: youtubeUrl || undefined,
    });

    setSubmitting(false);
    router.push('/marketplace');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'seller') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You need to be a seller to create listings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
        <p className="text-gray-600">List your service, goods, or account for sale</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="e.g., Professional Logo Design"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Describe what you're offering..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="service">Service</option>
              <option value="goods">Goods</option>
              <option value="account">Account</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="79.99 (optional)"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (days)</label>
            <input
              type="number"
              min="1"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revisions</label>
            <input
              type="number"
              min="0"
              value={formData.revisions}
              onChange={(e) => setFormData({ ...formData, revisions: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
          <textarea
            rows={3}
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL (optional)</label>
          <input
            type="text"
            value={formData.youtubeUrl}
            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="design, logo, branding"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

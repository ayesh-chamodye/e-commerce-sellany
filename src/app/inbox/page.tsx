'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/components/auth/AuthProvider';
import { apiFetch } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import type { IConversation } from '@/types/database';

export default function InboxPage() {
  const { user, loading } = useSession();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [pageLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      try {
        const convs = await apiFetch('/api/messages');
        setConversations(convs);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
        <p className="text-gray-600 mb-6">You need to sign in to view your messages</p>
        <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inbox</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {pageLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Start a conversation by contacting a seller</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <Link
                key={conv.partnerId}
                href={`/inbox/${conv.partnerId}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                   {conv.partner?.image ? (
                     <Image src={conv.partner.image} alt="" width={48} height={48} className="rounded-full object-cover" />
                   ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-600">
                      {conv.partner?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{conv.partner?.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conv.lastMessage.senderId === user.id ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                    {conv.lastMessage.senderId === user.id ? 'You: ' : ''}{conv.lastMessage.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

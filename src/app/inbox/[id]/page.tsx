'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/components/auth/AuthProvider';
import { apiFetch } from '@/lib/api';
import type { IMessage, IUser } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';

const FALLBACK_NOW = Date.now();

export default function ConversationPage() {
  const params = useParams();
  const partnerId = params.id as string;
  const { user, loading } = useSession();
  const [messages, setMessages] = useState<(IMessage & { sender: IUser; receiver: IUser })[]>([]);
  const [partner, setPartner] = useState<IUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [pageLoading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;
      try {
        const msgs = await apiFetch(`/api/messages?partnerId=${partnerId}`);
        setMessages(msgs);
        if (msgs.length > 0) {
          const firstMsg = msgs[0] as IMessage & { sender: IUser; receiver: IUser };
          const partnerUser = firstMsg.senderId === partnerId ? firstMsg.sender : firstMsg.receiver;
          setPartner(partnerUser);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user, partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    setSending(true);

    const msg = await apiFetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        receiverId: partnerId,
        content: newMessage.trim(),
      }),
    });
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    setSending(false);
  };

  if (!user || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
        <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-200px)] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <Link href="/inbox" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
             {partner?.image && <Image src={partner.image} alt="" width={40} height={40} className="rounded-full object-cover" />}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{partner?.name || 'User'}</h2>
            <p className="text-sm text-gray-500">{partner?.email}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {pageLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId = msg.senderId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      senderId === user.id
                        ? 'bg-indigo-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        senderId === user.id ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                       {formatDistanceToNow(new Date(msg.createdAt || FALLBACK_NOW), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

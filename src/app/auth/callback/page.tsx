'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/components/auth/AuthProvider';
import AuthCallbackClient from './AuthCallbackClient';

export default function AuthCallbackPage() {
  return <AuthCallbackClient />;
}

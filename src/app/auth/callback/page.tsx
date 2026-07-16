import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthCallbackClient from './AuthCallbackClient';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/');
  }

  const params = await searchParams;
  const error = params.error as string | undefined;

  return <AuthCallbackClient error={error} />;
}

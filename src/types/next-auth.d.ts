import { User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: 'buyer' | 'seller' | 'admin';
  }

  interface Session {
    user: User;
  }
}

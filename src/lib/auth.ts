import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextResponse } from "next/server";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb/connection";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

// @ts-ignore
function getMongoDBAdapter(): any {
  // @ts-ignore
  return MongoDBAdapter({
    // @ts-ignore
    db: () => {
      return connectToDatabase().then((mongoose: any) => mongoose.connection.db);
    },
  }) as any;
}

export const authOptions: any = {
  adapter: getMongoDBAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub!;
        const user = await User.findById(token.sub).select('role');
        if (user) {
          session.user.role = (user as any).role;
        }
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        await connectToDatabase();
        const existingUser = await User.findById(user.id);
        if (!existingUser) {
          await User.create({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'buyer',
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database',
  },
};

export async function auth() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await auth() as any;
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

import { ApiResponse, Auth } from '@/types';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<any> {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!credentials)
          return { status: false, error: 'Please provide credentials' };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/authenticate?userName=${email}&password=${password}`
        );
        if (response.status !== 200) throw null;
        const data: ApiResponse<Auth> = await response.json();

        if (!data.succeeded) return { status: false, error: data.messages[0] };

        const user = data.data;
        return user;
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) throw new Error('Error');
      return true;
    },

    async jwt({ token, user }) {
      if (user) token = { ...user };
      return token;
    },

    async session({ session, token }) {
      if (token) session.user = token as any;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes('/signout') || url.includes('/api/auth/signout')) {
        return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
      }
      // Handle other redirects
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 500 * 60, // 500 minutes in seconds
  },
  pages: {
    signIn: '/login',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 500 * 60, // 500 minutes in seconds
      },
    },
  },
});

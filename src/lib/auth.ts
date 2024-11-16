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
      if (url === baseUrl + "/api/auth/signout") {
        return baseUrl; 
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
});

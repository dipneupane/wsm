import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session {
    user: {
      id: string;
      token: string;
      email: string;
      role: string;
      jwt: string;
    };
  }
}

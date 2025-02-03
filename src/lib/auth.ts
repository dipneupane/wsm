import { ApiResponse, Auth, UserAuthType } from '@/types';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
  try {
    //console.log('Beaarer token', `Bearer ${token.refreshToken}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/renewToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    if (response.status !== 200) {
      throw token;
    }

    const result = (await response.json()) as ApiResponse<UserAuthType>;
    if (!result.succeeded) {
      throw token;
    }
    return {
      ...token,
      jwt: result.data.jwt,
      refreshToken: result.data.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

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

    async jwt({ token, account, user }) {
      if (user) token = { ...user };

      /** get the jwt expiration time and  add new propery to token ie token.expirationTime */
      if (token.jwt) {
        //@ts-ignore
        const decodedToken = JSON.parse(atob(token.jwt.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        token.accessTokenExpires = expirationTime;
      }
      /** user  is logging in first time  */
      if (account && user) {
        // console.log('account', account);
        return {
          ...user,
        };
      }

      // console.log(
      //   '**** Access token expires on *****',
      //   token.accessTokenExpires,
      //   new Date(token.accessTokenExpires as number).toLocaleString()
      // );

      /**  if the token as not expired  */
      if (Date.now() < Number(token.accessTokenExpires)) {
        // console.log('**** returning previous token  ******');
        return token;
      }
      // Access token has expired, try to update it
      //  console.log('**** Update Refresh token ******');
      const newToken = await refreshAccessToken(token);
      // console.log('res', newToken);
      //@ts-ignore
      if (newToken.error) {
        // here returing null will logout the user
        return null;
      }
      return newToken;
    },
    async session({ session, token }) {
      //  console.log('session', session);
      if (token) session.user = token as any;
      //  console.log('token', token);
      //console.log('session', session);
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

  // session: {
  //   strategy: 'jwt',
  //   maxAge: 500 * 60, // 500 minutes in seconds
  // },
  // pages: {
  //   signIn: '/login',
  // },
  // cookies: {
  //   sessionToken: {
  //     name: 'next-auth.session-token',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: process.env.NODE_ENV === 'production',
  //       maxAge: 500 * 60, // 500 minutes in seconds
  //     },
  //   },
  // },
});

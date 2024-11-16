import React from 'react';

import { auth } from '@/lib/auth';

import SessionProvider from './next-auth-session-provider';
import ReactQueryProvider from './react-query-provider';
import { ThemeProvider } from './theme-provider';

const Provider = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider session={session}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};

export default Provider;

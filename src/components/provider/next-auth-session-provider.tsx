'use client';

import React from 'react';

import { SessionProvider as SP } from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
  session: any;
}

export default function SessionProvider({
  children,
  session,
}: SessionProviderProps) {
  return <SP session={session}>{children}</SP>;
}

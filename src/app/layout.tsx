import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { Toaster } from 'sonner';

import Provider from '@/components/provider/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DoorSets',
  description: 'app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}

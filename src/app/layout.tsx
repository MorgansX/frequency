import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'frequency',
  description: 'radio app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh flex flex-col`}
      >
        <Providers>
          <header className="p-8 font-black">
            <h1 className="text-3xl">Frequency</h1>
            <span>Radio app</span>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}

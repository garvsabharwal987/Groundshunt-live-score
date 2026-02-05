import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: {
    default: 'SPORTIKON Arena | Live Scores & Tournament Tracking',
    template: '%s | SPORTIKON Arena',
  },
  description: 'GROUNDSHUNT x SPORTIKON 4.0 - Multi-sport live scoring and tournament tracking platform for Table Tennis, Football, Basketball, Badminton, and Volleyball.',
  keywords: ['sports', 'live scores', 'table tennis', 'football', 'basketball', 'badminton', 'volleyball', 'tournament', 'sportikon'],
  authors: [{ name: 'SPORTIKON Arena Team' }],
  openGraph: {
    title: 'SPORTIKON Arena',
    description: 'Multi-sport live scoring and tournament tracking platform',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

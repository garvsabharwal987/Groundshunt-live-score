import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: {
    default: 'Groundshunt Arena | Live Scores & Tournament Tracking',
    template: '%s | Groundshunt Arena',
  },
  description: 'Groundshunt Arena - Multi-sport live scoring and tournament tracking platform for Table Tennis, Football, Basketball, Badminton, and Volleyball.',
  keywords: ['sports', 'live scores', 'table tennis', 'football', 'basketball', 'badminton', 'volleyball', 'tournament', 'groundshunt'],
  authors: [{ name: 'Groundshunt Arena Team' }],
  openGraph: {
    title: 'Groundshunt Arena',
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 font-sans antialiased transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

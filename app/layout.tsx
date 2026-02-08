import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://neuraweb.tech'),
  title: {
    default: 'NeuraWeb - Professional Web Development & AI Integration Services',
    template: '%s | NeuraWeb',
  },
  description: 'Professional web development, AI integration, and automation services. Create stunning websites and intelligent solutions tailored to your business needs.',
  keywords: ['web development', 'AI integration', 'automation', 'professional websites', 'business solutions', 'Next.js', 'React'],
  authors: [{ name: 'NeuraWeb' }],
  creator: 'NeuraWeb',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neuraweb.tech',
    siteName: 'NeuraWeb',
    title: 'NeuraWeb - Professional Web Development & AI Integration Services',
    description: 'Professional web development, AI integration, and automation services. Create stunning websites and intelligent solutions tailored to your business needs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuraWeb - Professional Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraWeb - Professional Web Development & AI Integration Services',
    description: 'Professional web development, AI integration, and automation services.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
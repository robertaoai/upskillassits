import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/contexts/SessionContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Skills Coach - Built with ChatAndBuild',
  description: 'Assess and enhance your AI capabilities with personalized coaching',
  keywords: 'no-code, app builder, conversation-driven development, AI assessment, skills coaching',
  openGraph: {
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Assess and enhance your AI capabilities with personalized coaching',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Assess and enhance your AI capabilities with personalized coaching',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
    site: '@chatandbuild',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster position="top-center" richColors theme="dark" />
        </SessionProvider>
      </body>
    </html>
  );
}

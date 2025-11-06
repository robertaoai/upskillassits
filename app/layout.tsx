import type { Metadata } from 'next';
import { Orbitron, Exo_2 } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/contexts/SessionContext';
import { Toaster } from 'sonner';
import { DebugPanel } from '@/components/DebugPanel';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-exo2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Skills Coach - Built with ChatAndBuild',
  description: 'Unlock your potential with personalized AI-driven coaching',
  keywords: 'no-code, app builder, conversation-driven development, AI coaching, skills assessment',
  openGraph: {
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Unlock your potential with personalized AI-driven coaching',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Unlock your potential with personalized AI-driven coaching',
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
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`}>
      <body>
        <SessionProvider>
          {children}
          <Toaster position="top-center" />
          <DebugPanel />
        </SessionProvider>
      </body>
    </html>
  );
}

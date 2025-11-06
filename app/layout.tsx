import type { Metadata } from 'next';
import { Orbitron, Exo_2 } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/contexts/SessionContext';
import { Toaster } from 'sonner';

// Optimize Orbitron - only load weights used for headings/emphasis
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['700', '900'], // Only bold and black weights
  display: 'swap', // Prevent invisible text during load
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Optimize Exo 2 - only load weights used for body text
const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo-2',
  weight: ['400', '600'], // Only regular and semi-bold
  display: 'swap', // Prevent invisible text during load
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'AI Skills Coach - Built with ChatAndBuild',
  description: 'Assess and enhance your AI skills with personalized coaching',
  keywords: 'no-code, app builder, conversation-driven development, AI coaching, skills assessment',
  openGraph: {
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Assess and enhance your AI skills with personalized coaching',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Assess and enhance your AI skills with personalized coaching',
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
      <body className={`${orbitron.variable} ${exo2.variable}`}>
        <SessionProvider>
          {children}
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}

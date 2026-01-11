import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getProfile } from '@/lib/supabase-server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EAwiz - AI-Powered Tools for Executive Assistants',
  description:
    'Empowering Executive Assistants with AI-powered tools, curated prompts, and a vibrant community. Join the EAwiz movement.',
  keywords: ['executive assistant', 'AI', 'productivity', 'prompts', 'tools', 'community'],
  openGraph: {
    title: 'EAwiz - AI-Powered Tools for Executive Assistants',
    description:
      'Empowering Executive Assistants with AI-powered tools, curated prompts, and a vibrant community.',
    type: 'website',
    url: 'https://eawiz.com',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar user={profile} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

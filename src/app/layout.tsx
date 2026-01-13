import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getProfile } from '@/lib/supabase-server';
import { ThemeProviderWrapper } from '@/components/providers/ThemeProviderWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

// Font classes to pass to ThemeProvider
const fontClasses = {
  inter: inter.className,
  jakarta: jakarta.className,
};

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
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className={inter.className}>
        <ThemeProviderWrapper fontClasses={fontClasses}>
          <div className="min-h-screen flex flex-col">
            <Navbar user={profile} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

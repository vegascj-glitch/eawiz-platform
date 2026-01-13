'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const themes = [
  { id: 'default', name: 'Default', description: 'Original EAwiz theme' },
  { id: 'midnight', name: 'Midnight', description: 'Dark premium fintech vibe' },
  { id: 'paper', name: 'Paper', description: 'Light editorial premium vibe' },
  { id: 'luxe', name: 'Luxe', description: 'Light premium with teal/violet accent' },
  { id: 'pop', name: 'Pop', description: 'Light community vibe with pink/plum' },
];

const fonts = [
  { id: 'inter', name: 'Inter', description: 'Clean, modern sans-serif (default)' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', description: 'Premium, refined sans-serif' },
];

function ThemePreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTheme = searchParams.get('theme') || 'default';
  const currentFont = searchParams.get('font') || 'inter';

  const setTheme = (theme: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (theme === 'default') {
      params.delete('theme');
    } else {
      params.set('theme', theme);
    }
    router.push(`/design/theme?${params.toString()}`);
  };

  const setFont = (font: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (font === 'inter') {
      params.delete('font');
    } else {
      params.set('font', font);
    }
    router.push(`/design/theme?${params.toString()}`);
  };

  return (
    <div className="min-h-screen theme-bg theme-fg">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">EAwiz UI Preview</h1>
          <p className="theme-muted-fg text-lg">
            Preview different visual designs without affecting app logic
          </p>
        </div>

        {/* Theme Selector */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Theme</h2>
          <div className="flex flex-wrap gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  currentTheme === theme.id
                    ? 'theme-primary border-transparent'
                    : 'theme-card theme-border hover:opacity-80'
                }`}
              >
                <span className="font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm theme-muted-fg">
            Current: <strong>{themes.find(t => t.id === currentTheme)?.name}</strong> - {themes.find(t => t.id === currentTheme)?.description}
          </p>
        </section>

        {/* Font Selector */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Font</h2>
          <div className="flex flex-wrap gap-3">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => setFont(font.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  currentFont === font.id
                    ? 'theme-primary border-transparent'
                    : 'theme-card theme-border hover:opacity-80'
                }`}
              >
                <span className="font-medium">{font.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm theme-muted-fg">
            Current: <strong>{fonts.find(f => f.id === currentFont)?.name}</strong> - {fonts.find(f => f.id === currentFont)?.description}
          </p>
        </section>

        {/* URL Quick Links */}
        <section className="mb-12 p-4 rounded-lg theme-muted">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="/?theme=midnight" className="theme-primary-text hover:underline">/?theme=midnight</a>
            <span className="theme-muted-fg">|</span>
            <a href="/?theme=paper" className="theme-primary-text hover:underline">/?theme=paper</a>
            <span className="theme-muted-fg">|</span>
            <a href="/?theme=luxe" className="theme-primary-text hover:underline">/?theme=luxe</a>
            <span className="theme-muted-fg">|</span>
            <a href="/?theme=pop" className="theme-primary-text hover:underline">/?theme=pop</a>
            <span className="theme-muted-fg">|</span>
            <a href="/?font=jakarta" className="theme-primary-text hover:underline">/?font=jakarta</a>
          </div>
        </section>

        {/* Sample UI Components */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Sample Components</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons Card */}
            <Card variant="bordered" className="theme-card theme-border">
              <CardHeader>
                <CardTitle className="theme-card-fg">Buttons</CardTitle>
                <CardDescription className="theme-muted-fg">Button variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="danger" size="sm">Danger</Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges Card */}
            <Card variant="bordered" className="theme-card theme-border">
              <CardHeader>
                <CardTitle className="theme-card-fg">Badges</CardTitle>
                <CardDescription className="theme-muted-fg">Badge variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Input Card */}
            <Card variant="bordered" className="theme-card theme-border">
              <CardHeader>
                <CardTitle className="theme-card-fg">Inputs</CardTitle>
                <CardDescription className="theme-muted-fg">Form elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  type="text"
                  placeholder="Text input..."
                  className="w-full px-3 py-2 rounded-lg theme-border border theme-card theme-card-fg focus:outline-none focus:ring-2 theme-ring"
                />
                <select className="w-full px-3 py-2 rounded-lg theme-border border theme-card theme-card-fg">
                  <option>Select option...</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </CardContent>
            </Card>

            {/* Typography Card */}
            <Card variant="bordered" className="theme-card theme-border">
              <CardHeader>
                <CardTitle className="theme-card-fg">Typography</CardTitle>
                <CardDescription className="theme-muted-fg">Text samples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="text-xl font-bold theme-card-fg">Heading Text</h3>
                <p className="theme-card-fg">Regular body text looks like this.</p>
                <p className="text-sm theme-muted-fg">Muted/secondary text appearance.</p>
                <p className="theme-primary-text font-medium">Primary colored text.</p>
              </CardContent>
            </Card>

            {/* Card Variants */}
            <Card variant="bordered" className="theme-card theme-border">
              <CardHeader>
                <CardTitle className="theme-card-fg">Card States</CardTitle>
                <CardDescription className="theme-muted-fg">Hover and active states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 rounded-lg theme-muted theme-card-fg">Muted background</div>
                <div className="p-3 rounded-lg theme-primary">Primary background</div>
                <div className="p-3 rounded-lg theme-secondary">Secondary background</div>
              </CardContent>
            </Card>

            {/* Sample Feature Card */}
            <Card variant="bordered" className="theme-card theme-border">
              <CardHeader>
                <CardTitle className="theme-card-fg">Feature Preview</CardTitle>
                <CardDescription className="theme-muted-fg">As it would appear on the site</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="theme-card-fg mb-4">
                  AI-powered tools designed specifically for Executive Assistants.
                </p>
                <Button variant="primary" size="sm">Learn More</Button>
              </CardContent>
              <CardFooter className="theme-border border-t mt-4 pt-4">
                <span className="text-sm theme-muted-fg">Updated recently</span>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Navigation to Navbar Preview */}
        <section className="mt-12 p-6 rounded-lg theme-card theme-border border text-center">
          <h3 className="text-xl font-semibold mb-2 theme-card-fg">Navbar Preview</h3>
          <p className="theme-muted-fg mb-4">See different navbar design variants</p>
          <a href="/design/navbar">
            <Button variant="primary">View Navbar Variants</Button>
          </a>
        </section>
      </div>
    </div>
  );
}

export default function ThemePreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThemePreviewContent />
    </Suspense>
  );
}

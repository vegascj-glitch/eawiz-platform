'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Navigation items (same as real navbar)
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/tools', label: 'Tools' },
  { href: '/lounge', label: 'EA Lounge' },
  { href: '/events', label: 'Events' },
];

const servicesLinks = [
  { href: '/services/coaching', label: 'Coaching' },
  { href: '/services/speaking', label: 'Speaking' },
  { href: '/services/custom-app-development', label: 'Custom App Development' },
];

type NavbarVariant = 'baseline' | 'premium' | 'community';

// Baseline Navbar - Current design
function BaselineNavbar() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">EAwiz</span>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <span
                  key={link.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 cursor-pointer"
                >
                  {link.label}
                </span>
              ))}
              <div className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                  Services
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {servicesLinks.map((link) => (
                        <span key={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                          {link.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button variant="primary" size="sm">Join Now</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Premium Navbar - Translucent blur, subtle shadow, active underline
function PremiumNavbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              EAwiz
            </span>
            <div className="hidden md:ml-12 md:flex md:space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                    activeLink === link.href
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  )}
                >
                  {link.label}
                  {activeLink === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
              <div className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg flex items-center gap-1"
                >
                  Services
                  <svg className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm ring-1 ring-gray-200/50 p-2">
                    {servicesLinks.map((link) => (
                      <span key={link.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                        {link.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
            <Button variant="primary" size="sm" className="shadow-md shadow-primary-500/20">
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Community Navbar - Pill-style nav, playful, badge for free event
function CommunityNavbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 py-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              EAwiz
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                AI for EAs
              </span>
            </span>
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full transition-all',
                    activeLink === link.href
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </button>
              ))}
              <div className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full flex items-center gap-1"
                >
                  Services
                  <svg className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 mt-2 w-60 rounded-2xl shadow-lg bg-white ring-1 ring-gray-200 p-2">
                    {servicesLinks.map((link) => (
                      <span key={link.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl cursor-pointer transition-colors">
                        {link.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Free Monthly Zoom Badge */}
            <Link href="/events" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Free Monthly Zoom
            </Link>
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button variant="primary" size="sm" className="rounded-full px-5">
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function NavbarPreviewPage() {
  const [activeVariant, setActiveVariant] = useState<NavbarVariant>('baseline');

  const variants: { id: NavbarVariant; name: string; description: string }[] = [
    { id: 'baseline', name: 'Baseline', description: 'Current navbar design (unchanged)' },
    { id: 'premium', name: 'Premium', description: 'Translucent blur + subtle shadow + active underline' },
    { id: 'community', name: 'Community', description: 'Pill-style nav + playful spacing + free event badge' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Active Navbar Preview */}
      <div className="sticky top-0 z-50">
        {activeVariant === 'baseline' && <BaselineNavbar />}
        {activeVariant === 'premium' && <PremiumNavbar />}
        {activeVariant === 'community' && <CommunityNavbar />}
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Navbar Preview</h1>
          <p className="text-gray-600">
            Compare different navbar design variants. Click to switch between styles.
          </p>
        </div>

        {/* Variant Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Variant</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setActiveVariant(variant.id)}
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-all',
                  activeVariant === variant.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <h3 className={cn(
                  'font-semibold mb-1',
                  activeVariant === variant.id ? 'text-primary-700' : 'text-gray-900'
                )}>
                  {variant.name}
                </h3>
                <p className="text-sm text-gray-600">{variant.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Page Content</h2>
          <p className="text-gray-600 mb-4">
            This sample content area helps you visualize how the navbar interacts with page content.
            Scroll up and down to see sticky behavior and transparency effects.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Feature One</h3>
              <p className="text-gray-600 text-sm">
                AI-powered prompts designed specifically for Executive Assistants.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Feature Two</h3>
              <p className="text-gray-600 text-sm">
                Professional tools to streamline your daily workflow.
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-primary-50 rounded-lg">
            <h3 className="font-semibold text-primary-900 mb-2">Join the Community</h3>
            <p className="text-primary-700 text-sm mb-4">
              Connect with other EAs and share best practices.
            </p>
            <Button variant="primary" size="sm">Learn More</Button>
          </div>
        </div>

        {/* Extra scroll space */}
        <div className="h-96 flex items-center justify-center text-gray-400">
          Scroll to test navbar sticky behavior
        </div>

        {/* Back to Theme Preview */}
        <div className="text-center">
          <Link href="/design/theme">
            <Button variant="outline">Back to Theme Preview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

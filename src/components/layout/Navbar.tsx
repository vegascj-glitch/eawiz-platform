'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/database';

interface NavbarProps {
  user: Profile | null;
}

const publicLinks = [
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

const memberLinks: { href: string; label: string }[] = [];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isServicesActive = servicesLinks.some(link => pathname.startsWith(link.href));

  const isMember = user?.subscription_status === 'active' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navLinks = [...publicLinks, ...(isMember ? memberLinks : [])];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">EAwiz</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                    isActive(link.href)
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown */}
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                    isServicesActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  Services
                  <svg
                    className={cn('ml-1 h-4 w-4 transition-transform', servicesOpen && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {servicesOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {servicesLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            'block px-4 py-2 text-sm',
                            isActive(link.href)
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                          onClick={() => setServicesOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && (
                <Link
                  href="/admin/leads"
                  className={cn(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                    isActive('/admin')
                      ? 'border-accent-500 text-accent-600'
                      : 'border-transparent text-accent-600 hover:text-accent-700 hover:border-accent-300'
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link href="/account">
                  <Button variant="ghost" size="sm">
                    Account
                  </Button>
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="outline" size="sm" type="submit">
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/join">
                  <Button variant="primary" size="sm">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                  isActive(link.href)
                    ? 'bg-primary-50 border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Services Section */}
            <div className="pl-3 pr-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Services
            </div>
            {servicesLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block pl-6 pr-4 py-2 border-l-4 text-base font-medium',
                  isActive(link.href)
                    ? 'bg-primary-50 border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin/leads"
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                  isActive('/admin')
                    ? 'bg-accent-50 border-accent-500 text-accent-600'
                    : 'border-transparent text-accent-600 hover:bg-accent-50 hover:border-accent-300'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-1 px-2">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <form action="/api/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/join"
                    className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const VALID_THEMES = ['midnight', 'paper', 'luxe', 'pop'] as const;
const VALID_FONTS = ['inter', 'jakarta'] as const;

type Theme = (typeof VALID_THEMES)[number];
type Font = (typeof VALID_FONTS)[number];

interface ThemeProviderProps {
  children: React.ReactNode;
  fontClasses: {
    inter: string;
    jakarta: string;
  };
}

export function ThemeProvider({ children, fontClasses }: ThemeProviderProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const themeParam = searchParams.get('theme');
    const fontParam = searchParams.get('font');

    // Apply theme
    if (themeParam && VALID_THEMES.includes(themeParam as Theme)) {
      document.documentElement.setAttribute('data-theme', themeParam);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Apply font
    const htmlEl = document.documentElement;

    // Remove existing font classes
    Object.values(fontClasses).forEach(cls => {
      cls.split(' ').forEach(c => htmlEl.classList.remove(c));
    });

    // Apply selected font (default to inter)
    const selectedFont = (fontParam && VALID_FONTS.includes(fontParam as Font))
      ? fontParam as Font
      : 'inter';

    fontClasses[selectedFont].split(' ').forEach(c => {
      if (c) htmlEl.classList.add(c);
    });

  }, [searchParams, fontClasses]);

  return <>{children}</>;
}

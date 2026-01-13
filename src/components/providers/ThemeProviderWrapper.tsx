'use client';

import { Suspense } from 'react';
import { ThemeProvider } from './ThemeProvider';

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
  fontClasses: {
    inter: string;
    jakarta: string;
  };
}

export function ThemeProviderWrapper({ children, fontClasses }: ThemeProviderWrapperProps) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider fontClasses={fontClasses}>
        {children}
      </ThemeProvider>
    </Suspense>
  );
}

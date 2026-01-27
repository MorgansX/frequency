'use client';

import { HeroUIProvider } from '@heroui/system';
import { Toaster } from 'react-hot-toast';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <Toaster position="top-center" />
      {children}
    </HeroUIProvider>
  );
};

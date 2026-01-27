'use client';

import { HeroUIProvider } from '@heroui/system';
import { Toaster } from 'react-hot-toast';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider className="flex-1 flex flex-col">
      <Toaster position="top-center" />
      {children}
    </HeroUIProvider>
  );
};

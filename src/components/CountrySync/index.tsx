'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCountry } from '@/store/useCounrty';

interface CountrySyncProps {
  country: string;
  tags: string[];
}

export const CountrySync = ({ country, tags }: CountrySyncProps) => {
  const { setCountry, setTags } = useCountry();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Sync store with server-provided country
    setCountry(country);
    setTags(tags);

    // Set country in URL if not present
    const urlCountry = searchParams.get('country');
    if (!urlCountry) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('country', country);
      router.replace(`?${params.toString()}`);
    }
  }, [country, tags, setCountry, setTags, searchParams, router]);

  return null;
};

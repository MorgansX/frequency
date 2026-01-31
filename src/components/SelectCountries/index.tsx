'use client';

import { MappedCountry } from '@/lib/types/radio.types';
import { useSearchParams, useRouter } from 'next/navigation';
import { DEFAULT_COUNTRY, useCountry } from '@/store/useCounrty';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useRadioStations } from '@/store/useRadioStations';
import toast from 'react-hot-toast';
import { radioBrowserApi } from '@/lib/api/radio-browser';
import { Key } from '@heroui/react';

interface SelectCountriesProps {
  countries: MappedCountry[];
  initialCountry?: string;
}

export const SelectCountries = ({
  countries,
  initialCountry,
}: SelectCountriesProps) => {
  const { setCountry, setTags } = useCountry();
  const { fetchStations } = useRadioStations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultCountry = initialCountry || DEFAULT_COUNTRY;

  const updateURLQuery = (country: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('country', country);
    router.push(`?${params.toString()}`);
  };

  const selectCountryHandler = async (key: Key) => {
    const countryName = countries.find((c) => c.code === key)?.name;
    if (!countryName) return;
    try {
      setCountry(countryName);
      await fetchStations(countryName);
      const countryTags = await radioBrowserApi.getTagsByCountry(countryName);
      setTags(countryTags);
      updateURLQuery(countryName);
    } catch (error) {
      setCountry(DEFAULT_COUNTRY);
      await fetchStations(DEFAULT_COUNTRY);
      toast.error(
        'Failed to load stations for the selected country. Reverted to default country.'
      );
    }
  };

  const getFlagurl = (code: string) =>
    `https://flagcdn.com/${code.toLowerCase()}.svg`;

  return (
    <Autocomplete
      className="w-full"
      size="lg"
      label="Select a country"
      placeholder="Select a country"
      //@ts-expect-error wrong library types
      onSelectionChange={selectCountryHandler}
      defaultSelectedKey={
        countries.find((c) => c.name === defaultCountry)?.code
      }
    >
      {countries.map((country) => (
        <AutocompleteItem
          key={country.code}
          startContent={
            <img
              alt={country.name}
              className="w-6 h-4 object-cover rounded-sm"
              src={getFlagurl(country.code)}
            />
          }
        >
          {country.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

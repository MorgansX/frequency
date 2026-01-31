'use client';

import { MappedCountry } from '@/lib/types/radio.types';
import { useCountry } from '@/store/useCounrty';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';

interface SelectCountriesProps {
  countries: MappedCountry[];
}

export const SelectCountries = ({ countries }: SelectCountriesProps) => {
  const { setCountry, country } = useCountry();

  console.log('Selected country:', country);
  return (
    <Autocomplete
      className="w-full"
      size="lg"
      label="Select a country"
      placeholder="Select a country"
      onInputChange={setCountry}
    >
      {countries.map((country) => (
        <AutocompleteItem
          key={country.code}
          startContent={
            <img
              alt={country.name}
              className="w-6 h-4 object-cover rounded-sm"
              src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
            />
          }
        >
          {country.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

import { Country, MappedCountry } from '../types/radio.types';

const bannedCountryCodes: Readonly<string[]> = ['RU', 'BY'];

export const countriesMapper = (countriesData: Country[]): MappedCountry[] =>
  countriesData
    .map((country) => ({
      code: country.iso_3166_1,
      name: country.name,
    }))
    .filter(({ code }) => !bannedCountryCodes.includes(code));

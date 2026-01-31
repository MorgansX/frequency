import { CategoryFilters } from '@/components/CategoryFilters';
import { AudioPlayer } from '@/components/Player';
import { StationsList } from '@/components/StationsList';
import { SelectCountries } from '@/components/SelectCountries';
import { radioBrowserApi } from '@/lib/api/radio-browser';
import { countriesMapper } from '@/lib/helpers/countriesDataMapper';
import { DEFAULT_COUNTRY } from '@/store/useCounrty';

export default async function Home() {
  const [stations, categories, countries] = await Promise.all([
    radioBrowserApi.searchStations({
      country: DEFAULT_COUNTRY,
      order: 'votes',
      reverse: 'true',
      limit: '20',
    }),
    radioBrowserApi.getTagsByCountry(DEFAULT_COUNTRY),
    radioBrowserApi.getCountries(),
  ]);

  const mappedCountries = countriesMapper(countries);

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <SelectCountries countries={mappedCountries} />
        <AudioPlayer stations={stations} />
        <div aria-label="additional-buttons" className="flex gap-4">
          <CategoryFilters categories={categories} />
          <StationsList />
        </div>
      </div>
    </main>
  );
}

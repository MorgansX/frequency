import { Suspense } from 'react';
import { CategoryFilters } from '@/components/CategoryFilters';
import { AudioPlayer } from '@/components/Player';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';

export default async function Home() {
  const [stations, categories] = await Promise.all([
    radioBrowserApi.searchStations({
      country: 'Ukraine',
      order: 'votes',
      reverse: 'true',
      limit: '20',
    }),
    radioBrowserApi.getTagsByCountry('Ukraine'),
  ]);

  return (
    <main className="flex-1 flex flex-col justify-end items-center w-screen p-8 pb-2">
      <Suspense>
        <AudioPlayer stations={stations} />
        <div aria-label="additional-buttons" className="flex m-2">
          <CategoryFilters categories={categories} />
        </div>
      </Suspense>
    </main>
  );
}

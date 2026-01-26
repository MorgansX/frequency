import { CategoryFilters } from '@/components/CategoryFilters';
import { AudioPlayer } from '@/components/Player';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';

export default async function Home() {
  const stations = await radioBrowserApi.searchStations({
    country: 'Ukraine',
    order: 'votes',
    reverse: 'true',
    limit: '20',
  });

  const categories = stations.reduce((acc, station) => {
    const tags = station.tags?.split(',') || [];
    return Array.from(new Set([...acc, ...tags].filter((item) => item)));
  }, [] as string[]);

  return (
    <main className="flex flex-col justify-end items-center w-screen h-screen pb-2">
      <AudioPlayer stations={stations} />
      <div aria-label="additional-buttons" className="flex m-2">
        <CategoryFilters categories={categories} />
      </div>
    </main>
  );
}

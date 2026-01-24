import { AudioPlayer } from '@/components/Player';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';

export default async function Home() {
  const stations = await radioBrowserApi.searchStations({
    country: 'Ukraine',
    order: 'votes',
    reverse: 'true',
    limit: '20',
  });

  return (
    <main className="flex flex-col justify-end items-center w-screen h-screen pb-8">
      <AudioPlayer stations={stations} />
    </main>
  );
}

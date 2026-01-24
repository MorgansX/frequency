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
    <main className="p-8 max-w-4xl mx-auto">
      <AudioPlayer stations={stations} />
    </main>
  );
}

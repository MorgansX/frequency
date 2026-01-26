import { SearchParams } from 'next/dist/server/request/search-params';
import { Station } from '../radio.types';

const BASE_URL = 'https://de1.api.radio-browser.info';

export const radioBrowserApi = {
  searchStations: async (params: SearchParams): Promise<Station[]> => {
    const searchParams = new URLSearchParams();

    if (params.name) searchParams.append('name', params.name as string);
    if (params.country)
      searchParams.append('country', params.country.toString());
    if (params.language)
      searchParams.append('language', params.language.toString());
    if (params.tag) searchParams.append('tag', params.tag.toString());
    if (params.tagList) searchParams.append('tagList', params.tagList.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.order) searchParams.append('order', params.order.toString());
    if (params.reverse) searchParams.append('reverse', 'true');

    const response = await fetch(
      `${BASE_URL}/json/stations/search?${searchParams}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stations');
    }

    return response.json();
  },

  getStationByUuid: async (uuid: string): Promise<Station | null> => {
    const response = await fetch(`${BASE_URL}/json/stations/byuuid/${uuid}`);

    if (!response.ok) return null;

    const stations = await response.json();
    return stations[0] || null;
  },

  getTopStations: async (limit = '20'): Promise<Station[]> => {
    return radioBrowserApi.searchStations({
      limit,
      order: 'votes',
      reverse: 'true',
    });
  },

  getCountries: async () => {
    const response = await fetch(`${BASE_URL}/json/countries`);
    return response.json();
  },

  getTags: async () => {
    const response = await fetch(`${BASE_URL}/json/tags`);
    return response.json();
  },
};

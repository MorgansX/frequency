import { SearchParams } from 'next/dist/server/request/search-params';
import { Station, Country } from '../types/radio.types';

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
    if (params.tagList)
      searchParams.append('tagList', params.tagList.toString());
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

  searchStationsByTags: async (
    tags: string[],
    params: Omit<SearchParams, 'tag' | 'tagList'>
  ): Promise<Station[]> => {
    const requests = tags.map((tag) =>
      radioBrowserApi.searchStations({ ...params, tag })
    );

    const results = await Promise.allSettled(requests);

    const allStations = results
      .filter(
        (result): result is PromiseFulfilledResult<Station[]> =>
          result.status === 'fulfilled'
      )
      .flatMap((result) => result.value);

    const uniqueStations = Array.from(
      new Map(
        allStations.map((station) => [station.stationuuid, station])
      ).values()
    );

    return uniqueStations.sort((a, b) => b.votes - a.votes);
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

  getCountries: async (): Promise<Country[]> => {
    const response = await fetch(`${BASE_URL}/json/countries`);
    return response.json();
  },

  getTags: async () => {
    const response = await fetch(`${BASE_URL}/json/tags`);
    return response.json();
  },

  getTagsByCountry: async (country: string): Promise<string[]> => {
    const response = await fetch(
      `${BASE_URL}/json/stations/search?country=${encodeURIComponent(country)}&limit=1000&hidebroken=true`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const stations: Station[] = await response.json();

    const tags = stations.reduce((acc, station) => {
      const stationTags = station.tags?.split(',').filter(Boolean) || [];
      stationTags.forEach((tag) => acc.add(tag.trim()));
      return acc;
    }, new Set<string>());

    return Array.from(tags).sort();
  },
};

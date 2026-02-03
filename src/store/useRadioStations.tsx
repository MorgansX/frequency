import { Station } from '@/lib/types/radio.types';
import { radioBrowserApi } from '@/lib/api/radio-browser';
import { create } from 'zustand';

const STATIONS_PER_PAGE = 20;

type State = {
  stations: Station[];
  currentStationIndex: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadingStations: boolean;
  isPlaying: boolean;
  offset: number;
};

type FetchStations = (
  country: string,
  tags?: string[]
) => Promise<void | Station[]>;

type Actions = {
  setStations: (stations: Station[]) => void;
  setCurrentStationIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  nextStation: (country: string) => void;
  prevStation: () => void;
  playStation: (station: Station) => void;
  loadMoreStations: FetchStations;
  fetchStations: FetchStations;
  resetStations: (initialStations: Station[]) => void;
};

type Getters = {
  currentStation: () => Station | undefined;
  totalStations: () => number;
};

const fetchStationsFromApi = (
  offset: number,
  country: string,
  tags?: string[]
): Promise<Station[]> => {
  const baseParams = {
    country,
    order: 'votes',
    reverse: 'true',
    limit: String(STATIONS_PER_PAGE),
    offset: String(offset),
  };

  if (tags && tags.length > 0) {
    return radioBrowserApi.searchStationsByTags(tags, baseParams);
  }

  return radioBrowserApi.searchStations(baseParams);
};

export const useRadioStations = create<State & Actions & Getters>(
  (set, get) => ({
    stations: [],
    currentStationIndex: 0,
    hasMore: true,
    isLoadingMore: false,
    isLoadingStations: false,
    isPlaying: false,
    offset: STATIONS_PER_PAGE,

    currentStation: () => {
      const { stations, currentStationIndex } = get();
      return stations[currentStationIndex];
    },

    totalStations: () => get().stations.length,

    setStations: (stations) => set({ stations }),

    setCurrentStationIndex: (index) => set({ currentStationIndex: index }),

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

    playStation: (station) => {
      const { stations, currentStationIndex } = get();
      const index = stations.findIndex(
        (s) => s.stationuuid === station.stationuuid
      );
      if (index !== -1) {
        if (index === currentStationIndex) {
          // Same station - toggle play/pause
          set((state) => ({ isPlaying: !state.isPlaying }));
        } else {
          // Different station - switch and play
          set({ currentStationIndex: index, isPlaying: true });
        }
      }
    },

    nextStation: (country: string) => {
      const {
        currentStationIndex,
        stations,
        hasMore,
        isLoadingMore,
        loadMoreStations,
      } = get();
      const nextIndex = currentStationIndex + 1;

      if (nextIndex >= stations.length - 3 && !isLoadingMore && hasMore) {
        loadMoreStations(country);
      }

      if (nextIndex >= stations.length) {
        if (!isLoadingMore && hasMore) {
          loadMoreStations(country);
        }
        return;
      }

      set({ currentStationIndex: nextIndex });
    },

    prevStation: () => {
      const { currentStationIndex } = get();
      if (currentStationIndex === 0) return;
      set({ currentStationIndex: currentStationIndex - 1 });
    },

    loadMoreStations: async (country: string, tags?: string[]) => {
      const { isLoadingMore, hasMore, offset } = get();
      if (isLoadingMore || !hasMore) return;

      set({ isLoadingMore: true });

      try {
        const newStations = await fetchStationsFromApi(offset, country, tags);

        if (newStations.length > 0) {
          set((state) => {
            const existingIds = new Set(
              state.stations.map((s) => s.stationuuid)
            );
            const uniqueNewStations = newStations.filter(
              (s) => !existingIds.has(s.stationuuid)
            );
            return {
              stations: [...state.stations, ...uniqueNewStations],
              offset: state.offset + STATIONS_PER_PAGE,
            };
          });
        }

        if (newStations.length < STATIONS_PER_PAGE) {
          set({ hasMore: false });
        }
      } catch (error) {
        console.error('Error loading more stations:', error);
      } finally {
        set({ isLoadingMore: false });
      }
    },

    fetchStations: async (country: string, tags?: string[]) => {
      set({ isLoadingStations: true });

      try {
        const newStations = await fetchStationsFromApi(0, country, tags);
        set({
          stations: newStations,
          currentStationIndex: 0,
          offset: STATIONS_PER_PAGE,
          hasMore: newStations.length >= STATIONS_PER_PAGE,
        });
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        set({ isLoadingStations: false });
      }
    },

    resetStations: (initialStations) => {
      set({
        stations: initialStations,
        currentStationIndex: 0,
        offset: STATIONS_PER_PAGE,
        hasMore: true,
      });
    },
  })
);

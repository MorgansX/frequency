import { Station } from '@/lib/types/radio.types';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';
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

type Actions = {
  setStations: (stations: Station[]) => void;
  setCurrentStationIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  nextStation: () => void;
  prevStation: () => void;
  playStation: (station: Station) => void;
  loadMoreStations: (tags?: string[]) => Promise<void>;
  fetchStations: (tags?: string[]) => Promise<void>;
  resetStations: (initialStations: Station[]) => void;
};

type Getters = {
  currentStation: () => Station | undefined;
  totalStations: () => number;
};

const fetchStationsFromApi = (
  offset: number,
  tags?: string[]
): Promise<Station[]> => {
  const baseParams = {
    country: 'Ukraine',
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

    nextStation: () => {
      const {
        currentStationIndex,
        stations,
        hasMore,
        isLoadingMore,
        loadMoreStations,
      } = get();
      const nextIndex = currentStationIndex + 1;

      if (nextIndex >= stations.length - 3 && !isLoadingMore && hasMore) {
        loadMoreStations();
      }

      if (nextIndex >= stations.length) {
        if (!isLoadingMore && hasMore) {
          loadMoreStations();
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

    loadMoreStations: async (tags?: string[]) => {
      const { isLoadingMore, hasMore, offset } = get();
      if (isLoadingMore || !hasMore) return;

      set({ isLoadingMore: true });

      try {
        const newStations = await fetchStationsFromApi(offset, tags);

        if (newStations.length > 0) {
          set((state) => ({
            stations: [...state.stations, ...newStations],
            offset: state.offset + STATIONS_PER_PAGE,
          }));
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

    fetchStations: async (tags?: string[]) => {
      set({ isLoadingStations: true });

      try {
        const newStations = await fetchStationsFromApi(0, tags);
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

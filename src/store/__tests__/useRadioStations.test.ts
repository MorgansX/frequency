import { useRadioStations } from '../useRadioStations';
import { act } from '@testing-library/react';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';
import { Station } from '@/lib/types/radio.types';

jest.mock('@/lib/types/api/radio-browser');

const mockRadioBrowserApi = radioBrowserApi as jest.Mocked<
  typeof radioBrowserApi
>;

const createMockStation = (overrides: Partial<Station> = {}): Station => ({
  stationuuid: `station-${Math.random()}`,
  name: 'Test Radio',
  country: 'Ukraine',
  language: 'Ukrainian',
  tags: 'pop,rock',
  votes: 100,
  codec: 'MP3',
  bitrate: 128,
  url_resolved: 'https://example.com/stream',
  url: 'https://example.com/stream',
  favicon: '',
  ...overrides,
});

const createMockStations = (count: number): Station[] =>
  Array.from({ length: count }, (_, i) =>
    createMockStation({
      stationuuid: `station-${i}`,
      name: `Radio ${i}`,
      votes: 100 - i,
    })
  );

describe('useRadioStations', () => {
  const initialState = {
    stations: [],
    currentStationIndex: 0,
    hasMore: true,
    isLoadingMore: false,
    isLoadingStations: false,
    isPlaying: false,
    offset: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      useRadioStations.setState(initialState);
    });
  });

  describe('initial state', () => {
    it('should have empty stations array', () => {
      const { stations } = useRadioStations.getState();
      expect(stations).toEqual([]);
    });

    it('should have currentStationIndex at 0', () => {
      const { currentStationIndex } = useRadioStations.getState();
      expect(currentStationIndex).toBe(0);
    });

    it('should have hasMore as true', () => {
      const { hasMore } = useRadioStations.getState();
      expect(hasMore).toBe(true);
    });

    it('should have isPlaying as false', () => {
      const { isPlaying } = useRadioStations.getState();
      expect(isPlaying).toBe(false);
    });
  });

  describe('setStations', () => {
    it('should set stations array', () => {
      const mockStations = createMockStations(3);
      const { setStations } = useRadioStations.getState();

      act(() => {
        setStations(mockStations);
      });

      const { stations } = useRadioStations.getState();
      expect(stations).toEqual(mockStations);
    });
  });

  describe('setCurrentStationIndex', () => {
    it('should update currentStationIndex', () => {
      const { setCurrentStationIndex } = useRadioStations.getState();

      act(() => {
        setCurrentStationIndex(5);
      });

      const { currentStationIndex } = useRadioStations.getState();
      expect(currentStationIndex).toBe(5);
    });
  });

  describe('setIsPlaying', () => {
    it('should update isPlaying state', () => {
      const { setIsPlaying } = useRadioStations.getState();

      act(() => {
        setIsPlaying(true);
      });

      expect(useRadioStations.getState().isPlaying).toBe(true);

      act(() => {
        setIsPlaying(false);
      });

      expect(useRadioStations.getState().isPlaying).toBe(false);
    });
  });

  describe('togglePlayPause', () => {
    it('should toggle isPlaying from false to true', () => {
      const { togglePlayPause } = useRadioStations.getState();

      act(() => {
        togglePlayPause();
      });

      expect(useRadioStations.getState().isPlaying).toBe(true);
    });

    it('should toggle isPlaying from true to false', () => {
      act(() => {
        useRadioStations.setState({ isPlaying: true });
      });

      const { togglePlayPause } = useRadioStations.getState();

      act(() => {
        togglePlayPause();
      });

      expect(useRadioStations.getState().isPlaying).toBe(false);
    });
  });

  describe('playStation', () => {
    const mockStations = createMockStations(5);

    beforeEach(() => {
      act(() => {
        useRadioStations.setState({
          stations: mockStations,
          currentStationIndex: 0,
          isPlaying: false,
        });
      });
    });

    it('should toggle play/pause when clicking same station', () => {
      const { playStation } = useRadioStations.getState();

      act(() => {
        playStation(mockStations[0]);
      });

      expect(useRadioStations.getState().isPlaying).toBe(true);

      act(() => {
        playStation(mockStations[0]);
      });

      expect(useRadioStations.getState().isPlaying).toBe(false);
    });

    it('should switch to different station and start playing', () => {
      const { playStation } = useRadioStations.getState();

      act(() => {
        playStation(mockStations[2]);
      });

      const state = useRadioStations.getState();
      expect(state.currentStationIndex).toBe(2);
      expect(state.isPlaying).toBe(true);
    });

    it('should do nothing if station not in list', () => {
      const { playStation } = useRadioStations.getState();
      const unknownStation = createMockStation({ stationuuid: 'unknown' });

      act(() => {
        playStation(unknownStation);
      });

      const state = useRadioStations.getState();
      expect(state.currentStationIndex).toBe(0);
      expect(state.isPlaying).toBe(false);
    });
  });

  describe('nextStation', () => {
    const mockStations = createMockStations(5);

    beforeEach(() => {
      act(() => {
        useRadioStations.setState({
          stations: mockStations,
          currentStationIndex: 0,
          hasMore: false,
        });
      });
    });

    it('should move to next station', () => {
      const { nextStation } = useRadioStations.getState();

      act(() => {
        nextStation();
      });

      expect(useRadioStations.getState().currentStationIndex).toBe(1);
    });

    it('should not go past the last station', () => {
      act(() => {
        useRadioStations.setState({ currentStationIndex: 4 });
      });

      const { nextStation } = useRadioStations.getState();

      act(() => {
        nextStation();
      });

      expect(useRadioStations.getState().currentStationIndex).toBe(4);
    });

    it('should trigger loadMoreStations when near end and hasMore is true', async () => {
      mockRadioBrowserApi.searchStations.mockResolvedValue([]);

      act(() => {
        useRadioStations.setState({
          stations: mockStations,
          currentStationIndex: 1,
          hasMore: true,
          isLoadingMore: false,
        });
      });

      const { nextStation } = useRadioStations.getState();

      act(() => {
        nextStation();
      });

      expect(mockRadioBrowserApi.searchStations).toHaveBeenCalled();
    });
  });

  describe('prevStation', () => {
    const mockStations = createMockStations(5);

    beforeEach(() => {
      act(() => {
        useRadioStations.setState({
          stations: mockStations,
          currentStationIndex: 2,
        });
      });
    });

    it('should move to previous station', () => {
      const { prevStation } = useRadioStations.getState();

      act(() => {
        prevStation();
      });

      expect(useRadioStations.getState().currentStationIndex).toBe(1);
    });

    it('should not go below 0', () => {
      act(() => {
        useRadioStations.setState({ currentStationIndex: 0 });
      });

      const { prevStation } = useRadioStations.getState();

      act(() => {
        prevStation();
      });

      expect(useRadioStations.getState().currentStationIndex).toBe(0);
    });
  });

  describe('loadMoreStations', () => {
    it('should load more stations and append to list', async () => {
      const existingStations = createMockStations(5);
      const newStations = createMockStations(5).map((s, i) => ({
        ...s,
        stationuuid: `new-${i}`,
      }));

      mockRadioBrowserApi.searchStations.mockResolvedValue(newStations);

      act(() => {
        useRadioStations.setState({
          stations: existingStations,
          offset: 5,
          hasMore: true,
          isLoadingMore: false,
        });
      });

      const { loadMoreStations } = useRadioStations.getState();

      await act(async () => {
        await loadMoreStations();
      });

      const state = useRadioStations.getState();
      expect(state.stations.length).toBe(10);
      expect(state.offset).toBe(25);
    });

    it('should not load if already loading', async () => {
      act(() => {
        useRadioStations.setState({ isLoadingMore: true });
      });

      const { loadMoreStations } = useRadioStations.getState();

      await act(async () => {
        await loadMoreStations();
      });

      expect(mockRadioBrowserApi.searchStations).not.toHaveBeenCalled();
    });

    it('should not load if no more stations', async () => {
      act(() => {
        useRadioStations.setState({ hasMore: false });
      });

      const { loadMoreStations } = useRadioStations.getState();

      await act(async () => {
        await loadMoreStations();
      });

      expect(mockRadioBrowserApi.searchStations).not.toHaveBeenCalled();
    });

    it('should set hasMore to false when less than 20 stations returned', async () => {
      mockRadioBrowserApi.searchStations.mockResolvedValue(
        createMockStations(10)
      );

      act(() => {
        useRadioStations.setState({
          stations: [],
          hasMore: true,
          isLoadingMore: false,
        });
      });

      const { loadMoreStations } = useRadioStations.getState();

      await act(async () => {
        await loadMoreStations();
      });

      expect(useRadioStations.getState().hasMore).toBe(false);
    });

    it('should use searchStationsByTags when tags provided', async () => {
      mockRadioBrowserApi.searchStationsByTags.mockResolvedValue(
        createMockStations(5)
      );

      act(() => {
        useRadioStations.setState({
          stations: [],
          hasMore: true,
          isLoadingMore: false,
        });
      });

      const { loadMoreStations } = useRadioStations.getState();

      await act(async () => {
        await loadMoreStations(['rock', 'pop']);
      });

      expect(mockRadioBrowserApi.searchStationsByTags).toHaveBeenCalledWith(
        ['rock', 'pop'],
        expect.objectContaining({
          country: 'Ukraine',
          order: 'votes',
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockRadioBrowserApi.searchStations.mockRejectedValue(
        new Error('API Error')
      );

      act(() => {
        useRadioStations.setState({
          stations: createMockStations(5),
          hasMore: true,
          isLoadingMore: false,
        });
      });

      const { loadMoreStations } = useRadioStations.getState();

      await act(async () => {
        await loadMoreStations();
      });

      const state = useRadioStations.getState();
      expect(state.stations.length).toBe(5);
      expect(state.isLoadingMore).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('fetchStations', () => {
    it('should fetch and set stations', async () => {
      const mockStations = createMockStations(20);
      mockRadioBrowserApi.searchStations.mockResolvedValue(mockStations);

      const { fetchStations } = useRadioStations.getState();

      await act(async () => {
        await fetchStations();
      });

      const state = useRadioStations.getState();
      expect(state.stations).toEqual(mockStations);
      expect(state.currentStationIndex).toBe(0);
      expect(state.hasMore).toBe(true);
    });

    it('should set hasMore to false when less than 20 stations', async () => {
      mockRadioBrowserApi.searchStations.mockResolvedValue(
        createMockStations(10)
      );

      const { fetchStations } = useRadioStations.getState();

      await act(async () => {
        await fetchStations();
      });

      expect(useRadioStations.getState().hasMore).toBe(false);
    });

    it('should set isLoadingStations during fetch', async () => {
      let resolvePromise: (value: Station[]) => void;
      const promise = new Promise<Station[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockRadioBrowserApi.searchStations.mockReturnValue(promise);

      const { fetchStations } = useRadioStations.getState();

      let fetchPromise: Promise<void>;
      await act(async () => {
        fetchPromise = fetchStations();
      });

      expect(useRadioStations.getState().isLoadingStations).toBe(true);

      await act(async () => {
        resolvePromise!(createMockStations(5));
        await fetchPromise!;
      });

      expect(useRadioStations.getState().isLoadingStations).toBe(false);
    });

    it('should use searchStationsByTags when tags provided', async () => {
      mockRadioBrowserApi.searchStationsByTags.mockResolvedValue(
        createMockStations(5)
      );

      const { fetchStations } = useRadioStations.getState();

      await act(async () => {
        await fetchStations(['jazz']);
      });

      expect(mockRadioBrowserApi.searchStationsByTags).toHaveBeenCalledWith(
        ['jazz'],
        expect.objectContaining({
          country: 'Ukraine',
        })
      );
    });
  });

  describe('resetStations', () => {
    it('should reset to initial stations', () => {
      const initialStations = createMockStations(10);

      act(() => {
        useRadioStations.setState({
          stations: createMockStations(30),
          currentStationIndex: 15,
          offset: 100,
          hasMore: false,
        });
      });

      const { resetStations } = useRadioStations.getState();

      act(() => {
        resetStations(initialStations);
      });

      const state = useRadioStations.getState();
      expect(state.stations).toEqual(initialStations);
      expect(state.currentStationIndex).toBe(0);
      expect(state.offset).toBe(20);
      expect(state.hasMore).toBe(true);
    });
  });

  describe('getters', () => {
    it('currentStation should return current station', () => {
      const mockStations = createMockStations(5);

      act(() => {
        useRadioStations.setState({
          stations: mockStations,
          currentStationIndex: 2,
        });
      });

      const { currentStation } = useRadioStations.getState();
      expect(currentStation()).toEqual(mockStations[2]);
    });

    it('currentStation should return undefined if no stations', () => {
      const { currentStation } = useRadioStations.getState();
      expect(currentStation()).toBeUndefined();
    });

    it('totalStations should return stations count', () => {
      const mockStations = createMockStations(7);

      act(() => {
        useRadioStations.setState({ stations: mockStations });
      });

      const { totalStations } = useRadioStations.getState();
      expect(totalStations()).toBe(7);
    });
  });
});

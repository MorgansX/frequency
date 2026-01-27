import { renderHook, act, waitFor } from '@testing-library/react';
import { useRadioPlayer } from '../useRadioPlayer';
import { useRadioFilter } from '@/store/useRadioFilter';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';

// Mock the API
jest.mock('@/lib/types/api/radio-browser', () => ({
  radioBrowserApi: {
    searchStations: jest.fn(),
    searchStationsByTags: jest.fn(),
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

const mockStations = [
  {
    stationuuid: '1',
    name: 'Station 1',
    country: 'Ukraine',
    language: 'Ukrainian',
    tags: 'rock,pop',
    votes: 100,
    codec: 'MP3',
    bitrate: 128,
    url_resolved: 'https://example.com/stream1',
    favicon: '',
  },
  {
    stationuuid: '2',
    name: 'Station 2',
    country: 'Ukraine',
    language: 'Ukrainian',
    tags: 'jazz',
    votes: 50,
    codec: 'MP3',
    bitrate: 128,
    url_resolved: 'https://example.com/stream2',
    favicon: '',
  },
  {
    stationuuid: '3',
    name: 'Station 3',
    country: 'Ukraine',
    language: 'Ukrainian',
    tags: 'electronic',
    votes: 75,
    codec: 'MP3',
    bitrate: 128,
    url_resolved: 'https://example.com/stream3',
    favicon: '',
  },
];

const mockMoreStations = [
  {
    stationuuid: '4',
    name: 'Station 4',
    country: 'Ukraine',
    language: 'Ukrainian',
    tags: 'classical',
    votes: 60,
    codec: 'MP3',
    bitrate: 128,
    url_resolved: 'https://example.com/stream4',
    favicon: '',
  },
];

describe('useRadioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset store state
    act(() => {
      useRadioFilter.setState({
        filters: [],
        applyedFilters: [],
      });
    });

    (radioBrowserApi.searchStations as jest.Mock).mockResolvedValue(
      mockMoreStations
    );
    (radioBrowserApi.searchStationsByTags as jest.Mock).mockResolvedValue(
      mockStations
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should initialize with provided stations', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.stationState.totalStations).toBe(3);
      expect(result.current.stationState.currentStationIndex).toBe(0);
    });

    it('should set current station to first station', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.stationState.currentStation).toEqual(
        mockStations[0]
      );
    });

    it('should initialize with isPlaying as false', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.playingState.isPlaying).toBe(false);
    });

    it('should initialize with isLoading as false', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.playingState.isLoading).toBe(false);
    });
  });

  describe('handleNextStation', () => {
    it('should move to next station', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      act(() => {
        result.current.handlers.handleNextStation();
      });

      expect(result.current.stationState.currentStationIndex).toBe(1);
      expect(result.current.stationState.currentStation).toEqual(
        mockStations[1]
      );
    });

    it('should move through multiple stations', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      act(() => {
        result.current.handlers.handleNextStation();
      });
      expect(result.current.stationState.currentStationIndex).toBe(1);

      act(() => {
        result.current.handlers.handleNextStation();
      });
      expect(result.current.stationState.currentStationIndex).toBe(2);
    });
  });

  describe('handlePrevStation', () => {
    it('should move to previous station', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      // First go to station 2
      act(() => {
        result.current.handlers.handleNextStation();
      });

      expect(result.current.stationState.currentStationIndex).toBe(1);

      // Then go back
      act(() => {
        result.current.handlers.hanldePrevStation();
      });

      expect(result.current.stationState.currentStationIndex).toBe(0);
    });

    it('should not go below first station', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      act(() => {
        result.current.handlers.hanldePrevStation();
      });

      expect(result.current.stationState.currentStationIndex).toBe(0);
    });

    it('should not go below first station even after multiple calls', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      act(() => {
        result.current.handlers.hanldePrevStation();
        result.current.handlers.hanldePrevStation();
        result.current.handlers.hanldePrevStation();
      });

      expect(result.current.stationState.currentStationIndex).toBe(0);
    });
  });

  describe('filter changes', () => {
    it('should fetch new stations when filters are applied', async () => {
      jest.useRealTimers();

      renderHook(() => useRadioPlayer({ stations: mockStations }));

      await act(async () => {
        useRadioFilter.setState({
          filters: ['rock'],
          applyedFilters: ['rock'],
        });
      });

      await waitFor(() => {
        expect(radioBrowserApi.searchStationsByTags).toHaveBeenCalled();
      });
    });

    it('should reset to initial stations when filters are cleared', async () => {
      jest.useRealTimers();

      // First set some filters
      act(() => {
        useRadioFilter.setState({
          filters: ['rock'],
          applyedFilters: ['rock'],
        });
      });

      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      // Then clear filters
      await act(async () => {
        useRadioFilter.setState({
          filters: [],
          applyedFilters: [],
        });
      });

      await waitFor(() => {
        expect(result.current.stationState.totalStations).toBe(3);
      });
    });

    it('should reset currentStationIndex when filters change', async () => {
      jest.useRealTimers();

      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      // Move to station 2
      act(() => {
        result.current.handlers.handleNextStation();
      });

      expect(result.current.stationState.currentStationIndex).toBe(1);

      // Apply filters
      await act(async () => {
        useRadioFilter.setState({
          filters: ['rock'],
          applyedFilters: ['rock'],
        });
      });

      await waitFor(() => {
        expect(result.current.stationState.currentStationIndex).toBe(0);
      });
    });
  });

  describe('handlers object', () => {
    it('should expose all required handlers', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.handlers).toHaveProperty('handlePlay');
      expect(result.current.handlers).toHaveProperty('handleNextStation');
      expect(result.current.handlers).toHaveProperty('hanldePrevStation');
      expect(result.current.handlers).toHaveProperty('handleError');
    });
  });

  describe('stationState object', () => {
    it('should expose all required state', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.stationState).toHaveProperty('currentStation');
      expect(result.current.stationState).toHaveProperty('totalStations');
      expect(result.current.stationState).toHaveProperty('currentStationIndex');
    });
  });

  describe('playingState object', () => {
    it('should expose all required playing state', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(result.current.playingState).toHaveProperty('isPlaying');
      expect(result.current.playingState).toHaveProperty('isLoading');
      expect(result.current.playingState).toHaveProperty('setIsPlaying');
      expect(result.current.playingState).toHaveProperty('setIsLoading');
    });

    it('should allow setting isPlaying state', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      act(() => {
        result.current.playingState.setIsPlaying(true);
      });

      expect(result.current.playingState.isPlaying).toBe(true);

      act(() => {
        result.current.playingState.setIsPlaying(false);
      });

      expect(result.current.playingState.isPlaying).toBe(false);
    });

    it('should allow setting isLoading state', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      act(() => {
        result.current.playingState.setIsLoading(true);
      });

      expect(result.current.playingState.isLoading).toBe(true);

      act(() => {
        result.current.playingState.setIsLoading(false);
      });

      expect(result.current.playingState.isLoading).toBe(false);
    });
  });

  describe('audioRef', () => {
    it('should provide audioRef callback', () => {
      const { result } = renderHook(() =>
        useRadioPlayer({ stations: mockStations })
      );

      expect(typeof result.current.audioRef).toBe('function');
    });
  });
});

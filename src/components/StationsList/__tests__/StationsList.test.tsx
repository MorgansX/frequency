import { render, screen, fireEvent, act } from '@testing-library/react';
import { StationsList } from '../index';
import { useRadioStations } from '@/store/useRadioStations';
import { useRadioFilter } from '@/store/useRadioFilter';
import { useCountry } from '@/store/useCounrty';
import { Station } from '@/lib/types/radio.types';

jest.mock('@/store/useRadioStations');
jest.mock('@/store/useRadioFilter');
jest.mock('@/store/useCounrty');

const mockOnClose = jest.fn();
let mockIsOpen = false;
const mockOnOpen = jest.fn();

jest.mock('@heroui/modal', () => ({
  Modal: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  ModalContent: ({
    children,
  }: {
    children: ((onClose: () => void) => React.ReactNode) | React.ReactNode;
  }) => (
    <div data-testid="modal-content">
      {typeof children === 'function' ? children(mockOnClose) : children}
    </div>
  ),
  ModalBody: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="modal-body" {...props}>
      {children}
    </div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  ),
  useDisclosure: () => ({
    isOpen: mockIsOpen,
    onOpen: mockOnOpen,
    onOpenChange: jest.fn(),
    onClose: mockOnClose,
  }),
}));

jest.mock('@/components/Modal/ModalHeader', () => ({
  AppModalHeader: ({
    modalName,
    onClose,
  }: {
    modalName: string;
    onClose: () => void;
  }) => (
    <div data-testid="app-modal-header">
      <span>{modalName}</span>
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
    </div>
  ),
}));

const mockUseRadioStations = useRadioStations as jest.MockedFunction<
  typeof useRadioStations
>;
const mockUseRadioFilter = useRadioFilter as jest.MockedFunction<
  typeof useRadioFilter
>;
const mockUseCountry = useCountry as jest.MockedFunction<typeof useCountry>;

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
    })
  );

describe('StationsList', () => {
  const mockPlayStation = jest.fn();
  const mockLoadMoreStations = jest.fn();

  const defaultStoreState = {
    stations: createMockStations(5),
    playStation: mockPlayStation,
    currentStationIndex: 0,
    isPlaying: false,
    loadMoreStations: mockLoadMoreStations,
    isLoadingMore: false,
    hasMore: true,
  };

  const defaultFilterState = {
    applyedFilters: [] as string[],
  };

  let mockIntersectionCallback: IntersectionObserverCallback | null = null;
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsOpen = false;
    mockIntersectionCallback = null;

    mockUseRadioStations.mockReturnValue(defaultStoreState);
    mockUseRadioFilter.mockReturnValue(
      defaultFilterState as ReturnType<typeof useRadioFilter>
    );
    mockUseCountry.mockReturnValue({
      country: 'Ukraine',
      tags: [],
      setCountry: jest.fn(),
      setTags: jest.fn(),
    });

    window.IntersectionObserver = jest.fn((callback) => {
      mockIntersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    }) as unknown as typeof IntersectionObserver;
  });

  describe('rendering', () => {
    it('should render list button', () => {
      render(<StationsList />);

      expect(screen.getByText('List')).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      mockIsOpen = false;
      render(<StationsList />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('modal content when open', () => {
    beforeEach(() => {
      mockIsOpen = true;
    });

    it('should render stations in modal', () => {
      render(<StationsList />);

      expect(screen.getByText('Radio 0')).toBeInTheDocument();
      expect(screen.getByText('Radio 1')).toBeInTheDocument();
      expect(screen.getByText('Radio 4')).toBeInTheDocument();
    });

    it('should show empty message when no stations', () => {
      mockUseRadioStations.mockReturnValue({
        ...defaultStoreState,
        stations: [],
      });

      render(<StationsList />);

      expect(screen.getByText('No stations available.')).toBeInTheDocument();
    });

    it('should show spinner when loading more', () => {
      mockUseRadioStations.mockReturnValue({
        ...defaultStoreState,
        isLoadingMore: true,
      });

      render(<StationsList />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should not show spinner when not loading', () => {
      mockUseRadioStations.mockReturnValue({
        ...defaultStoreState,
        isLoadingMore: false,
      });

      render(<StationsList />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should render correct number of station cards', () => {
      render(<StationsList />);

      const stationNames = screen.getAllByText(/Radio \d/);
      expect(stationNames.length).toBe(5);
    });

    it('should render modal header with correct title', () => {
      render(<StationsList />);

      expect(screen.getByText('Stations List')).toBeInTheDocument();
    });
  });

  describe('handleLoadMore callback', () => {
    beforeEach(() => {
      mockIsOpen = true;
    });

    it('should call loadMoreStations when intersection is triggered', () => {
      render(<StationsList />);

      act(() => {
        mockIntersectionCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(mockLoadMoreStations).toHaveBeenCalled();
    });

    it('should not call loadMoreStations if not intersecting', () => {
      render(<StationsList />);

      act(() => {
        mockIntersectionCallback?.(
          [{ isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(mockLoadMoreStations).not.toHaveBeenCalled();
    });

    it('should not call loadMoreStations when already loading', () => {
      mockUseRadioStations.mockReturnValue({
        ...defaultStoreState,
        isLoadingMore: true,
      });

      render(<StationsList />);

      act(() => {
        mockIntersectionCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(mockLoadMoreStations).not.toHaveBeenCalled();
    });

    it('should not call loadMoreStations when hasMore is false', () => {
      mockUseRadioStations.mockReturnValue({
        ...defaultStoreState,
        hasMore: false,
      });

      render(<StationsList />);

      act(() => {
        mockIntersectionCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(mockLoadMoreStations).not.toHaveBeenCalled();
    });

    it('should pass applied filters to loadMoreStations', () => {
      mockUseRadioFilter.mockReturnValue({
        applyedFilters: ['rock', 'pop'],
      } as ReturnType<typeof useRadioFilter>);

      render(<StationsList />);

      act(() => {
        mockIntersectionCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(mockLoadMoreStations).toHaveBeenCalledWith('Ukraine', [
        'rock',
        'pop',
      ]);
    });

    it('should pass undefined when no filters applied', () => {
      mockUseRadioFilter.mockReturnValue({
        applyedFilters: [],
      } as ReturnType<typeof useRadioFilter>);

      render(<StationsList />);

      act(() => {
        mockIntersectionCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(mockLoadMoreStations).toHaveBeenCalledWith('Ukraine', undefined);
    });
  });

  describe('IntersectionObserver lifecycle', () => {
    beforeEach(() => {
      mockIsOpen = true;
    });

    it('should setup IntersectionObserver when modal is open', () => {
      render(<StationsList />);

      expect(window.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.1 }
      );
      expect(mockObserve).toHaveBeenCalled();
    });

    it('should disconnect IntersectionObserver on unmount', () => {
      const { unmount } = render(<StationsList />);

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should not setup IntersectionObserver when modal is closed', () => {
      mockIsOpen = false;

      render(<StationsList />);

      expect(mockObserve).not.toHaveBeenCalled();
    });
  });

  describe('station interactions', () => {
    beforeEach(() => {
      mockIsOpen = true;
    });

    it('should call playStation with correct station when clicked', () => {
      render(<StationsList />);

      const playButtons = screen.getAllByRole('button');
      const stationPlayButtons = playButtons.filter(
        (btn) =>
          !btn.textContent?.includes('List') &&
          !btn.textContent?.includes('Close')
      );

      if (stationPlayButtons.length > 0) {
        fireEvent.click(stationPlayButtons[0]);
        expect(mockPlayStation).toHaveBeenCalledWith(
          expect.objectContaining({ stationuuid: 'station-0' })
        );
      }
    });

    it('should indicate currently playing station', () => {
      mockUseRadioStations.mockReturnValue({
        ...defaultStoreState,
        currentStationIndex: 2,
        isPlaying: true,
      });

      render(<StationsList />);

      expect(screen.getByText('Radio 2')).toBeInTheDocument();
    });
  });
});

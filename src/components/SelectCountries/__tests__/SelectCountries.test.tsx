import { render, screen } from '@testing-library/react';
import { SelectCountries } from '../index';
import { useCountry } from '@/store/useCounrty';
import { useRadioStations } from '@/store/useRadioStations';
import { radioBrowserApi } from '@/lib/api/radio-browser';

jest.mock('@/store/useCounrty');
jest.mock('@/store/useRadioStations');
jest.mock('@/lib/api/radio-browser');
jest.mock('react-hot-toast');

const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

const mockUseCountry = useCountry as jest.MockedFunction<typeof useCountry>;
const mockUseRadioStations = useRadioStations as jest.MockedFunction<
  typeof useRadioStations
>;

const mockCountries = [
  { code: 'UA', name: 'Ukraine' },
  { code: 'DE', name: 'Germany' },
  { code: 'US', name: 'United States' },
];

describe('SelectCountries', () => {
  const mockSetCountry = jest.fn();
  const mockSetTags = jest.fn();
  const mockFetchStations = jest.fn().mockResolvedValue([]);

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCountry.mockReturnValue({
      country: 'Ukraine',
      tags: [],
      setCountry: mockSetCountry,
      setTags: mockSetTags,
    });

    mockUseRadioStations.mockReturnValue({
      fetchStations: mockFetchStations,
      stations: [],
      currentStationIndex: 0,
      hasMore: true,
      isLoadingMore: false,
      isLoadingStations: false,
      isPlaying: false,
      offset: 20,
      setStations: jest.fn(),
      setCurrentStationIndex: jest.fn(),
      setIsPlaying: jest.fn(),
      togglePlayPause: jest.fn(),
      nextStation: jest.fn(),
      prevStation: jest.fn(),
      playStation: jest.fn(),
      loadMoreStations: jest.fn(),
      resetStations: jest.fn(),
      currentStation: jest.fn(),
      totalStations: jest.fn(),
    });

    (radioBrowserApi.getTagsByCountry as jest.Mock) = jest
      .fn()
      .mockResolvedValue(['rock', 'pop']);
  });

  describe('rendering', () => {
    it('should render autocomplete with label', () => {
      render(<SelectCountries countries={mockCountries} />);

      expect(screen.getByText('Select a country')).toBeInTheDocument();
    });

    it('should render combobox element', () => {
      render(<SelectCountries countries={mockCountries} />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
    });

    it('should render with initialCountry prop', () => {
      render(
        <SelectCountries countries={mockCountries} initialCountry="Germany" />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should use DEFAULT_COUNTRY when no initialCountry provided', () => {
      render(<SelectCountries countries={mockCountries} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('should accept countries array', () => {
      const { container } = render(
        <SelectCountries countries={mockCountries} />
      );

      expect(container).toBeInTheDocument();
    });

    it('should accept optional initialCountry', () => {
      const { container } = render(
        <SelectCountries countries={mockCountries} initialCountry="Germany" />
      );

      expect(container).toBeInTheDocument();
    });

    it('should handle empty countries array', () => {
      render(<SelectCountries countries={[]} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('hooks integration', () => {
    it('should use useCountry hook', () => {
      render(<SelectCountries countries={mockCountries} />);

      expect(mockUseCountry).toHaveBeenCalled();
    });

    it('should use useRadioStations hook', () => {
      render(<SelectCountries countries={mockCountries} />);

      expect(mockUseRadioStations).toHaveBeenCalled();
    });
  });
});

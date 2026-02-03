import { render, waitFor } from '@testing-library/react';
import { CountrySync } from '../index';
import { useCountry } from '@/store/useCounrty';

jest.mock('@/store/useCounrty');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

const mockUseCountry = useCountry as jest.MockedFunction<typeof useCountry>;

describe('CountrySync', () => {
  const mockSetCountry = jest.fn();
  const mockSetTags = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();

    mockUseCountry.mockReturnValue({
      country: 'Ukraine',
      tags: [],
      setCountry: mockSetCountry,
      setTags: mockSetTags,
    });
  });

  it('should render nothing (null)', () => {
    const { container } = render(
      <CountrySync country="Ukraine" tags={['rock', 'pop']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should sync country to store on mount', async () => {
    render(<CountrySync country="Germany" tags={['jazz']} />);

    await waitFor(() => {
      expect(mockSetCountry).toHaveBeenCalledWith('Germany');
    });
  });

  it('should sync tags to store on mount', async () => {
    render(<CountrySync country="Germany" tags={['jazz', 'blues']} />);

    await waitFor(() => {
      expect(mockSetTags).toHaveBeenCalledWith(['jazz', 'blues']);
    });
  });

  it('should add country to URL if not present', async () => {
    render(<CountrySync country="Germany" tags={[]} />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('country=Germany')
      );
    });
  });

  it('should not update URL if country already present', async () => {
    mockSearchParams = new URLSearchParams('country=Germany');

    render(<CountrySync country="Germany" tags={[]} />);

    await waitFor(() => {
      expect(mockSetCountry).toHaveBeenCalled();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should only initialize once', async () => {
    const { rerender } = render(
      <CountrySync country="Germany" tags={['rock']} />
    );

    await waitFor(() => {
      expect(mockSetCountry).toHaveBeenCalledTimes(1);
    });

    rerender(<CountrySync country="France" tags={['pop']} />);

    // Should still only be called once due to isInitialized ref
    expect(mockSetCountry).toHaveBeenCalledTimes(1);
  });

  it('should preserve existing URL params when adding country', async () => {
    mockSearchParams = new URLSearchParams('categories=rock,pop');

    render(<CountrySync country="Ukraine" tags={[]} />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringMatching(
          /categories=rock.*country=Ukraine|country=Ukraine.*categories=rock/
        )
      );
    });
  });
});

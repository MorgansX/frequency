import { render, screen } from '@testing-library/react';
import { AudioPlayer } from '@/components/Player';

// Mock HTMLAudioElement
window.HTMLMediaElement.prototype.load = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = jest.fn();

jest.mock('@/store/useCounrty', () => ({
  useCountry: () => ({
    country: 'Ukraine',
    tags: [],
    setCountry: jest.fn(),
    setTags: jest.fn(),
  }),
  DEFAULT_COUNTRY: 'Ukraine',
}));

const mockStations = [
  {
    stationuuid: '1',
    name: 'Test Radio',
    country: 'Ukraine',
    language: 'Ukrainian',
    tags: 'pop,rock',
    votes: 100,
    codec: 'MP3',
    bitrate: 128,
    url_resolved: 'https://example.com/stream',
    favicon: '',
  },
];

describe('AudioPlayer', () => {
  it('renders the station name', () => {
    render(<AudioPlayer stations={mockStations} />);

    expect(screen.getByText('Test Radio')).toBeInTheDocument();
  });

  it('renders the station country', () => {
    render(<AudioPlayer stations={mockStations} />);

    expect(screen.getByText(/Ukraine/)).toBeInTheDocument();
  });

  it('renders play controls', () => {
    render(<AudioPlayer stations={mockStations} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});

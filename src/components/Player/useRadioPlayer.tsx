import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Station } from '@/lib/types/radio.types';
import { IPlayer } from './types';

const STATIONS_PER_PAGE = 20;
const BASE_URL = 'https://de1.api.radio-browser.info';

const fetchMoreStations = async (offset: number): Promise<Station[]> => {
  const params = new URLSearchParams({
    country: 'Ukraine',
    order: 'votes',
    reverse: 'true',
    limit: String(STATIONS_PER_PAGE),
    offset: String(offset),
  });

  const response = await fetch(`${BASE_URL}/json/stations/search?${params}`);
  if (!response.ok) throw new Error('Failed to fetch stations');
  return response.json();
};

export const useRadioPlayer = ({ stations: initialStations }: IPlayer) => {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const audioRef = useCallback((node: HTMLAudioElement | null) => {
    setAudioElement(node);
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const offsetRef = useRef(STATIONS_PER_PAGE);

  const totalStations = stations.length;

  const currentStation = stations[currentStationIndex];

  const handlePlay = async () => {
    if (!audioElement) return;
    setIsLoading(true);

    try {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        await audioElement.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Помилка відтворення');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreStations = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const newStations = await fetchMoreStations(offsetRef.current);
      if (newStations.length > 0) {
        setStations((prev) => [...prev, ...newStations]);
        offsetRef.current += STATIONS_PER_PAGE;
      }
    } catch (error) {
      console.error('Error loading more stations:', error);
      toast.error('Не вдалося завантажити більше станцій');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const handleNextStation = useCallback(() => {
    const nextIndex = currentStationIndex + 1;

    if (nextIndex >= totalStations - 3 && !isLoadingMore) {
      loadMoreStations();
    }

    if (nextIndex >= totalStations) {
      if (!isLoadingMore) {
        loadMoreStations();
      }
      return;
    }

    setCurrentStationIndex(nextIndex);
  }, [currentStationIndex, totalStations, isLoadingMore, loadMoreStations]);

  const hanldePrevStation = () => {
    if (currentStationIndex === 0) {
      return;
    }
    setCurrentStationIndex((prev) => prev - 1);
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    toast.error(
      `${currentStation?.name || 'Станція'} недоступна, перемикаю...`
    );
    setTimeout(() => handleNextStation(), 2000);
  };

  useEffect(() => {
    if (!audioElement) return;

    // Load new source when station changes
    audioElement.load();

    const playNewStation = async () => {
      if (!isPlaying) return;

      setIsLoading(true);

      try {
        await audioElement.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    };

    playNewStation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStationIndex, audioElement]);

  return {
    audioRef,
    audioElement,
    stationState: {
      currentStation,
      totalStations,
      currentStationIndex,
    },
    playingState: {
      isPlaying,
      setIsPlaying,
      setIsLoading,
      isLoading,
    },
    handlers: {
      hanldePrevStation,
      handlePlay,
      handleNextStation,
      handleError,
    },
  };
};

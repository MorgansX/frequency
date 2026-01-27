import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Station } from '@/lib/types/radio.types';
import { radioBrowserApi } from '@/lib/types/api/radio-browser';
import { IPlayer } from './types';
import { useRadioFilter } from '@/store/useRadioFilter';

const STATIONS_PER_PAGE = 20;

const fetchStations = (offset: number, tags?: string[]): Promise<Station[]> => {
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
  const [hasMore, setHasMore] = useState(true);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const offsetRef = useRef(STATIONS_PER_PAGE);

  const { applyedFilters } = useRadioFilter();

  // Fetch stations when filters change
  useEffect(() => {
    const fetchFilteredStations = async () => {
      setIsLoading(true);
      try {
        const newStations = await fetchStations(0, applyedFilters);
        setStations(newStations);
        setCurrentStationIndex(0);
        offsetRef.current = STATIONS_PER_PAGE;
        setHasMore(newStations.length >= STATIONS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching stations:', error);
        toast.error('Не вдалося завантажити станції');
      } finally {
        setIsLoading(false);
      }
    };

    if (applyedFilters.length) {
      fetchFilteredStations();
    } else {
      setStations(initialStations);
      setCurrentStationIndex(0);
      offsetRef.current = STATIONS_PER_PAGE;
      setHasMore(true);
    }
  }, [applyedFilters, initialStations]);

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
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const newStations = await fetchStations(
        offsetRef.current,
        applyedFilters.length > 0 ? applyedFilters : undefined
      );
      if (newStations.length > 0) {
        setStations((prev) => [...prev, ...newStations]);
        offsetRef.current += STATIONS_PER_PAGE;
      }
      if (newStations.length < STATIONS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more stations:', error);
      toast.error('Не вдалося завантажити більше станцій');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, applyedFilters]);

  const handleNextStation = useCallback(() => {
    const nextIndex = currentStationIndex + 1;

    if (nextIndex >= totalStations - 3 && !isLoadingMore && hasMore) {
      loadMoreStations();
    }

    if (nextIndex >= totalStations) {
      if (!isLoadingMore && hasMore) {
        loadMoreStations();
      }
      return;
    }

    setCurrentStationIndex(nextIndex);
  }, [
    currentStationIndex,
    totalStations,
    isLoadingMore,
    hasMore,
    loadMoreStations,
  ]);

  const hanldePrevStation = () => {
    if (currentStationIndex === 0) {
      return;
    }
    setCurrentStationIndex((prev) => prev - 1);
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    console.log(
      `${currentStation?.name || 'Станція'} недоступна, перемикаю...`
    );
    setTimeout(() => handleNextStation(), 500);
  };

  useEffect(() => {
    if (!audioElement) return;

    let cancelled = false;

    const handleCanPlay = async () => {
      if (cancelled || !isPlaying) return;

      setIsLoading(true);

      try {
        await audioElement.play();
      } catch (error) {
        if (cancelled) return;
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    audioElement.addEventListener('canplay', handleCanPlay, { once: true });
    audioElement.load();

    return () => {
      cancelled = true;
      audioElement.removeEventListener('canplay', handleCanPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStationIndex, audioElement, stations]);

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

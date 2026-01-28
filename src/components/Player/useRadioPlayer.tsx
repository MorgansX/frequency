import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useRadioFilter } from '@/store/useRadioFilter';
import { useRadioStations } from '@/store/useRadioStations';
import { IPlayer } from './types';

export const useRadioPlayer = ({ stations: initialStations }: IPlayer) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const audioRef = useCallback((node: HTMLAudioElement | null) => {
    setAudioElement(node);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const { applyedFilters } = useRadioFilter();

  const {
    stations,
    currentStationIndex,
    currentStation,
    totalStations,
    nextStation,
    prevStation,
    fetchStations,
    resetStations,
    loadMoreStations,
    isPlaying,
    setIsPlaying,
  } = useRadioStations();

  // Initialize stations on mount
  useEffect(() => {
    if (initialStations.length > 0 && stations.length === 0) {
      resetStations(initialStations);
    }
  }, [initialStations, stations.length, resetStations]);

  // Fetch stations when filters change
  useEffect(() => {
    if (applyedFilters.length) {
      fetchStations(applyedFilters);
    } else if (initialStations.length > 0) {
      resetStations(initialStations);
    }
  }, [applyedFilters, initialStations, fetchStations, resetStations]);

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

  const handleNextStation = useCallback(() => {
    nextStation();
    if (applyedFilters.length > 0) {
      loadMoreStations(applyedFilters);
    }
  }, [nextStation, loadMoreStations, applyedFilters]);

  const hanldePrevStation = useCallback(() => {
    prevStation();
  }, [prevStation]);

  const handleError = useCallback(() => {
    setIsPlaying(false);
    setIsLoading(false);
    const station = currentStation();
    console.log(`${station?.name || 'Станція'} недоступна, перемикаю...`);
    setTimeout(() => handleNextStation(), 500);
  }, [currentStation, handleNextStation, setIsPlaying]);

  // Sync audio with isPlaying state from store
  useEffect(() => {
    if (!audioElement) return;

    const syncAudio = async () => {
      if (isPlaying && audioElement.paused) {
        try {
          await audioElement.play();
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          }
        }
      } else if (!isPlaying && !audioElement.paused) {
        audioElement.pause();
      }
    };

    syncAudio();
  }, [isPlaying, audioElement, setIsPlaying]);

  // Load new station when currentStationIndex changes
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
  }, [currentStationIndex, audioElement, stations, isPlaying, setIsPlaying]);

  const station = currentStation();

  return {
    audioRef,
    audioElement,
    stationState: {
      currentStation: station,
      totalStations: totalStations(),
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

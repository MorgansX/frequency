import { useEffect, useState, useCallback } from 'react';
import { IPlayer } from './types';

export const useRadioPlayer = ({ stations }: IPlayer) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const audioRef = useCallback((node: HTMLAudioElement | null) => {
    setAudioElement(node);
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);

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
      //TODO: error handler with react hot toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStation = () => {
    setCurrentStationIndex((prev) => (prev + 1) % totalStations);
  };

  const hanldePrevStation = () => {
    if (currentStationIndex === 0) {
      return;
    }
    setCurrentStationIndex((prev) => prev - 1);
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    // Auto-skip to next station on error
    handleNextStation();
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

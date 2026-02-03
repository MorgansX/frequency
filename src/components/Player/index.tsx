'use client';

import { Card, CardHeader } from '@heroui/react';
import { IPlayer } from './types';
import { useRadioPlayer } from './useRadioPlayer';
import { PlayerButtons } from './PlayerButtons';
import { PlayerFooter } from './PlayerFooter';
import { PlayerStationInfo } from './PlayerStationInfo';
import { useRadioStations } from '@/store/useRadioStations';

export const AudioPlayer = ({ stations }: IPlayer) => {
  const { stations: storedStations } = useRadioStations();
  const stationsData = storedStations.length ? storedStations : stations;
  const { handlers, stationState, audioRef, playingState } = useRadioPlayer({
    stations: stationsData,
  });

  const { handlePlay, hanldePrevStation, handleNextStation, handleError } =
    handlers;

  const { currentStation } = stationState;

  const { isPlaying, setIsPlaying, isLoading } = playingState;

  if (!currentStation) {
    return <div>No stations available</div>;
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700">
      <CardHeader className="flex gap-4 pb-0 items-center">
        <PlayerStationInfo
          currentStation={currentStation}
          isPlaying={isPlaying}
        />
      </CardHeader>
      <hr className="border-zinc-700" />

      <PlayerButtons
        isLoading={isLoading}
        isPlaying={isPlaying}
        handleNextStation={handleNextStation}
        handlePlay={handlePlay}
        hanldePrevStation={hanldePrevStation}
      />

      <PlayerFooter
        totalStations={stationState.totalStations}
        currentStation={stationState.currentStationIndex}
      />

      <audio
        ref={audioRef}
        src={currentStation.url_resolved || currentStation.url}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
      />
    </Card>
  );
};

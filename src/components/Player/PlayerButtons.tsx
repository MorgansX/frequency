import {
  CircleChevronLeft,
  CirclePause,
  CirclePlay,
  CircleChevronRight,
} from '@gravity-ui/icons';
import { Button, Spinner, CardFooter } from '@heroui/react';

interface PlayerButtonsProps {
  hanldePrevStation: () => void;
  isLoading: boolean;
  handlePlay: () => void;
  isPlaying: boolean;
  handleNextStation: () => void;
}

export const PlayerButtons = ({
  hanldePrevStation,
  isLoading,
  handlePlay,
  isPlaying,
  handleNextStation,
}: PlayerButtonsProps) => (
  <CardFooter className="justify-center gap-4 py-4">
    <Button
      isIconOnly
      size="lg"
      onClick={hanldePrevStation}
      isDisabled={isLoading}
      className="rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
    >
      <CircleChevronLeft className="w-8 h-8" />
    </Button>

    <Button
      isIconOnly
      size="lg"
      className="rounded-full w-16 h-16 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
      onClick={handlePlay}
      isDisabled={isLoading}
    >
      {isLoading ? (
        <Spinner color="current" size="sm" />
      ) : isPlaying ? (
        <CirclePause className="w-8 h-8" />
      ) : (
        <CirclePlay className="w-8 h-8" />
      )}
    </Button>

    <Button
      isIconOnly
      size="lg"
      onClick={handleNextStation}
      isDisabled={isLoading}
      className="rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
    >
      <CircleChevronRight className="w-8 h-8" />
    </Button>
  </CardFooter>
);

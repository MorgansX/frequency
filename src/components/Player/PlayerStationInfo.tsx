import { Station } from '@/lib/types/radio.types';
import { CircleFill } from '@gravity-ui/icons';
import { Chip } from '@heroui/react';
import { PlayerTags } from './PlayerTags';

export const PlayerStationInfo = ({
  currentStation,
  isPlaying,
}: {
  currentStation: Station;
  isPlaying: boolean;
}) => (
  <>
    <div className="w-20 h-20 rounded-xl bg-zinc-700/50 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-600">
      {currentStation.favicon ? (
        <img
          src={currentStation.favicon}
          alt={currentStation.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <span
        className={`text-2xl font-bold text-zinc-300 ${currentStation.favicon ? 'hidden' : ''}`}
      >
        {currentStation.name?.charAt(0) || 'FM'}
      </span>
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-zinc-100 truncate max-w-[300px]">
          {currentStation.name}
        </h2>
        {isPlaying && (
          <Chip className="!px-2 !py-1 gap-1" size="md" color="danger">
            <CircleFill width={6} />
            Live
          </Chip>
        )}
      </div>
      <p className="text-sm text-zinc-400">
        {currentStation.country}{' '}
        {currentStation.language && `• ${currentStation.language}`}
      </p>
      <div className="flex gap-2 flex-wrap mt-1">
        <Chip
          size="sm"
          color="success"
          variant="primary"
          className="!px-2 !py-1 gap-1"
        >
          {currentStation.codec} {currentStation.bitrate}kbps
        </Chip>
        <Chip
          size="sm"
          color="success"
          variant="primary"
          className="!px-2 !py-1 gap-1"
        >
          {currentStation.votes} votes
        </Chip>
      </div>
      <PlayerTags tags={currentStation.tags} />
    </div>
  </>
);

'use client';
import { Button } from '@heroui/react';
import { CirclePlay, CirclePause } from '@gravity-ui/icons';
import { Station } from '@/lib/types/radio.types';
import { ReactNode } from 'react';

export interface StationCardProps {
  station: Station;
  onPlay: (station: Station) => void;
  isCurrentlyPlaying?: boolean;
  actionIcon?: ReactNode;
  onAction?: (station: Station) => void;
}

export const StationCard = ({
  station,
  onPlay,
  isCurrentlyPlaying = false,
  actionIcon,
  onAction,
}: StationCardProps) => {
  return (
    <div
      className={`border transition-all duration-200 rounded-xl ${
        isCurrentlyPlaying
          ? 'bg-purple-500/10 border-purple-500/50'
          : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50'
      }`}
    >
      <div className="flex flex-row items-center gap-2 sm:gap-4 p-3 sm:p-4">
        <div
          className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden shrink-0 border ${
            isCurrentlyPlaying
              ? 'bg-purple-500/20 border-purple-500/50'
              : 'bg-zinc-700/50 border-zinc-600'
          }`}
        >
          {station.favicon ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span
            className={`text-base sm:text-xl font-bold ${isCurrentlyPlaying ? 'text-purple-300' : 'text-zinc-300'} ${station.favicon ? 'hidden' : ''}`}
          >
            {station.name?.charAt(0) || 'FM'}
          </span>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <h3
            className={`text-sm sm:text-base font-semibold truncate ${isCurrentlyPlaying ? 'text-purple-100' : 'text-zinc-100'}`}
          >
            {station.name}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 truncate">
            {station.country}
            {station.language && ` • ${station.language}`}
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button
            isIconOnly
            size="sm"
            className={`w-9 h-9 sm:w-10 sm:h-10 min-w-0 rounded-full text-white shadow-lg ${
              isCurrentlyPlaying
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-purple-500/20'
            }`}
            onPress={() => onPlay(station)}
          >
            {isCurrentlyPlaying ? (
              <CirclePause className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <CirclePlay className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>

          {actionIcon && onAction && (
            <Button
              isIconOnly
              size="sm"
              className="w-9 h-9 sm:w-10 sm:h-10 min-w-0 rounded-full bg-zinc-700 hover:bg-red-500/80 text-zinc-300 hover:text-white transition-colors"
              onPress={() => onAction(station)}
            >
              {actionIcon}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

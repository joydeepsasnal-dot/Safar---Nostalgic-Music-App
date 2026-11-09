import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Tv,
  ListMusic,
  Radio,
} from 'lucide-react';
import { PlaylistData, TrackInfo } from '../types/index.ts';
import { formatDuration } from '../utils/time.ts';

interface MusicPlayerProps {
  playlist: PlaylistData;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onShuffleChange: (enabled: boolean) => void;
  onLoopChange: (enabled: boolean) => void;
  onPrev: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  currentTrack?: TrackInfo;
  videoVisible: boolean;
  onToggleVideoVisible: () => void;
  onToggleTracklist: () => void;
  tracklistOpen: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  playlist,
  isPlaying,
  onTogglePlay,
  onNext,
  onShuffleChange,
  onLoopChange,
  onPrev,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  currentTime,
  duration,
  onSeek,
  currentTrack,
  videoVisible,
  onToggleVideoVisible,
  onToggleTracklist,
  tracklistOpen,
}) => {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  // Fallback track display if none playing
  const displayTitle = currentTrack?.title || `${playlist.name} Streaming`;
  const displayArtist = currentTrack?.artist || playlist.subtitle;
  const displayThumb = currentTrack?.thumbnail || playlist.bgImage;

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 pointer-events-none"
      aria-label="Audio playback controls"
    >
      <div className="mx-auto max-w-4xl pointer-events-auto">
        {/* Main Floating Glass Player Bar */}
        <div
          className="relative flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl md:rounded-full px-4 py-3 shadow-2xl backdrop-blur-xl border transition-all duration-300"
          style={{
            backgroundColor: 'rgba(18, 16, 20, 0.82)',
            borderColor: `${playlist.accentColor}33`,
            boxShadow: `0 12px 40px -10px ${playlist.accentColor}20`,
          }}
        >
          {/* Left: Track Information & Spinning Disc */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/20 bg-neutral-900 shadow-md">
              <img
                src={displayThumb}
                alt="Track artwork"
                className={`h-full w-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'rotate-anim' : ''
                }`}
                style={{
                  animation: isPlaying ? 'spin 12s linear infinite' : 'none',
                }}
              />
              {/* Center vinyl spindle dot */}
              <div className="absolute inset-0 m-auto h-3 w-3 rounded-full border border-black/40 bg-white/90 shadow-inner" />
            </div>

            <div className="flex flex-col min-w-0 pr-2">
              <span className="truncate text-sm font-bold text-white tracking-wide">
                {displayTitle}
              </span>
              <span className="truncate text-xs text-white/60">
                {displayArtist}
              </span>
            </div>
          </div>

          {/* Center: Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-5/12">
            {/* Control buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => { const next = !isShuffle; setIsShuffle(next); onShuffleChange(next); }}
                aria-label="Toggle shuffle"
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  isShuffle ? 'text-amber-400' : 'text-white/40 hover:text-white'
                }`}
              >
                <Shuffle className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous track"
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-neutral-950 shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={{
                  backgroundColor: playlist.accentColor,
                  color: '#000000',
                }}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onNext}
                aria-label="Next track"
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => { const next = !isLoop; setIsLoop(next); onLoopChange(next); }}
                aria-label="Toggle repeat"
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  isLoop ? 'text-amber-400' : 'text-white/40 hover:text-white'
                }`}
              >
                <Repeat className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Seekbar and timestamp */}
            <div className="flex items-center gap-2 w-full px-2 text-[11px] font-mono-code text-white/60">
              <span className="w-8 text-right">{formatDuration(currentTime)}</span>
              <div
                className="relative flex-1 h-1.5 rounded-full bg-white/20 cursor-pointer overflow-hidden group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  if (duration > 0) onSeek(Math.min(duration, Math.max(0, pos * duration)));
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: playlist.accentColor,
                  }}
                />
              </div>
              <span className="w-8 text-left">{duration > 0 ? formatDuration(duration) : '--:--'}</span>
            </div>
          </div>

          {/* Right: Volume & Extra Utilities */}
          <div className="flex items-center justify-end gap-2 w-full md:w-1/3">
            {/* Volume toggle & slider */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-1.5 text-white/70 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : volume < 50 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Volume slider"
                className="h-1 w-16 sm:w-20 accent-amber-400 cursor-pointer bg-white/20 rounded-lg"
              />
            </div>

            {/* Watch Video Mode Toggle */}
            <button
              type="button"
              onClick={onToggleVideoVisible}
              aria-label={videoVisible ? 'Hide Video' : 'Watch YouTube Video'}
              title={videoVisible ? 'Hide Video Window' : 'Watch Video Window'}
              className={`p-2 rounded-full border transition-all ${
                videoVisible
                  ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                  : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Tv className="h-4 w-4" />
            </button>

            {/* Tracklist Toggle */}
            <button
              type="button"
              onClick={onToggleTracklist}
              aria-label="Toggle playlist tracklist"
              title="View Playlist Tracks"
              className={`p-2 rounded-full border transition-all ${
                tracklistOpen
                  ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                  : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <ListMusic className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Keyboard shortcuts pill matching screenshot 1 */}
        <div className="mt-1 hidden sm:flex items-center justify-center gap-1.5 text-[10px] text-white/60 select-none">
          <span className="rounded bg-black/40 px-1.5 py-0.5 border border-white/10 font-mono-code">Space</span>
          <span>Play/Pause</span>
          <span className="mx-1">•</span>
          <span className="rounded bg-black/40 px-1.5 py-0.5 border border-white/10 font-mono-code">← →</span>
          <span>Seek</span>
          <span className="mx-1">•</span>
          <span className="rounded bg-black/40 px-1.5 py-0.5 border border-white/10 font-mono-code">N / P</span>
          <span>Next/Prev</span>
          <span className="mx-1">•</span>
          <span className="rounded bg-black/40 px-1.5 py-0.5 border border-white/10 font-mono-code">H</span>
          <span>Horn</span>
          <span className="mx-1">•</span>
          <span className="rounded bg-black/40 px-1.5 py-0.5 border border-white/10 font-mono-code">R</span>
          <span>Rain</span>
        </div>
      </div>
    </footer>
  );
};

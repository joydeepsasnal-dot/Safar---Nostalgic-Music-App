import React from 'react';
import { X, Play, Music, Radio, Disc3 } from 'lucide-react';
import { PlaylistData, TrackInfo } from '../types/index.ts';

interface TracklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: PlaylistData;
  currentTrackId?: string;
  onSelectTrack: (track: TrackInfo) => void;
}

export const TracklistDrawer: React.FC<TracklistDrawerProps> = ({
  isOpen,
  onClose,
  playlist,
  currentTrackId,
  onSelectTrack,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Playlist tracks drawer"
      className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-neutral-950/95 border-l border-white/10 shadow-2xl backdrop-blur-2xl p-5 flex flex-col text-white animate-in slide-in-from-right-10 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Station Tracklist
          </span>
          <h2 className="text-base font-extrabold truncate">{playlist.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tracklist"
          className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tracks list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {playlist.featuredTracks.map((track, idx) => {
          const isSelected = track.id === currentTrackId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectTrack(track)}
              className={`flex w-full items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 text-white'
                  : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 text-white/80'
              }`}
            >
              <span className="w-5 text-center text-xs font-mono-code text-white/50">
                {idx + 1}
              </span>

              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                <img
                  src={track.thumbnail || playlist.bgImage}
                  alt={track.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-white">{track.title}</p>
                <p className="text-[11px] text-white/60 truncate">{track.artist}</p>
              </div>

              {track.duration && (
                <span className="text-[11px] font-mono-code text-white/50">{track.duration}</span>
              )}

              <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-amber-500 hover:text-black transition-colors">
                <Play className="h-3 w-3 fill-current ml-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Info notice */}
      <div className="border-t border-white/10 pt-3 text-[11px] text-white/50 flex items-center gap-2">
        <Radio className="h-4 w-4 text-amber-400" />
        <span>Tracks follow YouTube playlist order; titles may differ from previews</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Menu,
  X,
  Radio,
  CloudRain,
  Volume2,
  Coffee,
  Disc3,
  ExternalLink,
  Plus,
  Sparkles,
  Scissors,
  Droplets,
  Music2,
  Clock,
  Sliders,
} from 'lucide-react';
import { PlaylistData } from '../types/index.ts';
import { extractPlaylistId } from '../utils/youtube.ts';

interface SidebarProps {
  playlists: PlaylistData[];
  activePlaylistId: string;
  onSelectPlaylist: (playlist: PlaylistData) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  rainActive: boolean;
  onToggleRain: () => void;
  onPlayHorn: () => void;
  onChaiClick: () => void;
  onScissorsClick: () => void;
  onSprayClick: () => void;
  onOpenClockSettings: () => void;
  onCustomPlaylistSubmit: (playlistId: string, name: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  isOpen,
  onToggleOpen,
  rainActive,
  onToggleRain,
  onPlayHorn,
  onChaiClick,
  onScissorsClick,
  onSprayClick,
  onOpenClockSettings,
  onCustomPlaylistSubmit,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    const extracted = extractPlaylistId(customInput);
    if (!extracted) {
      setCustomError('Please enter a valid YouTube playlist URL or ID');
      return;
    }
    onCustomPlaylistSubmit(extracted, 'Custom YouTube Playlist');
    setCustomInput('');
    setShowCustomForm(false);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex w-80 sm:w-88 flex-col border-r border-white/10 bg-neutral-950/95 text-white shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Playlist Navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-black shadow-lg">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">SAFAR RADIO</h1>
              <p className="text-[11px] font-medium text-amber-400/90">Curated Indian Audio Journeys</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Section: Main Curated Playlists */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Official Playlists
              </span>
              <span className="text-[10px] rounded-full bg-white/10 px-2 py-0.5 text-white/70">
                {playlists.length} Stations
              </span>
            </div>

            <div className="space-y-2.5">
              {playlists.map((pl) => {
                const isActive = pl.id === activePlaylistId;
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => {
                      onSelectPlaylist(pl);
                      onToggleOpen();
                    }}
                    className={`group relative flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-200 border ${
                      isActive
                        ? 'border-amber-400/80 bg-white/10 shadow-lg scale-[1.01]'
                        : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {/* Playlist Art thumbnail */}
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-md">
                      <img
                        src={pl.bgImage}
                        alt={pl.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Disc3 className="h-6 w-6 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                        </div>
                      )}
                    </div>

                    {/* Playlist Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-bold tracking-wide text-white">
                          {pl.name}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-sm font-bold text-amber-300 truncate mt-0.5 ${pl.nativeFontClass}`}>
                        {pl.nativeTitle}
                      </p>
                      <p className="text-[11px] text-white/60 truncate mt-0.5">
                        {pl.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Custom YouTube Playlist Loader */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Music2 className="h-3.5 w-3.5 text-amber-400" /> Custom YouTube Playlist
              </span>
              <button
                type="button"
                onClick={() => setShowCustomForm((v) => !v)}
                className="text-[11px] text-amber-400 hover:underline font-medium"
              >
                {showCustomForm ? 'Cancel' : '+ Add URL'}
              </button>
            </div>

            {showCustomForm && (
              <form onSubmit={handleCustomSubmit} className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Paste YouTube playlist URL or ID..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                />
                {customError && <p className="text-[10px] text-red-400">{customError}</p>}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  Load Custom Playlist
                </button>
              </form>
            )}
          </div>

          {/* Section: Interactive Ambient Sound Pad */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-amber-400" /> Ambient Atmosphere
            </span>

            {/* Rain Mood Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className={`h-4 w-4 ${rainActive ? 'text-blue-400' : 'text-white/50'}`} />
                <span className="text-xs font-medium">Monsoon Rain Mood</span>
              </div>
              <button
                type="button"
                onClick={onToggleRain}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                  rainActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {rainActive ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Sound FX Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onPlayHorn}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-bold text-amber-300 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                📯 Air Horn
              </button>

              <button
                type="button"
                onClick={onChaiClick}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-bold text-amber-300 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                ☕ Driver Chai
              </button>

              <button
                type="button"
                onClick={onScissorsClick}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-bold text-emerald-300 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Scissors className="h-3.5 w-3.5" /> Scissors
              </button>

              <button
                type="button"
                onClick={onSprayClick}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-bold text-cyan-300 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Droplets className="h-3.5 w-3.5" /> Hair Spray
              </button>
            </div>
          </div>

          {/* Section: Clock Settings Launcher */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold">Minimalist Clock</p>
                <p className="text-[10px] text-white/60">Fonts, 12h/24h & layout</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenClockSettings}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
            >
              Customize
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 bg-black/40">
          <p className="text-[11px] text-white/50 text-center">
            Safar Radio • Authentic Roadside Vibes
          </p>
        </div>
      </aside>
    </>
  );
};

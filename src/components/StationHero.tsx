import React from 'react';
import {
  CloudRain,
  Coffee,
  Volume2,
  Sparkles,
  Heart,
  Share2,
  Info,
  Radio,
  Scissors,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import { PlaylistData } from '../types/index.ts';

interface StationHeroProps {
  playlist: PlaylistData;
  rainActive: boolean;
  onToggleRain: () => void;
  onChaiClick: () => void;
  onHornClick: () => void;
  onScissorsClick: () => void;
  onSprayClick: () => void;
  chaiCount: number;
}

export const StationHero: React.FC<StationHeroProps> = ({
  playlist,
  rainActive,
  onToggleRain,
  onChaiClick,
  onHornClick,
  onScissorsClick,
  onSprayClick,
  chaiCount,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-20 pb-36 select-none max-w-4xl mx-auto">
      {/* Top Tagline */}
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1 text-xs text-white/80 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>{playlist.songsCount}</span>
        <span className="text-white/30">•</span>
        <span className="text-amber-300/90">{playlist.route}</span>
      </div>

      {/* Main Massive Native Title matching screenshots */}
      <h1
        className={`text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-2xl my-2 ${playlist.nativeFontClass}`}
        style={{
          textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {playlist.nativeTitle}
      </h1>

      {/* Secondary Motto / Slogan */}
      <p className="text-sm sm:text-base font-semibold text-white/90 drop-shadow-md tracking-wide max-w-md">
        {playlist.secondaryMotto}
      </p>

      {/* Thematic Action Badges & Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {/* Rain Mood Toggle */}
        <button
          type="button"
          onClick={onToggleRain}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-lg backdrop-blur-md border ${
            rainActive
              ? 'border-blue-400/80 bg-blue-600/80 text-white'
              : 'border-white/20 bg-black/50 text-white/90 hover:bg-black/70'
          }`}
        >
          <CloudRain className="h-4 w-4" />
          <span>Rain Mood</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              rainActive ? 'bg-white/25 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            {rainActive ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Driver Chai / Tea Button */}
        <button
          type="button"
          onClick={onChaiClick}
          className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <Coffee className="h-4 w-4 fill-black" />
          <span>{playlist.teaButtonText}</span>
          {chaiCount > 0 && (
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-extrabold text-black">
              {chaiCount}
            </span>
          )}
        </button>

        {/* Horn Sound Button for Bus / Truck */}
        {(playlist.id === 'bus-driver' || playlist.id === 'truck-driver') && (
          <button
            type="button"
            onClick={onHornClick}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-bold text-white hover:bg-black/70 active:scale-95 transition-all backdrop-blur-md"
            title="Honk vehicle air horn"
          >
            <span>📯</span>
            <span>{playlist.id === 'bus-driver' ? 'হর্ন (Horn)' : 'Horn OK Please'}</span>
          </button>
        )}

        {/* Barber Tools for Salon */}
        {playlist.id === 'salon' && (
          <>
            <button
              type="button"
              onClick={onScissorsClick}
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 active:scale-95 transition-all backdrop-blur-md"
            >
              <Scissors className="h-3.5 w-3.5" />
              <span>कैंची (Snip)</span>
            </button>
            <button
              type="button"
              onClick={onSprayClick}
              className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 active:scale-95 transition-all backdrop-blur-md"
            >
              <Droplets className="h-3.5 w-3.5" />
              <span>स्प्रे (Spray)</span>
            </button>
          </>
        )}
      </div>

      {/* Slogan Banner Pill matching screenshot 1 / 2 */}
      {playlist.motto && (
        <div className="mt-6 inline-flex max-w-lg items-center gap-2 rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white/90 shadow-xl backdrop-blur-md">
          <span className="text-amber-400">📢</span>
          <span className="font-medium">{playlist.motto}</span>
        </div>
      )}
    </div>
  );
};
